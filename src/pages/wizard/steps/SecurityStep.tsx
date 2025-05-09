
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import OtherSpecifyItem from '@/components/OtherSpecifyItem';

interface SecurityData {
  selectedSecurity: string[];
  otherSecurityFeature: string;
}

interface SecurityStepProps {
  formData: SecurityData;
  updateFormData: (data: Partial<SecurityData>) => void;
}

const SecurityStep: React.FC<SecurityStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  
  const securityOptions = [
    'protection',
    'authenticationSec',
    'https',
    'auditLogs',
    'apiSecurity'
  ];

  const handleSecurityChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.selectedSecurity, option]
      : formData.selectedSecurity.filter(o => o !== option);
    
    updateFormData({ selectedSecurity: updatedOptions });
  };

  const toggleSelectAll = () => {
    if (formData.selectedSecurity.length === securityOptions.length) {
      updateFormData({ selectedSecurity: [] });
    } else {
      updateFormData({ selectedSecurity: [...securityOptions] });
    }
  };

  const allSelected = formData.selectedSecurity.length === securityOptions.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.security.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.security.description')}</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{t('promptGenerator.security.securityFeatures')}</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSelectAll}
            >
              {allSelected ? t('promptGenerator.common.unselectAll') : t('promptGenerator.common.selectAll')}
            </Button>
          </div>
          
          <div className="space-y-3">
            {securityOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`security-${option}`}
                  checked={formData.selectedSecurity.includes(option)}
                  onCheckedChange={(checked) => 
                    handleSecurityChange(option, checked === true)
                  }
                />
                <Label htmlFor={`security-${option}`} className="cursor-pointer">
                  {t(`promptGenerator.security.${option}`)}
                </Label>
              </div>
            ))}
            
            <OtherSpecifyItem
              id="security-otherSecurityFeature"
              label={t('promptGenerator.security.otherSecurityFeature')}
              checked={formData.selectedSecurity.includes('otherSecurityFeature')}
              value={formData.otherSecurityFeature}
              placeholder={t('promptGenerator.security.otherSecurityFeaturePlaceholder')}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateFormData({
                    selectedSecurity: [...formData.selectedSecurity, 'otherSecurityFeature']
                  });
                } else {
                  updateFormData({
                    selectedSecurity: formData.selectedSecurity.filter(o => o !== 'otherSecurityFeature'),
                    otherSecurityFeature: ''
                  });
                }
              }}
              onValueChange={(value) => updateFormData({ otherSecurityFeature: value })}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecurityStep;
