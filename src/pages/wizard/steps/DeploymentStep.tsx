
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import NotInListButton from '@/components/NotInListButton';
import CheckboxItem from '@/components/CheckboxItem';
import deploymentData from '../data/deploymentData.json';

// Defina o tipo de propriedades para o componente
interface DeploymentStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const DeploymentStep: React.FC<DeploymentStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  const { t } = useLanguage();
  const [deployment, setDeployment] = useState(formData.deployment || {});
  const [otherItems, setOtherItems] = useState(formData.deploymentOtherItems || {});

  useEffect(() => {
    if (formData.deployment) {
      setDeployment(formData.deployment);
    }
    if (formData.deploymentOtherItems) {
      setOtherItems(formData.deploymentOtherItems);
    }
  }, [formData]);

  const handleReset = () => {
    setDeployment({});
    setOtherItems({});
    resetStep();
  };

  const handleCheckboxChange = (groupId: string, itemId: string, checked: boolean) => {
    setDeployment(prev => {
      const currentGroup = prev[groupId] || [];
      if (checked) {
        return { ...prev, [groupId]: [...currentGroup, itemId] };
      } else {
        return { ...prev, [groupId]: currentGroup.filter((id: string) => id !== itemId) };
      }
    });
  };

  const handleOtherChange = (groupId: string, value: string) => {
    setOtherItems(prev => ({ ...prev, [groupId]: value }));
  };

  const handleSaveAndFinalize = () => {
    const updatedData = {
      ...formData,
      deployment,
      deploymentOtherItems: otherItems,
    };
    updateFormData(updatedData);
    markAsFinalized();
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('wizard.steps.deployment.title')}</h2>
      <p className="text-gray-600">{t('wizard.steps.deployment.description')}</p>

      {deploymentData.groups.map((group) => (
        <Card key={group.id} className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{group.title}</h3>
            <div className="space-y-2">
              {group.items.map((item) => (
                <CheckboxItem
                  key={item.id}
                  id={`${group.id}_${item.id}`}
                  label={item.label}
                  description={item.description}
                  checked={(deployment[group.id] || []).includes(item.id)}
                  onChange={(checked) => handleCheckboxChange(group.id, item.id, checked)}
                  otherValue={item.hasOtherField ? otherItems[group.id] || '' : undefined}
                  onOtherChange={item.hasOtherField ? (value) => handleOtherChange(group.id, value) : undefined}
                />
              ))}
              <NotInListButton
                onClick={() => {
                  // Deixe o usuário adicionar um item personalizado se necessário
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev}>
          {t('wizard.common.back')}
        </Button>
        <div className="space-x-2">
          <Button variant="ghost" onClick={handleReset}>
            {t('wizard.common.reset')}
          </Button>
          <Button onClick={handleSaveAndFinalize}>
            {isFinalized ? t('wizard.common.next') : t('wizard.common.saveAndContinue')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentStep;
