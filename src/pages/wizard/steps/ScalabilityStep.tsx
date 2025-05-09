
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import OtherSpecifyItem from '@/components/OtherSpecifyItem';

interface ScalabilityData {
  isScalable: boolean;
  scalabilityFeatures: string[];
  otherScalabilityFeature: string;
  performanceFeatures: string[];
  otherPerformanceFeature: string;
}

interface ScalabilityStepProps {
  formData: ScalabilityData;
  updateFormData: (data: Partial<ScalabilityData>) => void;
}

const ScalabilityStep: React.FC<ScalabilityStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();

  const scalabilityOptions = ['redis', 'caching', 'autoScaling'];
  const performanceOptions = ['lazyLoading', 'minification', 'serverRendering', 'optimization'];

  const handleScalabilityToggle = (value: string) => {
    const isScalable = value === 'true';
    updateFormData({ 
      isScalable,
      ...(isScalable ? {} : { 
        scalabilityFeatures: [], 
        performanceFeatures: [],
        otherScalabilityFeature: '',
        otherPerformanceFeature: ''
      })
    });
  };

  const handleScalabilityFeatureChange = (feature: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...formData.scalabilityFeatures, feature]
      : formData.scalabilityFeatures.filter(f => f !== feature);
    
    updateFormData({ scalabilityFeatures: updatedFeatures });
  };

  const handlePerformanceFeatureChange = (feature: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...formData.performanceFeatures, feature]
      : formData.performanceFeatures.filter(f => f !== feature);
    
    updateFormData({ performanceFeatures: updatedFeatures });
  };

  const selectAllScalability = () => {
    updateFormData({ scalabilityFeatures: [...scalabilityOptions] });
  };

  const selectAllPerformance = () => {
    updateFormData({ performanceFeatures: [...performanceOptions] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.scalability.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.scalability.description')}</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center mb-4">
          <h4 className="font-medium mr-4">{t('promptGenerator.scalability.isScalable')}</h4>
          <RadioGroup
            value={formData.isScalable ? 'true' : 'false'}
            onValueChange={handleScalabilityToggle}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="scalable-yes" />
              <Label htmlFor="scalable-yes">{t('promptGenerator.uxui.yes')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="scalable-no" />
              <Label htmlFor="scalable-no">{t('promptGenerator.uxui.no')}</Label>
            </div>
          </RadioGroup>
        </div>
        
        {formData.isScalable && (
          <>
            {/* Scalability Features */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">{t('promptGenerator.scalability.scalability')}</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAllScalability}
                >
                  {t('promptGenerator.common.selectAll')}
                </Button>
              </div>
              
              <div className="space-y-2">
                {scalabilityOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`scalability-${option}`}
                      checked={formData.scalabilityFeatures.includes(option)}
                      onCheckedChange={(checked) => 
                        handleScalabilityFeatureChange(option, checked === true)
                      }
                    />
                    <Label htmlFor={`scalability-${option}`} className="cursor-pointer">
                      {t(`promptGenerator.scalability.${option}`)}
                    </Label>
                  </div>
                ))}
                
                <OtherSpecifyItem
                  id="scalability-other"
                  label={t('promptGenerator.scalability.otherScalabilityFeature')}
                  checked={formData.scalabilityFeatures.includes('otherScalabilityFeature')}
                  value={formData.otherScalabilityFeature}
                  placeholder={t('promptGenerator.scalability.otherScalabilityFeaturePlaceholder')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFormData({
                        scalabilityFeatures: [...formData.scalabilityFeatures, 'otherScalabilityFeature']
                      });
                    } else {
                      updateFormData({
                        scalabilityFeatures: formData.scalabilityFeatures.filter(f => f !== 'otherScalabilityFeature'),
                        otherScalabilityFeature: ''
                      });
                    }
                  }}
                  onValueChange={(value) => updateFormData({ otherScalabilityFeature: value })}
                />
              </div>
            </div>

            {/* Performance Features */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">{t('promptGenerator.scalability.performance')}</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAllPerformance}
                >
                  {t('promptGenerator.common.selectAll')}
                </Button>
              </div>
              
              <div className="space-y-2">
                {performanceOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`performance-${option}`}
                      checked={formData.performanceFeatures.includes(option)}
                      onCheckedChange={(checked) => 
                        handlePerformanceFeatureChange(option, checked === true)
                      }
                    />
                    <Label htmlFor={`performance-${option}`} className="cursor-pointer">
                      {t(`promptGenerator.scalability.${option}`)}
                    </Label>
                  </div>
                ))}
                
                <OtherSpecifyItem
                  id="performance-other"
                  label={t('promptGenerator.scalability.otherPerformanceFeature')}
                  checked={formData.performanceFeatures.includes('otherPerformanceFeature')}
                  value={formData.otherPerformanceFeature}
                  placeholder={t('promptGenerator.scalability.otherPerformanceFeaturePlaceholder')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFormData({
                        performanceFeatures: [...formData.performanceFeatures, 'otherPerformanceFeature']
                      });
                    } else {
                      updateFormData({
                        performanceFeatures: formData.performanceFeatures.filter(f => f !== 'otherPerformanceFeature'),
                        otherPerformanceFeature: ''
                      });
                    }
                  }}
                  onValueChange={(value) => updateFormData({ otherPerformanceFeature: value })}
                />
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ScalabilityStep;
