
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OtherSpecifyItem from '@/components/OtherSpecifyItem';

interface FeaturesData {
  specificFeatures: string[];
  otherFeature: string;
  dynamicFeatures: string[];
}

interface FeaturesStepProps {
  formData: FeaturesData;
  systemType: string;
  updateFormData: (data: Partial<FeaturesData>) => void;
}

const FeaturesStep: React.FC<FeaturesStepProps> = ({ formData, systemType, updateFormData }) => {
  const { t } = useLanguage();

  const specificFeaturesOptions = [
    'uploadFiles', 'notifications', 'advancedFilters', 'interactiveDashboards',
    'scheduling', 'export', 'rolePermissions', 'apiIntegration', 
    'multiLanguage', 'accessibility', 'darkMode', 'customLandingPage'
  ];

  // Dynamic features based on system type
  const getDynamicFeatures = () => {
    switch (systemType) {
      case 'ecommerce':
        return [
          'customCheckout', 'paymentGateways', 'inventoryManagement',
          'shippingCalculation', 'abandonedCart', 'promotions'
        ];
      case 'apiBackend':
        return [
          'authentication', 'multiTenancy', 'apiDocs',
          'apiVersioning', 'webhooks'
        ];
      case 'crm':
        return [
          'salesPipeline', 'customerSegmentation', 'emailIntegration',
          'performanceDashboard', 'tasksReminders'
        ];
      default:
        return [];
    }
  };

  const dynamicFeatureOptions = getDynamicFeatures();

  const handleSpecificFeatureChange = (feature: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...formData.specificFeatures, feature]
      : formData.specificFeatures.filter(f => f !== feature);
    
    updateFormData({ specificFeatures: updatedFeatures });
  };

  const handleDynamicFeatureChange = (feature: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...formData.dynamicFeatures, feature]
      : formData.dynamicFeatures.filter(f => f !== feature);
    
    updateFormData({ dynamicFeatures: updatedFeatures });
  };

  const toggleSelectAllSpecific = () => {
    if (formData.specificFeatures.length === specificFeaturesOptions.length) {
      updateFormData({ specificFeatures: [] });
    } else {
      updateFormData({ specificFeatures: [...specificFeaturesOptions] });
    }
  };

  const toggleSelectAllDynamic = () => {
    if (formData.dynamicFeatures.length === dynamicFeatureOptions.length) {
      updateFormData({ dynamicFeatures: [] });
    } else {
      updateFormData({ dynamicFeatures: [...dynamicFeatureOptions] });
    }
  };

  const specificAllSelected = formData.specificFeatures.length === specificFeaturesOptions.length;
  const dynamicAllSelected = formData.dynamicFeatures.length === dynamicFeatureOptions.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.features.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.features.description')}</p>
      </div>

      {/* Specific Features */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{t('promptGenerator.features.specificFeatures')}</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSelectAllSpecific}
            >
              {specificAllSelected ? t('promptGenerator.common.unselectAll') : t('promptGenerator.common.selectAll')}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {specificFeaturesOptions.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox 
                  id={`specific-${feature}`} 
                  checked={formData.specificFeatures.includes(feature)}
                  onCheckedChange={(checked) => 
                    handleSpecificFeatureChange(feature, checked === true)
                  }
                />
                <Label htmlFor={`specific-${feature}`} className="cursor-pointer">
                  {t(`promptGenerator.features.${feature}`)}
                </Label>
              </div>
            ))}
            
            <OtherSpecifyItem
              id="specific-other"
              label={t('promptGenerator.features.other')}
              checked={formData.specificFeatures.includes('other')}
              value={formData.otherFeature || ''}
              placeholder={t('promptGenerator.features.otherFeaturePlaceholder')}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateFormData({
                    specificFeatures: [...formData.specificFeatures, 'other']
                  });
                } else {
                  updateFormData({
                    specificFeatures: formData.specificFeatures.filter(f => f !== 'other'),
                    otherFeature: ''
                  });
                }
              }}
              onValueChange={(value) => updateFormData({ otherFeature: value })}
            />
          </div>
        </div>
      </Card>

      {/* Dynamic Features based on system type */}
      {dynamicFeatureOptions.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{t(`promptGenerator.features.${systemType}Features`)}</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSelectAllDynamic}
              >
                {dynamicAllSelected ? t('promptGenerator.common.unselectAll') : t('promptGenerator.common.selectAll')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dynamicFeatureOptions.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`dynamic-${feature}`} 
                    checked={formData.dynamicFeatures.includes(feature)}
                    onCheckedChange={(checked) => 
                      handleDynamicFeatureChange(feature, checked === true)
                    }
                  />
                  <Label htmlFor={`dynamic-${feature}`} className="cursor-pointer">
                    {t(`promptGenerator.features.${feature}`)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FeaturesStep;
