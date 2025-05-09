
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import ProjectStep from './steps/ProjectStep';
import ObjectiveStep from './steps/ObjectiveStep';
import RequirementsStep from './steps/RequirementsStep';
import StackStep from './steps/StackStep';
import IntegrationsStep from './steps/IntegrationsStep';
import SecurityStep from './steps/SecurityStep';
import GenerateStep from './steps/GenerateStep';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Define wizard steps with dynamic title based on language
const getWizardSteps = (t: (key: string) => string) => [
  { id: 'project', title: t('promptGenerator.project.title') },
  { id: 'objective', title: t('promptGenerator.objective.title') },
  { id: 'requirements', title: t('promptGenerator.requirements.title') },
  { id: 'stack', title: t('promptGenerator.stack.title') },
  { id: 'integrations', title: t('promptGenerator.integrations.title') },
  { id: 'security', title: t('promptGenerator.security.title') },
  { id: 'generate', title: t('promptGenerator.generate.title') }
];

const PromptGeneratorWizard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Get translated wizard steps
  const wizardSteps = getWizardSteps(t);
  
  // Form data state
  const [formData, setFormData] = useState({
    project: {
      title: '',
      author: user?.email || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0'
    },
    objective: {
      primaryObjective: '',
      selectedObjectives: []
    },
    requirements: {
      userTypes: [],
      functionalRequirements: [],
      nonFunctionalRequirements: []
    },
    stack: {
      frontend: [],
      backend: [],
      database: [],
      hosting: []
    },
    integrations: {
      selectedIntegrations: []
    },
    security: {
      selectedSecurity: []
    }
  });
  
  // Update form data
  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step as keyof typeof prev],
        ...data
      }
    }));
  };
  
  // Handle navigation between steps
  const nextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < wizardSteps.length) {
      setCurrentStep(stepIndex);
      window.scrollTo(0, 0);
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / wizardSteps.length) * 100;
  
  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: // Project
        return <ProjectStep 
          formData={formData.project} 
          updateFormData={(data) => updateFormData('project', data)} 
        />;
      case 1: // Objective
        return <ObjectiveStep 
          formData={formData.objective} 
          updateFormData={(data) => updateFormData('objective', data)} 
        />;
      case 2: // Requirements
        return <RequirementsStep 
          formData={formData.requirements} 
          updateFormData={(data) => updateFormData('requirements', data)} 
        />;
      case 3: // Stack
        return <StackStep 
          formData={formData.stack} 
          updateFormData={(data) => updateFormData('stack', data)} 
        />;
      case 4: // Integrations
        return <IntegrationsStep 
          formData={formData.integrations} 
          updateFormData={(data) => updateFormData('integrations', data)} 
        />;
      case 5: // Security
        return <SecurityStep 
          formData={formData.security} 
          updateFormData={(data) => updateFormData('security', data)} 
        />;
      case 6: // Generate
        return <GenerateStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 mb-8">
        <div className="flex flex-col space-y-4">
          {/* Wizard Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">{t('promptGenerator.title')}</h2>
              <span className="text-sm font-medium">{currentStep + 1} / {wizardSteps.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {/* Wizard Steps */}
          <div className="flex flex-wrap gap-2 mb-6">
            {wizardSteps.map((step, index) => (
              <Button
                key={step.id}
                variant={currentStep === index ? "default" : "outline"}
                className={`flex-grow flex-shrink-0 ${currentStep === index ? '' : 'text-gray-500'}`}
                onClick={() => goToStep(index)}
              >
                <span className="mr-2 w-6 h-6 flex items-center justify-center rounded-full border border-current">
                  {index + 1}
                </span>
                {step.title}
              </Button>
            ))}
          </div>
          
          {/* Current Step Content */}
          <div className="py-4">
            {renderCurrentStep()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 mt-4 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              {t('common.back')}
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={currentStep === wizardSteps.length - 1}
            >
              {currentStep === wizardSteps.length - 2 ? t('promptGenerator.generate') : t('common.next')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PromptGeneratorWizard;
