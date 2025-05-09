
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

interface UXUIData {
  colorPalette: string[];
  visualStyle: string;
  menuType: string;
  landingPage: boolean;
  landingPageDetails: any;
  authentication: string[];
  userDashboard: boolean;
  userDashboardDetails: any;
}

interface UXUIStepProps {
  formData: UXUIData;
  updateFormData: (data: Partial<UXUIData>) => void;
}

const UXUIStep: React.FC<UXUIStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  
  // Color palette options with hex values
  const colorOptions = [
    { id: 'blue', color: '#0057D9' },
    { id: 'green', color: '#28A745' },
    { id: 'red', color: '#DC3545' },
    { id: 'purple', color: '#6F42C1' },
    { id: 'orange', color: '#FD7E14' },
    { id: 'black', color: '#000000' },
    { id: 'white', color: '#FFFFFF' },
    { id: 'gray', color: '#6C757D' },
    { id: 'custom', color: '#F1F0FB' },
  ];

  // Visual style options
  const visualStyleOptions = [
    'minimalist', 'modern', 'flat', 'ios', 'android', 'other'
  ];

  // Menu type options
  const menuTypeOptions = [
    'topFixed', 'sideFixed', 'hamburger', 'horizontalTabs', 'custom', 'other'
  ];

  // Landing page options
  const landingPageStyleOptions = [
    'structure', 'elements', 'style', 'other'
  ];

  // Authentication options
  const authenticationOptions = [
    'emailPassword', 'socialLogin', 'twoFactorAuth', 'other'
  ];

  // Dashboard options
  const dashboardOptions = [
    'customizable', 'statistics', 'activityHistory', 'responsiveThemes', 'other'
  ];

  const handleColorChange = (color: string, checked: boolean) => {
    const updatedColors = checked
      ? [...formData.colorPalette, color]
      : formData.colorPalette.filter(c => c !== color);
    
    updateFormData({ colorPalette: updatedColors });
  };

  const handleAuthOptionChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.authentication, option]
      : formData.authentication.filter(o => o !== option);
    
    updateFormData({ authentication: updatedOptions });
  };

  const handleLandingPageChange = (value: boolean) => {
    updateFormData({ 
      landingPage: value,
      landingPageDetails: value ? formData.landingPageDetails : {} 
    });
  };

  const handleDashboardChange = (value: boolean) => {
    updateFormData({ 
      userDashboard: value,
      userDashboardDetails: value ? formData.userDashboardDetails : {} 
    });
  };

  const handleLandingPageDetailChange = (option: string, checked: boolean) => {
    const details = { ...formData.landingPageDetails };
    details[option] = checked;
    updateFormData({ landingPageDetails: details });
  };

  const handleDashboardDetailChange = (option: string, checked: boolean) => {
    const details = { ...formData.userDashboardDetails };
    details[option] = checked;
    updateFormData({ userDashboardDetails: details });
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {colorOptions.map(({ id, color }) => (
            <div key={id} className="flex items-center space-x-3">
              <Checkbox 
                id={`color-${id}`} 
                checked={formData.colorPalette.includes(id)}
                onCheckedChange={(checked) => 
                  handleColorChange(id, checked === true)
                }
              />
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: color }}
              />
              <Label htmlFor={`color-${id}`} className="cursor-pointer">
                {t(`promptGenerator.uxui.${id}`)}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Visual Style */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.visualStyle')}</h4>
        <RadioGroup
          value={formData.visualStyle}
          onValueChange={(value) => updateFormData({ visualStyle: value })}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {visualStyleOptions.map((style) => (
            <div key={style} className="flex items-center space-x-2">
              <RadioGroupItem value={style} id={`style-${style}`} />
              <Label htmlFor={`style-${style}`} className="cursor-pointer">
                {t(`promptGenerator.uxui.${style}`)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      {/* Menu Type */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.menuType')}</h4>
        <RadioGroup
          value={formData.menuType}
          onValueChange={(value) => updateFormData({ menuType: value })}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {menuTypeOptions.map((menu) => (
            <div key={menu} className="flex items-center space-x-2">
              <RadioGroupItem value={menu} id={`menu-${menu}`} />
              <Label htmlFor={`menu-${menu}`} className="cursor-pointer">
                {t(`promptGenerator.uxui.${menu}`)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      {/* Landing Page */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">{t('promptGenerator.uxui.landingPage')}</h4>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.landingPage}
              onCheckedChange={handleLandingPageChange}
              id="landing-page-switch"
            />
            <Label htmlFor="landing-page-switch">
              {formData.landingPage ? t('promptGenerator.uxui.yes') : t('promptGenerator.uxui.no')}
            </Label>
          </div>
        </div>

        {formData.landingPage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {landingPageStyleOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`landing-${option}`} 
                  checked={formData.landingPageDetails?.[option] || false}
                  onCheckedChange={(checked) => 
                    handleLandingPageDetailChange(option, checked === true)
                  }
                />
                <Label htmlFor={`landing-${option}`} className="cursor-pointer">
                  {t(`promptGenerator.uxui.${option}`)}
                </Label>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Authentication */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.uxui.authentication')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {authenticationOptions.map((auth) => (
            <div key={auth} className="flex items-center space-x-2">
              <Checkbox 
                id={`auth-${auth}`} 
                checked={formData.authentication.includes(auth)}
                onCheckedChange={(checked) => 
                  handleAuthOptionChange(auth, checked === true)
                }
              />
              <Label htmlFor={`auth-${auth}`} className="cursor-pointer">
                {t(`promptGenerator.uxui.${auth}`)}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Dashboard for Logged Users */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">{t('promptGenerator.uxui.userDashboard')}</h4>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.userDashboard}
              onCheckedChange={handleDashboardChange}
              id="dashboard-switch"
            />
            <Label htmlFor="dashboard-switch">
              {formData.userDashboard ? t('promptGenerator.uxui.yes') : t('promptGenerator.uxui.no')}
            </Label>
          </div>
        </div>

        {formData.userDashboard && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {dashboardOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`dashboard-${option}`} 
                  checked={formData.userDashboardDetails?.[option] || false}
                  onCheckedChange={(checked) => 
                    handleDashboardDetailChange(option, checked === true)
                  }
                />
                <Label htmlFor={`dashboard-${option}`} className="cursor-pointer">
                  {t(`promptGenerator.uxui.${option}`)}
                </Label>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UXUIStep;
