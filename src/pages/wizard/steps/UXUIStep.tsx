import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import NotInListButton from '@/components/NotInListButton';
import CheckboxItem from '@/components/CheckboxItem';

interface UXUIStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const UXUIStep: React.FC<UXUIStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  const { t } = useLanguage();
  const [selectedColors, setSelectedColors] = useState<string[]>(formData.colorPalette || []);
  const [otherColor, setOtherColor] = useState<string>('');

  useEffect(() => {
    setSelectedColors(formData.colorPalette || []);
    setOtherColor(formData.otherColor || '');
  }, [formData]);

  const handleColorChange = (color: string, checked: boolean) => {
    setSelectedColors(prev => {
      if (checked) {
        return [...prev, color];
      } else {
        return prev.filter(c => c !== color);
      }
    });
  };

  const handleOtherColorChange = (value: string) => {
    setOtherColor(value);
  };

  const handleSaveAndFinalize = () => {
    const updatedData = {
      ...formData,
      colorPalette: selectedColors,
      otherColor,
    };
    updateFormData(updatedData);
    markAsFinalized();
    onNext();
  };

  const isColorInPalette = (color: string): boolean => {
    return selectedColors.some((paletteColor: string) => paletteColor === color);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('wizard.steps.uxui.title')}</h2>
      <p className="text-gray-600">{t('wizard.steps.uxui.description')}</p>

      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">{t('wizard.steps.uxui.colorPalette.title')}</h3>
          <div className="space-y-2">
            {['red', 'blue', 'green', 'yellow'].map(color => (
              <CheckboxItem
                key={color}
                id={color}
                label={color.charAt(0).toUpperCase() + color.slice(1)}
                checked={isColorInPalette(color)}
                onChange={(checked) => handleColorChange(color, checked)}
              />
            ))}
            <NotInListButton
              onClick={() => {
                // Deixe o usuário adicionar um item personalizado se necessário
              }}
            />
            <input
              type="text"
              value={otherColor}
              onChange={(e) => handleOtherColorChange(e.target.value)}
              placeholder={t('wizard.steps.uxui.otherColor.placeholder')}
              className="mt-2 p-2 border rounded"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev}>
          {t('wizard.common.back')}
        </Button>
        <div className="space-x-2">
          <Button variant="ghost" onClick={resetStep}>
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

export default UXUIStep;
