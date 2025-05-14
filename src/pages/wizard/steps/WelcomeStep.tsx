
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

interface WelcomeStepProps {
  next?: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ next }) => {
  const { language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">
        {language === 'pt' ? 'Bem-vindo ao Gerador de Prompts' : 
         language === 'es' ? 'Bienvenido al Generador de Prompts' : 'Welcome to Prompt Generator'}
      </h1>
      
      <p className="text-lg mb-8">
        {language === 'pt' ? 
          'Vamos ajudá-lo a criar um prompt perfeito para o seu projeto.' : 
         language === 'es' ? 
          'Te ayudaremos a crear un prompt perfecto para tu proyecto.' : 
          'We\'ll help you create the perfect prompt for your project.'}
      </p>
      
      <Button 
        onClick={next}
        className="px-6 py-3 text-lg"
      >
        {language === 'pt' ? 'Vamos começar!' : 
         language === 'es' ? '¡Comencemos!' : 'Let\'s get started!'}
      </Button>
    </div>
  );
};

export default WelcomeStep;
