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
import { RotateCcw, Save, CheckCircle as CheckCircleIcon, ListPlus, PlusCircle, XCircle, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
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

const UXUIStep: React.FC<UXUIStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  const { t } = useLanguage();
  const itemsPerPage = 6; 
  const LP_ITEMS_PER_PAGE = 4;
  const [aiOpen, setAIOpen] = useState(false);

  const [customColorPickers, setCustomColorPickers] = useState<string[]>(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
  const [activeColorPickerIndex, setActiveColorPickerIndex] = useState<number | null>(null);

  const [currentPageVisualStyle, setCurrentPageVisualStyle] = useState(0);
  const [isOtherVisualStylePopoverOpen, setIsOtherVisualStylePopoverOpen] = useState(false);
  const [currentOtherVisualStyleInput, setCurrentOtherVisualStyleInput] = useState('');
  const [tempOtherVisualStylesList, setTempOtherVisualStylesList] = useState<string[]>([]);

  const [currentPageMenuType, setCurrentPageMenuType] = useState(0);
  const [isOtherMenuTypePopoverOpen, setIsOtherMenuTypePopoverOpen] = useState(false);
  const [currentOtherMenuTypeInput, setCurrentOtherMenuTypeInput] = useState('');
  const [tempOtherMenuTypesList, setTempOtherMenuTypesList] = useState<string[]>([]);
  
  const [currentPageAuth, setCurrentPageAuth] = useState(0);
  const [isOtherAuthPopoverOpen, setIsOtherAuthPopoverOpen] = useState(false);
  const [currentOtherAuthInput, setCurrentOtherAuthInput] = useState('');
  const [tempOtherAuthList, setTempOtherAuthList] = useState<string[]>([]);
  
  const [currentPageDashboard, setCurrentPageDashboard] = useState(0);
  const [isOtherDashboardFeaturePopoverOpen, setIsOtherDashboardFeaturePopoverOpen] = useState(false);
  const [currentOtherDashboardFeatureInput, setCurrentOtherDashboardFeatureInput] = useState('');
  const [tempOtherDashboardFeaturesList, setTempOtherDashboardFeaturesList] = useState<string[]>([]);

  const lpStructureOptions = [
    { key: 'hero', i18nKey: 'promptGenerator.uxui.structureItems.hero', defaultText: 'Seção Principal' },
    { key: 'benefits', i18nKey: 'promptGenerator.uxui.structureItems.benefits', defaultText: 'Benefícios/Funcionalidades' },
    { key: 'testimonials', i18nKey: 'promptGenerator.uxui.structureItems.testimonials', defaultText: 'Depoimentos' },
    { key: 'cta', i18nKey: 'promptGenerator.uxui.structureItems.cta', defaultText: 'Chamada para Ação' },
  ];
  const [currentPageLpStructure, setCurrentPageLpStructure] = useState(0);
  const [isOtherLpStructurePopoverOpen, setIsOtherLpStructurePopoverOpen] = useState(false);
  const [currentOtherLpStructureInput, setCurrentOtherLpStructureInput] = useState('');
  const [tempOtherLpStructureList, setTempOtherLpStructureList] = useState<string[]>([]);

  const [visualStyleOptions, setVisualStyleOptions] = useState<any[]>([]);
  const [menuTypeOptions, setMenuTypeOptions] = useState<any[]>([]);
  const [authOptions, setAuthOptions] = useState<any[]>([]);
  const [dashboardFeaturesOptions, setDashboardFeaturesOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (Array.isArray(uxuiData)) {
        const dashboardFeatures = uxuiData.filter((item: any) => item.category === 'dashboardFeatures');
        console.log('Dashboard Features:', dashboardFeatures);
        setDashboardFeaturesOptions(dashboardFeatures);
        setVisualStyleOptions(uxuiData.filter((item: any) => item.category === 'visualStyle'));
        setMenuTypeOptions(uxuiData.filter((item: any) => item.category === 'menuType'));
        setAuthOptions(uxuiData.filter((item: any) => item.category === 'auth'));
      }
      setLoading(false);
    } catch (e) {
      console.error('Erro ao carregar opções de UX/UI:', e);
      setError('Erro ao carregar opções de UX/UI');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTempOtherLpStructureList(formData.landingPageDetails.structure.otherValues || []);
  }, [formData.landingPageDetails.structure.otherValues, isOtherLpStructurePopoverOpen]);

  const handleAddOtherLpStructure = () => {
    if (currentOtherLpStructureInput.trim() && tempOtherLpStructureList.length < 10) {
      setTempOtherLpStructureList([...tempOtherLpStructureList, currentOtherLpStructureInput.trim()]);
      setCurrentOtherLpStructureInput('');
    }
  };

  const handleRemoveOtherLpStructure = (index: number) => {
    setTempOtherLpStructureList(tempOtherLpStructureList.filter((_, i) => i !== index));
  };

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
    
    const newStructureState = { ...formData.landingPageDetails.structure };
    allPredefinedKeys.forEach(key => {
        newStructureState[key as keyof Omit<typeof formData.landingPageDetails.structure, 'other' | 'otherValues'>] = !allSelected;
    });
    
    updateFormData({
      landingPageDetails: { ...formData.landingPageDetails, structure: newStructureState }
    });
  };
    
  const allLpStructureSelected = lpStructureOptions.every(opt => !!formData.landingPageDetails.structure[opt.key as keyof Omit<typeof formData.landingPageDetails.structure, 'other' | 'otherValues'>]);

  const lpElementOptions = [
    { key: 'video', i18nKey: 'promptGenerator.uxui.elementsItems.video', defaultText: 'Vídeo/Animação' },
    { key: 'form', i18nKey: 'promptGenerator.uxui.elementsItems.form', defaultText: 'Formulário de Contato' },
    { key: 'animations', i18nKey: 'promptGenerator.uxui.elementsItems.animations', defaultText: 'Elementos Interativos' },
  ];
  const [currentPageLpElements, setCurrentPageLpElements] = useState(0);
  const [isOtherLpElementsPopoverOpen, setIsOtherLpElementsPopoverOpen] = useState(false);
  const [currentOtherLpElementsInput, setCurrentOtherLpElementsInput] = useState('');
  const [tempOtherLpElementsList, setTempOtherLpElementsList] = useState<string[]>([]);

  useEffect(() => {
    setTempOtherLpElementsList(formData.landingPageDetails.elements.otherValues || []);
  }, [formData.landingPageDetails.elements.otherValues, isOtherLpElementsPopoverOpen]);

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

  const handleAuthMethodChange = (value: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.authentication, value]
      : formData.authentication.filter(id => id !== value);
    updateFormData({ authentication: updatedOptions });
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

  const totalPagesVisualStyle = Math.ceil(visualStyleOptions.length / itemsPerPage);
  const currentVisualStyleToDisplay = visualStyleOptions.slice(currentPageVisualStyle * itemsPerPage, (currentPageVisualStyle + 1) * itemsPerPage);

  const totalPagesMenuType = Math.ceil(menuTypeOptions.length / itemsPerPage);
  const currentMenuTypeToDisplay = menuTypeOptions.slice(currentPageMenuType * itemsPerPage, (currentPageMenuType + 1) * itemsPerPage);

  const totalPagesAuth = Math.ceil(authOptions.length / itemsPerPage);
  const currentAuthToDisplay = authOptions.slice(currentPageAuth * itemsPerPage, (currentPageAuth + 1) * itemsPerPage);
  const toggleSelectAllAuth = () => {
    const allOptionIds = authOptions.map(opt => opt.value);
    const allSelectedCurrently = allOptionIds.every(id => formData.authentication.includes(id));

    if (allSelectedCurrently) {
      updateFormData({ authentication: formData.authentication.filter(auth => !allOptionIds.includes(auth)) });
    } else {
      updateFormData({ authentication: Array.from(new Set([...formData.authentication, ...allOptionIds])) });
    }
  };
  const allAuthSelected = authOptions.length > 0 && authOptions.every(opt => (formData.authentication || []).includes(opt.value));

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
    
    const newStructureState = { ...formData.landingPageDetails.structure };
    lpStructureOptions.forEach(opt => {
      newStructureState[opt.key as keyof typeof formData.landingPageDetails.structure] = !allSelected;
    });
    
    updateFormData({
      landingPageDetails: { ...formData.landingPageDetails, structure: newStructureState }
    });
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t('promptGenerator.uxui.title')}</CardTitle>
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
            <div className="space-y-2 mb-1">
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
                            otherValues: formData.landingPageDetails.structure.otherValues || [], // Manter otherValues se já existirem
                          },
                          elements: {
                            video: false,
                            form: false,
                            animations: false,
                            other: false,
                            otherValues: formData.landingPageDetails.elements.otherValues || [], // Manter otherValues
                          },
                          style: {
                            modern: false,
                            minimalist: false,
                            corporate: false,
                            creative: false,
                            other: false,
                            otherValues: formData.landingPageDetails.style.otherValues || [], // Manter otherValues
                          },
                        };
                        updateFormData({ landingPage: newLandingPageValue, landingPageDetails: { ...formData.landingPageDetails, ...landingPageDetailsUpdate } });
                      } else {
                        // Se NÃO, apenas atualiza o estado da landingPage
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
                    <p className="text-xs text-muted-foreground mb-1">{t('promptGenerator.uxui.structureOption')}</p>
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
                            <Button variant="outline" size="sm" className="text-xs">
                              <ListPlus className="h-3 w-3 mr-1.5" />
                              {t('promptGenerator.objective.notInList')}
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
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherLpStructure(idx)} className="h-5 w-5"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
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
                     {formData.landingPageDetails.structure.otherValues && formData.landingPageDetails.structure.otherValues.length > 0 && (
                        <div className="mt-2 space-y-1 border p-2 rounded-md bg-muted/30">
                          <p className="text-xs font-medium text-muted-foreground mb-1">{t('promptGenerator.uxui.addedOtherStructure')}</p>
                          {formData.landingPageDetails.structure.otherValues.map((item, index) => (
                            <div key={`saved-other-lp-structure-${index}`} className="text-xs text-foreground p-1 bg-muted/50 rounded">{item}</div>
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    {/* This is the problematic section that was duplicated and caused errors. Removing the duplicate. */}
                  </div>

                  {/* LP Elements Section */}
                  <div className="space-y-1 pt-2 border-t">
                    <h5 className="text-sm font-medium text-foreground mb-0.5">{t('promptGenerator.uxui.elements')}</h5>
                    <p className="text-xs text-muted-foreground mb-1">{t('promptGenerator.uxui.elementsOption')}</p>
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
                            <Button variant="outline" size="sm" className="text-xs">
                              <ListPlus className="h-3 w-3 mr-1.5" />
                              {t('promptGenerator.objective.notInList')}
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
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherLpElement(idx)} className="h-5 w-5"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
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
                    {formData.landingPageDetails.elements.otherValues && formData.landingPageDetails.elements.otherValues.length > 0 && !isOtherLpElementsPopoverOpen && (
                      <div className="mt-2 space-y-1 border p-2 rounded-md bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t('promptGenerator.uxui.addedOtherElements') || "Outros Elementos Adicionados:"}</p>
                        {formData.landingPageDetails.elements.otherValues.map((item, index) => (
                          <div key={`saved-other-lp-elements-${index}`} className="text-xs text-foreground p-1 bg-muted/50 rounded">{item}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* LP Style Section */}
                  <div className="space-y-1 pt-2 border-t">
                    <h5 className="text-sm font-medium text-foreground mb-0.5">{t('promptGenerator.uxui.style')}</h5>
                    <p className="text-xs text-muted-foreground mb-1">{t('promptGenerator.uxui.styleOption')}</p>
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
                            <Button variant="outline" size="sm" className="text-xs">
                              <ListPlus className="h-3 w-3 mr-1.5" />
                              {t('promptGenerator.objective.notInList')}
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
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherLpStyle(idx)} className="h-5 w-5"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
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
                    {formData.landingPageDetails.style.otherValues && formData.landingPageDetails.style.otherValues.length > 0 && (
                      <div className="mt-2 space-y-1 border p-2 rounded-md bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t('promptGenerator.uxui.addedOtherStyles') || "Outros Estilos Adicionados:"}</p>
                        {formData.landingPageDetails.style.otherValues.map((item, index) => (
                          <div key={`saved-other-lp-style-${index}`} className="text-xs text-foreground p-1 bg-muted/50 rounded">{item}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Dashboard Section */}
            <div className="space-y-2 mb-1">
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
                          <Button variant="outline" size="sm" className="text-xs">
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
                                      <XCircle className="h-3.5 w-3.5 text-destructive" />
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
                          <span className="text-xs text-muted-foreground">{`${t('common.page') || 'Página'} ${currentPageDashboard + 1} ${t('common.of') || 'de'} ${totalPagesDashboard}`}</span>
                          <Button variant="ghost" size="icon" onClick={() => setCurrentPageDashboard(p => Math.min(totalPagesDashboard - 1, p + 1))} disabled={currentPageDashboard === totalPagesDashboard - 1} className="h-7 w-7">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {Array.isArray(formData.userDashboardDetails.otherDashboardFeatures) && formData.userDashboardDetails.otherDashboardFeatures.length > 0 && (
                    <div className="mt-2 space-y-1 border p-2 rounded-md bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Outras Funcionalidades do Painel Adicionadas:</p>
                      {formData.userDashboardDetails.otherDashboardFeatures.map((feat, index) => (
                        <div key={`saved-other-dash-${index}`} className="text-xs text-foreground p-1 bg-muted/50 rounded">{feat}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Color Palette Accordion */}
          <Accordion type="single" collapsible className="w-full mb-1">
            <AccordionItem value="color-palette-accordion" className="border-0">
              <AccordionTrigger className="text-base font-medium text-foreground py-2 hover:no-underline">
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
          </Accordion>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="visual-style-accordion" className="border-0 mb-1">
              <AccordionTrigger className="text-base font-medium text-foreground py-2 hover:no-underline">
                {t('promptGenerator.uxui.visualStyle') || "Estilo Visual"}
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-0">
                <div className="space-y-2">
                  <RadioGroup
                    value={formData.visualStyle === 'other' && (Array.isArray(formData.otherVisualStyles) && formData.otherVisualStyles.length > 0) ? 'other' : formData.visualStyle}
                    onValueChange={(value) => {
                      if (value !== 'other') {
                        updateFormData({ visualStyle: value, otherVisualStyles: [] });
                      } else {
                        updateFormData({ visualStyle: 'other' });
                        if (!Array.isArray(formData.otherVisualStyles) || formData.otherVisualStyles.length === 0) setIsOtherVisualStylePopoverOpen(true);
                      }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-1" 
                  >
                    {visualStyleOptions.map((option) => (
                      <div key={option.value} className="flex items-start space-x-1">
                        <RadioGroupItem value={option.value} id={`visual-style-${option.value}`} className="mt-0.5" />
                        <Label htmlFor={`visual-style-${option.value}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <div className="flex items-center justify-end space-x-2 mt-2 pt-2">
                     <Popover open={isOtherVisualStylePopoverOpen} onOpenChange={setIsOtherVisualStylePopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs ml-auto">
                            <ListPlus className="h-3 w-3 mr-1.5" />
                            {t('promptGenerator.objective.notInList') || "Não está na lista?"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" side="top" align="end">
                          <div className="space-y-3">
                            <Label htmlFor="other-visualstyle-input" className="text-sm font-medium">
                              {t('promptGenerator.uxui.otherVisualStylePlaceholder') || 'Adicionar outro estilo visual:'}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Input id="other-visualstyle-input" value={currentOtherVisualStyleInput} onChange={(e) => setCurrentOtherVisualStyleInput(e.target.value)} placeholder={t('promptGenerator.uxui.otherVisualStylePlaceholder') || 'Seu estilo...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherVisualStyleInput.trim()) handleAddOtherVisualStyle(); }} />
                              <Button size="icon" onClick={handleAddOtherVisualStyle} disabled={!currentOtherVisualStyleInput.trim() || tempOtherVisualStylesList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                            </div>
                            {tempOtherVisualStylesList.length > 0 && (
                              <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                <p className="text-xs text-muted-foreground mb-1">{`Adicionados (${tempOtherVisualStylesList.length}/10):`}</p>
                                {tempOtherVisualStylesList.map((style, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                    <span className="truncate flex-1 mr-2">{style}</span>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherVisualStyle(idx)} className="h-5 w-5"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {tempOtherVisualStylesList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached') || "Limite de 10 atingido."}</p>}
                            <div className="flex justify-end space-x-2 mt-3">
                              <Button size="sm" variant="ghost" onClick={() => setIsOtherVisualStylePopoverOpen(false)} className="text-xs h-8">{'Cancelar'}</Button>
                              <Button size="sm" onClick={handleSaveOtherVisualStyles} disabled={tempOtherVisualStylesList.length === 0 && (!Array.isArray(formData.otherVisualStyles) || formData.otherVisualStyles.length === 0) && !currentOtherVisualStyleInput.trim()} className="text-xs h-8">{'Salvar Outros'}</Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                  </div>
                  {Array.isArray(formData.otherVisualStyles) && formData.otherVisualStyles.length > 0 && (
                    <div className="mt-2 space-y-1 border p-2 rounded-md bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Outros Estilos Visuais Adicionados:</p>
                      {formData.otherVisualStyles.map((style, index) => (
                        <div key={`saved-other-vs-${index}`} className="text-xs text-foreground p-1 bg-muted/50 rounded">{style}</div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="menu-type-accordion" className="border-0 mb-1">
              <AccordionTrigger className="text-base font-medium text-foreground py-2 hover:no-underline">
                {t('promptGenerator.uxui.menuType') || "Tipo de Menu"}
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-0">
                 <div className="space-y-2">
                    <RadioGroup
                        value={formData.menuType === 'other' && (Array.isArray(formData.otherMenuTypes) && formData.otherMenuTypes.length > 0) ? 'other' : formData.menuType}
                        onValueChange={(value) => {
                          if (value !== 'other') {
                            updateFormData({ menuType: value, otherMenuTypes: [] });
                          } else {
                            updateFormData({ menuType: 'other' });
                            if (!Array.isArray(formData.otherMenuTypes) || formData.otherMenuTypes.length === 0) setIsOtherMenuTypePopoverOpen(true);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-1"
                      >
                        {menuTypeOptions.map((option) => (
                          <div key={option.value} className="flex items-start space-x-1">
                            <RadioGroupItem value={option.value} id={`menu-type-${option.value}`} className="mt-0.5"/>
                            <Label htmlFor={`menu-type-${option.value}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <div className="flex items-center justify-end space-x-2 mt-2 pt-2">
                        <Popover open={isOtherMenuTypePopoverOpen} onOpenChange={setIsOtherMenuTypePopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs ml-auto">
                              <ListPlus className="h-3 w-3 mr-1.5" />
                              {t('promptGenerator.objective.notInList') || "Não está na lista?"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-4" side="top" align="end">
                             <div className="space-y-3">
                                <Label htmlFor="other-menutype-input" className="text-sm font-medium">
                                  {t('promptGenerator.uxui.otherMenuTypePlaceholder') || 'Adicionar outro tipo de menu:'}
                                </Label>
                                <div className="flex items-center space-x-2">
                                  <Input id="other-menutype-input" value={currentOtherMenuTypeInput} onChange={(e) => setCurrentOtherMenuTypeInput(e.target.value)} placeholder={t('promptGenerator.uxui.otherMenuTypePlaceholder') || 'Seu tipo de menu...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherMenuTypeInput.trim()) handleAddOtherMenuType(); }} />
                                  <Button size="icon" onClick={handleAddOtherMenuType} disabled={!currentOtherMenuTypeInput.trim() || tempOtherMenuTypesList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                                </div>
                                {tempOtherMenuTypesList.length > 0 && (
                                  <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                    <p className="text-xs text-muted-foreground mb-1">{`Adicionados (${tempOtherMenuTypesList.length}/10):`}</p>
                                    {tempOtherMenuTypesList.map((type, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                        <span className="truncate flex-1 mr-2">{type}</span>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherMenuType(idx)} className="h-5 w-5"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {tempOtherMenuTypesList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached') || "Limite de 10 atingido."}</p>}
                                <div className="flex justify-end space-x-2 mt-3">
                                  <Button size="sm" variant="ghost" onClick={() => setIsOtherMenuTypePopoverOpen(false)} className="text-xs h-8">{'Cancelar'}</Button>
                                  <Button size="sm" onClick={handleSaveOtherMenuTypes} disabled={tempOtherMenuTypesList.length === 0 && (!Array.isArray(formData.otherMenuTypes) || formData.otherMenuTypes.length === 0) && !currentOtherMenuTypeInput.trim()} className="text-xs h-8">{'Salvar Outros'}</Button>
                                </div>
                              </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      {Array.isArray(formData.otherMenuTypes) && formData.otherMenuTypes.length > 0 && (
                        <div className="mt-2 space-y-1 border p-2 rounded-md bg-muted/30">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Outros Tipos de Menu Adicionados:</p>
                          {formData.otherMenuTypes.map((type, index) => (
                            <div key={`saved-other-mt-${index}`} className="text-xs text-foreground p-1 bg-muted/50 rounded">{type}</div>
                          ))}
                        </div>
                      )}
                 </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="authentication-accordion" className="border-0 mb-1">
               <AccordionTrigger className="text-base font-medium text-foreground py-2 hover:no-underline">
                 {t('promptGenerator.uxui.authentication') || "Autenticação"}
               </AccordionTrigger>
               <AccordionContent className="pt-1 pb-0">
                <div className="space-y-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1" style={{ minHeight: `${Math.ceil(itemsPerPage / 2) * 20}px` }}>
                    {currentAuthToDisplay.map((option) => (
                      <div key={option.value} className="flex items-start space-x-1">
                        <Checkbox id={`auth-${option.value}`} checked={formData.authentication.includes(option.value)} onCheckedChange={(checked) => handleAuthMethodChange(option.value, checked === true)} className="mt-0.5"/>
                        <Label htmlFor={`auth-${option.value}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between space-x-2 mt-2">
                    {authOptions.length > 0 && (
                        <Button variant="outline" size="sm" className="text-xs" onClick={toggleSelectAllAuth}>
                            {allAuthSelected ? (t('common.unselectAll') || "Desmarcar Todos") : (t('common.selectAll') || "Marcar Todos")}
                        </Button>
                    )}
                    <div className="flex items-center space-x-2">
                        <Popover open={isOtherAuthPopoverOpen} onOpenChange={setIsOtherAuthPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="text-xs">
                                    <ListPlus className="h-3 w-3 mr-1.5" />
                                    {t('promptGenerator.objective.notInList') || "Não está na lista?"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-4" side="top" align="end">
                               <div className="space-y-3">
                                    <Label htmlFor="other-auth-input" className="text-sm font-medium">
                                    {t('promptGenerator.uxui.otherAuthMethodPlaceholder') || 'Adicionar outro método de autenticação:'}
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                    <Input id="other-auth-input" value={currentOtherAuthInput} onChange={(e) => setCurrentOtherAuthInput(e.target.value)} placeholder={t('promptGenerator.uxui.otherAuthMethodPlaceholder') || 'Seu método...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherAuthInput.trim()) handleAddOtherAuth(); }} />
                                    <Button size="icon" onClick={handleAddOtherAuth} disabled={!currentOtherAuthInput.trim() || tempOtherAuthList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                                    </div>
                                    {tempOtherAuthList.length > 0 && (
                                    <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                        <p className="text-xs text-muted-foreground mb-1">{`Adicionados (${tempOtherAuthList.length}/10):`}</p>
                                        {tempOtherAuthList.map((method, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                            <span className="truncate flex-1 mr-2">{method}</span>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherAuth(idx)} className="h-5 w-5"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                                        </div>
                                        ))}
                                    </div>
                                    )}
                                    {tempOtherAuthList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached') || "Limite de 10 atingido."}</p>}
                                    <div className="flex justify-end space-x-2 mt-3">
                                    <Button size="sm" variant="ghost" onClick={() => setIsOtherAuthPopoverOpen(false)} className="text-xs h-8">{'Cancelar'}</Button>
                                    <Button size="sm" onClick={handleSaveOtherAuths} disabled={tempOtherAuthList.length === 0 && (!Array.isArray(formData.otherAuthMethods) || formData.otherAuthMethods.length === 0) && !currentOtherAuthInput.trim()} className="text-xs h-8">{'Salvar Outros'}</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        {totalPagesAuth > 1 && (
                        <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => setCurrentPageAuth(p => Math.max(0, p - 1))} disabled={currentPageAuth === 0} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-xs text-muted-foreground">{`${t('common.page') || 'Página'} ${currentPageAuth + 1} ${t('common.of') || 'de'} ${totalPagesAuth}`}</span>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentPageAuth(p => Math.min(totalPagesAuth - 1, p + 1))} disabled={currentPageAuth === totalPagesAuth - 1} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                        )}
                    </div>
                  </div>
                  {Array.isArray(formData.otherAuthMethods) && formData.otherAuthMethods.length > 0 && (
                    <div className="mt-2 space-y-1 border p-2 rounded-md bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Outros Métodos de Autenticação Adicionados:</p>
                      {formData.otherAuthMethods.map((method, index) => (
                        <div key={`saved-other-auth-${index}`} className="text-xs text-foreground p-1 bg-muted/50 rounded">{method}</div>
                      ))}
                    </div>
                  )}
                </div>
               </AccordionContent>
            </AccordionItem>
          </Accordion>
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
