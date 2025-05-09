
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckboxItem } from '@/components/CheckboxItem';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OtherSpecifyItem from '@/components/OtherSpecifyItem';
import RadioSpecifyItem from '@/components/RadioSpecifyItem';

interface UXUIData {
  colorPalette: string[];
  customColors: { [hex: string]: string };
  visualStyle: string;
  otherVisualStyle: string;
  menuType: string;
  otherMenuType: string;
  landingPage: boolean;
  landingPageDetails: {
    structure: boolean;
    elements: boolean;
    style: boolean;
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
  const [customColorInput, setCustomColorInput] = useState('');

  // Available color options with their hex values
  const colorOptions = [
    { name: 'blue', hex: '#0057D9' },
    { name: 'green', hex: '#28A745' },
    { name: 'red', hex: '#DC3545' },
    { name: 'purple', hex: '#6F42C1' },
    { name: 'orange', hex: '#FD7E14' },
    { name: 'black', hex: '#000000' },
    { name: 'white', hex: '#FFFFFF' },
    { name: 'gray', hex: '#6C757D' },
  ];
  
  // Visual style options
  const visualStyleOptions = [
    'minimalist', 'modern', 'flat', 'ios', 'android', 'otherVisualStyle'
  ];
  
  // Menu type options
  const menuTypeOptions = [
    'topFixed', 'sideFixed', 'hamburger', 'horizontalTabs', 'customMenu', 'otherMenuType'
  ];
  
  // Authentication options
  const authOptions = [
    'emailPassword', 'socialLogin', 'twoFactorAuth', 'otherAuthMethod'
  ];
  
  // Dashboard feature options
  const dashboardOptions = [
    'customizable', 'statistics', 'activityHistory', 'responsiveThemes', 'otherDashboardFeature'
  ];
  
  // Handle color palette changes
  const handleColorChange = (color: string) => {
    const updatedColors = formData.colorPalette.includes(color)
      ? formData.colorPalette.filter(c => c !== color)
      : [...formData.colorPalette, color];
    
    updateFormData({ colorPalette: updatedColors });
  };

  // Handle custom color addition
  const handleAddCustomColor = () => {
    if (customColorInput && /^#[0-9A-F]{6}$/i.test(customColorInput)) {
      const hex = customColorInput.toUpperCase();
      updateFormData({ 
        colorPalette: [...formData.colorPalette, hex],
        customColors: { ...formData.customColors, [hex]: hex }
      });
      setCustomColorInput('');
    }
  };

  // Handle custom color removal
  const handleRemoveCustomColor = (hex: string) => {
    const updatedColors = formData.colorPalette.filter(c => c !== hex);
    const updatedCustomColors = { ...formData.customColors };
    delete updatedCustomColors[hex];
    
    updateFormData({ 
      colorPalette: updatedColors,
      customColors: updatedCustomColors
    });
  };
  
  // Handle landing page toggle
  const handleLandingPageToggle = (value: string) => {
    const hasLandingPage = value === 'hasLandingPage';
    updateFormData({ 
      landingPage: hasLandingPage,
      landingPageDetails: hasLandingPage ? {
        structure: false,
        elements: false,
        style: false
      } : { structure: false, elements: false, style: false }
    });
  };

  // Handle landing page detail changes
  const handleLandingPageDetailChange = (detail: 'structure' | 'elements' | 'style', checked: boolean) => {
    if (formData.landingPageDetails) {
      updateFormData({
        landingPageDetails: {
          ...formData.landingPageDetails,
          [detail]: checked
        }
      });
    }
  };
  
  // Handle dashboard toggle
  const handleDashboardToggle = (value: string) => {
    const hasDashboard = value === 'true';
    updateFormData({ 
      userDashboard: hasDashboard,
      userDashboardDetails: hasDashboard ? {
        features: [],
        otherFeature: ''
      } : { features: [], otherFeature: '' }
    });
  };
  
  // Handle dashboard feature changes
  const handleDashboardFeatureChange = (feature: string, checked: boolean) => {
    if (!formData.userDashboardDetails) return;
    
    const updatedFeatures = checked
      ? [...formData.userDashboardDetails.features, feature]
      : formData.userDashboardDetails.features.filter(f => f !== feature);
    
    updateFormData({
      userDashboardDetails: {
        ...formData.userDashboardDetails,
        features: updatedFeatures
      }
    });
  };
  
  // Handle authentication option changes
  const handleAuthOptionChange = (option: string) => {
    const updatedOptions = formData.authentication.includes(option)
      ? formData.authentication.filter(o => o !== option)
      : [...formData.authentication, option];
    
    updateFormData({ authentication: updatedOptions });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.uxui.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.uxui.description')}</p>
      </div>

      {/* Color Palette */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.colorPalette')}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {colorOptions.map(color => (
            <div key={color.name} className="flex items-center space-x-2">
              <Checkbox 
                id={`color-${color.name}`}
                checked={formData.colorPalette.includes(color.name)}
                onCheckedChange={() => handleColorChange(color.name)}
              />
              <div className="flex items-center">
                <div 
                  className="w-6 h-6 mr-2 rounded border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                ></div>
                <label 
                  htmlFor={`color-${color.name}`} 
                  className="text-sm cursor-pointer"
                >
                  {t(`promptGenerator.uxui.${color.name}`)}
                </label>
              </div>
            </div>
          ))}
          
