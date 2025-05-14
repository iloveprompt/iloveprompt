
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Wand2, RotateCcw, Save, CheckCircle as CheckCircleIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import deploymentData from '../data/deploymentData.json';
import AIAssistantPanel from '../components/AIAssistantPanel';

interface DeploymentFormData {
  selectedDeploymentOptions: string[];
  deploymentNotes: string;
}

interface DeploymentStepProps {
  formData: DeploymentFormData;
  updateFormData: (data: Partial<DeploymentFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const DeploymentStep: React.FC<DeploymentStepProps> = ({
  formData,
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  const { t } = useLanguage();
  const [aiOpen, setAIOpen] = useState(false);
  
  const handleReset = () => {
    resetStep();
  };
  
  const handleDeploymentOptionToggle = (optionId: string) => {
    const newSelected = formData.selectedDeploymentOptions.includes(optionId)
      ? formData.selectedDeploymentOptions.filter(id => id !== optionId)
      : [...formData.selectedDeploymentOptions, optionId];
    updateFormData({ selectedDeploymentOptions: newSelected });
  };
  
  const handleSaveAndFinalize = () => {
    markAsFinalized();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t('promptGenerator.deployment.title') || "Opções de Implantação"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.deployment.description') || "Selecione as opções de implantação para seu projeto"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleReset} size="icon" className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">{t('common.reset')}</span>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => setAIOpen(true)} size="icon" className="h-8 w-8">
                      <Wand2 className="h-4 w-4 text-blue-500" />
                      <span className="sr-only">Assistente de IA</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <span>Obter ajuda do assistente de IA para opções de implantação</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
              </Button>
              {isFinalized && <CheckCircleIcon className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {deploymentData.map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`deployment-${option.id}`}
                  checked={formData.selectedDeploymentOptions.includes(option.id)}
                  onCheckedChange={() => handleDeploymentOptionToggle(option.id)}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor={`deployment-${option.id}`} className="cursor-pointer text-sm font-medium">
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <AIAssistantPanel
          open={aiOpen}
          onClose={() => setAIOpen(false)}
          items={Array.isArray(deploymentData) ? deploymentData : []}
          title={t('promptGenerator.deployment.title') || 'Implantação'}
        />
      </Card>
    </div>
  );
};

export default DeploymentStep;
