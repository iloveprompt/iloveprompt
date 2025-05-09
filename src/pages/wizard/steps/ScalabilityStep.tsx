
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  
  const scalabilityOptions = [
    'redis',
    'caching',
    'autoScaling'
  ];

  const performanceOptions = [
    'lazyLoading',
    'minification',
    'serverRendering',
    'optimization'
  ];

  const handleScalabilityChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.scalabilityFeatures, option]
      : formData.scalabilityFeatures.filter(o => o !== option);
    
    updateFormData({ scalabilityFeatures: updatedOptions });
  };

  const handlePerformanceChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.performanceFeatures, option]
      : formData.performanceFeatures.filter(o => o !== option);
    
    updateFormData({ performanceFeatures: updatedOptions });
  };

  const toggleScalabilitySelectAll = () => {
    if (formData.scalabilityFeatures.length === scalabilityOptions.length) {
      updateFormData({ scalabilityFeatures: [] });
    } else {
      updateFormData({ scalabilityFeatures: [...scalabilityOptions] });
    }
  };

  const togglePerformanceSelectAll = () => {
    if (formData.performanceFeatures.length === performanceOptions.length) {
      updateFormData({ performanceFeatures: [] });
    } else {
      updateFormData({ performanceFeatures: [...performanceOptions] });
    }
  };

  const allScalabilitySelected = formData.scalabilityFeatures.length === scalabilityOptions.length;
  const allPerformanceSelected = formData.performanceFeatures.length === performanceOptions.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.scalability.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.scalability.description')}</p>
      </div>

      <div className="flex flex-row items-center space-x-4 mb-4">
        <Label className="text-base font-medium mr-4">
          {t('promptGenerator.scalability.isScalable')}
        </Label>
        <RadioGroup
          value={formData.isScalable ? 'yes' : 'no'}
          onValueChange={(value) => updateFormData({ isScalable: value === 'yes' })}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="scalable-yes" />
            <Label htmlFor="scalable-yes">{t('promptGenerator.common.yes')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="scalable-no" />
            <Label htmlFor="scalable-no">{t('promptGenerator.common.no')}</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.isScalable && (
        <>
          {/* Scalability Features */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{t('promptGenerator.scalability.scalability')}</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleScalabilitySelectAll}
                >
                  {allScalabilitySelected ? t('promptGenerator.common.unselectAll') : t('promptGenerator.common.selectAll')}
                </Button>
              </div>
              
              <div className="space-y-3">
                {scalabilityOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`scalability-${option}`}
                      checked={formData.scalabilityFeatures.includes(option)}
                      onCheckedChange={(checked) => 
                        handleScalabilityChange(option, checked === true)
                      }
                    />
                    <Label htmlFor={`scalability-${option}`} className="cursor-pointer">
                      {t(`promptGenerator.scalability.${option}`)}
                    </Label>
                  </div>
                ))}
                
                <OtherSpecifyItem
                  id="scalability-otherFeature"
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
          </Card>

          {/* Performance Features */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{t('promptGenerator.scalability.performance')}</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={togglePerformanceSelectAll}
                >
                  {allPerformanceSelected ? t('promptGenerator.common.unselectAll') : t('promptGenerator.common.selectAll')}
                </Button>
              </div>
              
              <div className="space-y-3">
                {performanceOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`performance-${option}`}
                      checked={formData.performanceFeatures.includes(option)}
                      onCheckedChange={(checked) => 
                        handlePerformanceChange(option, checked === true)
                      }
                    />
                    <Label htmlFor={`performance-${option}`} className="cursor-pointer">
                      {t(`promptGenerator.scalability.${option}`)}
                    </Label>
                  </div>
                ))}
                
                <OtherSpecifyItem
                  id="performance-otherFeature"
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
          </Card>
        </>
      )}
    </div>
  );
};

export default ScalabilityStep;