          {/* Custom color input */}
          <div className="col-span-2 mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="color-custom"
                checked={customColorInput.length > 0}
                onCheckedChange={(checked) => {
                  if (!checked) setCustomColorInput('');
                }}
              />
              <label 
                htmlFor="color-custom" 
                className="text-sm cursor-pointer"
              >
                {t('promptGenerator.uxui.custom')}
              </label>
            </div>
            
            {customColorInput.length > 0 && (
              <div className="ml-6 mt-2 flex items-center space-x-2">
                {/^#[0-9A-F]{6}$/i.test(customColorInput) && (
                  <div 
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: customColorInput }}
                  ></div>
                )}
                <Input 
                  value={customColorInput}
                  onChange={(e) => setCustomColorInput(e.target.value)}
                  placeholder={t('promptGenerator.uxui.customColorPlaceholder')}
                  className="text-sm w-40"
                />
                <button 
                  onClick={handleAddCustomColor}
                  disabled={!customColorInput || !/^#[0-9A-F]{6}$/i.test(customColorInput)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs disabled:bg-gray-300"
                >
                  {t('promptGenerator.common.add')}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Display custom colors */}
        {Object.keys(formData.customColors || {}).length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h5 className="text-sm font-medium mb-2">Custom Colors:</h5>
            <div className="flex flex-wrap gap-2">
              {Object.entries(formData.customColors).map(([hex, _]) => (
                <div 
                  key={hex} 
                  className="flex items-center bg-gray-100 rounded px-2 py-1"
                >
                  <div 
                    className="w-4 h-4 mr-2 rounded"
                    style={{ backgroundColor: hex }}
                  ></div>
                  <span className="text-xs mr-2">{hex}</span>
                  <button 
                    onClick={() => handleRemoveCustomColor(hex)}
                    className="text-red-500 text-xs hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Visual Style */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.visualStyle')}</h4>
        <RadioGroup
          value={formData.visualStyle}
          onValueChange={(value) => updateFormData({ visualStyle: value })}
          className="space-y-2"
        >
          {visualStyleOptions.filter(style => style !== 'otherVisualStyle').map(style => (
            <div key={style} className="flex items-center space-x-2">
              <RadioGroupItem value={style} id={`style-${style}`} />
              <label
                htmlFor={`style-${style}`}
                className="text-sm cursor-pointer"
              >
                {t(`promptGenerator.uxui.${style}`)}
              </label>
            </div>
          ))}
          <RadioSpecifyItem 
            id="style-other"
            groupValue={formData.visualStyle}
            value="otherVisualStyle"
            label={t('promptGenerator.uxui.otherVisualStyle')}
            specifyValue={formData.otherVisualStyle || ''}
            placeholder={t('promptGenerator.uxui.otherVisualStylePlaceholder')}
            onValueChange={(value) => updateFormData({ visualStyle: value })}
            onSpecifyValueChange={(value) => updateFormData({ otherVisualStyle: value })}
          />
        </RadioGroup>
      </Card>

      {/* Menu Type */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.menuType')}</h4>
        <RadioGroup
          value={formData.menuType}
          onValueChange={(value) => updateFormData({ menuType: value })}
          className="space-y-2"
        >
          {menuTypeOptions.filter(menu => menu !== 'otherMenuType').map(menu => (
            <div key={menu} className="flex items-center space-x-2">
              <RadioGroupItem value={menu} id={`menu-${menu}`} />
              <label
                htmlFor={`menu-${menu}`}
                className="text-sm cursor-pointer"
              >
                {t(`promptGenerator.uxui.${menu}`)}
              </label>
            </div>
          ))}
          <RadioSpecifyItem 
            id="menu-other"
            groupValue={formData.menuType}
            value="otherMenuType"
            label={t('promptGenerator.uxui.otherMenuType')}
            specifyValue={formData.otherMenuType || ''}
            placeholder={t('promptGenerator.uxui.otherMenuTypePlaceholder')}
            onValueChange={(value) => updateFormData({ menuType: value })}
            onSpecifyValueChange={(value) => updateFormData({ otherMenuType: value })}
          />
        </RadioGroup>
      </Card>

      {/* Landing Page */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.landingPage')}</h4>
        <RadioGroup
          value={formData.landingPage ? 'hasLandingPage' : 'noLandingPage'}
          onValueChange={handleLandingPageToggle}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hasLandingPage" id="landing-yes" />
            <label 
              htmlFor="landing-yes"
              className="text-sm cursor-pointer"
            >
              {t('promptGenerator.uxui.hasLandingPage')}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="noLandingPage" id="landing-no" />
            <label 
              htmlFor="landing-no"
              className="text-sm cursor-pointer"
            >
              {t('promptGenerator.uxui.noLandingPage')}
            </label>
          </div>
        </RadioGroup>
        
        {formData.landingPage && (
          <div className="mt-4 pl-6 border-l-2 border-gray-200 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="landing-structure"
                checked={formData.landingPageDetails?.structure || false}
                onCheckedChange={(checked) => 
                  handleLandingPageDetailChange('structure', checked === true)
                }
              />
              <div>
                <Label 
                  htmlFor="landing-structure" 
                  className="block text-sm font-medium"
                >
                  {t('promptGenerator.uxui.structure')}
                </Label>
                <p className="text-xs text-gray-500">{t('promptGenerator.uxui.structureOption')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="landing-elements"
                checked={formData.landingPageDetails?.elements || false}
                onCheckedChange={(checked) => 
                  handleLandingPageDetailChange('elements', checked === true)
                }
              />
              <div>
                <Label 
                  htmlFor="landing-elements" 
                  className="block text-sm font-medium"
                >
                  {t('promptGenerator.uxui.elements')}
                </Label>
                <p className="text-xs text-gray-500">{t('promptGenerator.uxui.elementsOption')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="landing-style"
                checked={formData.landingPageDetails?.style || false}
                onCheckedChange={(checked) => 
                  handleLandingPageDetailChange('style', checked === true)
                }
              />
              <div>
                <Label 
                  htmlFor="landing-style" 
                  className="block text-sm font-medium"
                >
                  {t('promptGenerator.uxui.style')}
                </Label>
                <p className="text-xs text-gray-500">{t('promptGenerator.uxui.styleOption')}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Authentication */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.authentication')}</h4>
        <div className="space-y-2">
          {authOptions.filter(auth => auth !== 'otherAuthMethod').map(auth => (
            <div key={auth} className="flex items-center space-x-2">
              <Checkbox
                id={`auth-${auth}`}
                checked={formData.authentication.includes(auth)}
                onCheckedChange={() => handleAuthOptionChange(auth)}
              />
              <label
                htmlFor={`auth-${auth}`}
                className="text-sm cursor-pointer"
              >
                {t(`promptGenerator.uxui.${auth}`)}
              </label>
            </div>
          ))}
          <OtherSpecifyItem
            id="auth-other"
            label={t('promptGenerator.uxui.otherAuthMethod')}
            checked={formData.authentication.includes('otherAuthMethod')}
            value={formData.otherAuthMethod || ''}
            placeholder={t('promptGenerator.uxui.otherAuthMethodPlaceholder')}
            onCheckedChange={(checked) => {
              if (checked) {
                updateFormData({
                  authentication: [...formData.authentication, 'otherAuthMethod']
                });
              } else {
                updateFormData({
                  authentication: formData.authentication.filter(a => a !== 'otherAuthMethod'),
                  otherAuthMethod: ''
                });
              }
            }}
            onValueChange={(value) => updateFormData({ otherAuthMethod: value })}
          />
        </div>
      </Card>

      {/* Dashboard for Logged-in Users */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.userDashboard')}</h4>
        <RadioGroup
          value={formData.userDashboard ? 'true' : 'false'}
          onValueChange={handleDashboardToggle}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="dashboard-yes" />
            <label htmlFor="dashboard-yes" className="text-sm cursor-pointer">{t('promptGenerator.uxui.yes')}</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="dashboard-no" />
            <label htmlFor="dashboard-no" className="text-sm cursor-pointer">{t('promptGenerator.uxui.no')}</label>
          </div>
        </RadioGroup>
        
        {formData.userDashboard && (
          <div className="mt-4 space-y-2">
            {dashboardOptions.filter(option => option !== 'otherDashboardFeature').map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`dash-${option}`}
                  checked={formData.userDashboardDetails?.features.includes(option) || false}
                  onCheckedChange={(checked) => 
                    handleDashboardFeatureChange(option, checked === true)
                  }
                />
                <label
                  htmlFor={`dash-${option}`}
                  className="text-sm cursor-pointer"
                >
                  {t(`promptGenerator.uxui.${option}`)}
                </label>
              </div>
            ))}
            <OtherSpecifyItem
              id="dash-other"
              label={t('promptGenerator.uxui.otherDashboardFeature')}
              checked={formData.userDashboardDetails?.features.includes('otherDashboardFeature') || false}
              value={formData.userDashboardDetails?.otherFeature || ''}
              placeholder={t('promptGenerator.uxui.otherDashboardFeaturePlaceholder')}
              onCheckedChange={(checked) => {
                if (!formData.userDashboardDetails) return;
                
                if (checked) {
                  updateFormData({
                    userDashboardDetails: {
                      ...formData.userDashboardDetails,
                      features: [...formData.userDashboardDetails.features, 'otherDashboardFeature']
                    }
                  });
                } else {
                  updateFormData({
                    userDashboardDetails: {
                      ...formData.userDashboardDetails,
                      features: formData.userDashboardDetails.features.filter(f => f !== 'otherDashboardFeature'),
                      otherFeature: ''
                    }
                  });
                }
              }}
              onValueChange={(value) => {
                if (formData.userDashboardDetails) {
                  updateFormData({
                    userDashboardDetails: {
                      ...formData.userDashboardDetails,
                      otherFeature: value
                    }
                  });
                }
              }}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default UXUIStep;
