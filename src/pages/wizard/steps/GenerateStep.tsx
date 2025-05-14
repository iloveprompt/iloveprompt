
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { savePromptToDatabase } from '@/services/promptService';
import { enhancePrompt } from '@/services/llmService';
import { FileText, Wand2, Sparkles, Loader2 } from 'lucide-react';

interface GenerateStepProps {
  formData: any;
  markAsFinalized: () => void;
  isFinalized: boolean;
}

const GenerateStep: React.FC<GenerateStepProps> = ({ 
  formData,
  markAsFinalized,
  isFinalized
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  
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
  
  // Novo método para melhorar o prompt com IA
  const handleEnhanceWithAI = async () => {
    if (!generatedPrompt || !user) {
      toast({
        title: "Erro",
        description: "É necessário gerar um prompt primeiro e estar logado.",
        variant: "destructive"
      });
      return;
    }
    
    setIsEnhancing(true);
    try {
      // Preparar prompt para melhoria com IA
      const enhancementPrompt = `Por favor, melhore o seguinte prompt para geração de projeto de software:
      
${generatedPrompt}

Melhore-o tornando mais detalhado, estruturado, e eficaz para gerar um resultado de alta qualidade. Mantenha a mesma estrutura geral, mas adicione detalhes técnicos e clareza onde for possível.`;

      // Chamar a API da IA ativa
      const enhancedPrompt = await enhancePrompt(enhancementPrompt, user.id);
      
      // Atualizar o prompt gerado
      setGeneratedPrompt(enhancedPrompt);
      
      toast({
        title: "Prompt melhorado com sucesso",
        description: "O prompt foi aprimorado utilizando IA.",
      });
      
      // Auto-save do prompt melhorado
      if (user) {
        try {
          setIsSaving(true);
          await savePromptToDatabase({
            user_id: user.id,
            title: `${formData.project.title || 'Prompt sem título'} (Melhorado)`,
            content: enhancedPrompt,
            wizard_data: formData,
            created_at: new Date(),
            updated_at: new Date(),
          });
        } catch (error) {
          console.error('Erro ao salvar prompt melhorado:', error);
        } finally {
          setIsSaving(false);
        }
      }
    } catch (error) {
      console.error('Erro ao melhorar prompt com IA:', error);
      toast({
        title: "Erro ao melhorar prompt",
        description: "Não foi possível melhorar o prompt. Verifique se você tem uma LLM ativa configurada.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // Método para gerar documentação com IA (placeholder)
  const handleGenerateDocumentation = async () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A geração de documentação estará disponível em breve.",
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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t('promptGenerator.generate.title')}</CardTitle>
              <CardDescription>
                {t('promptGenerator.generate.description')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex justify-center mb-4 gap-2">
            <Button 
              onClick={handleGenerate} 
              className="flex items-center gap-2"
              disabled={isGenerating || isSaving || isEnhancing}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t('promptGenerator.generate.generating')}
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" /> {t('promptGenerator.generate.createPrompt')}
                </>
              )}
            </Button>
            
            {/* Botão Gerar Documentação */}
            <Button 
              onClick={handleGenerateDocumentation}
              disabled={!generatedPrompt || isGenerating || isSaving || isEnhancing}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {t('promptGenerator.generate.generateDocs') || 'Gerar Documentação'}
            </Button>
            
            {/* Botão Melhorar com IA */}
            <Button 
              onClick={handleEnhanceWithAI}
              disabled={!generatedPrompt || isGenerating || isSaving || isEnhancing}
              className="flex items-center gap-2"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Melhorando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> {t('promptGenerator.generate.enhanceWithAI') || 'Melhorar com IA'}
                </>
              )}
            </Button>
          </div>
          
          {generatedPrompt && (
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-muted/50">
                <h3 className="font-semibold mb-2">{t('promptGenerator.generate.result')}</h3>
                <Textarea 
                  value={generatedPrompt}
                  readOnly
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="flex justify-end items-center mt-6 pt-4 border-t"> {/* Kept Copy button here */}
                <Button onClick={handleCopyToClipboard} variant="outline" size="sm">
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
