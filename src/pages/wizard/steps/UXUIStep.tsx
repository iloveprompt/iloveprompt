import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ColorSwatch, HexColorPicker } from '../components/ColorPicker';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save, CheckCircle as CheckCircleIcon, ListPlus, PlusCircle, Trash2, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AIAssistantPanel from '../components/AIAssistantPanel';
import uxuiData from '../data/uxuiData.json';

interface UXUIFormData {
  colorPalette: string[];
  customColors: string[];
  visualStyle: string;
  otherVisualStyles: string[];
  menuType: string;
  otherMenuTypes: string[];
  landingPage: boolean;
  landingPageDetails: {
    structure: {
      hero: boolean;
      benefits: boolean;
      testimonials: boolean;
      cta: boolean;
      other: boolean;
      otherValues: string[];
    };
    elements: {
      video: boolean;
      form: boolean;
      animations: boolean;
      other: boolean;
      otherValues: string[];
    };
    style: {
      modern: boolean;
      minimalist: boolean;
      corporate: boolean;
      creative: boolean;
      other: boolean;
      otherValues: string[];
    };
  };
  authentication: string[];
  otherAuthMethods: string[];
  userDashboard: boolean;
  userDashboardDetails: {
    features: string[];
    otherDashboardFeatures: string[];
  };
}

