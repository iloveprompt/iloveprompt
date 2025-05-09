import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Info, 
  Target, 
  List, 
  Grid2X2,
  LayoutGrid,
  Palette, 
  Server, 
  Shield, 
  FileText, 
  TrendingUp, 
  Ban, 
  Pencil,
} from 'lucide-react';

// Components
import ProjectStep from './steps/ProjectStep';
import ObjectiveStep from './steps/ObjectiveStep';
import RequirementsStep from './steps/RequirementsStep';
import SystemTypeStep from './steps/SystemTypeStep';
import FeaturesStep from './steps/FeaturesStep';
import UXUIStep from './steps/UXUIStep';
import StackStep from './steps/StackStep';
import SecurityStep from './steps/SecurityStep';
import CodeStructureStep from './steps/CodeStructureStep';
import ScalabilityStep from './steps/ScalabilityStep';
import RestrictionsStep from './steps/RestrictionsStep';
import GenerateStep from './steps/GenerateStep';

// Define wizard steps with dynamic title based on language and icons
const getWizardSteps = (t: (key: string) => string) => [
  { 
    id: 'project', 
    title: t('promptGenerator.project.title'),
    icon: Info,
    color: '#9b87f5' // Primary Purple
  },
  { 
    id: 'systemType', 
    title: t('promptGenerator.systemType.title'),
    icon: Grid2X2,
    color: '#8B5CF6' // Vivid Purple
  },
  { 
    id: 'objective', 
    title: t('promptGenerator.objective.title'),
    icon: Target,
    color: '#7E69AB' // Secondary Purple
  },
  { 
    id: 'requirements', 
    title: t('promptGenerator.requirements.title'),
    icon: List,
    color: '#6E59A5' // Tertiary Purple
  },
  { 
    id: 'features', 
    title: t('promptGenerator.features.title'),
    icon: LayoutGrid,
    color: '#D946EF' // Magenta Pink
  },
  { 
    id: 'uxui', 
    title: t('promptGenerator.uxui.title'),
    icon: Palette,
    color: '#F97316' // Bright Orange
  },
  { 
    id: 'stack', 
    title: t('promptGenerator.stack.title'),
    icon: Server,
    color: '#0EA5E9' // Ocean Blue
  },
  { 
    id: 'security', 
    title: t('promptGenerator.security.title'),
    icon: Shield,
    color: '#28A745' // Green
  },
  { 
    id: 'codeStructure', 
    title: t('promptGenerator.codeStructure.title'),
    icon: FileText,
    color: '#1EAEDB' // Bright Blue
  },
  { 
    id: 'scalability', 
    title: t('promptGenerator.scalability.title'),
    icon: TrendingUp,
    color: '#33C3F0' // Sky Blue
  },
  { 
    id: 'restrictions', 
    title: t('promptGenerator.restrictions.title'),
    icon: Ban,
    color: '#DC3545' // Red
  },
  { 
    id: 'generate', 
    title: t('promptGenerator.generate.title'),
    icon: Pencil,
    color: '#FD7E14' // Orange
  }
];

