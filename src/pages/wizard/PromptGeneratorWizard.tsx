import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
  CheckCircle, // Used for finalized state in nav
  ChevronLeft,
  ChevronRight,
  RotateCcw, // For Reset button
  Save,      // For Save & Finalize button
  Network,   // Ícone para Integrações
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Keep for other popovers if any
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Add AlertDialog imports
import PromptPreview from '@/components/prompt/PromptPreview';

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
import IntegrationsStep from './steps/IntegrationsStep';

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
    id: 'integrations', 
    title: t('promptGenerator.integrations.title'),
    icon: Network,
    color: '#6f42c1' // Roxo para integrações
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
  // filledStepsData can still be used for auto-detection if needed, or removed if finalizedSteps covers all UI needs.
  // For now, let's keep it as it might be used for other logic, but the primary visual indicator will be finalizedSteps.
  const [filledStepsData, setFilledStepsData] = useState<Record<string, boolean>>({});
  const [finalizedSteps, setFinalizedSteps] = useState<Record<string, boolean>>({});
  // isGlobalResetConfirmOpen state is no longer needed for uncontrolled AlertDialog

  const initialFormData = {
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
      otherObjective: []
    },
    requirements: {
      defineRequirements: false,
      userTypes: [],
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      otherRequirement: []
    },
    systemType: {
      selected: '',
      otherType: '',
      examples: []
    },
    features: {
      specificFeatures: [],
      otherFeature: '',
      dynamicFeatures: [],
      otherSpecificFeatures: [] // Added this property to match the expected type
    },
    uxui: {
      colorPalette: [],
      customColors: [], // Changed from {} (empty object) to [] (empty array)
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
          otherValues: [] // Changed from otherValue: '' to otherValues: [] to match the expected type
        },
        elements: { 
          video: true, 
          form: true, 
          animations: true, 
          other: false, 
          otherValues: [] // Changed from otherValue: '' to otherValues: [] to match the expected type
        },
        style: { 
          modern: true, 
          minimalist: true, 
          corporate: true, 
          creative: true, 
          other: false, 
          otherValues: [] // Changed from otherValue: '' to otherValues: [] to match the expected type
        }
      },
      authentication: [],
      otherAuthMethod: '',
      otherVisualStyles: [], // Added these missing properties
      otherMenuTypes: [],
      otherAuthMethods: [],
      userDashboard: false,
      userDashboardDetails: { 
        features: [], 
        otherDashboardFeatures: [] // Changed from 'otherFeature: string' to 'otherDashboardFeatures: []' to match the expected type
      }
    },
    stack: {
      separateFrontendBackend: false,
      frontend: [],
      backend: [],
      database: [],
      hosting: [],
      fullstack: [],
      orm: [],
      otherFrontend: [], // Changed these from strings to string arrays
      otherBackend: [],
      otherDatabase: [],
      otherHosting: [],
      otherFullstack: [],
      otherOrm: []
    },
    security: {
      selectedSecurity: [],
      otherSecurityFeature: [] // Changed from string to string[]
    },
    codeStructure: {
      folderOrganization: [],
      otherOrganizationStyle: [], // Changed from string to string[]
      architecturalPattern: [],
      otherArchPattern: [], // Changed from string to string[]
      bestPractices: [],
      otherBestPractice: [] // Changed from string to string[]
    },
    scalability: {
      isScalable: false,
      scalabilityFeatures: [],
      otherScalabilityFeature: [], // Changed from string to string[]
      performanceFeatures: [],
      otherPerformanceFeature: [] // Changed from string to string[]
    },
    restrictions: {
      avoidInCode: [],
      otherRestriction: [] // Changed from string to string[]
    },
    integrations: {
      selectedIntegrations: [],
    },
  };

  // Initial wizard steps definition (ensure this is the single source of truth for steps)
  const wizardStepsDefinition = (t: (key: string) => string) => [
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
      id: 'integrations', 
      title: t('promptGenerator.integrations.title'),
      icon: Network,
      color: '#6f42c1' // Roxo para integrações
    },
    { 
      id: 'generate', 
      title: t('promptGenerator.generate.title'),
      icon: Pencil,
      color: '#FD7E14' // Orange
    }
  ];
  
  // Get translated wizard steps
  const wizardSteps = wizardStepsDefinition(t); // Use the single definition
  
  // Form data state
  const [formData, setFormData] = useState(initialFormData);

  const [generatedPrompt, setGeneratedPrompt] = useState('');

  useEffect(() => {
    const newFilledSteps: Record<string, boolean> = {};
    wizardSteps.forEach(step => {
      let isFilled = false;
      switch (step.id) {
        case 'project':
          isFilled = !!formData.project.title;
          break;
        case 'systemType':
          isFilled = !!formData.systemType.selected && (formData.systemType.selected !== 'other' || !!formData.systemType.otherType);
          break;
        case 'objective':
          isFilled = !!formData.objective.primaryObjective || formData.objective.selectedObjectives.length > 0;
          break;
        case 'requirements':
          isFilled = formData.requirements.userTypes.length > 0 || 
                     formData.requirements.functionalRequirements.length > 0 || 
                     formData.requirements.nonFunctionalRequirements.length > 0 ||
                     !!formData.requirements.otherRequirement;
          break;
        case 'features':
          isFilled = formData.features.specificFeatures.length > 0 || 
                     formData.features.dynamicFeatures.length > 0 || 
                     !!formData.features.otherFeature;
          break;
        case 'uxui':
          // Simplified: check if any primary selection is made or custom fields are filled
          isFilled = formData.uxui.colorPalette.length > 0 ||
                     Object.keys(formData.uxui.customColors).length > 0 ||
                     (!!formData.uxui.visualStyle && (formData.uxui.visualStyle !== 'other' || !!formData.uxui.otherVisualStyle)) ||
                     (!!formData.uxui.menuType && (formData.uxui.menuType !== 'other' || !!formData.uxui.otherMenuType)) ||
                     formData.uxui.authentication.length > 0 || !!formData.uxui.otherAuthMethod;
          break;
        case 'stack':
          isFilled = (formData.stack.separateFrontendBackend && (formData.stack.frontend.length > 0 || !!formData.stack.otherFrontend || formData.stack.backend.length > 0 || !!formData.stack.otherBackend)) ||
                     (!formData.stack.separateFrontendBackend && (formData.stack.fullstack.length > 0 || !!formData.stack.otherFullstack)) ||
                     formData.stack.database.length > 0 || !!formData.stack.otherDatabase ||
                     formData.stack.hosting.length > 0 || !!formData.stack.otherHosting ||
                     formData.stack.orm.length > 0 || !!formData.stack.otherOrm;
          break;
        case 'security':
          isFilled = formData.security.selectedSecurity.length > 0 || !!formData.security.otherSecurityFeature;
          break;
        case 'codeStructure':
          isFilled = formData.codeStructure.folderOrganization.length > 0 || !!formData.codeStructure.otherOrganizationStyle ||
                     formData.codeStructure.architecturalPattern.length > 0 || !!formData.codeStructure.otherArchPattern ||
                     formData.codeStructure.bestPractices.length > 0 || !!formData.codeStructure.otherBestPractice;
          break;
        case 'scalability':
          isFilled = !formData.scalability.isScalable || 
                     (formData.scalability.isScalable && 
                      (formData.scalability.scalabilityFeatures.length > 0 || !!formData.scalability.otherScalabilityFeature ||
                       formData.scalability.performanceFeatures.length > 0 || !!formData.scalability.otherPerformanceFeature));
          break;
        case 'restrictions':
          isFilled = formData.restrictions.avoidInCode.length > 0 || !!formData.restrictions.otherRestriction;
          break;
        case 'integrations':
          isFilled = formData.integrations.selectedIntegrations.length > 0;
          break;
        case 'generate':
          isFilled = true; // Final step, considered filled by reaching
          break;
        default:
          isFilled = false;
      }
      newFilledSteps[step.id] = isFilled;
    });

    if (JSON.stringify(newFilledSteps) !== JSON.stringify(filledStepsData)) {
      setFilledStepsData(newFilledSteps);
    }
  }, [formData, wizardSteps, filledStepsData]);
  
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
  
  const [previewMarkdown, setPreviewMarkdown] = useState('');

  const handleMarkAsFinalized = (stepId: string) => {
    setFinalizedSteps(prev => ({ ...prev, [stepId]: true }));
    // Optionally, move to next step or provide feedback
    // nextStep(); 
  };

  const handleResetStep = (stepId: string) => {
    setFinalizedSteps(prev => ({ ...prev, [stepId]: false }));
    // Reset form data for the specific step
    // Need to ensure initialFormData is correctly structured and accessible
    // And that stepId matches a key in initialFormData
    if (stepId in initialFormData) {
      setFormData(prev => ({
        ...prev,
        [stepId as keyof typeof initialFormData]: initialFormData[stepId as keyof typeof initialFormData]
      }));
    }
  };

  // Adicionar função para resetar tudo
  const executeGlobalReset = () => { // Renamed and logic separated from confirm
    setFormData(initialFormData);
    setFinalizedSteps({});
    setCurrentStep(0);
    // Optionally, add a toast message for successful reset if desired
    // toast({ title: "Wizard Resetado", description: "Todas as suas escolhas foram limpas." });
  };

  // Moved renderCurrentStep definition before its use in the return statement
  const renderCurrentStep = () => {
    const currentStepId = wizardSteps[currentStep]?.id;
    if (!currentStepId) return null;

    const stepProps = {
      updateFormData: (data: any) => updateFormData(currentStepId, data),
      markAsFinalized: () => handleMarkAsFinalized(currentStepId),
      resetStep: () => handleResetStep(currentStepId),
      isFinalized: finalizedSteps[currentStepId] || false,
      // It's important that each step component expects these props.
      // And that `formData` prop is correctly passed with the specific step's data.
    };

    switch (currentStep) {
      case 0: // Project
        return <ProjectStep 
          formData={formData.project} 
          {...stepProps}
        />;
      case 1: // System Type
        return <SystemTypeStep 
          formData={formData.systemType}
          updateFormData={updateFormData} // SystemTypeStep uses updateFormData differently
          markAsFinalized={() => handleMarkAsFinalized(wizardSteps[currentStep].id)}
          resetStep={() => handleResetStep(wizardSteps[currentStep].id)}
          isFinalized={finalizedSteps[wizardSteps[currentStep].id] || false}
        />;
      case 2: // Objective
        return <ObjectiveStep 
          formData={formData.objective} 
          {...stepProps}
        />;
      case 3: // Requirements
        return <RequirementsStep 
          formData={formData.requirements} 
          {...stepProps}
        />;
      case 4: // Features
        return <FeaturesStep 
          formData={formData.features} 
          systemType={formData.systemType.selected}
          {...stepProps}
        />;
      case 5: // UX/UI
        return <UXUIStep 
          formData={formData.uxui} 
          {...stepProps}
        />;
      case 6: // Stack
        return <StackStep 
          formData={formData.stack} 
          {...stepProps}
        />;
      case 7: // Security
        return <SecurityStep 
          formData={formData.security} 
          {...stepProps}
        />;
      case 8: // Code Structure
        return <CodeStructureStep 
          formData={formData.codeStructure} 
          {...stepProps}
        />;
      case 9: // Scalability
        return <ScalabilityStep 
          formData={formData.scalability} 
          {...stepProps}
        />;
      case 10: // Restrictions
        return <RestrictionsStep 
          formData={formData.restrictions} 
          {...stepProps}
        />;
      case 11: // Integrações
        return <IntegrationsStep 
          formData={formData.integrations} 
          {...stepProps}
        />;
      case 12: // Generate
        return (
          <Card className="p-4 sm:p-6">
            <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="mb-1">{t('promptGenerator.generate.title')}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {t('promptGenerator.generate.description')}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <RotateCcw className="h-4 w-4" />
                        <span className="sr-only">Resetar Tudo</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t('promptGenerator.wizard.confirmGlobalResetTitle') || "Confirmar Reset Global"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('promptGenerator.wizard.confirmGlobalResetMessage') || "Tem certeza que deseja apagar todas as escolhas? Esta ação irá remover todas as seleções feitas em todas as etapas."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel') || "Cancelar"}</AlertDialogCancel>
                        <AlertDialogAction onClick={executeGlobalReset}>
                          {t('common.yes') || "Sim"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 pt-4">
              <GenerateStep 
                formData={formData}
                markAsFinalized={() => handleMarkAsFinalized(wizardSteps[currentStep].id)}
                isFinalized={finalizedSteps[wizardSteps[currentStep].id] || false}
                onPromptGenerated={setGeneratedPrompt}
              />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  // Função utilitária para tradução segura
  const getLabelOrTranslation = (key: string, fallback: string) => {
    const translated = t(key);
    // Se a tradução não existe, retorna o fallback
    if (!translated || translated === key) return fallback;
    return translated;
  };

  const generatePreviewMarkdown = (data: typeof formData): string => {
    let md = "";

    // Project Info
    if (data.project.title || data.project.author || data.project.email || data.project.url) {
      md += `# ${getLabelOrTranslation('promptGenerator.project.title', 'Informações do Projeto')}\n`;
      if (data.project.title) md += `**${getLabelOrTranslation('promptGenerator.project.projectTitle', 'Título do Projeto')}:** ${data.project.title}\n`;
      if (data.project.author) md += `**${getLabelOrTranslation('promptGenerator.project.author', 'Autor')}:** ${data.project.author}\n`;
      if (data.project.email) md += `**${getLabelOrTranslation('promptGenerator.project.email', 'Email')}:** ${data.project.email}\n`;
      if (data.project.url) md += `**${getLabelOrTranslation('promptGenerator.project.url', 'Website')}:** ${data.project.url}\n`;
      if (data.project.version) md += `**${getLabelOrTranslation('promptGenerator.project.version', 'Versão')}:** ${data.project.version}\n`;
      md += "\n";
    }

    // System Type
    if (data.systemType.selected && (data.systemType.selected !== 'other' || data.systemType.otherType)) {
      md += `## ${getLabelOrTranslation('promptGenerator.systemType.title', 'Tipo de Sistema')}\n`;
      const systemTypeId = data.systemType.selected.toLowerCase().replace(/\s+/g, '');
      const selectedType = data.systemType.selected === 'other' 
        ? data.systemType.otherType 
        : getLabelOrTranslation(`promptGenerator.systemType.${systemTypeId}`, data.systemType.selected);
      md += `- ${selectedType}\n`;
      if (data.systemType.examples && data.systemType.examples.length > 0) {
        md += `  - ${getLabelOrTranslation('promptGenerator.systemType.examples', 'Exemplos')}: ${data.systemType.examples.join(', ')}\n`;
      }
      md += "\n";
    }

    // Objective
    if (data.objective.primaryObjective || data.objective.selectedObjectives.length > 0 || (Array.isArray(data.objective.otherObjective) && data.objective.otherObjective.length > 0) ) {
      md += `## ${getLabelOrTranslation('promptGenerator.objective.title', 'Objetivo')}\n`;
      if (data.objective.primaryObjective) {
        md += `**${getLabelOrTranslation('promptGenerator.objective.primaryObjective', 'Objetivo Principal')}:** ${data.objective.primaryObjective}\n\n`;
      }
      if (data.objective.selectedObjectives.length > 0) {
        md += `**${getLabelOrTranslation('promptGenerator.objective.additionalObjectivesTitle', 'Objetivos Adicionais')}:**\n`;
        data.objective.selectedObjectives.forEach((objKey: string) => {
          if (objKey !== 'Other') {
            const objectiveLabel = getLabelOrTranslation(`promptGenerator.objective.${objKey}`, objKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
            md += `- ${objectiveLabel}\n`;
          }
        });
        md += "\n";
      }
      if (Array.isArray(data.objective.otherObjective) && data.objective.otherObjective.length > 0) {
        md += `**${getLabelOrTranslation('promptGenerator.objective.specifiedOtherObjectivesTitle', 'Outros Objetivos Especificados:')}**\n`;
        data.objective.otherObjective.forEach(customObj => {
          if (customObj.trim()) md += `- ${customObj.trim()}\n`;
        });
        md += "\n";
      }
    }
    // Requirements
    if (data.requirements.userTypes.length > 0 || 
        data.requirements.functionalRequirements.length > 0 || 
        data.requirements.nonFunctionalRequirements.length > 0 || 
        (Array.isArray(data.requirements.otherRequirement) && data.requirements.otherRequirement.length > 0)) {
      md += `## ${getLabelOrTranslation('promptGenerator.requirements.title', 'Requisitos')}\n`;
      if (data.requirements.userTypes.length > 0) {
        md += `**${getLabelOrTranslation('promptGenerator.requirements.userTypes', 'Tipos de Usuários')}:** ${data.requirements.userTypes.join(', ')}\n\n`;
      }
      if (data.requirements.functionalRequirements.length > 0) {
        md += `**${getLabelOrTranslation('promptGenerator.requirements.functionalRequirements', 'Requisitos Funcionais')}:**\n`;
        data.requirements.functionalRequirements.forEach(r => {
          if (r.trim()) md += `- ${r.trim()}\n`;
        });
        md += "\n";
      }
      const hasSelectedNFRs = data.requirements.nonFunctionalRequirements.filter(r => r !== 'Other').length > 0;
      const hasOtherNFRs = Array.isArray(data.requirements.otherRequirement) && data.requirements.otherRequirement.length > 0;
      if (hasSelectedNFRs || hasOtherNFRs) {
        md += `**${getLabelOrTranslation('promptGenerator.requirements.nonFunctionalRequirements', 'Requisitos Não-Funcionais')}:**\n`;
        data.requirements.nonFunctionalRequirements.forEach(reqKey => {
          if (reqKey !== 'Other') {
            const reqLabel = getLabelOrTranslation(`promptGenerator.requirements.${reqKey}`, reqKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
            md += `- ${reqLabel}\n`;
          }
        });
        if (hasOtherNFRs) {
          data.requirements.otherRequirement.forEach(customReq => {
            if (customReq.trim()) md += `- ${customReq.trim()}\n`;
          });
        }
        md += "\n";
      }
    }
    // Features
    if (data.features.specificFeatures.length > 0 || data.features.dynamicFeatures.length > 0 || data.features.otherFeature) {
      md += `## ${getLabelOrTranslation('promptGenerator.features.title', 'Funcionalidades')}\n`;
      if (data.features.specificFeatures.length > 0) {
         md += `### ${getLabelOrTranslation('promptGenerator.features.specificFeatures', 'Funcionalidades Específicas')}\n${data.features.specificFeatures.map(f => `- ${getLabelOrTranslation(`promptGenerator.features.${f}`, f)}`).join('\n')}\n`;
      }
      if (data.features.dynamicFeatures.length > 0) {
        md += `### ${getLabelOrTranslation('promptGenerator.features.dynamicFeatures', 'Funcionalidades Dinâmicas')}\n${data.features.dynamicFeatures.map(f => `- ${getLabelOrTranslation(`promptGenerator.features.${f}`, f)}`).join('\n')}\n`;
      }
      if (data.features.otherFeature) md += `- ${getLabelOrTranslation('common.other', 'Outro')}: ${data.features.otherFeature}\n`;
      md += "\n";
    }
    // UX/UI
    let uxuiContent = "";
    // Paleta de Cores
    if (data.uxui.colorPalette.length > 0) {
      data.uxui.colorPalette.forEach(pal => {
        let palLabel = pal;
        const paletteTranslations: Record<string, string> = {
          techInnovation: 'Tecnologia/Inovação',
          creativityDesign: 'Criatividade/Design',
          healthWellness: 'Saúde/Bem-estar',
          foodGastronomy: 'Alimentos/Gastronomia',
          educationLearning: 'Educação/Aprendizado',
          corporateFinance: 'Corporativo/Finanças',
          legalConsulting: 'Jurídico/Consultoria',
          newsInformation: 'Notícias/Informação',
          portfolioPersonal: 'Portfólio/Pessoal',
          realEstate: 'Imobiliário',
          fashionLuxury: 'Moda/Luxo',
          artCulture: 'Arte/Cultura',
          minimalism: 'Minimalismo',
          natureSustainability: 'Natureza/Sustentabilidade',
          travelAdventure: 'Viagem/Aventura',
          kidsToys: 'Infantil/Brinquedos',
          musicEntertainment: 'Música/Entretenimento',
          sportsFitness: 'Esportes/Fitness',
          weddingEvents: 'Casamento/Eventos',
          communityNGO: 'Comunidade/ONG',
          custom: 'Paleta Personalizada',
        };
        if (pal === 'custom') palLabel = 'Paleta Personalizada';
        else palLabel = paletteTranslations[pal] || pal;
        uxuiContent += `- Tipo de Paleta: ${palLabel}.\n`;
        if (pal === 'custom' && Array.isArray(data.uxui.customColors) && data.uxui.customColors.length > 0) {
          uxuiContent += `- Cores da Paleta: ${JSON.stringify(data.uxui.customColors)}\n`;
        } else if (Array.isArray(data.uxui.customColors) && data.uxui.customColors.length > 0) {
          uxuiContent += `- Cores da Paleta: ${JSON.stringify(data.uxui.customColors)}\n`;
        }
      });
    }
    // Página Inicial (Landing Page)
    if (data.uxui.landingPage) {
      // Estrutura
      const struct = data.uxui.landingPageDetails.structure;
      const structItems = [];
      ['hero','benefits','testimonials','cta'].forEach(key => { if (struct[key]) structItems.push(getLabelOrTranslation(`promptGenerator.uxui.structureItems.${key}`, key)); });
      if (Array.isArray(struct.otherValues)) struct.otherValues.forEach(val => { if (val) structItems.push(val); });
      if (structItems.length > 0) uxuiContent += `- Estrutura: ${structItems.join(', ')}\n`;
      // Elementos
      const elem = data.uxui.landingPageDetails.elements;
      const elemItems = [];
      ['video','form','animations'].forEach(key => { if (elem[key]) elemItems.push(getLabelOrTranslation(`promptGenerator.uxui.elementsItems.${key}`, key)); });
      if (Array.isArray(elem.otherValues)) elem.otherValues.forEach(val => { if (val) elemItems.push(val); });
      if (elemItems.length > 0) uxuiContent += `- Elementos: ${elemItems.join(', ')}\n`;
      // Estilo
      const style = data.uxui.landingPageDetails.style;
      const styleItems = [];
      ['modern','minimalist','corporate','creative'].forEach(key => { if (style[key]) styleItems.push(getLabelOrTranslation(`promptGenerator.uxui.styleItems.${key}`, key)); });
      if (Array.isArray(style.otherValues)) style.otherValues.forEach(val => { if (val) styleItems.push(val); });
      if (styleItems.length > 0) uxuiContent += `- Estilo: ${styleItems.join(', ')}\n`;
    }
    // Painel do Usuário
    if (data.uxui.userDashboard) {
      const dash = data.uxui.userDashboardDetails;
      const dashItems = [];
      if (Array.isArray(dash.features)) dash.features.forEach(f => dashItems.push(getLabelOrTranslation(`promptGenerator.uxui.dashboardFeatures.${f}`, f)));
      if (Array.isArray(dash.otherDashboardFeatures)) dash.otherDashboardFeatures.forEach(f => { if (f) dashItems.push(f); });
      if (dashItems.length > 0) uxuiContent += `- Painel do Usuário: ${dashItems.join(', ')}\n`;
    }
    // Estilo Visual
    if (data.uxui.visualStyle && data.uxui.visualStyle !== 'other') {
      uxuiContent += `- Estilo Visual: ${getLabelOrTranslation(`promptGenerator.uxui.visualStyleItems.${data.uxui.visualStyle}`, data.uxui.visualStyle)}\n`;
    } else if (data.uxui.visualStyle === 'other' && Array.isArray(data.uxui.otherVisualStyles) && data.uxui.otherVisualStyles.length > 0) {
      uxuiContent += `- Estilo Visual: ${data.uxui.otherVisualStyles.join(', ')}\n`;
    }
    // Tipo de Menu
    if (data.uxui.menuType && data.uxui.menuType !== 'other') {
      uxuiContent += `- Tipo de Menu: ${getLabelOrTranslation(`promptGenerator.uxui.menuTypeItems.${data.uxui.menuType}`, data.uxui.menuType)}\n`;
    } else if (data.uxui.menuType === 'other' && Array.isArray(data.uxui.otherMenuTypes) && data.uxui.otherMenuTypes.length > 0) {
      uxuiContent += `- Tipo de Menu: ${data.uxui.otherMenuTypes.join(', ')}\n`;
    }
    // Autenticação
    const authItems = [];
    if (Array.isArray(data.uxui.authentication)) data.uxui.authentication.forEach(a => authItems.push(getLabelOrTranslation(`promptGenerator.uxui.authItems.${a}`, a)));
    if (Array.isArray(data.uxui.otherAuthMethods)) data.uxui.otherAuthMethods.forEach(a => { if (a) authItems.push(a); });
    if (authItems.length > 0) uxuiContent += `**${getLabelOrTranslation('promptGenerator.uxui.authentication', 'Autenticação')}:** ${authItems.join(', ')}\n`;
    if (uxuiContent) md += `## ${getLabelOrTranslation('promptGenerator.uxui.title', 'UX/UI')}\n${uxuiContent}\n`;
    // Stack
    let stackContent = "";
    if (data.stack.separateFrontendBackend) {
      if (data.stack.frontend.length > 0 || (Array.isArray(data.stack.otherFrontend) && data.stack.otherFrontend.length > 0)) stackContent += `**${getLabelOrTranslation('promptGenerator.stack.frontend', 'Frontend')}:** ${[...data.stack.frontend, ...(Array.isArray(data.stack.otherFrontend) ? data.stack.otherFrontend : [])].filter(Boolean).map(f => getLabelOrTranslation(`promptGenerator.stack.${f}`, f)).join(', ')}\n`;
      if (data.stack.backend.length > 0 || (Array.isArray(data.stack.otherBackend) && data.stack.otherBackend.length > 0)) stackContent += `**${getLabelOrTranslation('promptGenerator.stack.backend', 'Backend')}:** ${[...data.stack.backend, ...(Array.isArray(data.stack.otherBackend) ? data.stack.otherBackend : [])].filter(Boolean).map(f => getLabelOrTranslation(`promptGenerator.stack.${f}`, f)).join(', ')}\n`;
    } else {
      if (data.stack.fullstack.length > 0 || (Array.isArray(data.stack.otherFullstack) && data.stack.otherFullstack.length > 0)) stackContent += `**${getLabelOrTranslation('promptGenerator.stack.fullstack', 'Fullstack')}:** ${[...data.stack.fullstack, ...(Array.isArray(data.stack.otherFullstack) ? data.stack.otherFullstack : [])].filter(Boolean).map(f => getLabelOrTranslation(`promptGenerator.stack.${f}`, f)).join(', ')}\n`;
    }
    if (data.stack.database.length > 0 || (Array.isArray(data.stack.otherDatabase) && data.stack.otherDatabase.length > 0)) stackContent += `**${getLabelOrTranslation('promptGenerator.stack.database', 'Banco de Dados')}:** ${[...data.stack.database, ...(Array.isArray(data.stack.otherDatabase) ? data.stack.otherDatabase : [])].filter(Boolean).map(f => getLabelOrTranslation(`promptGenerator.stack.${f}`, f)).join(', ')}\n`;
    if (stackContent.replace(/\s/g, "") !== "") md += `## ${getLabelOrTranslation('promptGenerator.stack.title', 'Stack Tecnológica')}\n${stackContent}\n`;
    // Security
    let securityContent = "";
    if (data.security.selectedSecurity.length > 0) {
      data.security.selectedSecurity.forEach(s => {
        const securityId = s.toLowerCase().replace(/\s+/g, '');
        securityContent += `- ${getLabelOrTranslation(`promptGenerator.security.${securityId}`, s)}\n`;
      });
    }
    if (Array.isArray(data.security.otherSecurityFeature) && data.security.otherSecurityFeature.length > 0) {
      data.security.otherSecurityFeature.forEach(other => {
        if (other && other.trim()) securityContent += `- ${getLabelOrTranslation('common.other', 'Outro')}: ${other.trim()}\n`;
      });
    }
    if (securityContent.replace(/\s/g, "") !== "") md += `## ${getLabelOrTranslation('promptGenerator.security.title', 'Segurança')}\n${securityContent}\n`;
    // Code Structure
    let codeStructureContent = "";
    if (data.codeStructure.folderOrganization.length > 0) codeStructureContent += `**${getLabelOrTranslation('promptGenerator.codeStructure.folderOrganization', 'Organização de Pastas')}:** ${data.codeStructure.folderOrganization.map(f => getLabelOrTranslation(`promptGenerator.codeStructure.${f}`, f)).join(', ')}\n`;
    if (Array.isArray(data.codeStructure.otherOrganizationStyle) && data.codeStructure.otherOrganizationStyle.length > 0) {
      data.codeStructure.otherOrganizationStyle.forEach(other => {
        if (other && other.trim()) codeStructureContent += `  - ${getLabelOrTranslation('common.other', 'Outro')}: ${other.trim()}\n`;
      });
    }
    if (data.codeStructure.architecturalPattern.length > 0) codeStructureContent += `**${getLabelOrTranslation('promptGenerator.codeStructure.architecturalPattern', 'Padrão Arquitetural')}:** ${data.codeStructure.architecturalPattern.map(f => getLabelOrTranslation(`promptGenerator.codeStructure.${f}`, f)).join(', ')}\n`;
    if (Array.isArray(data.codeStructure.otherArchPattern) && data.codeStructure.otherArchPattern.length > 0) {
      data.codeStructure.otherArchPattern.forEach(other => {
        if (other && other.trim()) codeStructureContent += `  - ${getLabelOrTranslation('common.other', 'Outro')}: ${other.trim()}\n`;
      });
    }
    if (data.codeStructure.bestPractices.length > 0) codeStructureContent += `**${getLabelOrTranslation('promptGenerator.codeStructure.bestPractices', 'Melhores Práticas')}:** ${data.codeStructure.bestPractices.map(f => getLabelOrTranslation(`promptGenerator.codeStructure.${f}`, f)).join(', ')}\n`;
    if (Array.isArray(data.codeStructure.otherBestPractice) && data.codeStructure.otherBestPractice.length > 0) {
      data.codeStructure.otherBestPractice.forEach(other => {
        if (other && other.trim()) codeStructureContent += `  - ${getLabelOrTranslation('common.other', 'Outro')}: ${other.trim()}\n`;
      });
    }
    if (codeStructureContent.replace(/\s/g, "") !== "") md += `## ${getLabelOrTranslation('promptGenerator.codeStructure.title', 'Estrutura de Código')}\n${codeStructureContent}\n`;
    // Scalability
    let scalabilityContent = "";
    if (data.scalability.isScalable) {
      if (data.scalability.scalabilityFeatures.length > 0) scalabilityContent += `**${getLabelOrTranslation('promptGenerator.scalability.scalabilityFeatures', 'Recursos de Escalabilidade')}:** ${data.scalability.scalabilityFeatures.map(f => getLabelOrTranslation(`promptGenerator.scalability.${f}`, f)).join(', ')}\n`;
      if (Array.isArray(data.scalability.otherScalabilityFeature) && data.scalability.otherScalabilityFeature.length > 0) {
        data.scalability.otherScalabilityFeature.forEach(other => {
          if (other && other.trim()) scalabilityContent += `  - ${getLabelOrTranslation('common.other', 'Outro')}: ${other.trim()}\n`;
        });
      }
      if (data.scalability.performanceFeatures.length > 0) scalabilityContent += `**${getLabelOrTranslation('promptGenerator.scalability.performanceFeatures', 'Recursos de Performance')}:** ${data.scalability.performanceFeatures.map(f => getLabelOrTranslation(`promptGenerator.scalability.${f}`, f)).join(', ')}\n`;
      if (Array.isArray(data.scalability.otherPerformanceFeature) && data.scalability.otherPerformanceFeature.length > 0) {
        data.scalability.otherPerformanceFeature.forEach(other => {
          if (other && other.trim()) scalabilityContent += `  - ${getLabelOrTranslation('common.other', 'Outro')}: ${other.trim()}\n`;
        });
      }
    }
    if (scalabilityContent.replace(/\s/g, "") !== "") md += `## ${getLabelOrTranslation('promptGenerator.scalability.title', 'Escalabilidade')}\n${getLabelOrTranslation('promptGenerator.scalability.isScalable', 'Escalável')}\n${scalabilityContent}\n`;
    // Restrictions
    let restrictionsContent = "";
    if (data.restrictions.avoidInCode.length > 0) {
      data.restrictions.avoidInCode.forEach(r => {
        const restrictionId = r.toLowerCase().replace(/\s+/g, '');
        restrictionsContent += `- ${getLabelOrTranslation(`promptGenerator.restrictions.${restrictionId}`, r)}\n`;
      });
    }
    if (Array.isArray(data.restrictions.otherRestriction) && data.restrictions.otherRestriction.length > 0) {
      data.restrictions.otherRestriction.forEach(other => {
        if (other && other.trim()) restrictionsContent += `- ${getLabelOrTranslation('common.other', 'Outro')}: ${other.trim()}\n`;
      });
    }
    if (restrictionsContent.replace(/\s/g, "") !== "") md += `## ${getLabelOrTranslation('promptGenerator.restrictions.title', 'Restrições')}\n${restrictionsContent}\n`;
    return md;
  };

  useEffect(() => {
    setPreviewMarkdown(generatePreviewMarkdown(formData));
  }, [formData, t]); // t is a dependency if translations inside generatePreviewMarkdown change

  // Update the onStepChange prop
  const handleStepChange = () => {
    console.log('Step changed');
    // If we need to track the current step, we can update it within the navigation component
    // The current step is accessible in the navigation.position property
  };

  return (
    <div className="space-y-1"> {/* Reverted from space-y-0 to space-y-1 */}
      <Card className="p-2 mb-2"> {/* Reverted p-1 to p-2, mb-1 to mb-2 */}
        <div className="flex flex-col space-y-1"> {/* Reverted from space-y-0 to space-y-1 */}
          {/* Wizard Progress */}
          <div className="mb-1"> {/* Reverted from mb-0 to mb-1 */}
            <div className="flex justify-between items-center mb-1"> {/* Reverted from mb-0 to mb-1 */}
              <h2 className="text-xl font-bold">{t('promptGenerator.title')}</h2>
              {/* Span for "X / Y" is now part of PopoverTrigger below */}
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {/* Wizard Steps - New Track Navigation */}
          <div className="flex items-center justify-between mb-2"> {/* Reverted from mb-0 to mb-2 */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={prevStep} 
              disabled={currentStep === 0}
              aria-label={t('common.back')}
              className="hover:bg-muted"
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>

            <div className="flex-grow overflow-hidden px-2">
              <div 
                className="flex items-center justify-center space-x-2 sm:space-x-4 transition-transform duration-300 ease-in-out"
                // This style would be for a transform-based scroll, but re-slicing is simpler for now
                // style={{ transform: `translateX(-${currentStep * (100 / itemsToShowInTrack)}%)` }} 
              >
                {(() => {
                  const itemsToShow = 3; // Show 3 items at a time (current, prev, next if possible)
                  let startIndex = Math.max(0, currentStep - Math.floor(itemsToShow / 2));
                  let endIndex = Math.min(wizardSteps.length, startIndex + itemsToShow);

                  if (endIndex - startIndex < itemsToShow) {
                    startIndex = Math.max(0, endIndex - itemsToShow);
                  }
                  
                  const visibleSteps = wizardSteps.slice(startIndex, endIndex);

                  return visibleSteps.map((step, visibleIndex) => {
                    const actualIndex = wizardSteps.findIndex(s => s.id === step.id);
                    const StepIcon = step.icon;
                    const isActive = currentStep === actualIndex;
                    // const isFilled = filledStepsData[step.id] || false; // Original logic
                    const isFinalized = finalizedSteps[step.id] || false; // New logic for visual cue

                    let iconBgStyle = {};
                    let iconClasses = "text-gray-400 dark:text-gray-500";
                    let titleClasses = "text-xs text-center mt-1 text-gray-500 dark:text-gray-400 whitespace-nowrap truncate w-full";
                    let itemWrapperClasses = "flex flex-col items-center p-2 rounded-md min-w-[80px] sm:min-w-[100px] transition-all duration-200 ease-in-out cursor-pointer hover:bg-muted/50";
                    
                    if (isActive) {
                      iconBgStyle = { backgroundColor: `${step.color}33` }; 
                      iconClasses = ``; 
                      titleClasses = `text-xs text-center mt-1 font-semibold whitespace-nowrap truncate w-full`; 
                    } else if (isFinalized) { // Check isFinalized instead of isFilled
                      iconBgStyle = { backgroundColor: 'rgba(74, 222, 128, 0.1)' }; 
                      iconClasses = "text-green-500 dark:text-green-400";
                      titleClasses = "text-xs text-center mt-1 text-green-600 dark:text-green-500 whitespace-nowrap truncate w-full";
                    }

                    return (
                      <div
                        key={step.id}
                        className={itemWrapperClasses}
                        onClick={() => goToStep(actualIndex)}
                        style={isActive ? { transform: 'scale(1.1)' } : {}}
                      >
                        <div 
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-1 transition-all duration-200 ease-in-out border-2" // Reverted mb-0 to mb-1
                          style={{ 
                            ...iconBgStyle, 
                            borderColor: isActive ? step.color : (isFinalized ? 'rgba(74, 222, 128, 0.4)' : 'transparent') // Use isFinalized
                          }}
                        >
                          <StepIcon size={24} style={{ color: isActive ? step.color : undefined }} className={iconClasses} />
                        </div>
                        <span className={titleClasses} style={{color: isActive ? step.color : undefined}}>
                          {step.title}
                          {isFinalized && !isActive && <CheckCircle className="inline w-3 h-3 ml-1" />} {/* Use isFinalized */}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={nextStep} 
              disabled={currentStep === wizardSteps.length - 1}
              aria-label={t('common.next')}
              className="hover:bg-muted"
            >
              <ChevronRight className="h-7 w-7" />
            </Button>
          </div>
          {/* Popover for full list - can be triggered by the "Step X / Y" text if desired */}
          <div className="text-center mb-1"> {/* Reverted from mb-0 to mb-1 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" className="text-sm text-muted-foreground hover:text-primary px-2 py-1">
                  {`Etapa ${currentStep + 1} de ${wizardSteps.length} - ${wizardSteps[currentStep].title}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-xs sm:max-w-sm md:max-w-md p-0" side="bottom" align="center"> {/* Adjusted width and max-width */}
                <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-1"> {/* Responsive 3-column grid, reduced gap */}
                  {wizardSteps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => {
                        goToStep(index);
                        // Consider managing open state of Popover to close it on item click
                      }}
                      className={`w-full text-left p-1.5 sm:p-2 rounded-md hover:bg-muted transition-colors flex items-center justify-between text-xs
                                  ${currentStep === index ? 'bg-muted font-semibold' : ''}
                                  ${finalizedSteps[step.id] ? (currentStep === index ? '' : 'text-green-600 dark:text-green-400') : 'text-foreground'}`} // Use finalizedSteps
                    >
                      <span className="truncate">{step.title}</span>
                      {finalizedSteps[step.id] && <CheckCircle className="h-4 w-4 ml-2 flex-shrink-0" style={{color: currentStep === index && finalizedSteps[step.id] ? wizardSteps[currentStep].color : (finalizedSteps[step.id] ? 'rgb(34 197 94)' : undefined )}}/>} {/* Use finalizedSteps */}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Current Step Content & Preview Container */}
          <div className="md:flex md:space-x-6 py-1"> {/* Reverted py-0 to py-1 */}
            {/* Left Column: Step Content */}
            <div className="flex-1 md:w-3/5 lg:w-2/3">
              {/* "Confirmar e Avançar" button removed from here */}
              {renderCurrentStep()}
            </div>

            {/* Right Column: Markdown Preview */}
            <div className="flex-1 md:w-2/5 lg:w-1/3 mt-6 md:mt-0 p-1">
              <div className="sticky top-24"> {/* Sticky positioning for preview */}
                <PromptPreview 
                  previewContent={previewMarkdown}
                  codeContent={previewMarkdown}
                  markdownContent={previewMarkdown}
                  generatedPromptContent={generatedPrompt}
                  documentationContent={''}
                />
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons and top border removed */}
        </div>
      </Card>
    </div>
  );
};

export default PromptGeneratorWizard;
