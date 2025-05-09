
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface GenerateStepProps {
  formData: any;
}

const GenerateStep: React.FC<GenerateStepProps> = ({ formData }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedPrompt, setGeneratedPrompt] = React.useState('');
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const prompt = generatePromptFromFormData(formData);
      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      
      toast({
        title: t('promptGenerator.generate.success'),
        description: t('promptGenerator.generate.promptGenerated'),
      });
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
    prompt += `# ${t('promptGenerator.project.title')}: ${data.project.title || t('common.loading')}\n`;
    prompt += `${t('promptGenerator.project.author')}: ${data.project.author || t('common.loading')}\n`;
    prompt += `${t('promptGenerator.project.email')}: ${data.project.email || t('common.loading')}\n`;
    if (data.project.url) prompt += `${t('promptGenerator.project.url')}: ${data.project.url}\n`;
    prompt += `${t('promptGenerator.project.version')}: ${data.project.version}\n\n`;
    
    // System Type
    prompt += `## ${t('promptGenerator.systemType.title')}\n`;
    if (data.systemType.selected) {
      const systemType = data.systemType.selected === 'other' 
        ? data.systemType.otherType 
        : t(`promptGenerator.systemType.${data.systemType.selected}`);
      prompt += `${systemType}\n\n`;
    }
    
    // Objective
    if (data.objective.defineObjectives) {
      prompt += `## ${t('promptGenerator.objective.title')}\n`;
      if (data.objective.primaryObjective) {
        prompt += `${data.objective.primaryObjective}\n\n`;
      }
      
      if (data.objective.selectedObjectives.length > 0) {
        prompt += `${t('promptGenerator.objective.businessObjectives')}:\n`;
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
      prompt += `## ${t('promptGenerator.requirements.title')}\n`;
      
      if (data.requirements.userTypes.length > 0) {
        prompt += `### ${t('promptGenerator.requirements.userTypes')}:\n`;
        data.requirements.userTypes.forEach((user: string) => {
          prompt += `- ${user}\n`;
        });
        prompt += '\n';
      }
      
      if (data.requirements.functionalRequirements.length > 0) {
        prompt += `### ${t('promptGenerator.requirements.functionalRequirements')}:\n`;
        data.requirements.functionalRequirements.forEach((req: string) => {
          prompt += `- ${req}\n`;
        });
        prompt += '\n';
      }
      
      if (data.requirements.nonFunctionalRequirements.length > 0) {
        prompt += `### ${t('promptGenerator.requirements.nonFunctionalRequirements')}:\n`;
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
    prompt += `## ${t('promptGenerator.stack.title')}\n`;
    
    if (data.stack.frontend.length > 0) {
      prompt += `### ${t('promptGenerator.stack.frontendTitle')}:\n`;
      data.stack.frontend.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    if (data.stack.backend.length > 0) {
      prompt += `### ${t('promptGenerator.stack.backendTitle')}:\n`;
      data.stack.backend.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    if (data.stack.database.length > 0) {
      prompt += `### ${t('promptGenerator.stack.databaseTitle')}:\n`;
      data.stack.database.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    if (data.stack.hosting.length > 0) {
      prompt += `### ${t('promptGenerator.stack.hostingTitle')}:\n`;
      data.stack.hosting.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    // Security
    if (data.security.selectedSecurity.length > 0) {
      prompt += `## ${t('promptGenerator.security.title')}\n`;
      data.security.selectedSecurity.forEach((security: string) => {
        if (security === 'Other') {
          prompt += `- ${data.security.otherSecurityFeature}\n`;
        } else {
          prompt += `- ${security}\n`;
        }
      });
      prompt += '\n';
    }
    
    prompt += `\n${t('promptGenerator.generate.createPrompt')}`;
    
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
              disabled={isGenerating}
            >
              {isGenerating ? t('promptGenerator.generate.generating') : t('promptGenerator.generate.createPrompt')}
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
