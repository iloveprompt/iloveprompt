
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import OtherSpecifyItem from '@/components/OtherSpecifyItem';

interface RestrictionsData {
  avoidInCode: string[];
  otherRestriction: string;
}

interface RestrictionsStepProps {
  formData: RestrictionsData;
  updateFormData: (data: Partial<RestrictionsData>) => void;
}

const RestrictionsStep: React.FC<RestrictionsStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  
  const restrictionOptions = [
    'eval',
    'globalVars',
    'callbackHell',
    'unmaintained',
    'important',
    'paidDeps'
  ];

  const handleRestrictionChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.avoidInCode, option]
      : formData.avoidInCode.filter(o => o !== option);
    
    updateFormData({ avoidInCode: updatedOptions });
  };

  const toggleSelectAll = () => {
    if (formData.avoidInCode.length === restrictionOptions.length) {
      updateFormData({ avoidInCode: [] });
    } else {
      updateFormData({ avoidInCode: [...restrictionOptions] });
    }
  };

  const allSelected = formData.avoidInCode.length === restrictionOptions.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.restrictions.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.restrictions.description')}</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{t('promptGenerator.restrictions.avoidInCode')}</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSelectAll}
            >
              {allSelected ? t('promptGenerator.common.unselectAll') : t('promptGenerator.common.selectAll')}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {restrictionOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`restriction-${option}`}
                  checked={formData.avoidInCode.includes(option)}
                  onCheckedChange={(checked) => 
                    handleRestrictionChange(option, checked === true)
                  }
                />
                <Label htmlFor={`restriction-${option}`} className="cursor-pointer">
                  {t(`promptGenerator.restrictions.${option}`)}
                </Label>
              </div>
            ))}
            
            <OtherSpecifyItem
              id="restriction-other"
              label={t('promptGenerator.restrictions.otherRestriction')}
              checked={formData.avoidInCode.includes('otherRestriction')}
              value={formData.otherRestriction}
              placeholder={t('promptGenerator.restrictions.otherRestrictionPlaceholder')}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateFormData({
                    avoidInCode: [...formData.avoidInCode, 'otherRestriction']
                  });
                } else {
                  updateFormData({
                    avoidInCode: formData.avoidInCode.filter(r => r !== 'otherRestriction'),
                    otherRestriction: ''
                  });
                }
              }}
              onValueChange={(value) => updateFormData({ otherRestriction: value })}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RestrictionsStep;
