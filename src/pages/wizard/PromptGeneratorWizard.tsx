
import React, { useState, useCallback } from 'react';
import { Steps } from "react-step-builder";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/i18n/LanguageContext';
import WelcomeStep from './steps/WelcomeStep';
import ProjectDetailsStep from './steps/ProjectDetailsStep';
import FeatureSelectionStep from './steps/FeatureSelectionStep';
import UXUIStep from './steps/UXUIStep';
import IntegrationsStep from './steps/IntegrationsStep';
import ReviewAndGenerateStep from './steps/ReviewAndGenerateStep';

interface FinalizedSteps {
  ProjectDetails?: boolean;
  FeatureSelection?: boolean;
  UXUI?: boolean;
  Integrations?: boolean;
}

const PromptGeneratorWizard: React.FC = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<any>({});
  const [finalized, setFinalized] = useState<FinalizedSteps>({});
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const markAsFinalized = (stepName: keyof FinalizedSteps) => {
    setFinalized(prev => ({ ...prev, [stepName]: true }));
  };

  const resetStep = (stepName: keyof FinalizedSteps) => {
    setFinalized(prev => ({ ...prev, [stepName]: false }));
  };

  const handleSaveProgress = useCallback(async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('wizardFormData', JSON.stringify(formData));
      localStorage.setItem('wizardFinalizedSteps', JSON.stringify(finalized));
      toast({
        title: language === 'pt' ? "Progresso Salvo!" : language === 'es' ? "¡Progreso Guardado!" : "Progress Saved!",
        description: language === 'pt' ? "Seu progresso foi salvo com sucesso." : language === 'es' ? "Su progreso se ha guardado con éxito." : "Your progress has been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === 'pt' ? "Erro ao Salvar!" : language === 'es' ? "¡Error al Guardar!" : "Error Saving!",
        description: language === 'pt' ? "Houve um problema ao salvar seu progresso." : language === 'es' ? "Hubo un problema al guardar su progreso." : "There was a problem saving your progress.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [formData, finalized, language]);

  const handleNextStep = () => {
    window.scrollTo(0, 0);
    handleSaveProgress();
  };

  const handlePreviousStep = () => {
    window.scrollTo(0, 0);
    handleSaveProgress();
  };

  React.useEffect(() => {
    const storedFormData = localStorage.getItem('wizardFormData');
    const storedFinalizedSteps = localStorage.getItem('wizardFinalizedSteps');

    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }

    if (storedFinalizedSteps) {
      setFinalized(JSON.parse(storedFinalizedSteps));
    }
  }, []);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const config = {
    navigation: {
      component: ({ position, navigation }) => {
        return (
          <div className="hidden">
            {position.index > 0 && (
              <button onClick={navigation.previous}>Back</button>
            )}
            {position.index < position.totalSteps - 1 && (
              <button onClick={navigation.next}>Next</button>
            )}
          </div>
        );
      }
    },
    onStepChange: handleStepChange
  };

  const UXUIStepComponent = () => {
    return (
      <UXUIStep
        formData={formData}
        updateFormData={updateFormData}
        setFormData={setFormData}
        markAsFinalized={() => markAsFinalized("UXUI")}
        resetStep={() => resetStep("UXUI")}
        isFinalized={finalized.UXUI}
        onNext={handleNextStep}
        onPrev={handlePreviousStep}
        handleSaveProgress={handleSaveProgress}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {isSaving && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-100 opacity-50 z-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        <Steps {...config}>
          <WelcomeStep />
          <ProjectDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            markAsFinalized={() => markAsFinalized("ProjectDetails")}
            resetStep={() => resetStep("ProjectDetails")}
            isFinalized={finalized.ProjectDetails}
            onNext={handleNextStep}
            onPrev={handlePreviousStep}
            handleSaveProgress={handleSaveProgress}
          />
          <FeatureSelectionStep
            formData={formData}
            updateFormData={updateFormData}
            markAsFinalized={() => markAsFinalized("FeatureSelection")}
            resetStep={() => resetStep("FeatureSelection")}
            isFinalized={finalized.FeatureSelection}
            onNext={handleNextStep}
            onPrev={handlePreviousStep}
            handleSaveProgress={handleSaveProgress}
          />
          <UXUIStepComponent />
          <IntegrationsStep
            formData={formData}
            updateFormData={updateFormData}
            markAsFinalized={() => markAsFinalized("Integrations")}
            resetStep={() => resetStep("Integrations")}
            isFinalized={finalized.Integrations}
            onNext={handleNextStep}
            onPrev={handlePreviousStep}
            handleSaveProgress={handleSaveProgress}
          />
          <ReviewAndGenerateStep
            formData={formData}
            handleSaveProgress={handleSaveProgress}
          />
        </Steps>
      </div>
    </div>
  );
};

export default PromptGeneratorWizard;