interface UXUIStepProps {
  formData: UXUIFormData;
  updateFormData: (data: Partial<UXUIFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

// Componente responsável por exibir e gerenciar as opções de UX/UI do wizard
// Importação dos hooks e componentes necessários do React e do projeto
const UXUIStep: React.FC<UXUIStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  // Hook de tradução para internacionalização
  const { t } = useLanguage();
  // Define quantos itens aparecem por página nas listas
  const itemsPerPage = 6; 
  const LP_ITEMS_PER_PAGE = 4;
  // Estado para controlar a abertura do painel de IA
  const [aiOpen, setAIOpen] = useState(false);

  // Estados para controle dos seletores de cores customizadas
  const [customColorPickers, setCustomColorPickers] = useState<string[]>(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
  const [activeColorPickerIndex, setActiveColorPickerIndex] = useState<number | null>(null);

  // Estados para paginação e popover dos estilos visuais
  const [currentPageVisualStyle, setCurrentPageVisualStyle] = useState(0);
  const [isOtherVisualStylePopoverOpen, setIsOtherVisualStylePopoverOpen] = useState(false);
  const [currentOtherVisualStyleInput, setCurrentOtherVisualStyleInput] = useState('');
  const [tempOtherVisualStylesList, setTempOtherVisualStylesList] = useState<string[]>([]);

  // Estados para paginação e popover dos tipos de menu
  const [currentPageMenuType, setCurrentPageMenuType] = useState(0);
  const [isOtherMenuTypePopoverOpen, setIsOtherMenuTypePopoverOpen] = useState(false);
  const [currentOtherMenuTypeInput, setCurrentOtherMenuTypeInput] = useState('');
  const [tempOtherMenuTypesList, setTempOtherMenuTypesList] = useState<string[]>([]);
  
  // Estados para paginação e popover dos métodos de autenticação
  const [currentPageAuth, setCurrentPageAuth] = useState(0);
  const [isOtherAuthPopoverOpen, setIsOtherAuthPopoverOpen] = useState(false);
  const [currentOtherAuthInput, setCurrentOtherAuthInput] = useState('');
  const [tempOtherAuthList, setTempOtherAuthList] = useState<string[]>([]);
  
  // Estados para paginação e popover das funcionalidades do dashboard
  const [currentPageDashboard, setCurrentPageDashboard] = useState(0);
  const [isOtherDashboardFeaturePopoverOpen, setIsOtherDashboardFeaturePopoverOpen] = useState(false);
  const [currentOtherDashboardFeatureInput, setCurrentOtherDashboardFeatureInput] = useState('');
  const [tempOtherDashboardFeaturesList, setTempOtherDashboardFeaturesList] = useState<string[]>([]);

  // Opções pré-definidas para estrutura da landing page
  const lpStructureOptions = [
    { key: 'hero', i18nKey: 'promptGenerator.uxui.structureItems.hero', defaultText: 'Seção Principal' },
    { key: 'benefits', i18nKey: 'promptGenerator.uxui.structureItems.benefits', defaultText: 'Benefícios/Funcionalidades' },
    { key: 'testimonials', i18nKey: 'promptGenerator.uxui.structureItems.testimonials', defaultText: 'Depoimentos' },
    { key: 'cta', i18nKey: 'promptGenerator.uxui.structureItems.cta', defaultText: 'Chamada para Ação' },
  ];
  // Estados para paginação e popover dos itens de estrutura da landing page
  const [currentPageLpStructure, setCurrentPageLpStructure] = useState(0);
  const [isOtherLpStructurePopoverOpen, setIsOtherLpStructurePopoverOpen] = useState(false);
  const [currentOtherLpStructureInput, setCurrentOtherLpStructureInput] = useState('');
  const [tempOtherLpStructureList, setTempOtherLpStructureList] = useState<string[]>([]);

  // Estados para armazenar as opções carregadas do arquivo uxuiData.json
  const [dashboardFeaturesOptions, setDashboardFeaturesOptions] = useState<any[]>([]);
  // Estados de carregamento e erro
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para carregar as opções do arquivo uxuiData.json ao montar o componente
  useEffect(() => {
    try {
      if (Array.isArray(uxuiData)) {
        const dashboardFeatures = uxuiData.filter((item: any) => item.category === 'dashboardFeatures');
        setDashboardFeaturesOptions(dashboardFeatures);
      }
      setLoading(false);
    } catch (e) {
      console.error('Erro ao carregar opções de UX/UI:', e);
      setError('Erro ao carregar opções de UX/UI');
      setLoading(false);
    }
  }, []);

  // useEffect para atualizar a lista temporária de outros itens de estrutura da landing page quando o popover abre ou os dados mudam
  useEffect(() => {
    setTempOtherLpStructureList(formData.landingPageDetails.structure.otherValues || []);
  }, [formData.landingPageDetails.structure.otherValues, isOtherLpStructurePopoverOpen]);

  // Função para adicionar um novo item "outro" na estrutura da landing page
  const handleAddOtherLpStructure = () => {
    if (currentOtherLpStructureInput.trim() && tempOtherLpStructureList.length < 10) {
      setTempOtherLpStructureList([...tempOtherLpStructureList, currentOtherLpStructureInput.trim()]);
      setCurrentOtherLpStructureInput('');
    }
  };

  // Função para remover um item "outro" da estrutura da landing page
  const handleRemoveOtherLpStructure = (index: number) => {
    setTempOtherLpStructureList(tempOtherLpStructureList.filter((_, i) => i !== index));
  };

  // Função para salvar os itens "outros" na estrutura da landing page
  const handleSaveOtherLpStructure = () => {
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        structure: {
          ...formData.landingPageDetails.structure,
          otherValues: [...tempOtherLpStructureList],
          other: tempOtherLpStructureList.length > 0 
        }
      }
    });
    setIsOtherLpStructurePopoverOpen(false);
  };
  
  const toggleSelectAllLpStructure = () => {
    const allPredefinedKeys = lpStructureOptions.map(opt => opt.key);
    const allSelected = allPredefinedKeys.every(key => !!formData.landingPageDetails.structure[key as keyof Omit<typeof formData.landingPageDetails.structure, 'other' | 'otherValues'>]);
    
    const { other, otherValues, ...structureBooleans } = formData.landingPageDetails.structure;
    const newStructureState: any = { ...structureBooleans };
    lpStructureOptions.forEach(opt => {
      newStructureState[opt.key as keyof typeof structureBooleans] = !allSelected;
    });
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        structure: {
          ...newStructureState,
          other: Boolean(other),
          otherValues: Array.isArray(otherValues) ? otherValues : [],
        }
      }
    });
  };
    
  const allLpStructureSelected = lpStructureOptions.every(opt => !!formData.landingPageDetails.structure[opt.key as keyof Omit<typeof formData.landingPageDetails.structure, 'other' | 'otherValues'>]);

  // Opções pré-definidas para elementos da landing page
  const lpElementOptions = [
    { key: 'video', i18nKey: 'promptGenerator.uxui.elementsItems.video', defaultText: 'Vídeo/Animação' },
    { key: 'form', i18nKey: 'promptGenerator.uxui.elementsItems.form', defaultText: 'Formulário de Contato' },
    { key: 'animations', i18nKey: 'promptGenerator.uxui.elementsItems.animations', defaultText: 'Elementos Interativos' },
  ];
  // Estados para paginação e popover dos elementos da landing page
  const [currentPageLpElements, setCurrentPageLpElements] = useState(0);
  const [isOtherLpElementsPopoverOpen, setIsOtherLpElementsPopoverOpen] = useState(false);
  const [currentOtherLpElementsInput, setCurrentOtherLpElementsInput] = useState('');
  const [tempOtherLpElementsList, setTempOtherLpElementsList] = useState<string[]>([]);

  // useEffect para atualizar a lista temporária de outros elementos quando o popover abre ou os dados mudam
  useEffect(() => {
    setTempOtherLpElementsList(formData.landingPageDetails.elements.otherValues || []);
  }, [formData.landingPageDetails.elements.otherValues, isOtherLpElementsPopoverOpen]);

  // Função para adicionar um novo elemento "outro" na landing page
  const handleAddOtherLpElement = () => {
    if (currentOtherLpElementsInput.trim() && tempOtherLpElementsList.length < 10) {
      setTempOtherLpElementsList([...tempOtherLpElementsList, currentOtherLpElementsInput.trim()]);
      setCurrentOtherLpElementsInput('');
    }
  };

  const handleRemoveOtherLpElement = (index: number) => {
    setTempOtherLpElementsList(tempOtherLpElementsList.filter((_, i) => i !== index));
  };

  const handleSaveOtherLpElements = () => {
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        elements: {
          ...formData.landingPageDetails.elements,
          otherValues: [...tempOtherLpElementsList],
          other: tempOtherLpElementsList.length > 0
        }
      }
    });
    setIsOtherLpElementsPopoverOpen(false);
  };
  
  const toggleSelectAllLpElements = () => {
    const allPredefinedKeys = lpElementOptions.map(opt => opt.key);
    const allSelected = allPredefinedKeys.every(key => !!formData.landingPageDetails.elements[key as keyof Omit<typeof formData.landingPageDetails.elements, 'other' | 'otherValues'>]);
    
    const newElementsState = { ...formData.landingPageDetails.elements };
    allPredefinedKeys.forEach(key => {
        newElementsState[key as keyof Omit<typeof formData.landingPageDetails.elements, 'other' | 'otherValues'>] = !allSelected;
    });
    
    updateFormData({
      landingPageDetails: { ...formData.landingPageDetails, elements: newElementsState }
    });
  };

  const allLpElementsSelected = lpElementOptions.every(opt => !!formData.landingPageDetails.elements[opt.key as keyof Omit<typeof formData.landingPageDetails.elements, 'other' | 'otherValues'>]);
  
  // --- End of Landing Page Elements ---

  const lpStyleOptions = [
    { key: 'modern', i18nKey: 'promptGenerator.uxui.styleItems.modern', defaultText: 'Moderno' },
    { key: 'minimalist', i18nKey: 'promptGenerator.uxui.styleItems.minimalist', defaultText: 'Minimalista' },
    { key: 'corporate', i18nKey: 'promptGenerator.uxui.styleItems.corporate', defaultText: 'Corporativo' },
    { key: 'creative', i18nKey: 'promptGenerator.uxui.styleItems.creative', defaultText: 'Criativo' },
  ];
  const [currentPageLpStyle, setCurrentPageLpStyle] = useState(0);
  const [isOtherLpStylePopoverOpen, setIsOtherLpStylePopoverOpen] = useState(false);
  const [currentOtherLpStyleInput, setCurrentOtherLpStyleInput] = useState('');
  const [tempOtherLpStyleList, setTempOtherLpStyleList] = useState<string[]>([]);

  useEffect(() => {
    setTempOtherLpStyleList(formData.landingPageDetails.style.otherValues || []);
  }, [formData.landingPageDetails.style.otherValues, isOtherLpStylePopoverOpen]);

  const handleAddOtherLpStyle = () => {
    if (currentOtherLpStyleInput.trim() && tempOtherLpStyleList.length < 10) {
      setTempOtherLpStyleList([...tempOtherLpStyleList, currentOtherLpStyleInput.trim()]);
      setCurrentOtherLpStyleInput('');
    }
  };

  const handleRemoveOtherLpStyle = (index: number) => {
    setTempOtherLpStyleList(tempOtherLpStyleList.filter((_, i) => i !== index));
  };

  const handleSaveOtherLpStyles = () => {
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        style: {
          ...formData.landingPageDetails.style,
          otherValues: [...tempOtherLpStyleList],
          other: tempOtherLpStyleList.length > 0
        }
      }
    });
    setIsOtherLpStylePopoverOpen(false);
  };

  const toggleSelectAllLpStyles = () => {
    const allPredefinedKeys = lpStyleOptions.map(opt => opt.key);
    const allSelected = allPredefinedKeys.every(key => !!formData.landingPageDetails.style[key as keyof Omit<typeof formData.landingPageDetails.style, 'other' | 'otherValues'>]);

    const newStyleState = { ...formData.landingPageDetails.style };
    allPredefinedKeys.forEach(key => {
        newStyleState[key as keyof Omit<typeof formData.landingPageDetails.style, 'other' | 'otherValues'>] = !allSelected;
    });

    updateFormData({
      landingPageDetails: { ...formData.landingPageDetails, style: newStyleState }
    });
  };

  const allLpStylesSelected = lpStyleOptions.every(opt => !!formData.landingPageDetails.style[opt.key as keyof Omit<typeof formData.landingPageDetails.style, 'other' | 'otherValues'>]);

  // --- End of Landing Page Style ---

  const formatKeyAsFallback = (key: string, prefix: string = 'promptGenerator.uxui.') => {
    const cleanKey = key.startsWith(prefix) ? key.substring(prefix.length) : key;
    return cleanKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const colorPalettes = {
    vibrantModern: {
      title: t('promptGenerator.uxui.palettes.vibrantModern.title'),
      palettes: [
        { name: t('promptGenerator.uxui.palettes.vibrantModern.techInnovation.name'), colors: ["#007BFF", "#DCFCE7", "#FFFFFF", "#343A40"], value: "techInnovation" },
        { name: t('promptGenerator.uxui.palettes.vibrantModern.creativityDesign.name'), colors: ["#FF8C00", "#00CED1", "#F5F5DC", "#6C757D"], value: "creativityDesign" },
        { name: t('promptGenerator.uxui.palettes.vibrantModern.healthWellness.name'), colors: ["#FF69B4", "#98FB98", "#FFFFFF", "#E0E0E0"], value: "healthWellness" },
        { name: t('promptGenerator.uxui.palettes.vibrantModern.foodGastronomy.name'), colors: ["#E53935", "#FFDA63", "#FFF8DC", "#4A3B31"], value: "foodGastronomy" },
        { name: t('promptGenerator.uxui.palettes.vibrantModern.educationLearning.name'), colors: ["#4169E1", "#FFA500", "#FFFFFF", "#708090"], value: "educationLearning" },
      ]
    },
    calmProfessional: {
      title: t('promptGenerator.uxui.palettes.calmProfessional.title'),
      palettes: [
        { name: t('promptGenerator.uxui.palettes.calmProfessional.corporateFinance.name'), colors: ["#001F3F", "#B8860B", "#FFFFFF", "#808080"], value: "corporateFinance" },
        { name: t('promptGenerator.uxui.palettes.calmProfessional.legalConsulting.name'), colors: ["#556B2F", "#F0E68C", "#FFFFFF", "#434A54"], value: "legalConsulting" },
        { name: t('promptGenerator.uxui.palettes.calmProfessional.newsInformation.name'), colors: ["#000000", "#30475E", "#FFFFFF", "#D3D3D3"], value: "newsInformation" },
        { name: t('promptGenerator.uxui.palettes.calmProfessional.portfolioPersonal.name'), colors: ["#9966CC", "#8FBC8F", "#FFFFFF", "#555555"], value: "portfolioPersonal" },
        { name: t('promptGenerator.uxui.palettes.calmProfessional.realEstate.name'), colors: ["#4682B4", "#F5DEB3", "#FFFFFF", "#8B4513"], value: "realEstate" },
      ]
    },
    subtleElegant: {
      title: t('promptGenerator.uxui.palettes.subtleElegant.title'),
      palettes: [
        { name: t('promptGenerator.uxui.palettes.subtleElegant.fashionLuxury.name'), colors: ["#FFE4E1", "#FFDAB9", "#FFFFFF", "#36454F"], value: "fashionLuxury" },
        { name: t('promptGenerator.uxui.palettes.subtleElegant.artCulture.name'), colors: ["#E2725B", "#ADD8E6", "#FAEBD7", "#704214"], value: "artCulture" },
        { name: t('promptGenerator.uxui.palettes.subtleElegant.minimalism.name'), colors: ["#808080", "#ADD8E6", "#FFFFFF", "#000000"], value: "minimalism" },
        { name: t('promptGenerator.uxui.palettes.subtleElegant.natureSustainability.name'), colors: ["#8FBC8F", "#F4A460", "#FAF0E6", "#228B22"], value: "natureSustainability" },
        { name: t('promptGenerator.uxui.palettes.subtleElegant.travelAdventure.name'), colors: ["#40E0D0", "#F4A460", "#FFFFFF", "#4A4A4A"], value: "travelAdventure" },
      ]
    },
    themed: {
      title: t('promptGenerator.uxui.palettes.themed.title'),
      palettes: [
        { name: t('promptGenerator.uxui.palettes.themed.kidsToys.name'), colors: ["#FFFF00", "#87CEEB", "#FFFFFF", "#FF0000"], value: "kidsToys" },
        { name: t('promptGenerator.uxui.palettes.themed.musicEntertainment.name'), colors: ["#8A2BE2", "#FF69B4", "#000000", "#333333"], value: "musicEntertainment" },
        { name: t('promptGenerator.uxui.palettes.themed.sportsFitness.name'), colors: ["#FF4500", "#007BFF", "#FFFFFF", "#696969"], value: "sportsFitness" },
        { name: t('promptGenerator.uxui.palettes.themed.weddingEvents.name'), colors: ["#FFC0CB", "#FFD700", "#FFFFFF", "#C0C0C0"], value: "weddingEvents" },
        { name: t('promptGenerator.uxui.palettes.themed.communityNGO.name'), colors: ["#1ABC9C", "#F39C12", "#FFFFFF", "#7F8C8D"], value: "communityNGO" },
      ]
    }
  };

  const handleLandingPageCheckboxChange = (
    category: 'structure' | 'elements' | 'style',
    itemKey: string,
    isChecked: boolean
  ) => {
    const currentCategory = formData.landingPageDetails[category] || {};
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        [category]: {
          ...currentCategory,
          [itemKey]: isChecked,
        },
      },
    });
  };
  
  const handleDashboardFeatureChange = (value: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...formData.userDashboardDetails.features, value]
      : formData.userDashboardDetails.features.filter(id => id !== value);
    updateFormData({ userDashboardDetails: { ...formData.userDashboardDetails, features: updatedFeatures } });
  };

  const handleReset = () => {
    resetStep();
    setCurrentPageVisualStyle(0); setIsOtherVisualStylePopoverOpen(false); setCurrentOtherVisualStyleInput(''); setTempOtherVisualStylesList([]);
    setCurrentPageMenuType(0); setIsOtherMenuTypePopoverOpen(false); setCurrentOtherMenuTypeInput(''); setTempOtherMenuTypesList([]);
    setCurrentPageAuth(0); setIsOtherAuthPopoverOpen(false); setCurrentOtherAuthInput(''); setTempOtherAuthList([]);
    setCurrentPageDashboard(0); setIsOtherDashboardFeaturePopoverOpen(false); setCurrentOtherDashboardFeatureInput(''); setTempOtherDashboardFeaturesList([]);
    setCurrentPageLpStructure(0); setIsOtherLpStructurePopoverOpen(false); setCurrentOtherLpStructureInput(''); setTempOtherLpStructureList(formData.landingPageDetails.structure.otherValues || []);
    setCurrentPageLpElements(0); setIsOtherLpElementsPopoverOpen(false); setCurrentOtherLpElementsInput(''); setTempOtherLpElementsList(formData.landingPageDetails.elements.otherValues || []);
    setCurrentPageLpStyle(0); setIsOtherLpStylePopoverOpen(false); setCurrentOtherLpStyleInput(''); setTempOtherLpStyleList(formData.landingPageDetails.style.otherValues || []);
  };

  const handleSaveAndFinalize = () => {
    const otherVisualStylesCount = Array.isArray(formData.otherVisualStyles) ? formData.otherVisualStyles.length : 0;
    const otherMenuTypesCount = Array.isArray(formData.otherMenuTypes) ? formData.otherMenuTypes.length : 0;
    const otherAuthMethodsCount = Array.isArray(formData.otherAuthMethods) ? formData.otherAuthMethods.length : 0;
    const otherDashboardFeaturesCount = Array.isArray(formData.userDashboardDetails.otherDashboardFeatures) ? formData.userDashboardDetails.otherDashboardFeatures.length : 0;

    const isColorPaletteSelected = formData.colorPalette.length > 0;
    const isCustomPaletteValid = formData.colorPalette.includes('custom') && formData.customColors.every(color => /^#[0-9A-Fa-f]{6}$/i.test(color));
    const isAnyPaletteSelected = isColorPaletteSelected && (formData.colorPalette.includes('custom') ? isCustomPaletteValid : true);

    if (!isAnyPaletteSelected &&
        (!formData.visualStyle || (formData.visualStyle === 'other' && otherVisualStylesCount === 0)) &&
        (!formData.menuType || (formData.menuType === 'other' && otherMenuTypesCount === 0)) &&
        !formData.landingPage &&
        (formData.authentication.filter(a => a !== 'otherAuthMethod').length === 0 && otherAuthMethodsCount === 0) &&
        (!formData.userDashboard || (formData.userDashboardDetails.features.filter(f => f !== 'otherDashboardFeature').length === 0 && otherDashboardFeaturesCount === 0))
    ) {
      alert(t('promptGenerator.uxui.atLeastOnePreferenceError'));
      return;
    }
    markAsFinalized();
  };

  const handleCustomColorChange = (index: number, color: string) => {
    const newCustomColors = [...customColorPickers];
    newCustomColors[index] = color;
    setCustomColorPickers(newCustomColors);
    if (formData.colorPalette.includes('custom')) {
      updateFormData({ customColors: newCustomColors });
    }
  };

  useEffect(() => {
    if (formData.colorPalette.includes('custom') && formData.customColors && formData.customColors.length === 4) {
      setCustomColorPickers(formData.customColors);
    } else {
      setCustomColorPickers(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
    }
  }, [formData.colorPalette, formData.customColors]);

  useEffect(() => {
    if (isOtherVisualStylePopoverOpen) setTempOtherVisualStylesList(Array.isArray(formData.otherVisualStyles) ? formData.otherVisualStyles : []);
  }, [isOtherVisualStylePopoverOpen, formData.otherVisualStyles]);
  const handleAddOtherVisualStyle = () => {
    if (currentOtherVisualStyleInput.trim() && tempOtherVisualStylesList.length < 10) {
      setTempOtherVisualStylesList([...tempOtherVisualStylesList, currentOtherVisualStyleInput.trim()]);
      setCurrentOtherVisualStyleInput('');
    }
  };
  const handleRemoveOtherVisualStyle = (index: number) => setTempOtherVisualStylesList(tempOtherVisualStylesList.filter((_, i) => i !== index));
  const handleSaveOtherVisualStyles = () => {
    updateFormData({ otherVisualStyles: tempOtherVisualStylesList, visualStyle: tempOtherVisualStylesList.length > 0 ? 'other' : (formData.visualStyle === 'other' ? '' : formData.visualStyle) });
    setIsOtherVisualStylePopoverOpen(false);
  };

  useEffect(() => {
    if (isOtherMenuTypePopoverOpen) setTempOtherMenuTypesList(Array.isArray(formData.otherMenuTypes) ? formData.otherMenuTypes : []);
  }, [isOtherMenuTypePopoverOpen, formData.otherMenuTypes]);
  const handleAddOtherMenuType = () => {
    if (currentOtherMenuTypeInput.trim() && tempOtherMenuTypesList.length < 10) {
      setTempOtherMenuTypesList([...tempOtherMenuTypesList, currentOtherMenuTypeInput.trim()]);
      setCurrentOtherMenuTypeInput('');
    }
  };
  const handleRemoveOtherMenuType = (index: number) => setTempOtherMenuTypesList(tempOtherMenuTypesList.filter((_, i) => i !== index));
  const handleSaveOtherMenuTypes = () => {
    updateFormData({ otherMenuTypes: tempOtherMenuTypesList, menuType: tempOtherMenuTypesList.length > 0 ? 'other' : (formData.menuType === 'other' ? '' : formData.menuType) });
    setIsOtherMenuTypePopoverOpen(false);
  };
  
  useEffect(() => {
    if (isOtherAuthPopoverOpen) setTempOtherAuthList(Array.isArray(formData.otherAuthMethods) ? formData.otherAuthMethods : []);
  }, [isOtherAuthPopoverOpen, formData.otherAuthMethods]);
  const handleAddOtherAuth = () => {
    if (currentOtherAuthInput.trim() && tempOtherAuthList.length < 10) {
      setTempOtherAuthList([...tempOtherAuthList, currentOtherAuthInput.trim()]);
      setCurrentOtherAuthInput('');
    }
  };
  const handleRemoveOtherAuth = (index: number) => setTempOtherAuthList(tempOtherAuthList.filter((_, i) => i !== index));
  const handleSaveOtherAuths = () => {
    const preDefinedSelectedAuth = formData.authentication.filter(a => authOptions.find(opt => opt.value === a));
    const newAuthenticationItems = Array.from(new Set([...preDefinedSelectedAuth, ...tempOtherAuthList]));
    updateFormData({ 
      otherAuthMethods: [...tempOtherAuthList], 
      authentication: newAuthenticationItems 
    });
    setIsOtherAuthPopoverOpen(false);
  };

  useEffect(() => {
    if (isOtherDashboardFeaturePopoverOpen) setTempOtherDashboardFeaturesList(Array.isArray(formData.userDashboardDetails.otherDashboardFeatures) ? formData.userDashboardDetails.otherDashboardFeatures : []);
  }, [isOtherDashboardFeaturePopoverOpen, formData.userDashboardDetails.otherDashboardFeatures]);
  const handleAddOtherDashboardFeature = () => {
    if (currentOtherDashboardFeatureInput.trim() && tempOtherDashboardFeaturesList.length < 10) {
      setTempOtherDashboardFeaturesList([...tempOtherDashboardFeaturesList, currentOtherDashboardFeatureInput.trim()]);
      setCurrentOtherDashboardFeatureInput('');
    }
  };
  const handleRemoveOtherDashboardFeature = (index: number) => setTempOtherDashboardFeaturesList(tempOtherDashboardFeaturesList.filter((_, i) => i !== index));
  const handleSaveOtherDashboardFeatures = () => {
    const preDefinedSelectedFeatures = formData.userDashboardDetails.features.filter(f => dashboardFeaturesOptions.find(opt => opt.value === f));
    const newDashboardFeatures = Array.from(new Set([...preDefinedSelectedFeatures, ...tempOtherDashboardFeaturesList]));
    updateFormData({
      userDashboardDetails: {
        ...formData.userDashboardDetails,
        otherDashboardFeatures: [...tempOtherDashboardFeaturesList], 
        features: newDashboardFeatures,
      },
    });
    setIsOtherDashboardFeaturePopoverOpen(false);
  };

  const totalPagesDashboard = Math.ceil(dashboardFeaturesOptions.length / itemsPerPage);
  const currentDashboardFeaturesToDisplay = dashboardFeaturesOptions.slice(currentPageDashboard * itemsPerPage, (currentPageDashboard + 1) * itemsPerPage);
  const toggleSelectAllDashboardFeatures = () => {
    const allOptionIds = dashboardFeaturesOptions.map(opt => opt.value);
    const allSelectedCurrently = allOptionIds.every(id => formData.userDashboardDetails.features.includes(id));

    if (allSelectedCurrently) {
      updateFormData({ 
        userDashboardDetails: { 
          ...formData.userDashboardDetails, 
          features: formData.userDashboardDetails.features.filter(feat => !allOptionIds.includes(feat)) 
        } 
      });
    } else {
      updateFormData({ 
        userDashboardDetails: { 
          ...formData.userDashboardDetails, 
          features: Array.from(new Set([...formData.userDashboardDetails.features, ...allOptionIds])) 
        } 
      });
    }
  };
  const allDashboardFeaturesSelected = dashboardFeaturesOptions.length > 0 && dashboardFeaturesOptions.every(opt => (formData.userDashboardDetails?.features || []).includes(opt.value));

  const handlePaletteSelection = (palette: { value: string, colors: string[] }) => {
    const isSelected = formData.colorPalette.includes(palette.value);
    let updatedPalette;
    if (isSelected) {
      updatedPalette = formData.colorPalette.filter(p => p !== palette.value);
      updateFormData({ colorPalette: updatedPalette, customColors: [] });
    } else {
      updatedPalette = [palette.value];
      if (formData.colorPalette.includes('custom')) {
        updatedPalette = updatedPalette.filter(p => p !== 'custom');
      }
      updateFormData({ 
        colorPalette: updatedPalette, 
        customColors: palette.colors 
      });
    }
  };

  const handleApplyCustomColors = () => {
    const allColorsValid = customColorPickers.every(color => /^#[0-9A-Fa-f]{6}$/i.test(color));
    if (!allColorsValid) {
      alert(t('promptGenerator.uxui.invalidColorsError') || 'Por favor, insira cores válidas em formato hexadecimal (#RRGGBB)');
      return;
    }
    updateFormData({ 
      colorPalette: ['custom'],
      customColors: [...customColorPickers]
    });
  };

  // Adicionando função para marcar/desmarcar todos os itens da landing page
  const toggleSelectAllLandingPageItems = () => {
    const allSelected = lpStructureOptions.every(opt => !!formData.landingPageDetails.structure[opt.key as keyof typeof formData.landingPageDetails.structure]);
    
    const { other, otherValues, ...structureBooleans } = formData.landingPageDetails.structure;
    const newStructureState: any = { ...structureBooleans };
    lpStructureOptions.forEach(opt => {
      newStructureState[opt.key as keyof typeof structureBooleans] = !allSelected;
    });
    updateFormData({
      landingPageDetails: {
        ...formData.landingPageDetails,
        structure: {
          ...newStructureState,
          other: Boolean(other),
          otherValues: Array.isArray(otherValues) ? otherValues : [],
        }
      }
    });
  };

  // 1. Estilo Visual (única escolha)
  const visualStyleOptions = [
    { value: 'minimalist', label: 'promptGenerator.uxui.visualStyleOptions.minimalist' },
    { value: 'modernShadows', label: 'promptGenerator.uxui.visualStyleOptions.modernShadows' },
    { value: 'flatMaterial', label: 'promptGenerator.uxui.visualStyleOptions.flatMaterial' },
    { value: 'iosInspired', label: 'promptGenerator.uxui.visualStyleOptions.iosInspired' },
    { value: 'androidInspired', label: 'promptGenerator.uxui.visualStyleOptions.androidInspired' },
    { value: 'neumorphism', label: 'promptGenerator.uxui.visualStyleOptions.neumorphism' },
    { value: 'glassmorphism', label: 'promptGenerator.uxui.visualStyleOptions.glassmorphism' },
    { value: 'retroVintage', label: 'promptGenerator.uxui.visualStyleOptions.retroVintage' },
    { value: 'brutalism', label: 'promptGenerator.uxui.visualStyleOptions.brutalism' },
    { value: 'darkMode', label: 'promptGenerator.uxui.visualStyleOptions.darkMode' },
    { value: 'thematic', label: 'promptGenerator.uxui.visualStyleOptions.thematic' },
  ];
  const itemsPerPageVisualStyle = 6;
  const totalPagesVisualStyle = Math.ceil(visualStyleOptions.length / itemsPerPageVisualStyle);
  const currentVisualStyleToDisplay = visualStyleOptions.slice(currentPageVisualStyle * itemsPerPageVisualStyle, (currentPageVisualStyle + 1) * itemsPerPageVisualStyle);

  // 2. Tipo de Menu (única escolha)
  const menuTypeOptions = [
    { value: 'horizontal', label: 'promptGenerator.uxui.menuTypeOptions.horizontal' },
    { value: 'vertical', label: 'promptGenerator.uxui.menuTypeOptions.vertical' },
    { value: 'hamburger', label: 'promptGenerator.uxui.menuTypeOptions.hamburger' },
    { value: 'mixed', label: 'promptGenerator.uxui.menuTypeOptions.mixed' },
    { value: 'dropdown', label: 'promptGenerator.uxui.menuTypeOptions.dropdown' },
    { value: 'context', label: 'promptGenerator.uxui.menuTypeOptions.context' },
    { value: 'circular', label: 'promptGenerator.uxui.menuTypeOptions.circular' },
    { value: 'mega', label: 'promptGenerator.uxui.menuTypeOptions.mega' },
  ];
  const itemsPerPageMenuType = 6;
  const totalPagesMenuType = Math.ceil(menuTypeOptions.length / itemsPerPageMenuType);
  const currentMenuTypeToDisplay = menuTypeOptions.slice(currentPageMenuType * itemsPerPageMenuType, (currentPageMenuType + 1) * itemsPerPageMenuType);

  // 3. Autenticação (múltipla escolha)
  const authOptions = [
    { value: 'emailPassword', label: 'promptGenerator.uxui.authOptions.emailPassword' },
    { value: 'socialLogin', label: 'promptGenerator.uxui.authOptions.socialLogin' },
    { value: 'twoFactor', label: 'promptGenerator.uxui.authOptions.twoFactor' },
    { value: 'biometrics', label: 'promptGenerator.uxui.authOptions.biometrics' },
    { value: 'digitalCertificates', label: 'promptGenerator.uxui.authOptions.digitalCertificates' },
    { value: 'physicalToken', label: 'promptGenerator.uxui.authOptions.physicalToken' },
    { value: 'securityQuestions', label: 'promptGenerator.uxui.authOptions.securityQuestions' },
    { value: 'continuousAuth', label: 'promptGenerator.uxui.authOptions.continuousAuth' },
  ];
  const itemsPerPageAuth = 6;
  const totalPagesAuth = Math.ceil(authOptions.length / itemsPerPageAuth);
  const currentAuthToDisplay = authOptions.slice(currentPageAuth * itemsPerPageAuth, (currentPageAuth + 1) * itemsPerPageAuth);

  // Handlers para seleção
  const handleVisualStyleChange = (value: string) => {
    updateFormData({ visualStyle: value });
  };
  const handleMenuTypeChange = (value: string) => {
    updateFormData({ menuType: value });
  };
  const handleAuthChange = (value: string, checked: boolean) => {
    let updated = formData.authentication || [];
    if (checked) {
      updated = [...updated, value];
    } else {
      updated = updated.filter(item => item !== value);
    }
    updateFormData({ authentication: updated });
  };
  const toggleSelectAllAuth = () => {
    if ((formData.authentication || []).length === authOptions.length) {
      updateFormData({ authentication: [] });
    } else {
      updateFormData({ authentication: authOptions.map(opt => opt.value) });
    }
  };
  const allAuthSelected = (formData.authentication || []).length === authOptions.length;

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <Card className={`p-4 sm:p-6 relative${isFinalized ? ' border-2 border-green-500' : ''}`}>
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-1">{t('promptGenerator.uxui.title')}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{t('promptGenerator.uxui.description')}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleReset} size="icon" className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">{t('common.reset')}</span>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => setAIOpen(true)} size="icon" className="h-8 w-8">
                      <Wand2 className="h-4 w-4 text-blue-500" />
                      <span className="sr-only">Assistente de IA</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <span>Obter ajuda do assistente de IA para escolher as opções de UX/UI</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || (
                  formData.colorPalette.length === 0 &&
                  (!formData.visualStyle || (formData.visualStyle === 'other' && (!Array.isArray(formData.otherVisualStyles) || formData.otherVisualStyles.length === 0))) &&
                  (!formData.menuType || (formData.menuType === 'other' && (!Array.isArray(formData.otherMenuTypes) || formData.otherMenuTypes.length === 0))) &&
                  !formData.landingPage &&
                  (formData.authentication.filter(a => a !== 'otherAuthMethod').length === 0 && (!Array.isArray(formData.otherAuthMethods) || formData.otherAuthMethods.length === 0)) &&
                  (!formData.userDashboard || (formData.userDashboardDetails.features.filter(f => f !== 'otherDashboardFeature').length === 0 && (!Array.isArray(formData.userDashboardDetails.otherDashboardFeatures) || formData.userDashboardDetails.otherDashboardFeatures.length === 0)))
                )}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
              </Button>
              {isFinalized && <CheckCircleIcon className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 pt-4">
          <div className="grid grid-cols-1 gap-0.5">
            {/* Accordions de Estilo Visual, Tipo de Menu e Autenticação */}
            <Accordion type="single" collapsible className="w-full mt-2">
              {/* Estilo Visual */}
              <AccordionItem value="visual-style-accordion" className="border-0">
                <AccordionTrigger className="text-base font-medium text-foreground py-1 hover:no-underline">
                  {t('promptGenerator.uxui.visualStyle')}
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="space-y-2">
                    <RadioGroup
                      value={formData.visualStyle}
                      onValueChange={handleVisualStyleChange}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                      {currentVisualStyleToDisplay.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`visual-style-${option.value}`} />
                          <Label htmlFor={`visual-style-${option.value}`} className="cursor-pointer text-xs font-normal">
                            {t(option.label)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {totalPagesVisualStyle > 1 && (
                      <div className="flex flex-row justify-end items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" className="text-xs" style={{ minWidth: 120 }} onClick={() => setIsOtherVisualStylePopoverOpen(true)}>
                          <ListPlus className="h-3 w-3 mr-1.5" />
                          {t('promptGenerator.objective.notInList') || 'Não está na lista?'}
                        </Button>
                        {/* Popover IMEDIATAMENTE após o botão */}
                        <Popover open={isOtherVisualStylePopoverOpen} onOpenChange={setIsOtherVisualStylePopoverOpen}>
                          <PopoverTrigger asChild>
                            <span></span>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4" side="top" align="end">
                            <div className="space-y-3">
                              <Label htmlFor="other-visual-style-input" className="text-sm font-medium">
                                {t('promptGenerator.uxui.addOtherVisualStylePlaceholder') || 'Adicionar outro estilo visual:'}
                              </Label>
                              <div className="flex items-center space-x-2">
                                <Input id="other-visual-style-input" value={currentOtherVisualStyleInput} onChange={(e) => setCurrentOtherVisualStyleInput(e.target.value)} placeholder={t('promptGenerator.uxui.otherVisualStyleItemPlaceholder') || 'Nome do estilo...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherVisualStyleInput.trim()) handleAddOtherVisualStyle(); }} />
                                <Button size="icon" onClick={handleAddOtherVisualStyle} disabled={!currentOtherVisualStyleInput.trim() || tempOtherVisualStylesList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                              </div>
                              {tempOtherVisualStylesList.length > 0 && (
                                <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                  <p className="text-xs text-muted-foreground mb-1">{(t('promptGenerator.uxui.addedItemsText') || 'Adicionadas:') + ` (${tempOtherVisualStylesList.length}/10)`}</p>
                                  {tempOtherVisualStylesList.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                      <span className="truncate flex-1 mr-2">{item}</span>
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherVisualStyle(idx)} className="h-5 w-5"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {tempOtherVisualStylesList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached')}</p>}
                              <div className="flex justify-end space-x-2 mt-3">
                                <Button size="sm" variant="ghost" onClick={() => {setIsOtherVisualStylePopoverOpen(false); setCurrentOtherVisualStyleInput(''); setTempOtherVisualStylesList(Array.isArray(formData.otherVisualStyles) ? formData.otherVisualStyles : []); }} className="text-xs h-8">{t('common.cancel')}</Button>
                                <Button size="sm" onClick={handleSaveOtherVisualStyles} className="text-xs h-8">{t('common.saveOtherItems')}</Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    {/* Exibir outros estilos visuais adicionados fora do popover */}
                    {Array.isArray(formData.otherVisualStyles) && formData.otherVisualStyles.length > 0 && (
                      <div className="mt-2 border p-2 rounded-md bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Outros Estilos Visuais Adicionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.otherVisualStyles.map((item, index) => (
                            <div key={`saved-other-visual-style-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                              <span className="truncate mr-1.5">{item}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                  const newOther = formData.otherVisualStyles.filter((_, i) => i !== index);
                                  updateFormData({
                                    otherVisualStyles: newOther,
                                    visualStyle: newOther.length > 0 ? 'other' : ''
                                  });
                                }}
                                aria-label="Remover"
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Paleta de Cores - movido para logo após Estilo Visual */}
              <AccordionItem value="color-palette-accordion" className="border-0">
                <AccordionTrigger className="text-base font-medium text-foreground py-1 hover:no-underline">
                  {t('promptGenerator.uxui.colorPalette') || "Paleta de Cores"}
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="space-y-4">
                    {Object.entries(colorPalettes).map(([categoryKey, category]) => (
                      <div key={categoryKey}>
                        <h5 className="text-sm font-semibold mb-2 text-muted-foreground">{category.title}</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {category.palettes.map((palette) => (
                            <Card 
                              key={palette.value} 
                              className={`p-3 cursor-pointer transition-all hover:shadow-md ${formData.colorPalette.includes(palette.value) ? 'ring-2 ring-primary shadow-lg' : 'ring-1 ring-border'}`}
                              onClick={() => handlePaletteSelection({ value: palette.value, colors: palette.colors })}
                            >
                              <p className="text-xs font-medium mb-1.5 truncate">{palette.name}</p>
                              <div className="flex space-x-1">
                                {palette.colors.map((color, index) => (
                                  <div key={index} className="w-5 h-5 rounded-sm border border-muted-foreground/20" style={{ backgroundColor: color }}></div>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div>
                      <h5 className="text-sm font-semibold mt-4 mb-2 text-muted-foreground">{t('promptGenerator.uxui.customPaletteTitle')}</h5>
                      <Card 
                        className={`p-3 transition-all hover:shadow-md ${formData.colorPalette.includes('custom') ? 'ring-2 ring-primary shadow-lg' : 'ring-1 ring-border'}`}
                      >
                        <p className="text-xs font-medium mb-1.5">{t('promptGenerator.uxui.customPalette.name')}</p>
                        <p className="text-xs text-muted-foreground mb-2">{t('promptGenerator.uxui.customPalette.description')}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <div key={`custom-color-${index}`} className="space-y-1">
                              <Label htmlFor={`custom-color-input-${index}`} className="text-xs">
                                {t('common.color' + (index + 1))}
                              </Label>
                              <div className="flex items-center space-x-1.5 color-picker-container">
                                <Input
                                  id={`custom-color-input-${index}`}
                                  type="text"
                                  placeholder="#FFFFFF"
                                  value={customColorPickers[index] || ''}
                                  onChange={(e) => handleCustomColorChange(index, e.target.value)}
                                  className="w-full text-xs h-8"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="h-8 w-8"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div 
                                        className="w-4 h-4 rounded-sm border border-muted-foreground/50" 
                                        style={{ backgroundColor: customColorPickers[index] || 'transparent' }}
                                      />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <div onClick={(e) => e.stopPropagation()}>
                                      <HexColorPicker
                                        color={customColorPickers[index] || '#FFFFFF'}
                                        onChange={(color) => handleCustomColorChange(index, color)}
                                      />
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex space-x-1">
                            {customColorPickers.map((color, index) => (
                              <div 
                                key={index} 
                                className="w-5 h-5 rounded-sm border border-muted-foreground/20" 
                                style={{ backgroundColor: color || 'transparent' }}
                              />
                            ))}
                          </div>
                          <Button
                            size="sm"
                            onClick={handleApplyCustomColors}
                            className="text-xs"
                            disabled={!customColorPickers.every(color => /^#[0-9A-Fa-f]{6}$/i.test(color))}
                          >
                            {t('promptGenerator.uxui.applyColors') || 'Aplicar Cores'}
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tipo de Menu */}
              <AccordionItem value="menu-type-accordion" className="border-0">
                <AccordionTrigger className="text-base font-medium text-foreground py-1 hover:no-underline">
                  {t('promptGenerator.uxui.menuType')}
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="space-y-2">
                    <RadioGroup
                      value={formData.menuType}
                      onValueChange={handleMenuTypeChange}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                      {currentMenuTypeToDisplay.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`menu-type-${option.value}`} />
                          <Label htmlFor={`menu-type-${option.value}`} className="cursor-pointer text-xs font-normal">
                            {t(option.label)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {totalPagesMenuType > 1 && (
                      <div className="flex flex-row justify-end items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" className="text-xs" style={{ minWidth: 120 }} onClick={() => setIsOtherMenuTypePopoverOpen(true)}>
                          <ListPlus className="h-3 w-3 mr-1.5" />
                          {t('promptGenerator.objective.notInList') || 'Não está na lista?'}
                        </Button>
                        {/* Popover IMEDIATAMENTE após o botão */}
                        <Popover open={isOtherMenuTypePopoverOpen} onOpenChange={setIsOtherMenuTypePopoverOpen}>
                          <PopoverTrigger asChild>
                            <span></span>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4" side="top" align="end">
                            <div className="space-y-3">
                              <Label htmlFor="other-menu-type-input" className="text-sm font-medium">
                                {t('promptGenerator.uxui.addOtherMenuTypePlaceholder') || 'Adicionar outro tipo de menu:'}
                              </Label>
                              <div className="flex items-center space-x-2">
                                <Input id="other-menu-type-input" value={currentOtherMenuTypeInput} onChange={(e) => setCurrentOtherMenuTypeInput(e.target.value)} placeholder={t('promptGenerator.uxui.otherMenuTypeItemPlaceholder') || 'Nome do tipo de menu...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherMenuTypeInput.trim()) handleAddOtherMenuType(); }} />
                                <Button size="icon" onClick={handleAddOtherMenuType} disabled={!currentOtherMenuTypeInput.trim() || tempOtherMenuTypesList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                              </div>
                              {tempOtherMenuTypesList.length > 0 && (
                                <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                  <p className="text-xs text-muted-foreground mb-1">{(t('promptGenerator.uxui.addedItemsText') || 'Adicionadas:') + ` (${tempOtherMenuTypesList.length}/10)`}</p>
                                  {tempOtherMenuTypesList.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                      <span className="truncate flex-1 mr-2">{item}</span>
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherMenuType(idx)} className="h-5 w-5"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {tempOtherMenuTypesList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached')}</p>}
                              <div className="flex justify-end space-x-2 mt-3">
                                <Button size="sm" variant="ghost" onClick={() => {setIsOtherMenuTypePopoverOpen(false); setCurrentOtherMenuTypeInput(''); setTempOtherMenuTypesList(Array.isArray(formData.otherMenuTypes) ? formData.otherMenuTypes : []); }} className="text-xs h-8">{t('common.cancel')}</Button>
                                <Button size="sm" onClick={handleSaveOtherMenuTypes} className="text-xs h-8">{t('common.saveOtherItems')}</Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    {/* Exibir outros tipos de menu adicionados fora do popover */}
                    {Array.isArray(formData.otherMenuTypes) && formData.otherMenuTypes.length > 0 && (
                      <div className="mt-2 border p-2 rounded-md bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Outros Tipos de Menu Adicionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.otherMenuTypes.map((item, index) => (
                            <div key={`saved-other-menu-type-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                              <span className="truncate mr-1.5">{item}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                  const newOther = formData.otherMenuTypes.filter((_, i) => i !== index);
                                  updateFormData({
                                    otherMenuTypes: newOther,
                                    menuType: newOther.length > 0 ? 'other' : ''
                                  });
                                }}
                                aria-label="Remover"
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Autenticação */}
              <AccordionItem value="auth-accordion" className="border-0">
                <AccordionTrigger className="text-base font-medium text-foreground py-1 hover:no-underline">
                  {t('promptGenerator.uxui.authentication')}
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentAuthToDisplay.map((option) => (
                        <div key={option.value} className="flex items-start space-x-2">
                          <Checkbox
                            id={`auth-${option.value}`}
                            checked={formData.authentication.includes(option.value)}
                            onCheckedChange={(checked) => handleAuthChange(option.value, Boolean(checked))}
                            className="mt-0.5"
                          />
                          <Label htmlFor={`auth-${option.value}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                            {t(option.label)}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {totalPagesAuth > 1 && (
                      <div className="flex flex-row items-center justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsOtherAuthPopoverOpen(true)}>
                          <ListPlus className="h-3 w-3 mr-1.5" />
                          {t('promptGenerator.objective.notInList') || 'Não está na lista?'}
                        </Button>
                        {/* Popover IMEDIATAMENTE após o botão */}
                        <Popover open={isOtherAuthPopoverOpen} onOpenChange={setIsOtherAuthPopoverOpen}>
                          <PopoverTrigger asChild>
                            <span></span>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4" side="top" align="end">
                            <div className="space-y-3">
                              <Label htmlFor="other-auth-input" className="text-sm font-medium">
                                {t('promptGenerator.uxui.addOtherAuthPlaceholder') || 'Adicionar outro método de autenticação:'}
                              </Label>
                              <div className="flex items-center space-x-2">
                                <Input id="other-auth-input" value={currentOtherAuthInput} onChange={(e) => setCurrentOtherAuthInput(e.target.value)} placeholder={t('promptGenerator.uxui.otherAuthItemPlaceholder') || 'Nome do método...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherAuthInput.trim()) handleAddOtherAuth(); }} />
                                <Button size="icon" onClick={handleAddOtherAuth} disabled={!currentOtherAuthInput.trim() || tempOtherAuthList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                              </div>
                              {tempOtherAuthList.length > 0 && (
                                <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                  <p className="text-xs text-muted-foreground mb-1">{(t('promptGenerator.uxui.addedItemsText') || 'Adicionadas:') + ` (${tempOtherAuthList.length}/10)`}</p>
                                  {tempOtherAuthList.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                      <span className="truncate flex-1 mr-2">{item}</span>
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherAuth(idx)} className="h-5 w-5"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {tempOtherAuthList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached')}</p>}
                              <div className="flex justify-end space-x-2 mt-3">
                                <Button size="sm" variant="ghost" onClick={() => {setIsOtherAuthPopoverOpen(false); setCurrentOtherAuthInput(''); setTempOtherAuthList(Array.isArray(formData.otherAuthMethods) ? formData.otherAuthMethods : []); }} className="text-xs h-8">{t('common.cancel')}</Button>
                                <Button size="sm" onClick={handleSaveOtherAuths} className="text-xs h-8">{t('common.saveOtherItems')}</Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    {/* Exibir outros métodos de autenticação adicionados fora do popover */}
                    {Array.isArray(formData.otherAuthMethods) && formData.otherAuthMethods.length > 0 && (
                      <div className="mt-2 border p-2 rounded-md bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Outros Métodos de Autenticação Adicionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.otherAuthMethods.map((item, index) => (
                            <div key={`saved-other-auth-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                              <span className="truncate mr-1.5">{item}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                  const newOther = formData.otherAuthMethods.filter((_, i) => i !== index);
                                  const newAuth = formData.authentication.filter(a => a !== item);
                                  updateFormData({
                                    otherAuthMethods: newOther,
                                    authentication: newAuth
                                  });
                                }}
                                aria-label="Remover"
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Página Inicial (Landing Page) - mover para após os Accordions */}
              <div className="flex justify-between items-center">
                <h4 className="text-base font-medium text-foreground">{t('promptGenerator.uxui.landingPage')}</h4>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="landing-page-toggle"
                    checked={formData.landingPage}
                    onCheckedChange={(checked) => {
                      const newLandingPageValue = Boolean(checked);
                      let landingPageDetailsUpdate = {};
                      if (newLandingPageValue) {
                        // Se SIM, desmarcar todos os sub-itens
                        landingPageDetailsUpdate = {
                          structure: {
                            hero: false,
                            benefits: false,
                            testimonials: false,
                            cta: false,
                            other: false,
                          otherValues: formData.landingPageDetails.structure.otherValues || [],
                          },
                          elements: {
                            video: false,
                            form: false,
                            animations: false,
                            other: false,
                          otherValues: formData.landingPageDetails.elements.otherValues || [],
                          },
                          style: {
                            modern: false,
                            minimalist: false,
                            corporate: false,
                            creative: false,
                            other: false,
                          otherValues: formData.landingPageDetails.style.otherValues || [],
                          },
                        };
                        updateFormData({ landingPage: newLandingPageValue, landingPageDetails: { ...formData.landingPageDetails, ...landingPageDetailsUpdate } });
                      } else {
                        updateFormData({ landingPage: newLandingPageValue });
                      }
                    }}
                  />
                  <Label htmlFor="landing-page-toggle" className="text-sm font-medium text-foreground">
                    {formData.landingPage ? t('promptGenerator.uxui.hasLandingPage') : t('promptGenerator.uxui.noLandingPage')}
                  </Label>
                </div>
              </div>
              {formData.landingPage && (
                <div className="space-y-2 mt-1">
                  <div className="space-y-1">
                    <h5 className="text-sm font-medium text-foreground mb-0.5">{t('promptGenerator.uxui.structure')}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5" style={{ minHeight: `${Math.ceil(LP_ITEMS_PER_PAGE / 2) * 20}px` }}>
                      {lpStructureOptions
                        .slice(currentPageLpStructure * LP_ITEMS_PER_PAGE, (currentPageLpStructure + 1) * LP_ITEMS_PER_PAGE)
                        .map((option) => (
                          <div key={option.key} className="flex items-start space-x-1">
                            <Checkbox
                              id={`lp-structure-${option.key}`}
                              checked={!!formData.landingPageDetails.structure[option.key as keyof typeof formData.landingPageDetails.structure]}
                              onCheckedChange={(checked) => handleLandingPageCheckboxChange('structure', option.key, Boolean(checked))}
                              className="mt-0.5"
                            />
                            <Label htmlFor={`lp-structure-${option.key}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                              {t(option.i18nKey) || option.defaultText}
                            </Label>
                          </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="text-xs" onClick={toggleSelectAllLandingPageItems}>
                        {allLpStructureSelected ? t('common.unselectAll') : t('common.selectAll')}
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Popover open={isOtherLpStructurePopoverOpen} onOpenChange={(isOpen) => {
                          setIsOtherLpStructurePopoverOpen(isOpen);
                          if (!isOpen) setCurrentOtherLpStructureInput(''); 
                        }}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsOtherLpStructurePopoverOpen(true)}>
                              <ListPlus className="h-3 w-3 mr-1.5" />
                              {t('promptGenerator.objective.notInList') || 'Não está na lista?'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4" side="top" align="end">
                            <div className="space-y-3">
                              <Label htmlFor="other-lp-structure-input" className="text-sm font-medium">
                                {t('promptGenerator.uxui.addOtherStructurePlaceholder')}
                              </Label>
                              <div className="flex items-center space-x-2">
                                <Input id="other-lp-structure-input" value={currentOtherLpStructureInput} onChange={(e) => setCurrentOtherLpStructureInput(e.target.value)} placeholder={t('promptGenerator.uxui.otherStructureItemPlaceholder')} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherLpStructureInput.trim()) handleAddOtherLpStructure(); }} />
                                <Button size="icon" onClick={handleAddOtherLpStructure} disabled={!currentOtherLpStructureInput.trim() || tempOtherLpStructureList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                              </div>
                              {tempOtherLpStructureList.length > 0 && (
                                <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                  <p className="text-xs text-muted-foreground mb-1">{(t('promptGenerator.uxui.addedItemsText') || 'Adicionadas:') + ` (${tempOtherLpStructureList.length}/10)`}</p>
                                  {tempOtherLpStructureList.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                      <span className="truncate flex-1 mr-2">{item}</span>
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherLpStructure(idx)} className="h-5 w-5"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {tempOtherLpStructureList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached')}</p>}
                              <div className="flex justify-end space-x-2 mt-3">
                                <Button size="sm" variant="ghost" onClick={() => {setIsOtherLpStructurePopoverOpen(false); setCurrentOtherLpStructureInput(''); setTempOtherLpStructureList(formData.landingPageDetails.structure.otherValues || []); }} className="text-xs h-8">{t('common.cancel')}</Button>
                                <Button size="sm" onClick={handleSaveOtherLpStructure} className="text-xs h-8">{t('common.saveOtherItems')}</Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        {Math.ceil((lpStructureOptions.length + (formData.landingPageDetails.structure.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE) > 1 && (
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => setCurrentPageLpStructure(p => Math.max(0, p - 1))} disabled={currentPageLpStructure === 0} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-xs text-muted-foreground">{`${t('common.page')} ${currentPageLpStructure + 1} ${t('common.of')} ${Math.ceil((lpStructureOptions.length + (formData.landingPageDetails.structure.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE)}`}</span>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentPageLpStructure(p => Math.min(Math.ceil((lpStructureOptions.length + (formData.landingPageDetails.structure.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE) - 1, p + 1))} disabled={currentPageLpStructure === Math.ceil((lpStructureOptions.length + (formData.landingPageDetails.structure.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE) - 1} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                          </div>
                        )}
                      </div>
                    </div>
                     {Array.isArray(formData.landingPageDetails.structure.otherValues) && formData.landingPageDetails.structure.otherValues.length > 0 && (
                      <div className="mt-2 border p-2 rounded-md bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Outras Seções de Estrutura Adicionadas:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.landingPageDetails.structure.otherValues.map((item, index) => (
                            <div key={`saved-other-structure-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                              <span className="truncate mr-1.5">{item}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                  const newOther = formData.landingPageDetails.structure.otherValues.filter((_, i) => i !== index);
                                  updateFormData({
                                    landingPageDetails: {
                                      ...formData.landingPageDetails,
                                      structure: {
                                        ...formData.landingPageDetails.structure,
                                        otherValues: newOther,
                                        other: newOther.length > 0
                                      }
                                    }
                                  });
                                }}
                                aria-label="Remover"
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* LP Elements Section */}
                  <div className="space-y-1 pt-2">
                    <h5 className="text-sm font-medium text-foreground mb-0.5">{t('promptGenerator.uxui.elements')}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5" style={{ minHeight: `${Math.ceil(LP_ITEMS_PER_PAGE / 2) * 20}px` }}>
                      {lpElementOptions
                        .slice(currentPageLpElements * LP_ITEMS_PER_PAGE, (currentPageLpElements + 1) * LP_ITEMS_PER_PAGE)
                        .map((option) => (
                          <div key={option.key} className="flex items-start space-x-1">
                            <Checkbox
                              id={`lp-elements-${option.key}`}
                              checked={!!formData.landingPageDetails.elements[option.key as keyof typeof formData.landingPageDetails.elements]}
                              onCheckedChange={(checked) => handleLandingPageCheckboxChange('elements', option.key, Boolean(checked))}
                              className="mt-0.5"
                            />
                            <Label htmlFor={`lp-elements-${option.key}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                              {t(option.i18nKey) || option.defaultText}
                            </Label>
                          </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="text-xs" onClick={toggleSelectAllLpElements}>
                        {allLpElementsSelected ? t('common.unselectAll') : t('common.selectAll')}
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Popover open={isOtherLpElementsPopoverOpen} onOpenChange={(isOpen) => {
                          setIsOtherLpElementsPopoverOpen(isOpen);
                          if (!isOpen) setCurrentOtherLpElementsInput('');
                        }}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsOtherLpElementsPopoverOpen(true)}>
                              <ListPlus className="h-3 w-3 mr-1.5" />
                              {t('promptGenerator.objective.notInList') || 'Não está na lista?'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4" side="top" align="end">
                            <div className="space-y-3">
                              <Label htmlFor="other-lp-elements-input" className="text-sm font-medium">
                                {t('promptGenerator.uxui.addOtherElementPlaceholder') || 'Adicionar outro elemento:'}
                              </Label>
                              <div className="flex items-center space-x-2">
                                <Input id="other-lp-elements-input" value={currentOtherLpElementsInput} onChange={(e) => setCurrentOtherLpElementsInput(e.target.value)} placeholder={t('promptGenerator.uxui.otherElementItemPlaceholder') || 'Nome do elemento...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherLpElementsInput.trim()) handleAddOtherLpElement(); }} />
                                <Button size="icon" onClick={handleAddOtherLpElement} disabled={!currentOtherLpElementsInput.trim() || tempOtherLpElementsList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                              </div>
                              {tempOtherLpElementsList.length > 0 && (
                                <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                  <p className="text-xs text-muted-foreground mb-1">{(t('promptGenerator.uxui.addedItemsText') || 'Adicionadas:') + ` (${tempOtherLpElementsList.length}/10)`}</p>
                                  {tempOtherLpElementsList.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                      <span className="truncate flex-1 mr-2">{item}</span>
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherLpElement(idx)} className="h-5 w-5"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {tempOtherLpElementsList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached')}</p>}
                              <div className="flex justify-end space-x-2 mt-3">
                                <Button size="sm" variant="ghost" onClick={() => {setIsOtherLpElementsPopoverOpen(false); setCurrentOtherLpElementsInput(''); setTempOtherLpElementsList(formData.landingPageDetails.elements.otherValues || []); }} className="text-xs h-8">{t('common.cancel')}</Button>
                                <Button size="sm" onClick={handleSaveOtherLpElements} className="text-xs h-8">{t('common.saveOtherItems')}</Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        {Math.ceil((lpElementOptions.length + (formData.landingPageDetails.elements.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE) > 1 && (
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => setCurrentPageLpElements(p => Math.max(0, p - 1))} disabled={currentPageLpElements === 0} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-xs text-muted-foreground">{`${t('common.page')} ${currentPageLpElements + 1} ${t('common.of')} ${Math.ceil((lpElementOptions.length + (formData.landingPageDetails.elements.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE)}`}</span>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentPageLpElements(p => Math.min(Math.ceil((lpElementOptions.length + (formData.landingPageDetails.elements.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE) - 1, p + 1))} disabled={currentPageLpElements === Math.ceil((lpElementOptions.length + (formData.landingPageDetails.elements.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE) - 1} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {Array.isArray(formData.landingPageDetails.elements.otherValues) && formData.landingPageDetails.elements.otherValues.length > 0 && (
                      <div className="mt-2 border p-2 rounded-md bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Outros Elementos Adicionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.landingPageDetails.elements.otherValues.map((item, index) => (
                            <div key={`saved-other-element-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                              <span className="truncate mr-1.5">{item}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                  const newOther = formData.landingPageDetails.elements.otherValues.filter((_, i) => i !== index);
                                  updateFormData({
                                    landingPageDetails: {
                                      ...formData.landingPageDetails,
                                      elements: {
                                        ...formData.landingPageDetails.elements,
                                        otherValues: newOther,
                                        other: newOther.length > 0
                                      }
                                    }
                                  });
                                }}
                                aria-label="Remover"
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* LP Style Section */}
                  <div className="space-y-1 pt-2">
                    <h5 className="text-sm font-medium text-foreground mb-0.5">{t('promptGenerator.uxui.style')}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5" style={{ minHeight: `${Math.ceil(LP_ITEMS_PER_PAGE / 2) * 20}px` }}>
                      {lpStyleOptions
                        .slice(currentPageLpStyle * LP_ITEMS_PER_PAGE, (currentPageLpStyle + 1) * LP_ITEMS_PER_PAGE)
                        .map((option) => (
                          <div key={option.key} className="flex items-start space-x-1">
                            <Checkbox
                              id={`lp-style-${option.key}`}
                              checked={!!formData.landingPageDetails.style[option.key as keyof typeof formData.landingPageDetails.style]}
                              onCheckedChange={(checked) => handleLandingPageCheckboxChange('style', option.key, Boolean(checked))}
                              className="mt-0.5"
                            />
                            <Label htmlFor={`lp-style-${option.key}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                              {t(option.i18nKey) || option.defaultText}
                            </Label>
                          </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="text-xs" onClick={toggleSelectAllLpStyles}>
                        {allLpStylesSelected ? t('common.unselectAll') : t('common.selectAll')}
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Popover open={isOtherLpStylePopoverOpen} onOpenChange={(isOpen) => {
                          setIsOtherLpStylePopoverOpen(isOpen);
                          if (!isOpen) setCurrentOtherLpStyleInput('');
                        }}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsOtherLpStylePopoverOpen(true)}>
                              <ListPlus className="h-3 w-3 mr-1.5" />
                              {t('promptGenerator.objective.notInList') || 'Não está na lista?'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4" side="top" align="end">
                            <div className="space-y-3">
                              <Label htmlFor="other-lp-style-input" className="text-sm font-medium">
                                {t('promptGenerator.uxui.addOtherStylePlaceholder') || 'Adicionar outro estilo:'}
                              </Label>
                              <div className="flex items-center space-x-2">
                                <Input id="other-lp-style-input" value={currentOtherLpStyleInput} onChange={(e) => setCurrentOtherLpStyleInput(e.target.value)} placeholder={t('promptGenerator.uxui.otherStyleItemPlaceholder') || 'Nome do estilo...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherLpStyleInput.trim()) handleAddOtherLpStyle(); }} />
                                <Button size="icon" onClick={handleAddOtherLpStyle} disabled={!currentOtherLpStyleInput.trim() || tempOtherLpStyleList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                              </div>
                              {tempOtherLpStyleList.length > 0 && (
                                <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                  <p className="text-xs text-muted-foreground mb-1">{(t('promptGenerator.uxui.addedItemsText') || 'Adicionadas:') + ` (${tempOtherLpStyleList.length}/10)`}</p>
                                  {tempOtherLpStyleList.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                      <span className="truncate flex-1 mr-2">{item}</span>
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherLpStyle(idx)} className="h-5 w-5"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {tempOtherLpStyleList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached')}</p>}
                              <div className="flex justify-end space-x-2 mt-3">
                                <Button size="sm" variant="ghost" onClick={() => {setIsOtherLpStylePopoverOpen(false); setCurrentOtherLpStyleInput(''); setTempOtherLpStyleList(formData.landingPageDetails.style.otherValues || []); }} className="text-xs h-8">{t('common.cancel')}</Button>
                                <Button size="sm" onClick={handleSaveOtherLpStyles} className="text-xs h-8">{t('common.saveOtherItems')}</Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        {Math.ceil((lpStyleOptions.length + (formData.landingPageDetails.style.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE) > 1 && (
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => setCurrentPageLpStyle(p => Math.max(0, p - 1))} disabled={currentPageLpStyle === 0} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-xs text-muted-foreground">{`${t('common.page')} ${currentPageLpStyle + 1} ${t('common.of')} ${Math.ceil((lpStyleOptions.length + (formData.landingPageDetails.style.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE)}`}</span>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentPageLpStyle(p => Math.min(Math.ceil((lpStyleOptions.length + (formData.landingPageDetails.style.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE) - 1, p + 1))} disabled={currentPageLpStyle === Math.ceil((lpStyleOptions.length + (formData.landingPageDetails.style.otherValues?.length || 0)) / LP_ITEMS_PER_PAGE) - 1} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {Array.isArray(formData.landingPageDetails.style.otherValues) && formData.landingPageDetails.style.otherValues.length > 0 && (
                      <div className="mt-2 border p-2 rounded-md bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Outros Estilos Adicionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.landingPageDetails.style.otherValues.map((item, index) => (
                            <div key={`saved-other-style-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                              <span className="truncate mr-1.5">{item}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                  const newOther = formData.landingPageDetails.style.otherValues.filter((_, i) => i !== index);
                                  updateFormData({
                                    landingPageDetails: {
                                      ...formData.landingPageDetails,
                                      style: {
                                        ...formData.landingPageDetails.style,
                                        otherValues: newOther,
                                        other: newOther.length > 0
                                      }
                                    }
                                  });
                                }}
                                aria-label="Remover"
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Painel do Usuário (User Dashboard) - mover para após Landing Page */}
            <div className="space-y-2"> {/* Removed mb-1 */}
              <div className="flex justify-between items-center">
                <h4 className="text-base font-medium text-foreground">{t('promptGenerator.uxui.userDashboard') || "Painel do Usuário"}</h4>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dashboard-toggle"
                    checked={formData.userDashboard}
                    onCheckedChange={(checked) => updateFormData({ userDashboard: checked })}
                  />
                  <Label htmlFor="dashboard-toggle" className="text-sm font-medium text-foreground">
                    {formData.userDashboard ? (t('common.yes') || "Sim") : (t('promptGenerator.uxui.noUserDashboard') || "Não")}
                  </Label>
                </div>
              </div>
              {formData.userDashboard && (
                <div className="space-y-1 mt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5" style={{ minHeight: `${Math.ceil(itemsPerPage / 2) * 20}px` }}>
                    {currentDashboardFeaturesToDisplay.map((feature) => (
                      <div key={feature.value} className="flex items-start space-x-1">
                        <Checkbox 
                          id={`dashboard-${feature.value}`} 
                          checked={formData.userDashboardDetails.features.includes(feature.value)} 
                          onCheckedChange={(checked) => handleDashboardFeatureChange(feature.value, checked === true)} 
                          className="mt-0.5"
                        />
                        <Label 
                          htmlFor={`dashboard-${feature.value}`} 
                          className="cursor-pointer text-xs font-normal whitespace-normal leading-tight"
                        >
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between space-x-2 mt-2">
                    {dashboardFeaturesOptions.length > 0 && (
                      <Button variant="outline" size="sm" className="text-xs" onClick={toggleSelectAllDashboardFeatures}>
                        {allDashboardFeaturesSelected ? t('common.unselectAll') : t('common.selectAll')}
                      </Button>
                    )}
                    <div className="flex items-center space-x-2">
                      <Popover open={isOtherDashboardFeaturePopoverOpen} onOpenChange={setIsOtherDashboardFeaturePopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsOtherDashboardFeaturePopoverOpen(true)}>
                            <ListPlus className="h-3 w-3 mr-1.5" />
                            {t('promptGenerator.objective.notInList') || "Não está na lista?"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" side="top" align="end">
                          <div className="space-y-3">
                            <Label htmlFor="other-dashboardfeature-input" className="text-sm font-medium">
                              {t('promptGenerator.uxui.otherDashboardFeaturePlaceholder') || 'Adicionar outra funcionalidade do painel:'}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Input 
                                id="other-dashboardfeature-input" 
                                value={currentOtherDashboardFeatureInput} 
                                onChange={(e) => setCurrentOtherDashboardFeatureInput(e.target.value)} 
                                placeholder={t('promptGenerator.uxui.otherDashboardFeaturePlaceholder') || 'Sua funcionalidade...'} 
                                className="text-xs h-8" 
                                onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherDashboardFeatureInput.trim()) handleAddOtherDashboardFeature(); }} 
                              />
                              <Button 
                                size="icon" 
                                onClick={handleAddOtherDashboardFeature} 
                                disabled={!currentOtherDashboardFeatureInput.trim() || tempOtherDashboardFeaturesList.length >= 10} 
                                className="h-8 w-8 flex-shrink-0"
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                            {tempOtherDashboardFeaturesList.length > 0 && (
                              <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                <p className="text-xs text-muted-foreground mb-1">{`Adicionadas (${tempOtherDashboardFeaturesList.length}/10):`}</p>
                                {tempOtherDashboardFeaturesList.map((feat, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                    <span className="truncate flex-1 mr-2">{feat}</span>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherDashboardFeature(idx)} className="h-5 w-5">
                                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {tempOtherDashboardFeaturesList.length >= 10 && (
                              <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached') || "Limite de 10 atingido."}</p>
                            )}
                            <div className="flex justify-end space-x-2 mt-3">
                              <Button size="sm" variant="ghost" onClick={() => setIsOtherDashboardFeaturePopoverOpen(false)} className="text-xs h-8">
                                {'Cancelar'}
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={handleSaveOtherDashboardFeatures} 
                                disabled={tempOtherDashboardFeaturesList.length === 0 && (!Array.isArray(formData.userDashboardDetails.otherDashboardFeatures) || formData.userDashboardDetails.otherDashboardFeatures.length === 0) && !currentOtherDashboardFeatureInput.trim()} 
                                className="text-xs h-8"
                              >
                                {'Salvar Outras'}
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      {totalPagesDashboard > 1 && (
                        <div className="flex items-center justify-center space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => setCurrentPageDashboard(p => Math.max(0, p - 1))} disabled={currentPageDashboard === 0} className="h-7 w-7">
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-xs text-muted-foreground">{`${t('common.page')} ${currentPageDashboard + 1} ${t('common.of')} ${totalPagesDashboard}`}</span>
                          <Button variant="ghost" size="icon" onClick={() => setCurrentPageDashboard(p => Math.min(totalPagesDashboard - 1, p + 1))} disabled={currentPageDashboard === totalPagesDashboard - 1} className="h-7 w-7">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {Array.isArray(formData.userDashboardDetails.otherDashboardFeatures) && formData.userDashboardDetails.otherDashboardFeatures.length > 0 && (
                    <div className="mt-2 border p-2 rounded-md bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Outras Funcionalidades do Painel Adicionadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.userDashboardDetails.otherDashboardFeatures.map((feat, index) => (
                          <div key={`saved-other-dash-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                            <span className="truncate mr-1.5">{feat}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => {
                                const newOther = formData.userDashboardDetails.otherDashboardFeatures.filter((_, i) => i !== index);
                                const newFeatures = Array.isArray(formData.userDashboardDetails.features) ? formData.userDashboardDetails.features.filter(f => f !== feat) : [];
                                updateFormData({
                                  userDashboardDetails: {
                                    ...formData.userDashboardDetails,
                                    otherDashboardFeatures: newOther,
                                    features: newFeatures
                                  }
                                });
                              }}
                              aria-label="Remover"
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AIAssistantPanel
        open={aiOpen}
        onClose={() => setAIOpen(false)}
        items={Array.isArray(uxuiData) ? uxuiData : []}
        title={t('promptGenerator.uxui.title') || 'UX/UI'}
      />
    </div>
  );
};

export default UXUIStep;