const PromptGeneratorWizard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Reorder the steps to make System Type the second item
  const getWizardSteps = (t: (key: string) => string) => [
    { 
      id: 'project', 
      title: t('promptGenerator.project.title'),
      icon: Info,
      color: '#9b87f5' // Primary Purple
    },
    { 
      id: 'systemType', 
      title: t('promptGenerator.systemType.title'),
      icon: Grid2X2,
      color: '#8B5CF6' // Vivid Purple
    },
    { 
      id: 'objective', 
      title: t('promptGenerator.objective.title'),
      icon: Target,
      color: '#7E69AB' // Secondary Purple
    },
    { 
      id: 'requirements', 
      title: t('promptGenerator.requirements.title'),
      icon: List,
      color: '#6E59A5' // Tertiary Purple
    },
    { 
      id: 'features', 
      title: t('promptGenerator.features.title'),
      icon: LayoutGrid,
      color: '#D946EF' // Magenta Pink
    },
    { 
      id: 'uxui', 
      title: t('promptGenerator.uxui.title'),
      icon: Palette,
      color: '#F97316' // Bright Orange
    },
    { 
      id: 'stack', 
      title: t('promptGenerator.stack.title'),
      icon: Server,
      color: '#0EA5E9' // Ocean Blue
    },
    { 
      id: 'security', 
      title: t('promptGenerator.security.title'),
      icon: Shield,
      color: '#28A745' // Green
    },
    { 
      id: 'codeStructure', 
      title: t('promptGenerator.codeStructure.title'),
      icon: FileText,
      color: '#1EAEDB' // Bright Blue
    },
    { 
      id: 'scalability', 
      title: t('promptGenerator.scalability.title'),
      icon: TrendingUp,
      color: '#33C3F0' // Sky Blue
    },
    { 
      id: 'restrictions', 
      title: t('promptGenerator.restrictions.title'),
      icon: Ban,
      color: '#DC3545' // Red
    },
    { 
      id: 'generate', 
      title: t('promptGenerator.generate.title'),
      icon: Pencil,
      color: '#FD7E14' // Orange
    }
  ];
  
  // Get translated wizard steps
  const wizardSteps = getWizardSteps(t);
  
  // Form data state
  const [formData, setFormData] = useState({
    project: {
      title: '',
      author: user?.user_metadata?.name || '',
      email: user?.email || '',
      url: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0'
    },
    objective: {
      defineObjectives: false,
      primaryObjective: '',
      selectedObjectives: [],
      otherObjective: ''
    },
    requirements: {
      defineRequirements: false,
      userTypes: [],
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      otherRequirement: ''
    },
    systemType: {
      selected: '',
      otherType: '',
      examples: []
    },
    features: {
      specificFeatures: [],
      otherFeature: '',
      dynamicFeatures: []
    },
    uxui: {
      colorPalette: [],
      customColors: {},
      visualStyle: '',
      otherVisualStyle: '',
      menuType: '',
      otherMenuType: '',
      landingPage: false,
      landingPageDetails: {
        structure: {
          hero: true,
          benefits: true,
          testimonials: true,
          cta: true,
          other: false,
          otherValue: ''
        },
        elements: {
          video: true,
          form: true,
          animations: true,
          other: false,
          otherValue: ''
        },
        style: {
          modern: true,
          minimalist: true,
          corporate: true,
          creative: true,
          other: false,
          otherValue: ''
        }
      },
      authentication: [],
      otherAuthMethod: '',
      userDashboard: false,
      userDashboardDetails: {
        features: [],
        otherFeature: ''
      }
    },
    stack: {
      separateFrontendBackend: true,
      frontend: [],
      backend: [],
      database: [],
      hosting: [],
      fullstack: [],
      orm: []
    },
    security: {
      selectedSecurity: [],
      otherSecurityFeature: ''
    },
    codeStructure: {
      folderOrganization: [],
      otherOrganizationStyle: '',
      architecturalPattern: [],
      otherArchPattern: '',
      bestPractices: [],
      otherBestPractice: ''
    },
    scalability: {
      isScalable: false,
      scalabilityFeatures: [],
      otherScalabilityFeature: '',
      performanceFeatures: [],
      otherPerformanceFeature: ''
    },
    restrictions: {
      avoidInCode: [],
      otherRestriction: ''
    }
  });
  
  // Update form data
  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step as keyof typeof prev]: {
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
  
  // Render current step - update order to match the new wizardSteps array
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: // Project
        return <ProjectStep 
          formData={formData.project} 
          updateFormData={(data) => updateFormData('project', data)} 
        />;
      case 1: // System Type (reordered)
        return <SystemTypeStep 
          formData={formData.systemType} 
          updateFormData={(data) => updateFormData('systemType', data)} 
        />;
      case 2: // Objective
        return <ObjectiveStep 
          formData={formData.objective} 
          updateFormData={(data) => updateFormData('objective', data)} 
        />;
      case 3: // Requirements
        return <RequirementsStep 
          formData={formData.requirements} 
          updateFormData={(data) => updateFormData('requirements', data)} 
        />;
      case 4: // Features
        return <FeaturesStep 
          formData={formData.features} 
          systemType={formData.systemType.selected}
          updateFormData={(data) => updateFormData('features', data)} 
        />;
      case 5: // UX/UI
        return <UXUIStep 
          formData={formData.uxui} 
          updateFormData={(data) => updateFormData('uxui', data)} 
        />;
      case 6: // Stack
        return <StackStep 
          formData={formData.stack} 
          updateFormData={(data) => updateFormData('stack', data)} 
        />;
      case 7: // Security
        return <SecurityStep 
          formData={formData.security} 
          updateFormData={(data) => updateFormData('security', data)} 
        />;
      case 8: // Code Structure
        return <CodeStructureStep 
          formData={formData.codeStructure} 
          updateFormData={(data) => updateFormData('codeStructure', data)} 
        />;
      case 9: // Scalability
        return <ScalabilityStep 
          formData={formData.scalability} 
          updateFormData={(data) => updateFormData('scalability', data)} 
        />;
      case 10: // Restrictions
        return <RestrictionsStep 
          formData={formData.restrictions} 
          updateFormData={(data) => updateFormData('restrictions', data)} 
        />;
      case 11: // Generate
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
            {wizardSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === index;
              
              return (
                <Button
                  key={step.id}
                  variant={isActive ? "default" : "outline"}
                  className={`flex flex-col items-center py-3 px-2 h-auto ${isActive ? '' : 'text-gray-500'}`}
                  onClick={() => goToStep(index)}
                  style={{borderColor: isActive ? step.color : ''}}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2" 
                    style={{backgroundColor: isActive ? step.color : '#f1f1f1'}}
                  >
                    <StepIcon 
                      size={20} 
                      className={isActive ? 'text-white' : 'text-gray-500'} 
                    />
                  </div>
                  <span className="text-xs text-center">{step.title}</span>
                </Button>
              );
            })}
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
              style={{backgroundColor: wizardSteps[currentStep].color}}
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
