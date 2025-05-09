
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import OtherSpecifyItem from '@/components/OtherSpecifyItem';

interface CodeStructureData {
  folderOrganization: string[];
  otherOrganizationStyle: string;
  architecturalPattern: string[];
  otherArchPattern: string;
  bestPractices: string[];
  otherBestPractice: string;
}

interface CodeStructureStepProps {
  formData: CodeStructureData;
  updateFormData: (data: Partial<CodeStructureData>) => void;
}

const CodeStructureStep: React.FC<CodeStructureStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();

  const folderOptions = [
    'byFunction', 'byDomain', 'frontBackSeparation', 'modularDI'
  ];

  const architectureOptions = [
    'mvc', 'mvvm', 'cleanArch', 'ddd', 'hexagonal'
  ];

  const bestPracticeOptions = [
    'stateless', 'lowCoupling', 'testing', 'reusableComponents'
  ];

  const handleFolderChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.folderOrganization, option]
      : formData.folderOrganization.filter(o => o !== option);
    
    updateFormData({ folderOrganization: updatedOptions });
  };

  const handleArchitectureChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.architecturalPattern, option]
      : formData.architecturalPattern.filter(o => o !== option);
    
    updateFormData({ architecturalPattern: updatedOptions });
  };

  const handleBestPracticeChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.bestPractices, option]
      : formData.bestPractices.filter(o => o !== option);
    
    updateFormData({ bestPractices: updatedOptions });
  };

  const toggleFolderSelectAll = () => {
    if (formData.folderOrganization.length === folderOptions.length) {
      updateFormData({ folderOrganization: [] });
    } else {
      updateFormData({ folderOrganization: [...folderOptions] });
    }
  };

  const toggleArchitectureSelectAll = () => {
    if (formData.architecturalPattern.length === architectureOptions.length) {
      updateFormData({ architecturalPattern: [] });
    } else {
      updateFormData({ architecturalPattern: [...architectureOptions] });
    }
  };

  const toggleBestPracticesSelectAll = () => {
    if (formData.bestPractices.length === bestPracticeOptions.length) {
      updateFormData({ bestPractices: [] });
    } else {
      updateFormData({ bestPractices: [...bestPracticeOptions] });
    }
  };

  const allFoldersSelected = formData.folderOrganization.length === folderOptions.length;
  const allArchitecturesSelected = formData.architecturalPattern.length === architectureOptions.length;
  const allBestPracticesSelected = formData.bestPractices.length === bestPracticeOptions.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.codeStructure.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.codeStructure.description')}</p>
      </div>

      {/* Folder Organization */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{t('promptGenerator.codeStructure.folderOrganization')}</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleFolderSelectAll}
            >
              {allFoldersSelected ? t('promptGenerator.common.unselectAll') : t('promptGenerator.common.selectAll')}
            </Button>
          </div>
          
          <div className="space-y-2">
            {folderOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`folder-${option}`}
                  checked={formData.folderOrganization.includes(option)}
                  onCheckedChange={(checked) => 
                    handleFolderChange(option, checked === true)
                  }
                />
                <Label htmlFor={`folder-${option}`} className="cursor-pointer">
                  {t(`promptGenerator.codeStructure.${option}`)}
                </Label>
              </div>
            ))}
            
            <OtherSpecifyItem
              id="folder-other"
              label={t('promptGenerator.codeStructure.otherOrganizationStyle')}
              checked={formData.folderOrganization.includes('otherOrganizationStyle')}
              value={formData.otherOrganizationStyle}
              placeholder={t('promptGenerator.codeStructure.otherOrganizationStylePlaceholder')}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateFormData({
                    folderOrganization: [...formData.folderOrganization, 'otherOrganizationStyle']
                  });
                } else {
                  updateFormData({
                    folderOrganization: formData.folderOrganization.filter(f => f !== 'otherOrganizationStyle'),
                    otherOrganizationStyle: ''
                  });
                }
              }}
              onValueChange={(value) => updateFormData({ otherOrganizationStyle: value })}
            />
          </div>
        </div>
      </Card>

      {/* Architectural Pattern */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{t('promptGenerator.codeStructure.architecturalPattern')}</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleArchitectureSelectAll}
            >
              {allArchitecturesSelected ? t('promptGenerator.common.unselectAll') : t('promptGenerator.common.selectAll')}
            </Button>
          </div>
          
          <div className="space-y-2">
            {architectureOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`arch-${option}`}
                  checked={formData.architecturalPattern.includes(option)}
                  onCheckedChange={(checked) => 
                    handleArchitectureChange(option, checked === true)
                  }
                />
                <Label htmlFor={`arch-${option}`} className="cursor-pointer">
                  {t(`promptGenerator.codeStructure.${option}`)}
                </Label>
              </div>
            ))}
            
            <OtherSpecifyItem
              id="arch-other"
              label={t('promptGenerator.codeStructure.otherArchPattern')}
              checked={formData.architecturalPattern.includes('otherArchPattern')}
              value={formData.otherArchPattern}
              placeholder={t('promptGenerator.codeStructure.otherArchPatternPlaceholder')}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateFormData({
                    architecturalPattern: [...formData.architecturalPattern, 'otherArchPattern']
                  });
                } else {
                  updateFormData({
                    architecturalPattern: formData.architecturalPattern.filter(a => a !== 'otherArchPattern'),
                    otherArchPattern: ''
                  });
                }
              }}
              onValueChange={(value) => updateFormData({ otherArchPattern: value })}
            />
          </div>
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{t('promptGenerator.codeStructure.bestPractices')}</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleBestPracticesSelectAll}
            >
              {allBestPracticesSelected ? t('promptGenerator.common.unselectAll') : t('promptGenerator.common.selectAll')}
            </Button>
          </div>
          
          <div className="space-y-2">
            {bestPracticeOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`bp-${option}`}
                  checked={formData.bestPractices.includes(option)}
                  onCheckedChange={(checked) => 
                    handleBestPracticeChange(option, checked === true)
                  }
                />
                <Label htmlFor={`bp-${option}`} className="cursor-pointer">
                  {t(`promptGenerator.codeStructure.${option}`)}
                </Label>
              </div>
            ))}
            
            <OtherSpecifyItem
              id="bp-other"
              label={t('promptGenerator.codeStructure.otherBestPractice')}
              checked={formData.bestPractices.includes('otherBestPractice')}
              value={formData.otherBestPractice}
              placeholder={t('promptGenerator.codeStructure.otherBestPracticePlaceholder')}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateFormData({
                    bestPractices: [...formData.bestPractices, 'otherBestPractice']
                  });
                } else {
                  updateFormData({
                    bestPractices: formData.bestPractices.filter(b => b !== 'otherBestPractice'),
                    otherBestPractice: ''
                  });
                }
              }}
              onValueChange={(value) => updateFormData({ otherBestPractice: value })}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CodeStructureStep;
