// Importa as dependências do React e componentes reutilizáveis
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, AlertCircle, ArrowLeft, ArrowRight, Clipboard, CheckCircle } from "lucide-react"; // Added CheckCircle
import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";
import { useAuth } from "@/hooks/useAuth";

// Define os passos do wizard do gerador de prompts
const wizardSteps = [
  { value: "system-type", label: "Tipo" },
  { value: "objective-features", label: "Objetivo" },
  { value: "design", label: "Design" },
  { value: "tech-stack", label: "Stack" },
  { value: "security", label: "Segurança" },
  { value: "code-structure", label: "Código" },
  { value: "scalability", label: "Escala" },
  { value: "restrictions", label: "Restrições" },
  { value: "generate", label: "Gerar" },
];

// Componente principal do gerador de prompts
const PromptGenerator = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState(wizardSteps[0].value);
  const [copied, setCopied] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const { user } = useAuth();
  const [promptHistory, setPromptHistory] = useState<Array<{id: string, date: Date, prompt: string, systemType: string}>>([]);
  const [filledSteps, setFilledSteps] = useState<Record<string, boolean>>(
    wizardSteps.reduce((acc, step) => ({ ...acc, [step.value]: false }), {})
  );
  
  // Form state
  const [formData, setFormData] = useState({
    systemType: "",
    systemTypeCustom: "",
    objective: "",
    specificFeatures: [] as string[],
    specificFeaturesCustom: "",
    dynamicFeatures: [] as string[],
    dynamicFeaturesCustom: "",
    colorPalette: [] as string[],
    customColor: "",
    visualStyle: "",
    visualStyleCustom: "",
    menuType: "",
    menuTypeCustom: "",
    hasLandingPage: false,
    landingPageStructure: [] as string[],
    landingPageElements: [] as string[],
    landingPageStyle: "",
    landingPageStyleCustom: "",
    authTypes: [] as string[],
    authTypesCustom: "",
    hasDashboard: false,
    dashboardFeatures: [] as string[],
    dashboardFeaturesCustom: "",
    separateFrontendBackend: false,
    frontend: [] as string[],
    frontendCustom: "",
    backend: [] as string[],
    backendCustom: "",
    fullstack: "",
    fullstackCustom: "",
    database: "",
    databaseCustom: "",
    orm: [] as string[],
    ormCustom: "",
    deploy: "",
    deployCustom: "",
    securityRequirements: [] as string[],
    securityRequirementsCustom: "",
    folderStructure: [] as string[],
    folderStructureCustom: "",
    architecturePattern: [] as string[],
    architecturePatternCustom: "",
    bestPractices: [] as string[],
    bestPracticesCustom: "",
    needsScalability: false,
    scalabilityFeatures: [] as string[],
    scalabilityFeaturesCustom: "",
    performanceOptimizations: [] as string[],
    performanceOptimizationsCustom: "",
    codeRestrictions: [] as string[],
    codeRestrictionsCustom: "",
  });

  // Dynamic features based on system type
  const getDynamicFeaturesBySystemType = (type: string) => {
    switch (type) {
      case "e-commerce":
        return [
          "Checkout personalizado", 
          "Integração com gateways de pagamento",
          "Gerenciamento de estoque",
          "Cálculo automático de frete",
          "Recuperação de carrinho abandonado",
          "Cupons e promoções"
        ];
      case "api-backend":
        return [
          "Autenticação JWT ou OAuth2",
          "Multi-tenancy",
          "Documentação automática (Swagger/OpenAPI)",
          "Versionamento de API",
          "Webhooks e eventos"
        ];
      case "crm":
        return [
          "Pipeline de vendas",
          "Segmentação de clientes",
          "Integração com e-mail e WhatsApp",
          "Dashboard de performance",
          "Sistema de tarefas e lembretes"
        ];
      case "micro-saas":
        return [
          "Integração com APIs de pagamento",
          "Sistema de assinatura recorrente",
          "Onboarding simples",
          "Analytics simplificado",
          "Automações básicas"
        ];
      case "saas":
        return [
          "Multi-tenancy completo",
          "Planos e preços diferenciados",
          "Painel de administração avançado",
          "Analytics avançado",
          "Automações avançadas" 
        ];
      case "erp":
        return [
          "Módulos financeiros",
          "Controle de estoque",
          "Gestão de funcionários",
          "Relatórios completos",
          "Integrações contábeis"
        ];
      case "cms":
        return [
          "Editor WYSIWYG",
          "Gerenciamento de mídia",
          "Controle de versões",
          "Agendamento de conteúdo",
          "SEO integrado"
        ];
      case "mobile-app":
        return [
          "Notificações push",
          "Modo offline",
          "Armazenamento local",
          "Integração com câmera",
          "Geolocalização"
        ];
      case "scheduling":
        return [
          "Calendário interativo",
          "Lembretes automatizados",
          "Recorrência de eventos",
          "Bloqueio de horários",
          "Integração com calendários externos"
        ];
      case "helpdesk":
        return [
          "Tickets de suporte",
          "Base de conhecimento",
          "Chat em tempo real",
          "SLA e priorização",
          "Automação de respostas"
        ];
      case "education":
        return [
          "Criação de cursos",
          "Avaliações e quizzes",
          "Progresso do aluno",
          "Certificados",
          "Fóruns de discussão"
        ];
      case "streaming":
        return [
          "Reprodução de mídia",
          "Recomendações personalizadas",
          "Listas de reprodução",
          "Qualidade adaptativa",
          "Download para offline"
        ];
      default:
        return [];
    }
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    window.scrollTo(0, 0);
  };

  const handleNextTab = () => {
    const currentIndex = wizardSteps.findIndex(step => step.value === currentTab);
    if (currentIndex < wizardSteps.length - 1) {
      handleTabChange(wizardSteps[currentIndex + 1].value);
    }
  };

  const handlePrevTab = () => {
    const currentIndex = wizardSteps.findIndex(step => step.value === currentTab);
    if (currentIndex > 0) {
      handleTabChange(wizardSteps[currentIndex - 1].value);
    }
  };

  const handleSystemTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      systemType: value,
      dynamicFeatures: [],
    }));
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          [field]: [...prev[field as keyof typeof prev] as string[], value],
        };
      } else {
        return {
          ...prev,
          [field]: (prev[field as keyof typeof prev] as string[]).filter(item => item !== value),
        };
      }
    });
  };

  const generatePrompt = () => {
    let prompt = "";
    // Título
    if (formData.systemType && (formData.systemType !== "outro" || formData.systemTypeCustom.trim() !== "")) {
      prompt += `# Sistema ${formData.systemType === "outro" ? formData.systemTypeCustom : formData.systemType}\n\n`;
    }
    // Objetivo
    if (formData.objective && formData.objective.trim() !== "") {
      prompt += `## Objetivo\n${formData.objective}\n\n`;
    }
    // Funcionalidades
    const hasFeatures = formData.specificFeatures.length > 0 || formData.specificFeaturesCustom.trim() !== "" || formData.dynamicFeatures.length > 0 || formData.dynamicFeaturesCustom.trim() !== "";
    if (hasFeatures) {
      prompt += "## Funcionalidades\n";
      if (formData.specificFeatures.length > 0 || formData.specificFeaturesCustom.trim() !== "") {
        prompt += "### Gerais\n";
        formData.specificFeatures.forEach(feature => {
          prompt += `- ${feature}\n`;
        });
        if (formData.specificFeaturesCustom.trim() !== "") {
          prompt += `- ${formData.specificFeaturesCustom}\n`;
        }
        prompt += "\n";
      }
      if (formData.dynamicFeatures.length > 0 || formData.dynamicFeaturesCustom.trim() !== "") {
        prompt += "### Específicas\n";
        formData.dynamicFeatures.forEach(feature => {
          prompt += `- ${feature}\n`;
        });
        if (formData.dynamicFeaturesCustom.trim() !== "") {
          prompt += `- ${formData.dynamicFeaturesCustom}\n`;
        }
        prompt += "\n";
      }
    }
    // Design e UX/UI
    const hasDesign = formData.colorPalette.length > 0 || formData.customColor.trim() !== "" || (formData.visualStyle && (formData.visualStyle !== "outro" || formData.visualStyleCustom.trim() !== "")) || (formData.menuType && (formData.menuType !== "outro" || formData.menuTypeCustom.trim() !== "")) || (formData.hasLandingPage && (formData.landingPageStructure.length > 0 || formData.landingPageElements.length > 0 || (formData.landingPageStyle && (formData.landingPageStyle !== "outro" || formData.landingPageStyleCustom.trim() !== "")))) || formData.authTypes.length > 0 || formData.authTypesCustom.trim() !== "" || (formData.hasDashboard && (formData.dashboardFeatures.length > 0 || formData.dashboardFeaturesCustom.trim() !== ""));
    if (hasDesign) {
      prompt += "## Design e UX/UI\n";
      if (formData.colorPalette.length > 0 || formData.customColor.trim() !== "") {
        prompt += "### Cores\n";
        formData.colorPalette.forEach(color => {
          prompt += `- ${color}\n`;
        });
        if (formData.customColor.trim() !== "") {
          prompt += `- Personalizada: ${formData.customColor}\n`;
        }
        prompt += "\n";
      }
      if (formData.visualStyle && (formData.visualStyle !== "outro" || formData.visualStyleCustom.trim() !== "")) {
        prompt += `### Estilo Visual\n${formData.visualStyle === "outro" ? formData.visualStyleCustom : formData.visualStyle}\n\n`;
      }
      if (formData.menuType && (formData.menuType !== "outro" || formData.menuTypeCustom.trim() !== "")) {
        prompt += `### Tipo de Menu\n${formData.menuType === "outro" ? formData.menuTypeCustom : formData.menuType}\n\n`;
      }
      if (formData.hasLandingPage && (formData.landingPageStructure.length > 0 || formData.landingPageElements.length > 0 || (formData.landingPageStyle && (formData.landingPageStyle !== "outro" || formData.landingPageStyleCustom.trim() !== "")))) {
        prompt += "### Landing Page\n";
        if (formData.landingPageStructure.length > 0) {
          prompt += "Estrutura:\n";
          formData.landingPageStructure.forEach(item => {
            prompt += `- ${item}\n`;
          });
          prompt += "\n";
        }
        if (formData.landingPageElements.length > 0) {
          prompt += "Elementos:\n";
          formData.landingPageElements.forEach(item => {
            prompt += `- ${item}\n`;
          });
          prompt += "\n";
        }
        if (formData.landingPageStyle && (formData.landingPageStyle !== "outro" || formData.landingPageStyleCustom.trim() !== "")) {
          prompt += `Estilo: ${formData.landingPageStyle === "outro" ? formData.landingPageStyleCustom : formData.landingPageStyle}\n\n`;
        }
      }
      if (formData.authTypes.length > 0 || formData.authTypesCustom.trim() !== "") {
        prompt += "### Autenticação\n";
        formData.authTypes.forEach(type => {
          prompt += `- ${type}\n`;
        });
        if (formData.authTypesCustom.trim() !== "") {
          prompt += `- ${formData.authTypesCustom}\n`;
        }
        prompt += "\n";
      }
      if (formData.hasDashboard && (formData.dashboardFeatures.length > 0 || formData.dashboardFeaturesCustom.trim() !== "")) {
        prompt += "### Dashboard\n";
        if (formData.dashboardFeatures.length > 0) {
          formData.dashboardFeatures.forEach(feature => {
            prompt += `- ${feature}\n`;
          });
        }
        if (formData.dashboardFeaturesCustom.trim() !== "") {
          prompt += `- ${formData.dashboardFeaturesCustom}\n`;
        }
        prompt += "\n";
      }
    }
    // Stack Tecnológica
    let hasStack = false;
    let stackPrompt = "";
    if (formData.separateFrontendBackend) {
      if (formData.frontend.length > 0 || formData.frontendCustom.trim() !== "") {
        stackPrompt += "### Frontend\n";
        formData.frontend.forEach(tech => {
          stackPrompt += `- ${tech}\n`;
        });
        if (formData.frontendCustom.trim() !== "") {
          stackPrompt += `- ${formData.frontendCustom}\n`;
        }
        stackPrompt += "\n";
        hasStack = true;
      }
      if (formData.backend.length > 0 || formData.backendCustom.trim() !== "") {
        stackPrompt += "### Backend\n";
        formData.backend.forEach(tech => {
          stackPrompt += `- ${tech}\n`;
        });
        if (formData.backendCustom.trim() !== "") {
          stackPrompt += `- ${formData.backendCustom}\n`;
        }
        stackPrompt += "\n";
        hasStack = true;
      }
    } else {
      if ((formData.fullstack && formData.fullstack !== "outro") || (formData.fullstack === "outro" && formData.fullstackCustom.trim() !== "")) {
        stackPrompt += "### Fullstack\n";
        if (formData.fullstack === "outro" && formData.fullstackCustom.trim() !== "") {
          stackPrompt += `${formData.fullstackCustom}\n\n`;
        } else if (formData.fullstack !== "outro") {
          stackPrompt += `${formData.fullstack}\n\n`;
        }
        hasStack = true;
      }
    }
    if ((formData.database && formData.database !== "outro") || (formData.database === "outro" && formData.databaseCustom.trim() !== "")) {
      stackPrompt += "### Banco de Dados\n";
      if (formData.database === "outro" && formData.databaseCustom.trim() !== "") {
        stackPrompt += `${formData.databaseCustom}\n\n`;
      } else if (formData.database !== "outro") {
        stackPrompt += `${formData.database}\n\n`;
      }
      hasStack = true;
    }
    if (formData.orm.length > 0 || formData.ormCustom.trim() !== "") {
      stackPrompt += "### ORM/ODM\n";
      formData.orm.forEach(item => {
        stackPrompt += `- ${item}\n`;
      });
      if (formData.ormCustom.trim() !== "") {
        stackPrompt += `- ${formData.ormCustom}\n`;
      }
      stackPrompt += "\n";
      hasStack = true;
    }
    if ((formData.deploy && formData.deploy !== "outro") || (formData.deploy === "outro" && formData.deployCustom.trim() !== "")) {
      stackPrompt += "### Deploy/Infraestrutura\n";
      if (formData.deploy === "outro" && formData.deployCustom.trim() !== "") {
        stackPrompt += `${formData.deployCustom}\n\n`;
      } else if (formData.deploy !== "outro") {
        stackPrompt += `${formData.deploy}\n\n`;
      }
      hasStack = true;
    }
    if (hasStack && stackPrompt.replace(/\s/g, "") !== "") {
      prompt += `## Stack Tecnológica\n${stackPrompt}`;
    }
    // Segurança
    let hasSecurity = false;
    let securityPrompt = "";
    if (formData.securityRequirements.length > 0) {
      formData.securityRequirements.forEach(req => {
        securityPrompt += `- ${req}\n`;
      });
      hasSecurity = true;
    }
    if (formData.securityRequirementsCustom.trim() !== "") {
      securityPrompt += `- ${formData.securityRequirementsCustom}\n`;
      hasSecurity = true;
    }
    if (hasSecurity && securityPrompt.replace(/\s/g, "") !== "") {
      prompt += `## Segurança\n${securityPrompt}\n`;
    }
    // Estrutura de Código
    let hasCodeStructure = false;
    let codeStructurePrompt = "";
    if (formData.folderStructure.length > 0) {
      codeStructurePrompt += "### Organização de Pastas\n";
      formData.folderStructure.forEach(item => {
        codeStructurePrompt += `- ${item}\n`;
      });
      hasCodeStructure = true;
    }
    if (formData.folderStructureCustom.trim() !== "") {
      if (!codeStructurePrompt.includes("### Organização de Pastas")) codeStructurePrompt += "### Organização de Pastas\n";
      codeStructurePrompt += `- ${formData.folderStructureCustom}\n`;
      hasCodeStructure = true;
    }
    if (formData.architecturePattern.length > 0) {
      codeStructurePrompt += "### Padrão Arquitetural\n";
      formData.architecturePattern.forEach(pattern => {
        codeStructurePrompt += `- ${pattern}\n`;
      });
      hasCodeStructure = true;
    }
    if (formData.architecturePatternCustom.trim() !== "") {
      if (!codeStructurePrompt.includes("### Padrão Arquitetural")) codeStructurePrompt += "### Padrão Arquitetural\n";
      codeStructurePrompt += `- ${formData.architecturePatternCustom}\n`;
      hasCodeStructure = true;
    }
    if (formData.bestPractices.length > 0) {
      codeStructurePrompt += "### Boas Práticas\n";
      formData.bestPractices.forEach(practice => {
        codeStructurePrompt += `- ${practice}\n`;
      });
      hasCodeStructure = true;
    }
    if (formData.bestPracticesCustom.trim() !== "") {
      if (!codeStructurePrompt.includes("### Boas Práticas")) codeStructurePrompt += "### Boas Práticas\n";
      codeStructurePrompt += `- ${formData.bestPracticesCustom}\n`;
      hasCodeStructure = true;
    }
    if (hasCodeStructure && codeStructurePrompt.replace(/\s/g, "") !== "") {
      prompt += `## Estrutura de Código\n${codeStructurePrompt}`;
    }
    // Restrições Técnicas
    let hasRestrictions = false;
    let restrictionsPrompt = "";
    if (formData.codeRestrictions.length > 0) {
      formData.codeRestrictions.forEach(restriction => {
        restrictionsPrompt += `- Evitar: ${restriction}\n`;
      });
      hasRestrictions = true;
    }
    if (formData.codeRestrictionsCustom.trim() !== "") {
      restrictionsPrompt += `- Evitar: ${formData.codeRestrictionsCustom}\n`;
      hasRestrictions = true;
    }
    if (hasRestrictions && restrictionsPrompt.replace(/\s/g, "") !== "") {
      prompt += `## Restrições Técnicas\n${restrictionsPrompt}\n`;
    }
    // Instrução final
    if (prompt.replace(/\s/g, "") !== "") {
      prompt += "Por favor, construa este sistema seguindo todas as especificações acima. Apresente uma estrutura de arquivos, as principais bibliotecas a serem usadas e trechos de código importantes para implementar as funcionalidades principais.";
    }
    return prompt;
  };

  const handleCopyPrompt = async () => {
    const prompt = generatePrompt();
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Prompt copiado para a área de transferência.",
      });
      
      if (user) {
        // Save to history if user is logged in
        const newHistoryItem = {
          id: Date.now().toString(),
          date: new Date(),
          prompt: prompt,
          systemType: formData.systemType === "outro" ? formData.systemTypeCustom : formData.systemType
        };
        
        setPromptHistory(prev => [newHistoryItem, ...prev]);
      }
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o prompt.",
        variant: "destructive",
      });
    }
  };

  // Save prompt history to local storage for logged in users
  useEffect(() => {
    if (user && promptHistory.length > 0) {
      localStorage.setItem(`promptHistory-${user.id}`, JSON.stringify(promptHistory));
    }
  }, [promptHistory, user]);

  // Load prompt history from local storage for logged in users
  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`promptHistory-${user.id}`);
      if (savedHistory) {
        setPromptHistory(JSON.parse(savedHistory));
      }
    }
  }, [user]);

  // Update filledSteps state based on formData changes
  useEffect(() => {
    const newFilledSteps = { ...filledSteps };

    // Step 1: Tipo de Sistema
    newFilledSteps["system-type"] = formData.systemType !== "" && (formData.systemType !== "outro" || formData.systemTypeCustom !== "");
    
    // Step 2: Objetivo e Funcionalidades
    newFilledSteps["objective-features"] = formData.objective !== "";

    // Step 3: Design e UX/UI
    newFilledSteps["design"] = 
      formData.colorPalette.length > 0 ||
      formData.customColor !== "" ||
      (formData.visualStyle !== "" && (formData.visualStyle !== "outro" || formData.visualStyleCustom !== "")) ||
      (formData.menuType !== "" && (formData.menuType !== "outro" || formData.menuTypeCustom !== "")) ||
      (formData.hasLandingPage && (
        formData.landingPageStructure.length > 0 || 
        formData.landingPageElements.length > 0 ||
        (formData.landingPageStyle !== "" && (formData.landingPageStyle !== "outro" || formData.landingPageStyleCustom !== ""))
      )) ||
      formData.authTypes.length > 0 ||
      formData.authTypesCustom !== "" ||
      (formData.hasDashboard && (formData.dashboardFeatures.length > 0 || formData.dashboardFeaturesCustom !== ""));

    // Step 4: Stack Tecnológica
    const isFrontendFilled = formData.frontend.length > 0 || formData.frontendCustom !== "";
    const isBackendFilled = formData.backend.length > 0 || formData.backendCustom !== "";
    const isFullstackFilled = formData.fullstack !== "" && (formData.fullstack !== "outro" || formData.fullstackCustom !== "");
    const isDatabaseFilled = formData.database !== "" && (formData.database !== "outro" || formData.databaseCustom !== "");
    
    newFilledSteps["tech-stack"] = 
      (formData.separateFrontendBackend ? (isFrontendFilled || isBackendFilled) : isFullstackFilled) &&
      isDatabaseFilled;

    // Step 5: Segurança
    newFilledSteps["security"] = formData.securityRequirements.length > 0 || formData.securityRequirementsCustom !== "";

    // Step 6: Estrutura de Código
    newFilledSteps["code-structure"] = 
      formData.folderStructure.length > 0 || formData.folderStructureCustom !== "" ||
      formData.architecturePattern.length > 0 || formData.architecturePatternCustom !== "" ||
      formData.bestPractices.length > 0 || formData.bestPracticesCustom !== "";

    // Step 7: Escalabilidade e Performance
    if (formData.needsScalability) {
      newFilledSteps["scalability"] = 
        formData.scalabilityFeatures.length > 0 || formData.scalabilityFeaturesCustom !== "" ||
        formData.performanceOptimizations.length > 0 || formData.performanceOptimizationsCustom !== "";
    } else {
      newFilledSteps["scalability"] = true; // Considered filled if not needed
    }

    // Step 8: Restrições Técnicas
    newFilledSteps["restrictions"] = formData.codeRestrictions.length > 0 || formData.codeRestrictionsCustom !== "";
    
    // Step 9: Gerar - always considered "filled" if reached, but visual cue is more about previous steps
    newFilledSteps["generate"] = true; 


    // Only update if there's an actual change to avoid infinite loops if objects are always new
    if (JSON.stringify(newFilledSteps) !== JSON.stringify(filledSteps)) {
      setFilledSteps(newFilledSteps);
    }
  }, [formData, filledSteps]); // Added filledSteps to dependency array carefully

  // Atualizar o preview em tempo real
  useEffect(() => {
    setGeneratedPrompt(generatePrompt());
  }, [formData]);

  return (
    <div className="container mx-auto py-10 px-4">
      <ScrollToTopOnMount />
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Gerador de Prompts</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Crie prompts detalhados para criar sistemas de software passo a passo
        </p>
      </div>

      <Tabs defaultValue={wizardSteps[0].value} value={currentTab} onValueChange={handleTabChange} className="mx-auto max-w-4xl">
        <div className="border rounded-lg p-4 mb-6 overflow-x-auto">
          <TabsList className="relative flex items-stretch justify-between w-full">
            {wizardSteps.map((step, index) => {
              const stepIndex = wizardSteps.findIndex(s => s.value === step.value);
              const currentIndex = wizardSteps.findIndex(s => s.value === currentTab);
              const isNavigatedPast = stepIndex < currentIndex; // User has navigated beyond this step
              const isActive = step.value === currentTab;
              const isFilled = filledSteps[step.value];

              let iconBorderColor = 'border-border';
              let iconBgColor = 'bg-transparent';
              let iconTextColor = 'text-muted-foreground';
              let stepTextColor = 'text-muted-foreground';
              let showCheckIcon = false;

              if (isActive) {
                iconBorderColor = 'border-primary';
                iconBgColor = 'bg-primary';
                iconTextColor = 'text-primary-foreground';
                stepTextColor = 'text-primary font-bold';
              } else if (isFilled) {
                iconBorderColor = 'border-green-500'; // Filled color
                iconBgColor = 'bg-green-500';    // Filled color
                iconTextColor = 'text-white';       // Filled color
                stepTextColor = 'text-green-500';   // Filled color for text
                showCheckIcon = true;
              } else if (isNavigatedPast) { // Navigated past but not necessarily "filled" by criteria
                iconBorderColor = 'border-green-600'; // Original completed color
                iconBgColor = 'bg-green-600';    // Original completed color
                iconTextColor = 'text-white';       // Original completed color
                stepTextColor = 'text-green-600';
                showCheckIcon = true; // Still show check if navigated past
              }
              
              // If a step is filled, the line connecting to it should also be green
              const lineConnectorColor = (isFilled && isNavigatedPast) || (isActive && filledSteps[wizardSteps[Math.max(0,index-1)]?.value]) ? 'hsl(var(--primary))' : 'hsl(var(--border))';
              // More precise line coloring: if current step is filled, or if current step is active and previous step was filled.
              const prevStepValue = index > 0 ? wizardSteps[index-1].value : null;
              const isPrevStepFilled = prevStepValue ? filledSteps[prevStepValue] : true; // Assume true for first step's "previous"

              const currentLineColor = (isActive && isPrevStepFilled) || (isFilled && isNavigatedPast) ? 'hsl(var(--primary))' : 'hsl(var(--border))';
              // The line after a step should be primary if that step is filled AND completed (navigated past)
              // OR if that step is active AND filled
              const nextLineShouldBeActive = (isFilled && isNavigatedPast) || (isActive && isFilled);


              return (
                <React.Fragment key={step.value}>
                  <div className="flex flex-col items-center flex-1 group">
                    <TabsTrigger
                      value={step.value}
                      className={`flex flex-col items-center justify-center p-1 md:p-2 text-center text-xs md:text-sm h-full 
                                  data-[state=active]:font-bold 
                                  ${stepTextColor}
                                  hover:bg-muted/50 rounded-md w-full`}
                    >
                      <div className={`mb-1 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 
                                    ${iconBorderColor} ${iconBgColor} ${iconTextColor}`}>
                        {showCheckIcon ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> : index + 1}
                      </div>
                      <span className="hidden md:inline-block whitespace-nowrap">{step.label}</span>
                      <span className="md:hidden whitespace-nowrap">{step.label.substring(0,3)}</span>
                    </TabsTrigger>
                  </div>
                  {index < wizardSteps.length - 1 && (
                     <div className="flex-none self-center h-0.5 min-w-[12px] md:min-w-[24px] flex-grow" style={{
                        backgroundColor: nextLineShouldBeActive ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                        marginRight: '0.25rem', 
                        marginLeft: '0.25rem'
                      }} />
                  )}
                </React.Fragment>
              );
            })}
          </TabsList>
        </div>

        {/* Tab 1: Sistema */}
        <TabsContent value="system-type" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Tipo de Sistema</h2>
                <p className="text-gray-600 dark:text-gray-400">Selecione o tipo de sistema que você deseja criar</p>
                
                <RadioGroup value={formData.systemType} onValueChange={handleSystemTypeChange}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="micro-saas" value="micro-saas" />
                      <Label htmlFor="micro-saas">MicroSaaS</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="saas" value="saas" />
                      <Label htmlFor="saas">SaaS</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="erp" value="erp" />
                      <Label htmlFor="erp">ERP (Enterprise Resource Planning)</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="crm" value="crm" />
                      <Label htmlFor="crm">CRM (Customer Relationship Management)</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="e-commerce" value="e-commerce" />
                      <Label htmlFor="e-commerce">Plataforma de E-commerce</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="cms" value="cms" />
                      <Label htmlFor="cms">CMS (Gerenciador de Conteúdo)</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="api-backend" value="api-backend" />
                      <Label htmlFor="api-backend">API Backend</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="mobile-app" value="mobile-app" />
                      <Label htmlFor="mobile-app">Aplicativo Mobile</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="scheduling" value="scheduling" />
                      <Label htmlFor="scheduling">Sistema de Agendamento</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="helpdesk" value="helpdesk" />
                      <Label htmlFor="helpdesk">Sistema de Suporte/Helpdesk</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="education" value="education" />
                      <Label htmlFor="education">Plataforma Educacional</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="streaming" value="streaming" />
                      <Label htmlFor="streaming">Plataforma de Streaming</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="outro" value="outro" />
                      <Label htmlFor="outro">Outro</Label>
                    </div>
                  </div>
                </RadioGroup>
                
                {formData.systemType === "outro" && (
                  <div className="mt-4">
                    <Label htmlFor="systemTypeCustom">Especifique o tipo de sistema:</Label>
                    <Input 
                      id="systemTypeCustom"
                      value={formData.systemTypeCustom}
                      onChange={(e) => handleFormChange("systemTypeCustom", e.target.value)}
                      placeholder="Nome do tipo de sistema"
                      className="mt-1"
                      required
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button disabled variant="outline">Anterior</Button>
            <Button onClick={handleNextTab} disabled={!formData.systemType || (formData.systemType === "outro" && !formData.systemTypeCustom)}>
              Próximo
            </Button>
          </div>
        </TabsContent>

        {/* Tab 2: Objetivo e Funcionalidades */}
        <TabsContent value="objective-features" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Objetivo do Projeto</h2>
                <div>
                  <Label htmlFor="objective">Descreva o objetivo principal do sistema</Label>
                  <Textarea 
                    id="objective"
                    value={formData.objective}
                    onChange={(e) => handleFormChange("objective", e.target.value)}
                    placeholder="Ex: Sistema de login com redes sociais, Plataforma com landing page e dashboard, etc."
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                
                <h2 className="text-2xl font-bold">Funcionalidades Gerais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="upload-files" 
                        checked={formData.specificFeatures.includes("Upload de arquivos e imagens")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Upload de arquivos e imagens", checked === true)
                        }
                      />
                      <Label htmlFor="upload-files">Upload de arquivos e imagens</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="notifications" 
                        checked={formData.specificFeatures.includes("Notificações (Push, Email, SMS)")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Notificações (Push, Email, SMS)", checked === true)
                        }
                      />
                      <Label htmlFor="notifications">Notificações: Push | Email | SMS</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="advanced-filters" 
                        checked={formData.specificFeatures.includes("Filtros avançados + busca com autocomplete")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Filtros avançados + busca com autocomplete", checked === true)
                        }
                      />
                      <Label htmlFor="advanced-filters">Filtros avançados + busca com autocomplete</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dashboards" 
                        checked={formData.specificFeatures.includes("Dashboards com gráficos interativos")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Dashboards com gráficos interativos", checked === true)
                        }
                      />
                      <Label htmlFor="dashboards">Dashboards com gráficos interativos</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="scheduling" 
                        checked={formData.specificFeatures.includes("Agendamentos e lembretes automáticos")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Agendamentos e lembretes automáticos", checked === true)
                        }
                      />
                      <Label htmlFor="scheduling">Agendamentos e lembretes automáticos</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="export" 
                        checked={formData.specificFeatures.includes("Exportação para CSV, PDF, Excel")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Exportação para CSV, PDF, Excel", checked === true)
                        }
                      />
                      <Label htmlFor="export">Exportação: CSV | PDF | Excel</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="roles" 
                        checked={formData.specificFeatures.includes("Controle de permissões por papéis")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Controle de permissões por papéis", checked === true)
                        }
                      />
                      <Label htmlFor="roles">Controle de permissões por papéis</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="api-integration" 
                        checked={formData.specificFeatures.includes("Integração com APIs externas")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Integração com APIs externas", checked === true)
                        }
                      />
                      <Label htmlFor="api-integration">Integração com APIs externas</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="multi-language" 
                        checked={formData.specificFeatures.includes("Suporte a múltiplos idiomas")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Suporte a múltiplos idiomas", checked === true)
                        }
                      />
                      <Label htmlFor="multi-language">Suporte a múltiplos idiomas</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="accessibility" 
                        checked={formData.specificFeatures.includes("Acessibilidade (WCAG)")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Acessibilidade (WCAG)", checked === true)
                        }
                      />
                      <Label htmlFor="accessibility">Acessibilidade (WCAG)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dark-mode" 
                        checked={formData.specificFeatures.includes("Tema escuro/claro")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Tema escuro/claro", checked === true)
                        }
                      />
                      <Label htmlFor="dark-mode">Tema escuro/claro</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="landing-page" 
                        checked={formData.specificFeatures.includes("Landing page customizável")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("specificFeatures", "Landing page customizável", checked === true)
                        }
                      />
                      <Label htmlFor="landing-page">Landing page customizável</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="specificFeaturesCustom">Outras funcionalidades gerais:</Label>
                  <Input 
                    id="specificFeaturesCustom"
                    value={formData.specificFeaturesCustom}
                    onChange={(e) => handleFormChange("specificFeaturesCustom", e.target.value)}
                    placeholder="Descreva outras funcionalidades gerais"
                    className="mt-1"
                  />
                </div>
                
                {formData.systemType && (
                  <>
                    <h2 className="text-2xl font-bold">Funcionalidades Específicas para {formData.systemType === "outro" ? formData.systemTypeCustom : formData.systemType}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getDynamicFeaturesBySystemType(formData.systemType).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`dynamic-feature-${index}`}
                            checked={formData.dynamicFeatures.includes(feature)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("dynamicFeatures", feature, checked === true)
                            }
                          />
                          <Label htmlFor={`dynamic-feature-${index}`}>{feature}</Label>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <Label htmlFor="dynamicFeaturesCustom">Outras funcionalidades específicas:</Label>
                      <Input 
                        id="dynamicFeaturesCustom"
                        value={formData.dynamicFeaturesCustom}
                        onChange={(e) => handleFormChange("dynamicFeaturesCustom", e.target.value)}
                        placeholder="Descreva outras funcionalidades específicas"
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button onClick={handlePrevTab} variant="outline">Anterior</Button>
            <Button onClick={handleNextTab} disabled={!formData.objective}>Próximo</Button>
          </div>
        </TabsContent>

        {/* Tab 3: UX/UI e Design */}
        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Paleta de Cores</h2>
                <p className="text-gray-600 dark:text-gray-400">Selecione as cores principais do sistema</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="color-blue"
                      checked={formData.colorPalette.includes("Azul (#0057D9)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("colorPalette", "Azul (#0057D9)", checked === true)
                      }
                    />
                    <Label htmlFor="color-blue" className="flex items-center">
                      <div className="w-6 h-6 bg-[#0057D9] rounded-md mr-2"></div>
                      Azul
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="color-green"
                      checked={formData.colorPalette.includes("Verde (#28A745)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("colorPalette", "Verde (#28A745)", checked === true)
                      }
                    />
                    <Label htmlFor="color-green" className="flex items-center">
                      <div className="w-6 h-6 bg-[#28A745] rounded-md mr-2"></div>
                      Verde
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="color-red"
                      checked={formData.colorPalette.includes("Vermelho (#DC3545)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("colorPalette", "Vermelho (#DC3545)", checked === true)
                      }
                    />
                    <Label htmlFor="color-red" className="flex items-center">
                      <div className="w-6 h-6 bg-[#DC3545] rounded-md mr-2"></div>
                      Vermelho
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="color-purple"
                      checked={formData.colorPalette.includes("Roxo (#6F42C1)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("colorPalette", "Roxo (#6F42C1)", checked === true)
                      }
                    />
                    <Label htmlFor="color-purple" className="flex items-center">
                      <div className="w-6 h-6 bg-[#6F42C1] rounded-md mr-2"></div>
                      Roxo
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="color-orange"
                      checked={formData.colorPalette.includes("Laranja (#FD7E14)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("colorPalette", "Laranja (#FD7E14)", checked === true)
                      }
                    />
                    <Label htmlFor="color-orange" className="flex items-center">
                      <div className="w-6 h-6 bg-[#FD7E14] rounded-md mr-2"></div>
                      Laranja
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="color-black"
                      checked={formData.colorPalette.includes("Preto (#000000)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("colorPalette", "Preto (#000000)", checked === true)
                      }
                    />
                    <Label htmlFor="color-black" className="flex items-center">
                      <div className="w-6 h-6 bg-[#000000] rounded-md mr-2"></div>
                      Preto
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="color-white"
                      checked={formData.colorPalette.includes("Branco (#FFFFFF)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("colorPalette", "Branco (#FFFFFF)", checked === true)
                      }
                    />
                    <Label htmlFor="color-white" className="flex items-center">
                      <div className="w-6 h-6 bg-[#FFFFFF] border rounded-md mr-2"></div>
                      Branco
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="color-gray"
                      checked={formData.colorPalette.includes("Cinza (#6C757D)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("colorPalette", "Cinza (#6C757D)", checked === true)
                      }
                    />
                    <Label htmlFor="color-gray" className="flex items-center">
                      <div className="w-6 h-6 bg-[#6C757D] rounded-md mr-2"></div>
                      Cinza
                    </Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customColor">Cor personalizada (HEX):</Label>
                  <Input
                    id="customColor"
                    value={formData.customColor}
                    onChange={(e) => handleFormChange("customColor", e.target.value)}
                    placeholder="#RRGGBB"
                    className="mt-1"
                  />
                </div>
                
                <h2 className="text-2xl font-bold">Estilo Visual</h2>
                <RadioGroup value={formData.visualStyle} onValueChange={(value) => handleFormChange("visualStyle", value)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="style-minimalist" value="minimalista" />
                      <Label htmlFor="style-minimalist">Minimalista</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="style-modern" value="moderna" />
                      <Label htmlFor="style-modern">Moderna com sombras</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="style-flat" value="material-design" />
                      <Label htmlFor="style-flat">Flat/Material Design</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="style-ios" value="ios" />
                      <Label htmlFor="style-ios">Inspirada em iOS</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="style-android" value="android" />
                      <Label htmlFor="style-android">Inspirada em Android</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="style-other" value="outro" />
                      <Label htmlFor="style-other">Outro</Label>
                    </div>
                  </div>
                </RadioGroup>
                
                {formData.visualStyle === "outro" && (
                  <div className="mt-4">
                    <Label htmlFor="visualStyleCustom">Especifique o estilo visual:</Label>
                    <Input 
                      id="visualStyleCustom"
                      value={formData.visualStyleCustom}
                      onChange={(e) => handleFormChange("visualStyleCustom", e.target.value)}
                      placeholder="Descreva o estilo visual"
                      className="mt-1"
                    />
                  </div>
                )}
                
                <h2 className="text-2xl font-bold">Tipo de Menu</h2>
                <RadioGroup value={formData.menuType} onValueChange={(value) => handleFormChange("menuType", value)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="menu-top" value="superior-fixo" />
                      <Label htmlFor="menu-top">Superior fixo</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="menu-sidebar" value="lateral-fixo" />
                      <Label htmlFor="menu-sidebar">Lateral fixo</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="menu-mobile" value="hamburger" />
                      <Label htmlFor="menu-mobile">Menu hamburguer (mobile)</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="menu-tabs" value="abas" />
                      <Label htmlFor="menu-tabs">Abas horizontais</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="menu-custom" value="personalizado" />
                      <Label htmlFor="menu-custom">Personalizado</Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem id="menu-other" value="outro" />
                      <Label htmlFor="menu-other">Outro</Label>
                    </div>
                  </div>
                </RadioGroup>
                
                {(formData.menuType === "outro" || formData.menuType === "personalizado") && (
                  <div className="mt-4">
                    <Label htmlFor="menuTypeCustom">Especifique o tipo de menu:</Label>
                    <Input 
                      id="menuTypeCustom"
                      value={formData.menuTypeCustom}
                      onChange={(e) => handleFormChange("menuTypeCustom", e.target.value)}
                      placeholder="Descreva o tipo de menu"
                      className="mt-1"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Switch 
                    id="has-landing-page" 
                    checked={formData.hasLandingPage}
                    onCheckedChange={(checked) => handleFormChange("hasLandingPage", checked)}
                  />
                  <Label htmlFor="has-landing-page">Landing Page</Label>
                </div>
                
                {formData.hasLandingPage && (
                  <div className="pl-5 border-l-2 border-gray-200 space-y-4">
                    <h3 className="text-xl font-semibold">Estrutura da Landing Page</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lp-hero"
                          checked={formData.landingPageStructure.includes("Hero")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("landingPageStructure", "Hero", checked === true)
                          }
                        />
                        <Label htmlFor="lp-hero">Hero</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lp-benefits"
                          checked={formData.landingPageStructure.includes("Benefícios")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("landingPageStructure", "Benefícios", checked === true)
                          }
                        />
                        <Label htmlFor="lp-benefits">Benefícios</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lp-testimonials"
                          checked={formData.landingPageStructure.includes("Depoimentos")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("landingPageStructure", "Depoimentos", checked === true)
                          }
                        />
                        <Label htmlFor="lp-testimonials">Depoimentos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lp-cta"
                          checked={formData.landingPageStructure.includes("CTA (Call to Action)")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("landingPageStructure", "CTA (Call to Action)", checked === true)
                          }
                        />
                        <Label htmlFor="lp-cta">CTA (Call to Action)</Label>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold">Elementos</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lp-video"
                          checked={formData.landingPageElements.includes("Vídeo")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("landingPageElements", "Vídeo", checked === true)
                          }
                        />
                        <Label htmlFor="lp-video">Vídeo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lp-form"
                          checked={formData.landingPageElements.includes("Formulário")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("landingPageElements", "Formulário", checked === true)
                          }
                        />
                        <Label htmlFor="lp-form">Formulário</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lp-animations"
                          checked={formData.landingPageElements.includes("Animações")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("landingPageElements", "Animações", checked === true)
                          }
                        />
                        <Label htmlFor="lp-animations">Animações</Label>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold">Estilo da Landing Page</h3>
                    <RadioGroup value={formData.landingPageStyle} onValueChange={(value) => handleFormChange("landingPageStyle", value)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 rounded-md border p-4">
                          <RadioGroupItem id="lp-style-modern" value="moderno" />
                          <Label htmlFor="lp-style-modern">Moderno</Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-md border p-4">
                          <RadioGroupItem id="lp-style-minimalist" value="minimalista" />
                          <Label htmlFor="lp-style-minimalist">Minimalista</Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-md border p-4">
                          <RadioGroupItem id="lp-style-corporate" value="corporativo" />
                          <Label htmlFor="lp-style-corporate">Corporativo</Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-md border p-4">
                          <RadioGroupItem id="lp-style-creative" value="criativo" />
                          <Label htmlFor="lp-style-creative">Criativo</Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-md border p-4">
                          <RadioGroupItem id="lp-style-other" value="outro" />
                          <Label htmlFor="lp-style-other">Outro</Label>
                        </div>
                      </div>
                    </RadioGroup>
                    
                    {formData.landingPageStyle === "outro" && (
                      <div className="mt-4">
                        <Label htmlFor="landingPageStyleCustom">Especifique o estilo da landing page:</Label>
                        <Input 
                          id="landingPageStyleCustom"
                          value={formData.landingPageStyleCustom}
                          onChange={(e) => handleFormChange("landingPageStyleCustom", e.target.value)}
                          placeholder="Descreva o estilo da landing page"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <h2 className="text-2xl font-bold">Login e Autenticação</h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="auth-email"
                      checked={formData.authTypes.includes("Email + Senha")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("authTypes", "Email + Senha", checked === true)
                      }
                    />
                    <Label htmlFor="auth-email">Email + Senha</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="auth-social"
                      checked={formData.authTypes.includes("Google | Facebook | GitHub | Apple")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("authTypes", "Google | Facebook | GitHub | Apple", checked === true)
                      }
                    />
                    <Label htmlFor="auth-social">Google | Facebook | GitHub | Apple</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="auth-2fa"
                      checked={formData.authTypes.includes("Autenticação em 2 etapas (2FA)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("authTypes", "Autenticação em 2 etapas (2FA)", checked === true)
                      }
                    />
                    <Label htmlFor="auth-2fa">Autenticação em 2 etapas (2FA)</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="authTypesCustom">Outros métodos de autenticação:</Label>
                  <Input 
                    id="authTypesCustom"
                    value={formData.authTypesCustom}
                    onChange={(e) => handleFormChange("authTypesCustom", e.target.value)}
                    placeholder="Descreva outros métodos de autenticação"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <Switch 
                    id="has-dashboard" 
                    checked={formData.hasDashboard}
                    onCheckedChange={(checked) => handleFormChange("hasDashboard", checked)}
                  />
                  <Label htmlFor="has-dashboard">Dashboard para Usuários Logados</Label>
                </div>
                
                {formData.hasDashboard && (
                  <div className="pl-5 border-l-2 border-gray-200 space-y-4">
                    <h3 className="text-xl font-semibold">Funcionalidades do Dashboard</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="dash-custom"
                          checked={formData.dashboardFeatures.includes("Personalizável")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("dashboardFeatures", "Personalizável", checked === true)
                          }
                        />
                        <Label htmlFor="dash-custom">Personalizável</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="dash-charts"
                          checked={formData.dashboardFeatures.includes("Gráficos e estatísticas")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("dashboardFeatures", "Gráficos e estatísticas", checked === true)
                          }
                        />
                        <Label htmlFor="dash-charts">Gráficos e estatísticas</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="dash-history"
                          checked={formData.dashboardFeatures.includes("Histórico de atividades")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("dashboardFeatures", "Histórico de atividades", checked === true)
                          }
                        />
                        <Label htmlFor="dash-history">Histórico de atividades</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="dash-theme"
                          checked={formData.dashboardFeatures.includes("Tema claro/escuro e responsivo")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("dashboardFeatures", "Tema claro/escuro e responsivo", checked === true)
                          }
                        />
                        <Label htmlFor="dash-theme">Tema claro/escuro e responsivo</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="dashboardFeaturesCustom">Outras funcionalidades do dashboard:</Label>
                      <Input 
                        id="dashboardFeaturesCustom"
                        value={formData.dashboardFeaturesCustom}
                        onChange={(e) => handleFormChange("dashboardFeaturesCustom", e.target.value)}
                        placeholder="Descreva outras funcionalidades do dashboard"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button onClick={handlePrevTab} variant="outline">Anterior</Button>
            <Button onClick={handleNextTab}>Próximo</Button>
          </div>
        </TabsContent>

        {/* Tab 4: Stack Tecnológica */}
        <TabsContent value="tech-stack" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Separação de Frontend e Backend?</h2>
                <div className="flex items-center space-x-3">
                  <Switch 
                    id="separate-frontend-backend" 
                    checked={formData.separateFrontendBackend}
                    onCheckedChange={(checked) => handleFormChange("separateFrontendBackend", checked)}
                  />
                  <Label htmlFor="separate-frontend-backend">
                    {formData.separateFrontendBackend ? 'Sim, separar Frontend e Backend' : 'Não, usar solução Fullstack integrada'}
                  </Label>
                </div>
                
                {formData.separateFrontendBackend ? (
                  <>
                    <h3 className="text-xl font-semibold">Frontend</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="fe-react"
                          checked={formData.frontend.includes("React")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("frontend", "React", checked === true)
                          }
                        />
                        <Label htmlFor="fe-react">React</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="fe-vue"
                          checked={formData.frontend.includes("Vue")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("frontend", "Vue", checked === true)
                          }
                        />
                        <Label htmlFor="fe-vue">Vue</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="fe-angular"
                          checked={formData.frontend.includes("Angular")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("frontend", "Angular", checked === true)
                          }
                        />
                        <Label htmlFor="fe-angular">Angular</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="fe-svelte"
                          checked={formData.frontend.includes("Svelte")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("frontend", "Svelte", checked === true)
                          }
                        />
                        <Label htmlFor="fe-svelte">Svelte</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="fe-next"
                          checked={formData.frontend.includes("Next.js")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("frontend", "Next.js", checked === true)
                          }
                        />
                        <Label htmlFor="fe-next">Next.js</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="fe-nuxt"
                          checked={formData.frontend.includes("Nuxt.js")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("frontend", "Nuxt.js", checked === true)
                          }
                        />
                        <Label htmlFor="fe-nuxt">Nuxt.js</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="frontendCustom">Outro framework frontend:</Label>
                      <Input 
                        id="frontendCustom"
                        value={formData.frontendCustom}
                        onChange={(e) => handleFormChange("frontendCustom", e.target.value)}
                        placeholder="Especifique outro framework"
                        className="mt-1"
                      />
                    </div>
                    
                    <h3 className="text-xl font-semibold">Backend</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="be-node"
                          checked={formData.backend.includes("Node.js")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("backend", "Node.js", checked === true)
                          }
                        />
                        <Label htmlFor="be-node">Node.js</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="be-django"
                          checked={formData.backend.includes("Django")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("backend", "Django", checked === true)
                          }
                        />
                        <Label htmlFor="be-django">Django</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="be-fastapi"
                          checked={formData.backend.includes("FastAPI")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("backend", "FastAPI", checked === true)
                          }
                        />
                        <Label htmlFor="be-fastapi">FastAPI</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="be-spring"
                          checked={formData.backend.includes("Spring")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("backend", "Spring", checked === true)
                          }
                        />
                        <Label htmlFor="be-spring">Spring</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="be-laravel"
                          checked={formData.backend.includes("Laravel")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("backend", "Laravel", checked === true)
                          }
                        />
                        <Label htmlFor="be-laravel">Laravel</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="be-rails"
                          checked={formData.backend.includes("Ruby on Rails")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("backend", "Ruby on Rails", checked === true)
                          }
                        />
                        <Label htmlFor="be-rails">Ruby on Rails</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="backendCustom">Outro framework backend:</Label>
                      <Input 
                        id="backendCustom"
                        value={formData.backendCustom}
                        onChange={(e) => handleFormChange("backendCustom", e.target.value)}
                        placeholder="Especifique outro framework"
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold">Fullstack Integrado</h3>
                    <RadioGroup value={formData.fullstack} onValueChange={(value) => handleFormChange("fullstack", value)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 rounded-md border p-4">
                          <RadioGroupItem id="fs-next" value="next.js" />
                          <Label htmlFor="fs-next">Next.js</Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-md border p-4">
                          <RadioGroupItem id="fs-nuxt" value="nuxt.js" />
                          <Label htmlFor="fs-nuxt">Nuxt.js</Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-md border p-4">
                          <RadioGroupItem id="fs-meteor" value="meteor" />
                          <Label htmlFor="fs-meteor">Meteor</Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-md border p-4">
                          <RadioGroupItem id="fs-remix" value="remix" />
                          <Label htmlFor="fs-remix">Remix</Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-md border p-4">
                          <RadioGroupItem id="fs-other" value="outro" />
                          <Label htmlFor="fs-other">Outro</Label>
                        </div>
                      </div>
                    </RadioGroup>
                    
                    {formData.fullstack === "outro" && (
                      <div className="mt-4">
                        <Label htmlFor="fullstackCustom">Especifique a framework fullstack:</Label>
                        <Input 
                          id="fullstackCustom"
                          value={formData.fullstackCustom}
                          onChange={(e) => handleFormChange("fullstackCustom", e.target.value)}
                          placeholder="Nome da framework"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </>
                )}
                
                <h2 className="text-2xl font-bold">Banco de Dados</h2>
                <Select value={formData.database} onValueChange={(value) => handleFormChange("database", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um banco de dados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="firebase">Firebase</SelectItem>
                    <SelectItem value="supabase">Supabase</SelectItem>
                    <SelectItem value="redis">Redis</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                
                {formData.database === "outro" && (
                  <div className="mt-4">
                    <Label htmlFor="databaseCustom">Especifique o banco de dados:</Label>
                    <Input 
                      id="databaseCustom"
                      value={formData.databaseCustom}
                      onChange={(e) => handleFormChange("databaseCustom", e.target.value)}
                      placeholder="Nome do banco de dados"
                      className="mt-1"
                    />
                  </div>
                )}
                
                <h2 className="text-2xl font-bold">ORM/ODM</h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="orm-prisma"
                      checked={formData.orm.includes("Prisma")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("orm", "Prisma", checked === true)
                      }
                    />
                    <Label htmlFor="orm-prisma">Prisma</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="orm-sequelize"
                      checked={formData.orm.includes("Sequelize")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("orm", "Sequelize", checked === true)
                      }
                    />
                    <Label htmlFor="orm-sequelize">Sequelize</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="orm-typeorm"
                      checked={formData.orm.includes("TypeORM")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("orm", "TypeORM", checked === true)
                      }
                    />
                    <Label htmlFor="orm-typeorm">TypeORM</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="orm-mongoose"
                      checked={formData.orm.includes("Mongoose")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("orm", "Mongoose", checked === true)
                      }
                    />
                    <Label htmlFor="orm-mongoose">Mongoose</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="orm-django"
                      checked={formData.orm.includes("Django ORM")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("orm", "Django ORM", checked === true)
                      }
                    />
                    <Label htmlFor="orm-django">Django ORM</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="orm-sqlalchemy"
                      checked={formData.orm.includes("SQLAlchemy")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("orm", "SQLAlchemy", checked === true)
                      }
                    />
                    <Label htmlFor="orm-sqlalchemy">SQLAlchemy</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="ormCustom">Outro ORM/ODM:</Label>
                  <Input 
                    id="ormCustom"
                    value={formData.ormCustom}
                    onChange={(e) => handleFormChange("ormCustom", e.target.value)}
                    placeholder="Especifique outro ORM/ODM"
                    className="mt-1"
                  />
                </div>
                
                <h2 className="text-2xl font-bold">Deploy / Infraestrutura</h2>
                <Select value={formData.deploy} onValueChange={(value) => handleFormChange("deploy", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção de deploy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vercel">Vercel</SelectItem>
                    <SelectItem value="netlify">Netlify</SelectItem>
                    <SelectItem value="heroku">Heroku</SelectItem>
                    <SelectItem value="railway">Railway</SelectItem>
                    <SelectItem value="aws">AWS</SelectItem>
                    <SelectItem value="gcp">Google Cloud</SelectItem>
                    <SelectItem value="digitalocean">DigitalOcean</SelectItem>
                    <SelectItem value="docker">Docker / Kubernetes</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                
                {formData.deploy === "outro" && (
                  <div className="mt-4">
                    <Label htmlFor="deployCustom">Especifique a opção de deploy:</Label>
                    <Input 
                      id="deployCustom"
                      value={formData.deployCustom}
                      onChange={(e) => handleFormChange("deployCustom", e.target.value)}
                      placeholder="Nome da opção de deploy"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button onClick={handlePrevTab} variant="outline">Anterior</Button>
            <Button onClick={handleNextTab}>Próximo</Button>
          </div>
        </TabsContent>

        {/* Tab 5: Segurança */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Requisitos de Segurança</h2>
                <p className="text-gray-600 dark:text-gray-400">Selecione os requisitos de segurança para o seu sistema</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sec-injections"
                        checked={formData.securityRequirements.includes("Proteção contra SQL Injection, XSS, CSRF")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("securityRequirements", "Proteção contra SQL Injection, XSS, CSRF", checked === true)
                        }
                      />
                      <Label htmlFor="sec-injections">Proteção contra SQL Injection, XSS, CSRF</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sec-auth"
                        checked={formData.securityRequirements.includes("Autenticação: JWT, OAuth2, 2FA")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("securityRequirements", "Autenticação: JWT, OAuth2, 2FA", checked === true)
                        }
                      />
                      <Label htmlFor="sec-auth">Autenticação: JWT, OAuth2, 2FA</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sec-https"
                        checked={formData.securityRequirements.includes("HTTPS (SSL/TLS), CSP, Helmet.js")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("securityRequirements", "HTTPS (SSL/TLS), CSP, Helmet.js", checked === true)
                        }
                      />
                      <Label htmlFor="sec-https">HTTPS (SSL/TLS), CSP, Helmet.js</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sec-logs"
                        checked={formData.securityRequirements.includes("Logs de auditoria, Rate limiting")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("securityRequirements", "Logs de auditoria, Rate limiting", checked === true)
                        }
                      />
                      <Label htmlFor="sec-logs">Logs de auditoria, Rate limiting</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sec-api"
                        checked={formData.securityRequirements.includes("Segurança para APIs públicas/privadas")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("securityRequirements", "Segurança para APIs públicas/privadas", checked === true)
                        }
                      />
                      <Label htmlFor="sec-api">Segurança para APIs públicas/privadas</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="securityRequirementsCustom">Outros requisitos de segurança:</Label>
                  <Input 
                    id="securityRequirementsCustom"
                    value={formData.securityRequirementsCustom}
                    onChange={(e) => handleFormChange("securityRequirementsCustom", e.target.value)}
                    placeholder="Especifique outros requisitos"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button onClick={handlePrevTab} variant="outline">Anterior</Button>
            <Button onClick={handleNextTab}>Próximo</Button>
          </div>
        </TabsContent>

        {/* Tab 6: Estrutura de Código */}
        <TabsContent value="code-structure" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Organização de Pastas</h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="folder-function"
                      checked={formData.folderStructure.includes("Por função (controllers/models/services)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("folderStructure", "Por função (controllers/models/services)", checked === true)
                      }
                    />
                    <Label htmlFor="folder-function">Por função (controllers/models/services)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="folder-domain"
                      checked={formData.folderStructure.includes("Por domínio (feature-based)")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("folderStructure", "Por domínio (feature-based)", checked === true)
                      }
                    />
                    <Label htmlFor="folder-domain">Por domínio (feature-based)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="folder-separation"
                      checked={formData.folderStructure.includes("Separação front/back")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("folderStructure", "Separação front/back", checked === true)
                      }
                    />
                    <Label htmlFor="folder-separation">Separação front/back</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="folder-di"
                      checked={formData.folderStructure.includes("Modular com injeção de dependência")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("folderStructure", "Modular com injeção de dependência", checked === true)
                      }
                    />
                    <Label htmlFor="folder-di">Modular com injeção de dependência</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="folderStructureCustom">Outra organização de pastas:</Label>
                  <Input 
                    id="folderStructureCustom"
                    value={formData.folderStructureCustom}
                    onChange={(e) => handleFormChange("folderStructureCustom", e.target.value)}
                    placeholder="Descreva outra organização"
                    className="mt-1"
                  />
                </div>
                
                <h2 className="text-2xl font-bold">Padrão Arquitetural</h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="arch-mvc"
                      checked={formData.architecturePattern.includes("MVC")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("architecturePattern", "MVC", checked === true)
                      }
                    />
                    <Label htmlFor="arch-mvc">MVC</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="arch-mvvm"
                      checked={formData.architecturePattern.includes("MVVM")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("architecturePattern", "MVVM", checked === true)
                      }
                    />
                    <Label htmlFor="arch-mvvm">MVVM</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="arch-clean"
                      checked={formData.architecturePattern.includes("Clean Architecture")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("architecturePattern", "Clean Architecture", checked === true)
                      }
                    />
                    <Label htmlFor="arch-clean">Clean Architecture</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="arch-ddd"
                      checked={formData.architecturePattern.includes("DDD")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("architecturePattern", "DDD", checked === true)
                      }
                    />
                    <Label htmlFor="arch-ddd">DDD</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="arch-hexagonal"
                      checked={formData.architecturePattern.includes("Hexagonal")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("architecturePattern", "Hexagonal", checked === true)
                      }
                    />
                    <Label htmlFor="arch-hexagonal">Hexagonal</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="architecturePatternCustom">Outro padrão arquitetural:</Label>
                  <Input 
                    id="architecturePatternCustom"
                    value={formData.architecturePatternCustom}
                    onChange={(e) => handleFormChange("architecturePatternCustom", e.target.value)}
                    placeholder="Descreva outro padrão"
                    className="mt-1"
                  />
                </div>
                
                <h2 className="text-2xl font-bold">Boas Práticas</h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prac-stateless"
                      checked={formData.bestPractices.includes("Stateless")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("bestPractices", "Stateless", checked === true)
                      }
                    />
                    <Label htmlFor="prac-stateless">Stateless</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prac-coupling"
                      checked={formData.bestPractices.includes("Baixo acoplamento")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("bestPractices", "Baixo acoplamento", checked === true)
                      }
                    />
                    <Label htmlFor="prac-coupling">Baixo acoplamento</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prac-tests"
                      checked={formData.bestPractices.includes("Testes: Unitários | Integração | E2E")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("bestPractices", "Testes: Unitários | Integração | E2E", checked === true)
                      }
                    />
                    <Label htmlFor="prac-tests">Testes: Unitários | Integração | E2E</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prac-components"
                      checked={formData.bestPractices.includes("Componentes reutilizáveis com interface única")}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("bestPractices", "Componentes reutilizáveis com interface única", checked === true)
                      }
                    />
                    <Label htmlFor="prac-components">Componentes reutilizáveis com interface única</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bestPracticesCustom">Outras boas práticas:</Label>
                  <Input 
                    id="bestPracticesCustom"
                    value={formData.bestPracticesCustom}
                    onChange={(e) => handleFormChange("bestPracticesCustom", e.target.value)}
                    placeholder="Descreva outras práticas"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button onClick={handlePrevTab} variant="outline">Anterior</Button>
            <Button onClick={handleNextTab}>Próximo</Button>
          </div>
        </TabsContent>

        {/* Tab 7: Escalabilidade e Performance */}
        <TabsContent value="scalability" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Escalabilidade</h2>
                <div className="flex items-center space-x-3">
                  <Switch 
                    id="needs-scalability" 
                    checked={formData.needsScalability}
                    onCheckedChange={(checked) => handleFormChange("needsScalability", checked)}
                  />
                  <Label htmlFor="needs-scalability">Sistema com alta demanda que precisa escalar</Label>
                </div>
                
                {formData.needsScalability && (
                  <div className="pl-5 border-l-2 border-gray-200 space-y-4">
                    <h3 className="text-xl font-semibold">Funcionalidades de Escalabilidade</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="scale-redis"
                          checked={formData.scalabilityFeatures.includes("Redis, CDN, Load Balancer")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("scalabilityFeatures", "Redis, CDN, Load Balancer", checked === true)
                          }
                        />
                        <Label htmlFor="scale-redis">Redis, CDN, Load Balancer</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="scale-cache"
                          checked={formData.scalabilityFeatures.includes("Cache dinâmico, Filas (RabbitMQ, Kafka)")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("scalabilityFeatures", "Cache dinâmico, Filas (RabbitMQ, Kafka)", checked === true)
                          }
                        />
                        <Label htmlFor="scale-cache">Cache dinâmico, Filas (RabbitMQ, Kafka)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="scale-auto"
                          checked={formData.scalabilityFeatures.includes("Auto Scaling, Monitoramento, Alta disponibilidade")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("scalabilityFeatures", "Auto Scaling, Monitoramento, Alta disponibilidade", checked === true)
                          }
                        />
                        <Label htmlFor="scale-auto">Auto Scaling, Monitoramento, Alta disponibilidade</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="scalabilityFeaturesCustom">Outras funcionalidades de escalabilidade:</Label>
                      <Input 
                        id="scalabilityFeaturesCustom"
                        value={formData.scalabilityFeaturesCustom}
                        onChange={(e) => handleFormChange("scalabilityFeaturesCustom", e.target.value)}
                        placeholder="Descreva outras funcionalidades"
                        className="mt-1"
                      />
                    </div>
                    
                    <h3 className="text-xl font-semibold">Otimização de Performance</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="perf-lazy"
                          checked={formData.performanceOptimizations.includes("Lazy loading, Code splitting")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("performanceOptimizations", "Lazy loading, Code splitting", checked === true)
                          }
                        />
                        <Label htmlFor="perf-lazy">Lazy loading, Code splitting</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="perf-minify"
                          checked={formData.performanceOptimizations.includes("Minificação, Gzip/Brotli")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("performanceOptimizations", "Minificação, Gzip/Brotli", checked === true)
                          }
                        />
                        <Label htmlFor="perf-minify">Minificação, Gzip/Brotli</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="perf-ssr"
                          checked={formData.performanceOptimizations.includes("SSR/SSG (Next.js/Nuxt.js)")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("performanceOptimizations", "SSR/SSG (Next.js/Nuxt.js)", checked === true)
                          }
                        />
                        <Label htmlFor="perf-ssr">SSR/SSG (Next.js/Nuxt.js)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="perf-optimize"
                          checked={formData.performanceOptimizations.includes("Otimização de imagens e JS/CSS")}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("performanceOptimizations", "Otimização de imagens e JS/CSS", checked === true)
                          }
                        />
                        <Label htmlFor="perf-optimize">Otimização de imagens e JS/CSS</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="performanceOptimizationsCustom">Outras otimizações de performance:</Label>
                      <Input 
                        id="performanceOptimizationsCustom"
                        value={formData.performanceOptimizationsCustom}
                        onChange={(e) => handleFormChange("performanceOptimizationsCustom", e.target.value)}
                        placeholder="Descreva outras otimizações"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button onClick={handlePrevTab} variant="outline">Anterior</Button>
            <Button onClick={handleNextTab}>Próximo</Button>
          </div>
        </TabsContent>

        {/* Tab 8: Restrições Técnicas */}
        <TabsContent value="restrictions" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Evitar no Código</h2>
                <p className="text-gray-600 dark:text-gray-400">Selecione práticas e padrões que devem ser evitados</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-eval"
                        checked={formData.codeRestrictions.includes("eval()")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("codeRestrictions", "eval()", checked === true)
                        }
                      />
                      <Label htmlFor="avoid-eval">eval()</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-global"
                        checked={formData.codeRestrictions.includes("Variáveis globais")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("codeRestrictions", "Variáveis globais", checked === true)
                        }
                      />
                      <Label htmlFor="avoid-global">Variáveis globais</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-callback"
                        checked={formData.codeRestrictions.includes("Callback Hell")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("codeRestrictions", "Callback Hell", checked === true)
                        }
                      />
                      <Label htmlFor="avoid-callback">Callback Hell</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-libs"
                        checked={formData.codeRestrictions.includes("Bibliotecas sem manutenção")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("codeRestrictions", "Bibliotecas sem manutenção", checked === true)
                        }
                      />
                      <Label htmlFor="avoid-libs">Bibliotecas sem manutenção</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-important"
                        checked={formData.codeRestrictions.includes("Uso excessivo de !important")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("codeRestrictions", "Uso excessivo de !important", checked === true)
                        }
                      />
                      <Label htmlFor="avoid-important">Uso excessivo de !important</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-prop"
                        checked={formData.codeRestrictions.includes("Dependências pagas/proprietárias")}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("codeRestrictions", "Dependências pagas/proprietárias", checked === true)
                        }
                      />
                      <Label htmlFor="avoid-prop">Dependências pagas/proprietárias</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="codeRestrictionsCustom">Outras restrições:</Label>
                  <Input 
                    id="codeRestrictionsCustom"
                    value={formData.codeRestrictionsCustom}
                    onChange={(e) => handleFormChange("codeRestrictionsCustom", e.target.value)}
                    placeholder="Especifique outras restrições"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button onClick={handlePrevTab} variant="outline">Anterior</Button>
            <Button onClick={handleNextTab}>Próximo</Button>
          </div>
        </TabsContent>

        {/* Tab 9: Geração e Edição do Prompt */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Seu Prompt Gerado</h2>
                
                <div className="flex justify-end mb-2">
                  <Button 
                    onClick={handleCopyPrompt} 
                    className="flex items-center gap-1"
                    variant="outline"
                    aria-label="Copiar prompt"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-4 w-4" aria-hidden="true" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 border rounded-md p-4 font-mono text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                  {generatedPrompt || "Clique em 'Copiar' para gerar o prompt baseado nas suas escolhas."}
                </div>
                
                <h2 className="text-2xl font-bold mt-8">Editar Prompt</h2>
                <Textarea 
                  value={generatedPrompt}
                  onChange={(e) => setGeneratedPrompt(e.target.value)}
                  className="min-h-[300px] font-mono"
                  placeholder="Edite o prompt gerado conforme necessário"
                />
                
                {user && promptHistory.length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold mt-8">Histórico de Prompts</h2>
                    <div className="space-y-4">
                      {promptHistory.map((item) => (
                        <div key={item.id} className="border rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">{item.systemType}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{item.prompt.substring(0, 150)}...</p>
                          <div className="flex gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setGeneratedPrompt(item.prompt)}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(item.prompt);
                                  toast({
                                    title: "Copiado!",
                                    description: "Prompt copiado para a área de transferência.",
                                  });
                                } catch (err) {
                                  toast({
                                    title: "Erro ao copiar",
                                    description: "Não foi possível copiar o prompt.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              Copiar
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setPromptHistory(prev => prev.filter(p => p.id !== item.id));
                              }}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {!user && (
                  <div className="flex items-center p-4 mt-4 text-amber-800 bg-amber-50 dark:bg-amber-950 dark:text-amber-200 rounded-md">
                    <AlertCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                    <p>Faça login para salvar seu histórico de prompts.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button onClick={handlePrevTab} variant="outline">Anterior</Button>
            <Button disabled>Finalizar</Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Use este gerador para criar prompts de software para IA</p>
      </div>
    </div>
  );
};

export default PromptGenerator;
