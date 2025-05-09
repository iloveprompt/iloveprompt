
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import OtherSpecifyItem from '@/components/OtherSpecifyItem';

interface RequirementsStepProps {
  formData: {
    defineRequirements: boolean;
    userTypes: string[];
    functionalRequirements: string[];
    nonFunctionalRequirements: string[];
    otherRequirement: string;
  };
  updateFormData: (data: Partial<RequirementsStepProps['formData']>) => void;
}

// Common non-functional requirements
const commonNonFunctionalRequirements = [
  'Performance (velocidade de carregamento)',
  'Segurança de dados',
  'Escalabilidade (capacidade de crescimento)',
  'Usabilidade (facilidade de uso)',
  'Acessibilidade',
  'Compatibilidade com dispositivos móveis',
  'Suporte a múltiplos idiomas',
  'Conformidade com normas (LGPD, GDPR, etc.)',
  'Monitoramento e logs',
  'Backup e recuperação de dados',
  'Alta disponibilidade (uptime)',
  'Compatibilidade com navegadores'
];

const RequirementsStep: React.FC<RequirementsStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  
  const [newUserType, setNewUserType] = React.useState('');
  const [newFunctionalRequirement, setNewFunctionalRequirement] = React.useState('');
  
  const handleAddUserType = () => {
    if (newUserType.trim()) {
      updateFormData({
        userTypes: [...formData.userTypes, newUserType.trim()]
      });
      setNewUserType('');
    }
  };
  
  const handleRemoveUserType = (index: number) => {
    updateFormData({
      userTypes: formData.userTypes.filter((_, i) => i !== index)
    });
  };
  
  const handleAddFunctionalRequirement = () => {
    if (newFunctionalRequirement.trim()) {
      updateFormData({
        functionalRequirements: [...formData.functionalRequirements, newFunctionalRequirement.trim()]
      });
      setNewFunctionalRequirement('');
    }
  };
  
  const handleRemoveFunctionalRequirement = (index: number) => {
    updateFormData({
      functionalRequirements: formData.functionalRequirements.filter((_, i) => i !== index)
    });
  };
  
  const handleNonFunctionalRequirementToggle = (requirement: string) => {
    if (formData.nonFunctionalRequirements.includes(requirement)) {
      updateFormData({
        nonFunctionalRequirements: formData.nonFunctionalRequirements.filter(r => r !== requirement)
      });
    } else {
      updateFormData({
        nonFunctionalRequirements: [...formData.nonFunctionalRequirements, requirement]
      });
    }
  };
  
  const handleSelectAllNonFunctional = () => {
    if (formData.nonFunctionalRequirements.length === commonNonFunctionalRequirements.length) {
      // Deselect all
      updateFormData({ nonFunctionalRequirements: [] });
    } else {
      // Select all
      updateFormData({ nonFunctionalRequirements: [...commonNonFunctionalRequirements] });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('promptGenerator.requirements.title')}</CardTitle>
          <CardDescription>
            {t('promptGenerator.requirements.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.defineRequirements}
              onCheckedChange={(checked) => updateFormData({ defineRequirements: checked })}
              id="define-requirements-toggle"
            />
            <Label htmlFor="define-requirements-toggle" className="text-base font-medium">
              {t('promptGenerator.requirements.defineRequirements')}
            </Label>
          </div>

          {formData.defineRequirements && (
            <>
              {/* User Types Section */}
              <div className="space-y-2 pt-4">
                <Label className="text-base font-medium">
                  {t('promptGenerator.requirements.userTypes')}
                </Label>
                <p className="text-sm text-gray-500">
                  {t('promptGenerator.requirements.userTypesHelp')}
                </p>
                
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input 
                      value={newUserType}
                      onChange={(e) => setNewUserType(e.target.value)}
                      placeholder={t('promptGenerator.requirements.userTypePlaceholder')}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddUserType()}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddUserType}
                      className="whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t('promptGenerator.common.add')}
                    </Button>
                  </div>
                  
                  {formData.userTypes.length > 0 ? (
                    <div className="space-y-2">
                      {formData.userTypes.map((userType, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <span>{userType}</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveUserType(index)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-400 mt-2">
                      {t('promptGenerator.requirements.noUserTypes')}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Functional Requirements Section */}
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-base font-medium">
                  {t('promptGenerator.requirements.functionalRequirements')}
                </Label>
                <p className="text-sm text-gray-500">
                  {t('promptGenerator.requirements.functionalRequirementsHelp')}
                </p>
                
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input 
                      value={newFunctionalRequirement}
                      onChange={(e) => setNewFunctionalRequirement(e.target.value)}
                      placeholder={t('promptGenerator.requirements.functionalRequirementPlaceholder')}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddFunctionalRequirement()}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddFunctionalRequirement}
                      className="whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t('promptGenerator.common.add')}
                    </Button>
                  </div>
                  
                  {formData.functionalRequirements.length > 0 ? (
                    <div className="space-y-2">
                      {formData.functionalRequirements.map((requirement, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <span>{requirement}</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveFunctionalRequirement(index)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-400 mt-2">
                      {t('promptGenerator.requirements.noFunctionalRequirements')}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Non-Functional Requirements Section */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    {t('promptGenerator.requirements.nonFunctionalRequirements')}
                  </Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleSelectAllNonFunctional}
                  >
                    {formData.nonFunctionalRequirements.length === commonNonFunctionalRequirements.length ? 
                      t('promptGenerator.common.unselectAll') : 
                      t('promptGenerator.common.selectAll')}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {t('promptGenerator.requirements.nonFunctionalRequirementsHelp')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commonNonFunctionalRequirements.map((requirement) => (
                    <div key={requirement} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`nfr-${requirement}`}
                        checked={formData.nonFunctionalRequirements.includes(requirement)}
                        onCheckedChange={() => handleNonFunctionalRequirementToggle(requirement)}
                      />
                      <Label 
                        htmlFor={`nfr-${requirement}`}
                        className="cursor-pointer text-gray-700"
                      >
                        {requirement}
                      </Label>
                    </div>
                  ))}
                  
                  <OtherSpecifyItem
                    id="nfr-other"
                    label={t('promptGenerator.requirements.otherRequirement')}
                    checked={formData.nonFunctionalRequirements.includes('Other')}
                    value={formData.otherRequirement}
                    placeholder={t('promptGenerator.requirements.otherRequirementPlaceholder')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData({
                          nonFunctionalRequirements: [...formData.nonFunctionalRequirements, 'Other']
                        });
                      } else {
                        updateFormData({
                          nonFunctionalRequirements: formData.nonFunctionalRequirements.filter(r => r !== 'Other'),
                          otherRequirement: ''
                        });
                      }
                    }}
                    onValueChange={(value) => updateFormData({ otherRequirement: value })}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementsStep;
