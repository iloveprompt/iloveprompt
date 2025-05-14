
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/i18n/LanguageContext';

interface ProjectDetailsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
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
  const { language } = useLanguage();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      projectName: formData.projectName || '',
      projectDescription: formData.projectDescription || '',
      targetAudience: formData.targetAudience || '',
    }
  });

  const onSubmit = (data: any) => {
    updateFormData(data);
    handleSaveProgress();
    onNext();
  };

  return (
    <div className="wizard-step project-details-step">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'pt' ? 'Detalhes do Projeto' : 
         language === 'es' ? 'Detalles del Proyecto' : 'Project Details'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="projectName">
              {language === 'pt' ? 'Nome do Projeto' : 
               language === 'es' ? 'Nombre del Proyecto' : 'Project Name'}
            </Label>
            <Input 
              id="projectName"
              {...register('projectName')}
              placeholder={language === 'pt' ? 'Ex: Meu Sistema de Gestão' : 
                          language === 'es' ? 'Ej: Mi Sistema de Gestión' : 
                          'Ex: My Management System'}
            />
          </div>
          
          <div>
            <Label htmlFor="projectDescription">
              {language === 'pt' ? 'Descrição do Projeto' : 
               language === 'es' ? 'Descripción del Proyecto' : 'Project Description'}
            </Label>
            <Textarea 
              id="projectDescription"
              {...register('projectDescription')}
              rows={5}
              placeholder={language === 'pt' ? 'Descreva seu projeto em detalhes...' : 
                          language === 'es' ? 'Describa su proyecto en detalle...' : 
                          'Describe your project in detail...'}
            />
          </div>
          
          <div>
            <Label htmlFor="targetAudience">
              {language === 'pt' ? 'Público-Alvo' : 
               language === 'es' ? 'Público Objetivo' : 'Target Audience'}
            </Label>
            <Input 
              id="targetAudience"
              {...register('targetAudience')}
              placeholder={language === 'pt' ? 'Ex: Pequenas empresas, profissionais de marketing' : 
                          language === 'es' ? 'Ej: Pequeñas empresas, profesionales de marketing' : 
                          'Ex: Small businesses, marketing professionals'}
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
          >
            {language === 'pt' ? 'Anterior' : 
             language === 'es' ? 'Anterior' : 'Previous'}
          </Button>
          
          <div className="space-x-2">
            {!isFinalized && (
              <Button
                type="button"
                variant="default"
                onClick={markAsFinalized}
                className="bg-green-600 hover:bg-green-700"
              >
                {language === 'pt' ? 'Finalizar' : 
                  language === 'es' ? 'Finalizar' : 'Finalize'}
              </Button>
            )}
            
            {isFinalized && (
              <Button
                type="button"
                variant="default"
                onClick={resetStep}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {language === 'pt' ? 'Resetar' : 
                  language === 'es' ? 'Reiniciar' : 'Reset'}
              </Button>
            )}
            
            <Button type="submit">
              {language === 'pt' ? 'Próximo' : 
               language === 'es' ? 'Siguiente' : 'Next'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectDetailsStep;
