
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorSwatch, HexColorPicker } from '../components/ColorPicker';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Edit3, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import RadioSpecifyItem from '@/components/RadioSpecifyItem';

interface UXUIData {
  colorPalette: string[];
  customColors: Record<string, string>;
  visualStyle: string;
  otherVisualStyle: string;
  menuType: string;
  otherMenuType: string;
  landingPage: boolean;
  landingPageDetails: {
    structure: {
      hero: boolean;
      benefits: boolean;
      testimonials: boolean;
      cta: boolean;
      other: boolean;
      otherValue: string;
    };
    elements: {
      video: boolean;
      form: boolean;
      animations: boolean;
      other: boolean;
      otherValue: string;
    };
    style: {
      modern: boolean;
      minimalist: boolean;
      corporate: boolean;
      creative: boolean;
      other: boolean;
      otherValue: string;
    };
  };
  authentication: string[];
  otherAuthMethod: string;
  userDashboard: boolean;
  userDashboardDetails: {
    features: string[];
    otherFeature: string;
  };
}

interface UXUIStepProps {
  formData: UXUIData;
  updateFormData: (data: Partial<UXUIData>) => void;
}

const UXUIStep: React.FC<UXUIStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  
  // Color options
  const colorOptions = [
    { value: 'blue', color: '#0057D9' },
    { value: 'green', color: '#28A745' },
    { value: 'red', color: '#DC3545' },
    { value: 'purple', color: '#6F42C1' },
    { value: 'orange', color: '#FD7E14' },
    { value: 'black', color: '#000000' },
    { value: 'white', color: '#FFFFFF' },
    { value: 'gray', color: '#6C757D' },
  ];

  // Visual style options
  const visualStyleOptions = [
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'modern', label: 'Modern with shadows' },
    { value: 'flat', label: 'Flat/Material Design' },
    { value: 'ios', label: 'iOS-inspired' },
    { value: 'android', label: 'Android-inspired' },
  ];

  // Menu type options
  const menuTypeOptions = [
    { value: 'topFixed', label: 'Fixed top' },
    { value: 'sideFixed', label: 'Fixed sidebar' },
    { value: 'hamburger', label: 'Hamburger menu (mobile)' },
    { value: 'horizontalTabs', label: 'Horizontal tabs' },
    { value: 'customMenu', label: 'Custom (describe)' },
  ];

  // Authentication options
  const authOptions = [
    { value: 'emailPassword', label: 'Email + Password' },
    { value: 'socialLogin', label: 'Google | Facebook | GitHub | Apple' },
    { value: 'twoFactorAuth', label: 'Two-factor authentication (2FA)' },
  ];

  // Dashboard features
  const dashboardFeatures = [
    { value: 'customizable', label: 'Customizable' },
    { value: 'statistics', label: 'Charts and statistics' },
    { value: 'activityHistory', label: 'Activity history' },
    { value: 'responsiveThemes', label: 'Light/dark theme and responsive' },
  ];

  // Handle checkbox changes for landing page details
  const handleLandingPageDetailChange = (
    category: 'structure' | 'elements' | 'style',
    item: string,
    checked: boolean
  ) => {
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        [category]: {
          ...formData.landingPageDetails[category],
          [item]: checked
        }
      }
    });
  };

  // Handle checkbox changes for authentication methods
  const handleAuthMethodChange = (value: string, checked: boolean) => {
    const updatedAuth = checked
      ? [...formData.authentication, value]
      : formData.authentication.filter((item) => item !== value);
    
    updateFormData({ authentication: updatedAuth });
  };

  // Handle checkbox changes for dashboard features
  const handleDashboardFeatureChange = (value: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...formData.userDashboardDetails.features, value]
      : formData.userDashboardDetails.features.filter((item) => item !== value);
    
    updateFormData({
      userDashboardDetails: {
        ...formData.userDashboardDetails,
        features: updatedFeatures,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.uxui.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.uxui.description')}</p>
      </div>
      
      {/* Color Palette */}
      <Card className="p-6 mb-4">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.colorPalette')}</h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {colorOptions.map((color) => (
            <ColorSwatch
              key={color.value}
              color={color.color}
              label={t(`promptGenerator.uxui.${color.value}`)}
              selected={formData.colorPalette.includes(color.value)}
              onToggle={(selected) => {
                const updatedColors = selected
                  ? [...formData.colorPalette, color.value]
                  : formData.colorPalette.filter((c) => c !== color.value);
                updateFormData({ colorPalette: updatedColors });
              }}
            />
          ))}
        </div>
        
        {/* Custom Color Picker */}
        <div className="mb-2">
          <ColorSwatch
            color="#CCCCCC"
            label={t('promptGenerator.uxui.custom')}
            selected={formData.colorPalette.includes('custom')}
            onToggle={(selected) => {
              const updatedColors = selected
                ? [...formData.colorPalette, 'custom']
                : formData.colorPalette.filter((c) => c !== 'custom');
              updateFormData({ colorPalette: updatedColors });
            }}
          />
        </div>
        
        {formData.colorPalette.includes('custom') && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>{t('promptGenerator.uxui.customColorPlaceholder')}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="#RRGGBB"
                  value={Object.keys(formData.customColors)[0] || ''}
                  onChange={(e) => {
                    const colorCode = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(colorCode) || colorCode === '') {
                      const newCustomColors = { ...formData.customColors };
                      
                      // Remove previous key
                      const prevKey = Object.keys(newCustomColors)[0];
                      if (prevKey) delete newCustomColors[prevKey];
                      
                      // Add new key with the same value (or default)
                      if (colorCode) {
                        newCustomColors[colorCode] = 'Custom Color';
                      }
                      
                      updateFormData({ customColors: newCustomColors });
                    }
                  }}
                  className="w-32"
                />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <span 
                        className="block w-4 h-4 rounded mr-1" 
                        style={{ backgroundColor: Object.keys(formData.customColors)[0] || '#000000' }}
                      ></span>
                      {t('common.pick')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <HexColorPicker
                      color={Object.keys(formData.customColors)[0] || '#000000'}
                      onChange={(color) => {
                        const newCustomColors = {};
                        newCustomColors[color] = 'Custom Color';
                        updateFormData({ customColors: newCustomColors });
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Visual Style */}
      <Card className="p-6 mb-4">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.visualStyle')}</h4>
        
        <RadioGroup
          value={formData.visualStyle}
          onValueChange={(value) => updateFormData({ visualStyle: value })}
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
        >
          {visualStyleOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`visual-style-${option.value}`} />
              <Label htmlFor={`visual-style-${option.value}`} className="cursor-pointer">
                {t(`promptGenerator.uxui.${option.value}`)}
              </Label>
            </div>
          ))}
          
          <RadioSpecifyItem
            id="visual-style-other"
            groupValue={formData.visualStyle}
            value="other"
            label={t('promptGenerator.uxui.otherVisualStyle')}
            specifyValue={formData.otherVisualStyle}
            placeholder={t('promptGenerator.uxui.otherVisualStylePlaceholder')}
            onValueChange={(value) => updateFormData({ visualStyle: value })}
            onSpecifyValueChange={(value) => updateFormData({ otherVisualStyle: value })}
          />
        </RadioGroup>
      </Card>
      
      {/* Menu Type */}
      <Card className="p-6 mb-4">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.menuType')}</h4>
        
        <RadioGroup
          value={formData.menuType}
          onValueChange={(value) => updateFormData({ menuType: value })}
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
        >
          {menuTypeOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`menu-type-${option.value}`} />
              <Label htmlFor={`menu-type-${option.value}`} className="cursor-pointer">
                {t(`promptGenerator.uxui.${option.value}`)}
              </Label>
            </div>
          ))}
          
          <RadioSpecifyItem
            id="menu-type-other"
            groupValue={formData.menuType}
            value="other"
            label={t('promptGenerator.uxui.otherMenuType')}
            specifyValue={formData.otherMenuType}
            placeholder={t('promptGenerator.uxui.otherMenuTypePlaceholder')}
            onValueChange={(value) => updateFormData({ menuType: value })}
            onSpecifyValueChange={(value) => updateFormData({ otherMenuType: value })}
          />
        </RadioGroup>
      </Card>
      
      {/* Landing Page */}
      <Card className="p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">{t('promptGenerator.uxui.landingPage')}</h4>
          <div className="flex items-center space-x-2">
            <Switch
              id="landing-page-toggle"
              checked={formData.landingPage}
              onCheckedChange={(checked) => updateFormData({ landingPage: checked })}
            />
            <Label htmlFor="landing-page-toggle">
              {formData.landingPage 
                ? t('promptGenerator.uxui.hasLandingPage') 
                : t('promptGenerator.uxui.noLandingPage')}
            </Label>
          </div>
        </div>
        
        {formData.landingPage && (
          <div className="space-y-6 mt-4">
            {/* Structure */}
            <div>
              <h5 className="text-sm font-medium mb-2">{t('promptGenerator.uxui.structure')}</h5>
              <p className="text-xs text-gray-500 mb-3">{t('promptGenerator.uxui.structureOption')}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(formData.landingPageDetails.structure)
                  .filter(([key]) => key !== 'otherValue')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`landing-structure-${key}`}
                        checked={value as boolean}
                        onCheckedChange={(checked) => 
                          handleLandingPageDetailChange('structure', key, checked === true)
                        }
                      />
                      <Label htmlFor={`landing-structure-${key}`} className="cursor-pointer">
                        {t(`promptGenerator.uxui.structureItems.${key}`)}
                      </Label>
                    </div>
                  ))}
              </div>
              
              {formData.landingPageDetails.structure.other && (
                <div className="mt-2">
                  <Input
                    placeholder={t('promptGenerator.uxui.structureOtherPlaceholder')}
                    value={formData.landingPageDetails.structure.otherValue}
                    onChange={(e) => 
                      handleLandingPageDetailChange('structure', 'otherValue', e.target.value as unknown as boolean)
                    }
                    className="max-w-md"
                  />
                </div>
              )}
            </div>
            
            {/* Elements */}
            <div>
              <h5 className="text-sm font-medium mb-2">{t('promptGenerator.uxui.elements')}</h5>
              <p className="text-xs text-gray-500 mb-3">{t('promptGenerator.uxui.elementsOption')}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(formData.landingPageDetails.elements)
                  .filter(([key]) => key !== 'otherValue')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`landing-elements-${key}`}
                        checked={value as boolean}
                        onCheckedChange={(checked) => 
                          handleLandingPageDetailChange('elements', key, checked === true)
                        }
                      />
                      <Label htmlFor={`landing-elements-${key}`} className="cursor-pointer">
                        {t(`promptGenerator.uxui.elementsItems.${key}`)}
                      </Label>
                    </div>
                  ))}
              </div>
              
              {formData.landingPageDetails.elements.other && (
                <div className="mt-2">
                  <Input
                    placeholder={t('promptGenerator.uxui.elementsOtherPlaceholder')}
                    value={formData.landingPageDetails.elements.otherValue}
                    onChange={(e) => {
                      const updatedElements = {
                        ...formData.landingPageDetails.elements,
                        otherValue: e.target.value
                      };
                      
                      updateFormData({
                        landingPageDetails: {
                          ...formData.landingPageDetails,
                          elements: updatedElements
                        }
                      });
                    }}
                    className="max-w-md"
                  />
                </div>
              )}
            </div>
            
            {/* Style */}
            <div>
              <h5 className="text-sm font-medium mb-2">{t('promptGenerator.uxui.style')}</h5>
              <p className="text-xs text-gray-500 mb-3">{t('promptGenerator.uxui.styleOption')}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(formData.landingPageDetails.style)
                  .filter(([key]) => key !== 'otherValue')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`landing-style-${key}`}
                        checked={value as boolean}
                        onCheckedChange={(checked) => 
                          handleLandingPageDetailChange('style', key, checked === true)
                        }
                      />
                      <Label htmlFor={`landing-style-${key}`} className="cursor-pointer">
                        {t(`promptGenerator.uxui.styleItems.${key}`)}
                      </Label>
                    </div>
                  ))}
              </div>
              
              {formData.landingPageDetails.style.other && (
                <div className="mt-2">
                  <Input
                    placeholder={t('promptGenerator.uxui.styleOtherPlaceholder')}
                    value={formData.landingPageDetails.style.otherValue}
                    onChange={(e) => {
                      const updatedStyle = {
                        ...formData.landingPageDetails.style,
                        otherValue: e.target.value
                      };
                      
                      updateFormData({
                        landingPageDetails: {
                          ...formData.landingPageDetails,
                          style: updatedStyle
                        }
                      });
                    }}
                    className="max-w-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
      
      {/* Authentication */}
      <Card className="p-6 mb-4">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.authentication')}</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {authOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`auth-${option.value}`}
                checked={formData.authentication.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleAuthMethodChange(option.value, checked === true)
                }
              />
              <Label htmlFor={`auth-${option.value}`} className="cursor-pointer">
                {t(`promptGenerator.uxui.${option.value}`)}
              </Label>
            </div>
          ))}
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auth-other"
              checked={formData.authentication.includes('otherAuthMethod')}
              onCheckedChange={(checked) => {
                handleAuthMethodChange('otherAuthMethod', checked === true);
                if (!checked) {
                  updateFormData({ otherAuthMethod: '' });
                }
              }}
            />
            <Label htmlFor="auth-other" className="cursor-pointer">
              {t('promptGenerator.uxui.otherAuthMethod')}
            </Label>
          </div>
        </div>
        
        {formData.authentication.includes('otherAuthMethod') && (
          <div className="mt-2">
            <Input
              placeholder={t('promptGenerator.uxui.otherAuthMethodPlaceholder')}
              value={formData.otherAuthMethod}
              onChange={(e) => updateFormData({ otherAuthMethod: e.target.value })}
              className="max-w-md"
            />
          </div>
        )}
      </Card>
      
      {/* User Dashboard */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">{t('promptGenerator.uxui.userDashboard')}</h4>
          <div className="flex items-center space-x-2">
            <Switch
              id="dashboard-toggle"
              checked={formData.userDashboard}
              onCheckedChange={(checked) => updateFormData({ userDashboard: checked })}
            />
            <Label htmlFor="dashboard-toggle">
              {formData.userDashboard ? t('common.yes') : t('common.no')}
            </Label>
          </div>
        </div>
        
        {formData.userDashboard && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dashboardFeatures.map((feature) => (
                <div key={feature.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dashboard-${feature.value}`}
                    checked={formData.userDashboardDetails.features.includes(feature.value)}
                    onCheckedChange={(checked) => 
                      handleDashboardFeatureChange(feature.value, checked === true)
                    }
                  />
                  <Label htmlFor={`dashboard-${feature.value}`} className="cursor-pointer">
                    {t(`promptGenerator.uxui.${feature.value}`)}
                  </Label>
                </div>
              ))}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dashboard-other"
                  checked={formData.userDashboardDetails.features.includes('otherDashboardFeature')}
                  onCheckedChange={(checked) => {
                    handleDashboardFeatureChange('otherDashboardFeature', checked === true);
                    if (!checked) {
                      updateFormData({ 
                        userDashboardDetails: {
                          ...formData.userDashboardDetails,
                          otherFeature: ''
                        }
                      });
                    }
                  }}
                />
                <Label htmlFor="dashboard-other" className="cursor-pointer">
                  {t('promptGenerator.uxui.otherDashboardFeature')}
                </Label>
              </div>
            </div>
            
            {formData.userDashboardDetails.features.includes('otherDashboardFeature') && (
              <div className="mt-2">
                <Input
                  placeholder={t('promptGenerator.uxui.otherDashboardFeaturePlaceholder')}
                  value={formData.userDashboardDetails.otherFeature}
                  onChange={(e) => updateFormData({ 
                    userDashboardDetails: {
                      ...formData.userDashboardDetails,
                      otherFeature: e.target.value
                    }
                  })}
                  className="max-w-md"
                />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UXUIStep;
