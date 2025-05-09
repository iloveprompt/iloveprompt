
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import RadioSpecifyItem from '@/components/RadioSpecifyItem';

interface SystemTypeData {
  selected: string;
  otherType: string;
  examples: string[];
}

interface SystemTypeStepProps {
  formData: SystemTypeData;
  updateFormData: (data: Partial<SystemTypeData>) => void;
}

const SystemTypeStep: React.FC<SystemTypeStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();

  const systemTypes = [
    'microsaas', 'saas', 'erp', 'crm', 'ecommerce', 'cms', 'apiBackend',
    'mobileApp', 'schedulingSystem', 'helpdesk', 'educationalPlatform',
    'streamingPlatform', 'staticPage', 'other'
  ];

  // Generate examples based on selected system type
  const getExamples = (systemType: string): string[] => {
    switch (systemType) {
      case 'microsaas':
      case 'saas':
        return ['socialLogin', 'platformWithLanding', 'interactiveDashboards'];
      case 'apiBackend':
        return ['jwtAuth', 'webhooks'];
      case 'mobileApp':
        return ['pushNotifications'];
      case 'schedulingSystem':
        return ['schedulingReminders'];
      case 'ecommerce':
        return ['subscriptionPlatform'];
      case 'staticPage':
        return ['platformWithLanding'];
      default:
        return ['socialLogin', 'jwtAuth', 'interactiveDashboards'];
    }
  };

  const handleSystemTypeChange = (value: string) => {
    const examples = getExamples(value);
    updateFormData({ 
      selected: value,
      examples
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.systemType.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.systemType.description')}</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h4 className="font-medium">{t('promptGenerator.systemType.systemTypeHelp')}</h4>
          
          <RadioGroup
            value={formData.selected}
            onValueChange={handleSystemTypeChange}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {systemTypes.filter(type => type !== 'other').map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={type} />
                <Label htmlFor={type} className="cursor-pointer">
                  {t(`promptGenerator.systemType.${type}`)}
                </Label>
              </div>
            ))}
            
            <RadioSpecifyItem 
              id="system-type-other"
              groupValue={formData.selected}
              value="other"
              label={t('promptGenerator.systemType.other')}
              specifyValue={formData.otherType}
              placeholder={t('promptGenerator.systemType.otherTypePlaceholder')}
              onValueChange={handleSystemTypeChange}
              onSpecifyValueChange={(value) => updateFormData({ otherType: value })}
            />
          </RadioGroup>

          {formData.selected && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">{t('promptGenerator.systemType.suggestedExamples')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {formData.examples.map((example) => (
                  <Card key={example} className="p-3 bg-gray-50">
                    {t(`promptGenerator.systemType.${example}`)}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SystemTypeStep;
