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
import { Button } from '@/components/ui/button';

interface UXUIData {
  colorPalette: string[];
  customColors: { [hex: string]: string };
  visualStyle: string;
  otherVisualStyle: string | string[];
  menuType: string;
  otherMenuType: string | string[];
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
  otherAuthMethod: string | string[];
  userDashboard: boolean;
  userDashboardDetails: {
    features: string[];
    otherFeature: string | string[];
  };
}

interface UXUIStepProps {
  formData: UXUIData;
  updateFormData: (data: Partial<UXUIData>) => void;
}

const UXUIStep: React.FC<UXUIStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  const [customColorInput, setCustomColorInput] = useState('');

  // Initialize landingPageDetails if not present
  if (!formData.landingPageDetails) {
    formData.landingPageDetails = {
      structure: {
        hero: true,
        benefits: true,
        testimonials: true,
        cta: true,
        other: false,
        otherValue: ''
      },
      elements: {
        video: true,
        form: true,
        animations: true,
        other: false,
        otherValue: ''
      },
      style: {
        modern: true,
        minimalist: true,
        corporate: true,
        creative: true,
        other: false,
        otherValue: ''
      }
    };
  }

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
    'minimalist', 'modern', 'flat', 'ios', 'android'
  ];
  
  // Menu type options
  const menuTypeOptions = [
    'topFixed', 'sideFixed', 'hamburger', 'horizontalTabs', 'customMenu'
  ];
  
  // Authentication options
  const authOptions = [
    'emailPassword', 'socialLogin', 'twoFactorAuth'
  ];
  
  // Dashboard feature options
  const dashboardOptions = [
    'customizable', 'statistics', 'activityHistory', 'responsiveThemes'
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
    updateFormData({ landingPage: hasLandingPage });
  };

  // Handle landing page structure detail changes
  const handleStructureChange = (key: keyof UXUIData['landingPageDetails']['structure'], value: boolean) => {
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        structure: {
          ...formData.landingPageDetails.structure,
          [key]: value
        }
      }
    });
  };

  // Handle landing page elements detail changes
  const handleElementsChange = (key: keyof UXUIData['landingPageDetails']['elements'], value: boolean) => {
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        elements: {
          ...formData.landingPageDetails.elements,
          [key]: value
        }
      }
    });
  };

  // Handle landing page style detail changes
  const handleStyleChange = (key: keyof UXUIData['landingPageDetails']['style'], value: boolean) => {
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        style: {
          ...formData.landingPageDetails.style,
          [key]: value
        }
      }
    });
  };
  
  // Handle landing page detail text input changes
  const handleLandingPageTextChange = (section: 'structure' | 'elements' | 'style', value: string) => {
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        [section]: {
          ...formData.landingPageDetails[section],
          otherValue: value
        }
      }
    });
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
                <Button 
                  onClick={handleAddCustomColor}
                  disabled={!customColorInput || !/^#[0-9A-F]{6}$/i.test(customColorInput)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs disabled:bg-gray-300"
                >
                  {t('promptGenerator.common.add')}
                </Button>
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
          {visualStyleOptions.map(style => (
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
            specifyValue={formData.otherVisualStyle as string}
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
          {menuTypeOptions.map(menu => (
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
            specifyValue={formData.otherMenuType as string}
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
          <div className="mt-4 space-y-6">
            {/* Structure */}
            <div className="pl-6 border-l-2 border-gray-200">
              <h5 className="font-medium mb-2">{t('promptGenerator.uxui.structure')}</h5>
              <p className="text-xs text-gray-500 mb-3">{t('promptGenerator.uxui.structureOption')}</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="structure-hero"
                    checked={formData.landingPageDetails?.structure?.hero || false}
                    onCheckedChange={(checked) => handleStructureChange('hero', checked === true)}
                  />
                  <Label htmlFor="structure-hero">
                    {t('promptGenerator.uxui.structureItems.hero')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="structure-benefits"
                    checked={formData.landingPageDetails?.structure?.benefits || false}
                    onCheckedChange={(checked) => handleStructureChange('benefits', checked === true)}
                  />
                  <Label htmlFor="structure-benefits">
                    {t('promptGenerator.uxui.structureItems.benefits')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="structure-testimonials"
                    checked={formData.landingPageDetails?.structure?.testimonials || false}
                    onCheckedChange={(checked) => handleStructureChange('testimonials', checked === true)}
                  />
                  <Label htmlFor="structure-testimonials">
                    {t('promptGenerator.uxui.structureItems.testimonials')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="structure-cta"
                    checked={formData.landingPageDetails?.structure?.cta || false}
                    onCheckedChange={(checked) => handleStructureChange('cta', checked === true)}
                  />
                  <Label htmlFor="structure-cta">
                    {t('promptGenerator.uxui.structureItems.cta')}
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="structure-other"
                      checked={formData.landingPageDetails?.structure?.other || false}
                      onCheckedChange={(checked) => handleStructureChange('other', checked === true)}
                    />
                    <Label htmlFor="structure-other">
                      {t('promptGenerator.uxui.structureItems.other')}
                    </Label>
                  </div>
                  
                  {formData.landingPageDetails?.structure?.other && (
                    <div className="ml-6">
                      <Input 
                        value={formData.landingPageDetails?.structure?.otherValue || ''}
                        onChange={(e) => handleLandingPageTextChange('structure', e.target.value)}
                        placeholder={t('promptGenerator.uxui.structureOtherPlaceholder')}
                        className="mt-1 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Elements */}
            <div className="pl-6 border-l-2 border-gray-200">
              <h5 className="font-medium mb-2">{t('promptGenerator.uxui.elements')}</h5>
              <p className="text-xs text-gray-500 mb-3">{t('promptGenerator.uxui.elementsOption')}</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="elements-video"
                    checked={formData.landingPageDetails?.elements?.video || false}
                    onCheckedChange={(checked) => handleElementsChange('video', checked === true)}
                  />
                  <Label htmlFor="elements-video">
                    {t('promptGenerator.uxui.elementsItems.video')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="elements-form"
                    checked={formData.landingPageDetails?.elements?.form || false}
                    onCheckedChange={(checked) => handleElementsChange('form', checked === true)}
                  />
                  <Label htmlFor="elements-form">
                    {t('promptGenerator.uxui.elementsItems.form')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="elements-animations"
                    checked={formData.landingPageDetails?.elements?.animations || false}
                    onCheckedChange={(checked) => handleElementsChange('animations', checked === true)}
                  />
                  <Label htmlFor="elements-animations">
                    {t('promptGenerator.uxui.elementsItems.animations')}
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="elements-other"
                      checked={formData.landingPageDetails?.elements?.other || false}
                      onCheckedChange={(checked) => handleElementsChange('other', checked === true)}
                    />
                    <Label htmlFor="elements-other">
                      {t('promptGenerator.uxui.elementsItems.other')}
                    </Label>
                  </div>
                  
                  {formData.landingPageDetails?.elements?.other && (
                    <div className="ml-6">
                      <Input 
                        value={formData.landingPageDetails?.elements?.otherValue || ''}
                        onChange={(e) => handleLandingPageTextChange('elements', e.target.value)}
                        placeholder={t('promptGenerator.uxui.elementsOtherPlaceholder')}
                        className="mt-1 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Style */}
            <div className="pl-6 border-l-2 border-gray-200">
              <h5 className="font-medium mb-2">{t('promptGenerator.uxui.style')}</h5>
              <p className="text-xs text-gray-500 mb-3">{t('promptGenerator.uxui.styleOption')}</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="style-modern"
                    checked={formData.landingPageDetails?.style?.modern || false}
                    onCheckedChange={(checked) => handleStyleChange('modern', checked === true)}
                  />
                  <Label htmlFor="style-modern">
                    {t('promptGenerator.uxui.styleItems.modern')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="style-minimalist"
                    checked={formData.landingPageDetails?.style?.minimalist || false}
                    onCheckedChange={(checked) => handleStyleChange('minimalist', checked === true)}
                  />
                  <Label htmlFor="style-minimalist">
                    {t('promptGenerator.uxui.styleItems.minimalist')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="style-corporate"
                    checked={formData.landingPageDetails?.style?.corporate || false}
                    onCheckedChange={(checked) => handleStyleChange('corporate', checked === true)}
                  />
                  <Label htmlFor="style-corporate">
                    {t('promptGenerator.uxui.styleItems.corporate')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="style-creative"
                    checked={formData.landingPageDetails?.style?.creative || false}
                    onCheckedChange={(checked) => handleStyleChange('creative', checked === true)}
                  />
                  <Label htmlFor="style-creative">
                    {t('promptGenerator.uxui.styleItems.creative')}
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="style-other"
                      checked={formData.landingPageDetails?.style?.other || false}
                      onCheckedChange={(checked) => handleStyleChange('other', checked === true)}
                    />
                    <Label htmlFor="style-other">
                      {t('promptGenerator.uxui.styleItems.other')}
                    </Label>
                  </div>
                  
                  {formData.landingPageDetails?.style?.other && (
                    <div className="ml-6">
                      <Input 
                        value={formData.landingPageDetails?.style?.otherValue || ''}
                        onChange={(e) => handleLandingPageTextChange('style', e.target.value)}
                        placeholder={t('promptGenerator.uxui.styleOtherPlaceholder')}
                        className="mt-1 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Authentication */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.authentication')}</h4>
        <div className="space-y-2">
          {authOptions.map(auth => (
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
            {dashboardOptions.map(option => (
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
