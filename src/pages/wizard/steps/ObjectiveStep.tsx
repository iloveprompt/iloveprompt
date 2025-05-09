
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface ObjectiveStepProps {
  formData: {
    primaryObjective: string;
    selectedObjectives: string[];
  };
  updateFormData: (data: Partial<ObjectiveStepProps['formData']>) => void;
}

const objectives = [
  'Automação de processos',
  'Aquisição de novos clientes',
  'Retenção de clientes',
  'Otimização de operações internas',
  'Análise de dados/Business Intelligence',
  'Compliance e conformidade regulatória',
  'Melhoria da experiência do usuário',
  'Aumento de vendas',
  'Redução de custos operacionais',
  'Expansão para novos mercados',
  'Monitoramento e manutenção remota',
  'Automação de marketing',
  'Gestão de relacionamento com clientes',
  'Controle de qualidade'
];

const ObjectiveStep: React.FC<ObjectiveStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  
  const handleObjectiveToggle = (objective: string) => {
    if (formData.selectedObjectives.includes(objective)) {
      updateFormData({
        selectedObjectives: formData.selectedObjectives.filter(obj => obj !== objective)
      });
    } else {
      updateFormData({
        selectedObjectives: [...formData.selectedObjectives, objective]
      });
    }
  };
  
  const handleSelectAll = () => {
    if (formData.selectedObjectives.length === objectives.length) {
      // Deselect all
      updateFormData({ selectedObjectives: [] });
    } else {
      // Select all
      updateFormData({ selectedObjectives: [...objectives] });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('promptGenerator.objective.title')}</CardTitle>
          <CardDescription>
            {t('promptGenerator.objective.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary-objective" className="text-base font-medium">
              {t('promptGenerator.objective.primaryObjective')}
            </Label>
            <Textarea 
              id="primary-objective"
              value={formData.primaryObjective}
              onChange={(e) => updateFormData({ primaryObjective: e.target.value })}
              placeholder={t('promptGenerator.objective.primaryObjectivePlaceholder')}
              rows={4}
              className="text-base"
            />
            <p className="text-sm text-gray-500">
              {t('promptGenerator.objective.primaryObjectiveHelp')}
            </p>
          </div>
          
          <div className="space-y-2 mt-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                {t('promptGenerator.objective.businessObjectives')}
              </Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
              >
                {formData.selectedObjectives.length === objectives.length ? 
                  t('promptGenerator.common.unselectAll') : 
                  t('promptGenerator.common.selectAll')}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {t('promptGenerator.objective.businessObjectivesHelp')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {objectives.map((objective) => (
                <div key={objective} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`objective-${objective}`}
                    checked={formData.selectedObjectives.includes(objective)}
                    onCheckedChange={() => handleObjectiveToggle(objective)}
                  />
                  <Label 
                    htmlFor={`objective-${objective}`}
                    className="cursor-pointer text-gray-700"
                  >
                    {objective}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectiveStep;
