import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const UXUIStep = ({ onNext, onPrev, formData, updateFormData }) => {
  const { t } = useLanguage();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(formData.uxui || []);

  const handleOptionSelect = (id: string) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(item => item !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const handleSave = () => {
    updateFormData({ uxui: selectedOptions });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">{t('wizard.uxuiStep.title')}</h2>
        <p className="text-gray-500 mt-2">{t('wizard.uxuiStep.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['option1', 'option2', 'option3'].map(option => (
          <Card 
            key={option}
            className={`cursor-pointer transition-all ${
              selectedOptions.includes(option) 
                ? 'border-primary shadow-md' 
                : 'hover:border-gray-400'
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t(`wizard.uxuiStep.options.${option}.name`)}</h3>
                <p className="text-sm text-gray-500">{t(`wizard.uxuiStep.options.${option}.description`)}</p>
              </div>
              {selectedOptions.includes(option) && (
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
        </div>
        <div>
          <Button onClick={handleSave}>
            {t('wizard.common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UXUIStep;
