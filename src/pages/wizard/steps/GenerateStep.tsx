
import React, { useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { savePromptToDatabase } from '@/services/promptService';
import { supabase } from '@/lib/supabase';

interface GenerateStepProps {
  formData: any;
}

const GenerateStep: React.FC<GenerateStepProps> = ({ formData }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [generatedPrompt, setGeneratedPrompt] = React.useState('');
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(async () => {
      const prompt = generatePromptFromFormData(formData);
      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      
      if (user) {
        // Auto-save the generated prompt
        try {
          setIsSaving(true);
          await savePromptToDatabase({
            user_id: user.id,
            title: formData.project.title || 'Prompt sem título',
            content: prompt,
            wizard_data: formData,
            created_at: new Date(),
            updated_at: new Date(),
          });
          
          toast({
            title: t('promptGenerator.generate.success'),
            description: t('promptGenerator.generate.promptGenerated'),
          });
        } catch (error) {
          console.error('Erro ao salvar prompt:', error);
          toast({
            title: t('promptGenerator.generate.error'),
            description: t('promptGenerator.generate.errorSaving'),
            variant: 'destructive',
          });
        } finally {
          setIsSaving(false);
        }
      } else {
        toast({
          title: t('promptGenerator.generate.success'),
          description: t('promptGenerator.generate.promptGenerated'),
        });
      }
    }, 1500);
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: t('promptGenerator.generate.copied'),
      description: t('promptGenerator.generate.copiedToClipboard'),
    });
  };
  
  const generatePromptFromFormData = (data: any) => {
    // This is a simplified version of generating a prompt
    // In a real application, this would be more sophisticated
    let prompt = '';
    
    // Project Information
    prompt += `# Projeto: ${data.project.title || 'Sem título'}\n`;
    prompt += `Autor: ${data.project.author || 'Não especificado'}\n`;
    prompt += `Email: ${data.project.email || 'Não especificado'}\n`;
    if (data.project.url) prompt += `URL: ${data.project.url}\n`;
    prompt += `Versão: ${data.project.version}\n\n`;
    
    // System Type
    prompt += `## Tipo de Sistema\n`;
    if (data.systemType.selected) {
      const systemType = data.systemType.selected === 'other' 
        ? data.systemType.otherType 
        : t(`promptGenerator.systemType.${data.systemType.selected}`);
      prompt += `${systemType}\n\n`;
    }
    
    // Objective
    if (data.objective.defineObjectives) {
      prompt += `## Objetivo\n`;
      if (data.objective.primaryObjective) {
        prompt += `${data.objective.primaryObjective}\n\n`;
      }
      
      if (data.objective.selectedObjectives.length > 0) {
        prompt += `Objetivos de Negócios:\n`;
        data.objective.selectedObjectives.forEach((obj: string) => {
          if (obj === 'Other') {
            prompt += `- ${data.objective.otherObjective}\n`;
          } else {
            prompt += `- ${obj}\n`;
          }
        });
        prompt += '\n';
      }
    }
    
    // Requirements
    if (data.requirements.defineRequirements) {
      prompt += `## Requisitos\n`;
      
      if (data.requirements.userTypes.length > 0) {
        prompt += `### Tipos de Usuários:\n`;
        data.requirements.userTypes.forEach((user: string) => {
          prompt += `- ${user}\n`;
        });
        prompt += '\n';
      }
      
      if (data.requirements.functionalRequirements.length > 0) {
        prompt += `### Requisitos Funcionais:\n`;
        data.requirements.functionalRequirements.forEach((req: string) => {
          prompt += `- ${req}\n`;
        });
        prompt += '\n';
      }
      
      if (data.requirements.nonFunctionalRequirements.length > 0) {
        prompt += `### Requisitos Não Funcionais:\n`;
        data.requirements.nonFunctionalRequirements.forEach((req: string) => {
          if (req === 'Other') {
            prompt += `- ${data.requirements.otherRequirement}\n`;
          } else {
            prompt += `- ${req}\n`;
          }
        });
        prompt += '\n';
      }
    }
    
    // Stack
    prompt += `## Stack Tecnológica\n`;
    
    if (data.stack.frontend.length > 0) {
      prompt += `### Frontend:\n`;
      data.stack.frontend.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    if (data.stack.backend.length > 0) {
      prompt += `### Backend:\n`;
      data.stack.backend.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    if (data.stack.database.length > 0) {
      prompt += `### Banco de Dados:\n`;
      data.stack.database.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    if (data.stack.hosting.length > 0) {
      prompt += `### Hospedagem/Infraestrutura:\n`;
      data.stack.hosting.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    // Security
    if (data.security.selectedSecurity.length > 0) {
      prompt += `## Segurança\n`;
      data.security.selectedSecurity.forEach((security: string) => {
        if (security === 'Other') {
          prompt += `- ${data.security.otherSecurityFeature}\n`;
        } else {
          prompt += `- ${security}\n`;
        }
      });
      prompt += '\n';
    }
    
    prompt += `\nCom base nas informações acima, por favor desenvolva um prompt detalhado para o meu sistema.`;
    
    return prompt;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('promptGenerator.generate.title')}</CardTitle>
          <CardDescription>
            {t('promptGenerator.generate.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-4">
            <Button 
              onClick={handleGenerate} 
              className="w-64"
              disabled={isGenerating || isSaving}
            >
              {isGenerating 
                ? t('promptGenerator.generate.generating') 
                : isSaving 
                  ? t('promptGenerator.generate.saving')
                  : t('promptGenerator.generate.createPrompt')}
            </Button>
          </div>
          
          {generatedPrompt && (
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-semibold mb-2">{t('promptGenerator.generate.result')}</h3>
                <Textarea 
                  value={generatedPrompt}
                  readOnly
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleCopyToClipboard} variant="outline">
                  {t('promptGenerator.generate.copyToClipboard')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateStep;
