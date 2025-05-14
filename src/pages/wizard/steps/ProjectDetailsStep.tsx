
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RotateCcw, Save, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectDetailsFormData {
  projectName?: string;
  projectDescription?: string;
  projectGoals?: string[];
  projectScope?: string;
}

interface ProjectDetailsStepProps {
  formData: ProjectDetailsFormData;
  updateFormData: (data: Partial<ProjectDetailsFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
  onNext: () => void;
  onPrev: () => void;
  handleSaveProgress: () => void;
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  formData,
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized,
  onNext,
  onPrev,
  handleSaveProgress
}) => {
  const { t } = useLanguage();
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFormData({ projectName: value });
    setNameError(value.trim() === '');
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    updateFormData({ projectDescription: value });
    setDescriptionError(value.trim() === '');
  };
  
  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };
  
  const validateForm = () => {
    const nameValid = !!formData.projectName?.trim();
    const descriptionValid = !!formData.projectDescription?.trim();
    
    setNameError(!nameValid);
    setDescriptionError(!descriptionValid);
    
    return nameValid && descriptionValid;
  };
  
  const handleFinalize = () => {
    if (validateForm()) {
      markAsFinalized();
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t('promptGenerator.projectDetails.title') || "Detalhes do Projeto"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.projectDetails.description') || "Forneça informações básicas sobre seu projeto"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={resetStep} size="icon" className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">{t('common.reset') || "Resetar"}</span>
              </Button>
              <Button 
                onClick={handleFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
              </Button>
              {isFinalized && <CheckCircle className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName" className={`text-sm font-medium ${nameError ? 'text-destructive' : ''}`}>
              {t('promptGenerator.projectDetails.projectName') || "Nome do Projeto"} *
            </Label>
            <Input
              id="projectName"
              value={formData.projectName || ''}
              onChange={handleNameChange}
              className={nameError ? 'border-destructive' : ''}
            />
            {nameError && (
              <p className="text-xs text-destructive">
                {t('promptGenerator.projectDetails.projectNameRequired') || "O nome do projeto é obrigatório"}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectDescription" className={`text-sm font-medium ${descriptionError ? 'text-destructive' : ''}`}>
              {t('promptGenerator.projectDetails.projectDescription') || "Descrição do Projeto"} *
            </Label>
            <Textarea
              id="projectDescription"
              value={formData.projectDescription || ''}
              onChange={handleDescriptionChange}
              rows={4}
              className={descriptionError ? 'border-destructive' : ''}
            />
            {descriptionError && (
              <p className="text-xs text-destructive">
                {t('promptGenerator.projectDetails.projectDescriptionRequired') || "A descrição do projeto é obrigatória"}
              </p>
            )}
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onPrev}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('common.previous') || "Anterior"}
            </Button>
            
            <Button
              type="button"
              onClick={handleNext}
            >
              {t('common.next') || "Próximo"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailsStep;
