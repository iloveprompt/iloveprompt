
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CodeStructureData {
  folderOrganization: string[];
  architecturalPattern: string[];
  bestPractices: string[];
}

interface CodeStructureStepProps {
  formData: CodeStructureData;
  updateFormData: (data: Partial<CodeStructureData>) => void;
}

const CodeStructureStep: React.FC<CodeStructureStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();

  const folderOrganizationOptions = [
    'byFunction', 'byDomain', 'frontBackSeparation', 'modularDI', 'other'
  ];

  const architecturalPatternOptions = [
    'mvc', 'mvvm', 'cleanArch', 'ddd', 'hexagonal', 'other'
  ];

  const bestPracticesOptions = [
    'stateless', 'lowCoupling', 'testing', 'reusableComponents', 'other'
  ];

  const handleFolderOrganizationChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.folderOrganization, option]
      : formData.folderOrganization.filter(o => o !== option);
    
    updateFormData({ folderOrganization: updatedOptions });
  };

  const handleArchitecturalPatternChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.architecturalPattern, option]
      : formData.architecturalPattern.filter(o => o !== option);
    
    updateFormData({ architecturalPattern: updatedOptions });
  };

  const handleBestPracticesChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.bestPractices, option]
      : formData.bestPractices.filter(o => o !== option);
    
    updateFormData({ bestPractices: updatedOptions });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.codeStructure.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.codeStructure.description')}</p>
      </div>

      {/* Folder Organization */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.codeStructure.folderOrganization')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {folderOrganizationOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={`folder-${option}`} 
                checked={formData.folderOrganization.includes(option)}
                onCheckedChange={(checked) => 
                  handleFolderOrganizationChange(option, checked === true)
                }
              />
              <Label htmlFor={`folder-${option}`} className="cursor-pointer">
                {t(`promptGenerator.codeStructure.${option}`)}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Architectural Pattern */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.codeStructure.architecturalPattern')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {architecturalPatternOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={`arch-${option}`} 
                checked={formData.architecturalPattern.includes(option)}
                onCheckedChange={(checked) => 
                  handleArchitecturalPatternChange(option, checked === true)
                }
              />
              <Label htmlFor={`arch-${option}`} className="cursor-pointer">
                {t(`promptGenerator.codeStructure.${option}`)}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.codeStructure.bestPractices')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bestPracticesOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={`practice-${option}`} 
                checked={formData.bestPractices.includes(option)}
                onCheckedChange={(checked) => 
                  handleBestPracticesChange(option, checked === true)
                }
              />
              <Label htmlFor={`practice-${option}`} className="cursor-pointer">
                {t(`promptGenerator.codeStructure.${option}`)}
              </Label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CodeStructureStep;
