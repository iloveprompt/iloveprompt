
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckboxItem } from '@/components/CheckboxItem';

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

  // Available color options
  const colorOptions = ['blue', 'green', 'red', 'purple', 'orange', 'black', 'white', 'gray', 'custom'];
  
  // Visual style options
  const visualStyleOptions = ['minimalist', 'modern', 'flat', 'ios', 'android', 'otherVisualStyle'];
  
  // Menu type options
  const menuTypeOptions = ['topFixed', 'sideFixed', 'hamburger', 'horizontalTabs', 'customMenu', 'otherMenuType'];
  
  // Authentication options
  const authOptions = ['emailPassword', 'socialLogin', 'twoFactorAuth', 'otherAuthMethod'];
  
  // Dashboard feature options
  const dashboardOptions = ['customizable', 'statistics', 'activityHistory', 'responsiveThemes', 'otherDashboardFeature'];
  
  // Handle color palette changes
  const handleColorChange = (color: string) => {
    const updatedColors = formData.colorPalette.includes(color)
      ? formData.colorPalette.filter(c => c !== color)
      : [...formData.colorPalette, color];
    
    updateFormData({ colorPalette: updatedColors });
  };
  
  // Handle landing page toggle
  const handleLandingPageToggle = (value: string) => {
    const hasLandingPage = value === 'hasLandingPage';
    updateFormData({ 
      landingPage: hasLandingPage,
      landingPageDetails: hasLandingPage ? {} : null
    });
  };
  
  // Handle dashboard toggle
  const handleDashboardToggle = (value: string) => {
    const hasDashboard = value === 'true';
    updateFormData({ 
      userDashboard: hasDashboard,
      userDashboardDetails: hasDashboard ? {} : null
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {colorOptions.map(color => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox 
                id={`color-${color}`}
                checked={formData.colorPalette.includes(color)}
                onCheckedChange={() => handleColorChange(color)}
              />
              <label 
                htmlFor={`color-${color}`} 
                className="text-sm cursor-pointer"
              >
                {t(`promptGenerator.uxui.${color}`)}
              </label>
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
          <div className="mt-4 pl-6 border-l-2 border-gray-200">
            <p className="text-sm text-gray-500 mb-2">{t('promptGenerator.uxui.structure')}</p>
            <p className="text-sm text-gray-500 mb-2">{t('promptGenerator.uxui.elements')}</p>
            <p className="text-sm text-gray-500">{t('promptGenerator.uxui.style')}</p>
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
            <label htmlFor="dashboard-yes" className="text-sm cursor-pointer">{t('promptGenerator.uxui.hasLandingPage')}</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="dashboard-no" />
            <label htmlFor="dashboard-no" className="text-sm cursor-pointer">{t('promptGenerator.uxui.noLandingPage')}</label>
          </div>
        </RadioGroup>
        
        {formData.userDashboard && (
          <div className="mt-4 space-y-2">
            {dashboardOptions.map(option => (
              <CheckboxItem
                key={option}
                id={`dash-${option}`}
                label={t(`promptGenerator.uxui.${option}`)}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UXUIStep;
