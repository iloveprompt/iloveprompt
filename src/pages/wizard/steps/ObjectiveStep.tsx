
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Wand2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import OtherSpecifyItem from '@/components/OtherSpecifyItem';

interface ObjectiveStepProps {
  formData: {
    defineObjectives: boolean;
    primaryObjective: string;
    selectedObjectives: string[];
    otherObjective: string | string[];
  };
  updateFormData: (data: Partial<ObjectiveStepProps['formData']>) => void;
}

const ObjectiveStep: React.FC<ObjectiveStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  
  const businessObjectives = [
    'Increase Revenue',
    'Reduce Costs',
    'Improve Customer Experience',
    'Enhance Brand Awareness',
    'Expand Market Reach',
    'Streamline Operations',
    'Drive Innovation',
    'Boost User Engagement',
    'Improve Data Insights',
    'Compliance with Regulations',
    'Enhance Security',
  ];

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

  const enhanceWithAI = () => {
    // This would normally call an AI service to enhance the text
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      if (formData.primaryObjective) {
        const enhanced = formData.primaryObjective + " [Enhanced with AI: This objective has been refined for clarity and impact.]";
        updateFormData({ primaryObjective: enhanced });
      }
    }, 1000);
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
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.defineObjectives}
              onCheckedChange={(checked) => updateFormData({ defineObjectives: checked })}
              id="define-objectives-toggle"
            />
            <Label htmlFor="define-objectives-toggle" className="text-base font-medium">
              {t('promptGenerator.objective.defineObjectives')}
            </Label>
          </div>

          {formData.defineObjectives && (
            <>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="primary-objective" className="text-base font-medium">
                    {t('promptGenerator.objective.primaryObjective')}
                  </Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={enhanceWithAI}
                    className="flex items-center space-x-1"
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    <span>{t('promptGenerator.objective.enhanceWithAI')}</span>
                  </Button>
                </div>
                <Textarea 
                  id="primary-objective"
                  value={formData.primaryObjective}
                  onChange={(e) => updateFormData({ primaryObjective: e.target.value })}
                  placeholder={t('promptGenerator.objective.primaryObjectivePlaceholder')}
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  {t('promptGenerator.objective.primaryObjectiveHelp')}
                </p>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-base font-medium">
                  {t('promptGenerator.objective.businessObjectives')}
                </Label>
                <p className="text-sm text-gray-500 mb-4">
                  {t('promptGenerator.objective.businessObjectivesHelp')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {businessObjectives.map((objective) => (
                    <div key={objective} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`objective-${objective}`}
                        checked={formData.selectedObjectives.includes(objective)}
                        onCheckedChange={() => handleObjectiveToggle(objective)}
                      />
                      <Label 
                        htmlFor={`objective-${objective}`}
                        className="cursor-pointer"
                      >
                        {objective}
                      </Label>
                    </div>
                  ))}

                  <OtherSpecifyItem
                    id="objective-other"
                    label={t('promptGenerator.objective.otherObjective')}
                    checked={formData.selectedObjectives.includes('Other')}
                    value={formData.otherObjective}
                    placeholder={t('promptGenerator.objective.otherObjectivePlaceholder')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData({
                          selectedObjectives: [...formData.selectedObjectives, 'Other']
                        });
                      } else {
                        updateFormData({
                          selectedObjectives: formData.selectedObjectives.filter(obj => obj !== 'Other'),
                          otherObjective: []
                        });
                      }
                    }}
                    onValueChange={(value) => updateFormData({ otherObjective: value })}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectiveStep;
