
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  next: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ next }) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold">
            {t('promptGenerator.welcome.title') || "Bem-vindo ao Gerador de Prompts"}
          </CardTitle>
          <CardDescription className="text-lg">
            {t('promptGenerator.welcome.subtitle') || "Crie prompts poderosos para seus projetos de desenvolvimento"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              {t('promptGenerator.welcome.description') || 
                "Este assistente o guiará através do processo de criação de um prompt detalhado para seu projeto. Cada passo foi projetado para capturar informações importantes que ajudarão a definir suas necessidades com precisão."}
            </p>
            
            <h3 className="text-lg font-medium">
              {t('promptGenerator.welcome.howToUse') || "Como usar:"}
            </h3>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>
                {t('promptGenerator.welcome.step1') || 
                  "Preencha cada seção com os detalhes do seu projeto"}
              </li>
              <li>
                {t('promptGenerator.welcome.step2') || 
                  "Você pode salvar seu progresso a qualquer momento"}
              </li>
              <li>
                {t('promptGenerator.welcome.step3') || 
                  "Revise todas as informações antes de gerar o prompt final"}
              </li>
            </ul>

            <div className="bg-muted p-4 rounded-lg mt-4">
              <h4 className="font-medium">
                {t('promptGenerator.welcome.tip') || "Dica:"}
              </h4>
              <p className="text-sm">
                {t('promptGenerator.welcome.tipText') || 
                  "Quanto mais detalhes você fornecer, melhor será o resultado final. Tome seu tempo em cada etapa e forneça informações claras e precisas."}
              </p>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={next} className="px-8">
              {t('promptGenerator.welcome.getStarted') || "Começar"} 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeStep;
