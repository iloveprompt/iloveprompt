
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

interface IntegrationsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  handleSaveProgress?: () => void;
}

const IntegrationsStep: React.FC<IntegrationsStepProps> = ({
  formData,
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized,
  onNext = () => {},
  onPrev = () => {},
  handleSaveProgress = () => {}
}) => {
  const { language } = useLanguage();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      integrations: formData.integrations || []
    }
  });

  const onSubmit = (data: any) => {
    updateFormData(data);
    if (handleSaveProgress) handleSaveProgress();
    if (onNext) onNext();
  };

  return (
    <div className="wizard-step integrations-step">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'pt' ? 'Integrações' : 
         language === 'es' ? 'Integraciones' : 'Integrations'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
          <p>
            {language === 'pt' ? 'Selecione as integrações que deseja para o seu projeto.' : 
             language === 'es' ? 'Seleccione las integraciones que desea para su proyecto.' : 
             'Select the integrations you want for your project.'}
          </p>
        </div>
        
        {/* Integration options would go here */}
        
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

export default IntegrationsStep;
