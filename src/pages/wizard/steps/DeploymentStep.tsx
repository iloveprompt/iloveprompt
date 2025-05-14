import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ListPlus, PlusCircle, XCircle, RotateCcw, Save, CheckCircle, Wand2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AIAssistantPanel from '../components/AIAssistantPanel';
import deploymentData from '../data/deploymentData.json';

const DeploymentStep: React.FC<DeploymentStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  const { t } = useLanguage();
  const [aiOpen, setAIOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t('promptGenerator.deployment.title')}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.deployment.description')}
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
                    <span>Obter ajuda do assistente de IA para escolher as opções de implantação</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || formData.deploymentOptions.length === 0}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
              </Button>
              {isFinalized && <CheckCircle className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>

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