
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

interface ReviewAndGenerateStepProps {
  formData: any;
  handleSaveProgress: () => void;
}

const ReviewAndGenerateStep: React.FC<ReviewAndGenerateStepProps> = ({
  formData,
  handleSaveProgress
}) => {
  const { language } = useLanguage();

  const handleGenerate = async () => {
    await handleSaveProgress();
    
    // Here you would implement your logic to generate the final prompt
    console.log('Generating prompt with data:', formData);
  };

  // Helper function to render form data section
  const renderSection = (title: string, data: any, fields: string[]) => {
    return (
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">{title}</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {fields.map(field => {
            if (Array.isArray(data[field])) {
              return (
                <div key={field} className="mb-2">
                  <span className="font-medium">{field}: </span>
                  {data[field].join(', ')}
                </div>
              );
            }
            
            if (data[field]) {
              return (
                <div key={field} className="mb-2">
                  <span className="font-medium">{field}: </span>
                  {data[field]}
                </div>
              );
            }
            
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="wizard-step review-generate-step">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'pt' ? 'Revisão e Geração' : 
         language === 'es' ? 'Revisión y Generación' : 'Review and Generate'}
      </h2>
      
      <div className="bg-blue-50 p-4 rounded-lg text-blue-800 mb-8">
        <p>
          {language === 'pt' ? 'Revise as informações do seu projeto antes de gerar o prompt.' : 
           language === 'es' ? 'Revise la información de su proyecto antes de generar el prompt.' : 
           'Review your project information before generating the prompt.'}
        </p>
      </div>
      
      <div className="space-y-8">
        {formData.projectName && renderSection(
          language === 'pt' ? 'Detalhes do Projeto' : 
          language === 'es' ? 'Detalles del Proyecto' : 'Project Details',
          formData,
          ['projectName', 'projectDescription', 'targetAudience']
        )}
        
        {formData.visualStyle && renderSection(
          language === 'pt' ? 'Design UX/UI' : 
          language === 'es' ? 'Diseño UX/UI' : 'UX/UI Design',
          formData,
          ['visualStyle', 'menuType', 'primaryColor', 'secondaryColor', 'accentColor']
        )}
        
        {/* More sections would be rendered here based on formData */}
      </div>
      
      <div className="mt-10 flex justify-center">
        <Button 
          onClick={handleGenerate}
          className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          {language === 'pt' ? 'Gerar Prompt' : 
           language === 'es' ? 'Generar Prompt' : 'Generate Prompt'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewAndGenerateStep;
