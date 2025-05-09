
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface RestrictionsData {
  avoidInCode: string[];
}

interface RestrictionsStepProps {
  formData: RestrictionsData;
  updateFormData: (data: Partial<RestrictionsData>) => void;
}

const RestrictionsStep: React.FC<RestrictionsStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();

  const restrictionsOptions = [
    'eval', 'globalVars', 'callbackHell', 'unmaintained', 'important', 'paidDeps', 'otherRestriction'
  ];

  const handleRestrictionChange = (restriction: string, checked: boolean) => {
    const updatedRestrictions = checked
      ? [...formData.avoidInCode, restriction]
      : formData.avoidInCode.filter(r => r !== restriction);
    
    updateFormData({ avoidInCode: updatedRestrictions });
  };

  const selectAll = () => {
    updateFormData({ avoidInCode: [...restrictionsOptions] });
  };

  const unselectAll = () => {
    updateFormData({ avoidInCode: [] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.restrictions.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.restrictions.description')}</p>
      </div>

      {/* Restrictions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">{t('promptGenerator.restrictions.avoidInCode')}</h4>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
            >
              {t('promptGenerator.common.selectAll')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={unselectAll}
            >
              {t('promptGenerator.common.unselectAll')}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {restrictionsOptions.map((restriction) => (
            <div key={restriction} className="flex items-center space-x-2">
              <Checkbox 
                id={`restriction-${restriction}`} 
                checked={formData.avoidInCode.includes(restriction)}
                onCheckedChange={(checked) => 
                  handleRestrictionChange(restriction, checked === true)
                }
              />
              <Label htmlFor={`restriction-${restriction}`} className="cursor-pointer">
                {t(`promptGenerator.restrictions.${restriction}`)}
              </Label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RestrictionsStep;
