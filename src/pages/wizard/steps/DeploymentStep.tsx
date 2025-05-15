
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import deploymentData from '../data/deploymentData.json';

interface DeploymentStepProps {
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSaveAndFinalize: () => void;
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
}

const DeploymentStep: React.FC<DeploymentStepProps> = ({ 
  onNext, 
  onPrev, 
  onReset, 
  onSaveAndFinalize,
  formData, 
  updateFormData 
}) => {
  const { t } = useLanguage();
  const [selectedDeployment, setSelectedDeployment] = useState<string[]>(
    formData.deployment || []
  );

  const handleDeploymentSelect = (id: string) => {
    if (selectedDeployment.includes(id)) {
      setSelectedDeployment(selectedDeployment.filter(item => item !== id));
    } else {
      setSelectedDeployment([...selectedDeployment, id]);
    }
  };

  const handleSave = () => {
    updateFormData({ deployment: selectedDeployment });
    onNext();
  };

  const handleReset = () => {
    setSelectedDeployment([]);
    onReset();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-1">{t('wizard.deploymentStep.title')}</h2>
        <p className="text-gray-500 mt-0">{t('wizard.deploymentStep.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deploymentData.deploymentOptions.map((option) => (
          <Card 
            key={option.id}
            className={`cursor-pointer transition-all ${
              selectedDeployment.includes(option.id) 
                ? 'border-primary shadow-md' 
                : 'hover:border-gray-400'
            }`}
            onClick={() => handleDeploymentSelect(option.id)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{option.name}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
              {selectedDeployment.includes(option.id) && (
                <Check className="text-primary h-5 w-5" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <div>
          <Button variant="outline" onClick={onPrev}>
            {t('wizard.common.previous')}
          </Button>
          <Button variant="outline" onClick={handleReset} className="ml-2">
            {t('wizard.common.reset')}
          </Button>
        </div>
        <div>
          <Button variant="outline" onClick={onSaveAndFinalize} className="mr-2">
            {t('wizard.common.saveAndFinalize')}
          </Button>
          <Button onClick={handleSave}>
            {t('wizard.common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentStep;
