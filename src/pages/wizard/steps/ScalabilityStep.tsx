
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ScalabilityData {
  isScalable: boolean;
  scalabilityFeatures: string[];
  performanceFeatures: string[];
}

interface ScalabilityStepProps {
  formData: ScalabilityData;
  updateFormData: (data: Partial<ScalabilityData>) => void;
}

const ScalabilityStep: React.FC<ScalabilityStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();

  const scalabilityOptions = [
    'redis', 'caching', 'autoScaling', 'other'
  ];

  const performanceOptions = [
    'lazyLoading', 'minification', 'serverRendering', 'optimization', 'other'
  ];

  const handleScalabilityChange = (value: boolean) => {
    updateFormData({ isScalable: value });
  };

  const handleScalabilityFeatureChange = (option: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...formData.scalabilityFeatures, option]
      : formData.scalabilityFeatures.filter(f => f !== option);
    
    updateFormData({ scalabilityFeatures: updatedFeatures });
  };

  const handlePerformanceFeatureChange = (option: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...formData.performanceFeatures, option]
      : formData.performanceFeatures.filter(f => f !== option);
    
    updateFormData({ performanceFeatures: updatedFeatures });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.scalability.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.scalability.description')}</p>
      </div>

      {/* Scalability */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">{t('promptGenerator.scalability.scalability')}</h4>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isScalable}
              onCheckedChange={handleScalabilityChange}
              id="scalability-switch"
            />
            <Label htmlFor="scalability-switch">
              {formData.isScalable ? t('promptGenerator.uxui.yes') : t('promptGenerator.uxui.no')}
            </Label>
          </div>
        </div>

        {formData.isScalable && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {scalabilityOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`scale-${option}`} 
                  checked={formData.scalabilityFeatures.includes(option)}
                  onCheckedChange={(checked) => 
                    handleScalabilityFeatureChange(option, checked === true)
                  }
                />
                <Label htmlFor={`scale-${option}`} className="cursor-pointer">
                  {t(`promptGenerator.scalability.${option}`)}
                </Label>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Performance */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.scalability.performance')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {performanceOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={`perf-${option}`} 
                checked={formData.performanceFeatures.includes(option)}
                onCheckedChange={(checked) => 
                  handlePerformanceFeatureChange(option, checked === true)
                }
              />
              <Label htmlFor={`perf-${option}`} className="cursor-pointer">
                {t(`promptGenerator.scalability.${option}`)}
              </Label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ScalabilityStep;
