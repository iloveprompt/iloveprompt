import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Save, CheckCircle as CheckCircleIcon, ListPlus, PlusCircle, XCircle, ChevronLeft, ChevronRight, Wand2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import stackData from '../data/stackData.json';
import AIAssistantPanel from '../components/AIAssistantPanel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StackFormData {
  separateFrontendBackend: boolean;
  frontend: string[];
  otherFrontend: string[]; // Changed to array
  backend: string[];
  otherBackend: string[]; // Changed to array
  database: string[];
  otherDatabase: string[]; // Changed to array
  hosting: string[];
  otherHosting: string[]; // Changed to array
  fullstack: string[];
  otherFullstack: string[]; // Changed to array
  orm: string[];
  otherOrm: string[]; // Changed to array
}

interface StackStepProps {
  formData: StackFormData;
  updateFormData: (data: Partial<StackFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const itemsPerPage = 6;

const StackStep: React.FC<StackStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized 
}) => {
  const { t } = useLanguage();
  const [aiOpen, setAIOpen] = useState(false);

  // State for Popovers and Pagination
  const [popoverStates, setPopoverStates] = useState({
    frontend: false, backend: false, fullstack: false, database: false, orm: false, hosting: false
  });
  const [currentInputs, setCurrentInputs] = useState({
    frontend: '', backend: '', fullstack: '', database: '', orm: '', hosting: ''
  });
  const [tempLists, setTempLists] = useState<Record<string, string[]>>({
    frontend: [], backend: [], fullstack: [], database: [], orm: [], hosting: []
  });
  const [currentPages, setCurrentPages] = useState({
    frontend: 0, backend: 0, fullstack: 0, database: 0, orm: 0, hosting: 0
  });

  const [techOptionsConfig, setTechOptionsConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createTechOption = (value: string, defaultLabel: string) => ({ value, i18nKey: `promptGenerator.stack.${value}`, defaultText: defaultLabel });

  useEffect(() => {
    try {
      // Agrupar por categoria
      const grouped: any = {};
      if (Array.isArray(stackData)) {
        stackData.forEach((item: any) => {
          if (!grouped[item.category]) grouped[item.category] = [];
          grouped[item.category].push(item);
        });
      }
      setTechOptionsConfig(grouped);
      setLoading(false);
    } catch (e) {
      setError('Erro ao carregar stack');
      setLoading(false);
    }
  }, []);

  type TechCategory = 'frontend' | 'backend' | 'fullstack' | 'database' | 'orm' | 'hosting';

  const singleChoiceCategories: TechCategory[] = ['frontend', 'backend', 'fullstack', 'database', 'orm', 'hosting'];

  const handleTechSelection = (category: TechCategory, optionId: string) => {
    if (singleChoiceCategories.includes(category)) {
      updateFormData({ [category]: [optionId] } as Partial<StackFormData>);
    } else {
      // fallback para múltipla escolha se necessário para outras categorias
      const currentSelection = formData[category] as string[];
      const updatedSelection = currentSelection.includes(optionId)
        ? currentSelection.filter(id => id !== optionId)
        : [...currentSelection, optionId];
      updateFormData({ [category]: updatedSelection } as Partial<StackFormData>);
    }
  };

  const toggleSelectAll = (category: TechCategory) => {
    const optionIds = techOptionsConfig[category].map(opt => opt.id);
    const currentSelection = formData[category] as string[];
    const allSelected = optionIds.length > 0 && optionIds.every(id => currentSelection.includes(id));
    
    if (allSelected) {
      updateFormData({ [category]: currentSelection.filter(item => !optionIds.includes(item)) } as Partial<StackFormData>);
    } else {
      updateFormData({ [category]: Array.from(new Set([...currentSelection, ...optionIds])) } as Partial<StackFormData>);
    }
  };
  
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  useEffect(() => {
    Object.keys(popoverStates).forEach(catStr => {
      const category = catStr as TechCategory;
      if (popoverStates[category]) {
        const otherFieldName = `other${capitalize(category)}` as keyof StackFormData;
        setTempLists(prev => ({ ...prev, [category]: Array.isArray(formData[otherFieldName]) ? formData[otherFieldName] as string[] : [] }));
        setCurrentInputs(prev => ({ ...prev, [category]: '' }));
      }
    });
  }, [popoverStates, formData]);

  const handleAddOtherItem = (category: TechCategory) => {
    if (currentInputs[category].trim() && tempLists[category].length < 10) {
      setTempLists(prev => ({ ...prev, [category]: [...prev[category], currentInputs[category].trim()] }));
      setCurrentInputs(prev => ({ ...prev, [category]: '' }));
    }
  };

  const handleRemoveOtherItem = (category: TechCategory, index: number) => {
    setTempLists(prev => ({ ...prev, [category]: prev[category].filter((_, i) => i !== index) }));
  };

  const handleSaveOtherList = (category: TechCategory) => {
    const otherFieldName = `other${capitalize(category)}` as keyof StackFormData;
    const mainListFieldName = category; // e.g., 'frontend', 'backend'

    const currentMainList = Array.isArray(formData[mainListFieldName]) ? formData[mainListFieldName] as string[] : [];
    // Combine existing main list items with the new temporary "other" items, ensuring uniqueness
    // These are treated as direct strings. If they were keys for translation, further logic would be needed.
    const newMainListItems = Array.from(new Set([...currentMainList, ...tempLists[category]]));
    
    updateFormData({ 
      [otherFieldName]: [...tempLists[category]], // Keep for separate display in this step's UI
      [mainListFieldName]: newMainListItems      // Add to main list for prompt generation
    } as Partial<StackFormData>);
    
    setPopoverStates(prev => ({ ...prev, [category]: false }));
  };
  
  const handleReset = () => {
    resetStep();
    setPopoverStates({ frontend: false, backend: false, fullstack: false, database: false, orm: false, hosting: false });
    setCurrentInputs({ frontend: '', backend: '', fullstack: '', database: '', orm: '', hosting: '' });
    setTempLists({ frontend: [], backend: [], fullstack: [], database: [], orm: [], hosting: [] });
    setCurrentPages({ frontend: 0, backend: 0, fullstack: 0, database: 0, orm: 0, hosting: 0 });
  };

  const handleSaveAndFinalize = () => {
    let hasSelection = false;
    if (formData.separateFrontendBackend) {
      if (formData.frontend.length > 0 || (Array.isArray(formData.otherFrontend) && formData.otherFrontend.length > 0) || 
          formData.backend.length > 0 || (Array.isArray(formData.otherBackend) && formData.otherBackend.length > 0)) {
        hasSelection = true;
      }
    } else {
      if (formData.fullstack.length > 0 || (Array.isArray(formData.otherFullstack) && formData.otherFullstack.length > 0)) {
        hasSelection = true;
      }
    }
    if (!hasSelection && (formData.database.length === 0 && (!Array.isArray(formData.otherDatabase) || formData.otherDatabase.length === 0))) {
        alert(t('promptGenerator.stack.atLeastOneTechError') || "Selecione ao menos uma tecnologia para frontend/backend ou fullstack, e/ou banco de dados.");
        return;
    }
    markAsFinalized();
  };

  const renderTechSection = (
    category: TechCategory,
    titleKey: string,
    defaultTitle: string,
    helpKey?: string,
    defaultHelp?: string
  ) => {
    const options = techOptionsConfig[category];
    const otherFieldName = `other${capitalize(category)}` as keyof StackFormData;
    const otherItems = (Array.isArray(formData[otherFieldName]) ? formData[otherFieldName] : []) as string[];

    const totalPages = Math.ceil(options.length / itemsPerPage);
    const currentItemsToDisplay = options.slice(currentPages[category] * itemsPerPage, (currentPages[category] + 1) * itemsPerPage);
    const allSelected = options.length > 0 && options.every(opt => (formData[category] as string[]).includes(opt.id));

    return (
      <AccordionItem value={`${category}-accordion`} className="border-0">
        <AccordionTrigger className="text-base font-medium text-foreground py-2 hover:no-underline">
          {t(titleKey) || defaultTitle}
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-0">
          <div className="space-y-2">
            {helpKey && <p className="text-xs text-muted-foreground mb-1.5">{t(helpKey) || defaultHelp}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {currentItemsToDisplay.map((option) => (
                <div key={option.id} className="flex items-start space-x-1.5">
                  {singleChoiceCategories.includes(category) ? (
                    <input
                      type="radio"
                      id={`${category}-${option.id}`}
                      name={`radio-${category}`}
                      checked={(formData[category] as string[])[0] === option.id}
                      onChange={() => handleTechSelection(category, option.id)}
                      className="mt-0.5 accent-primary h-4 w-4"
                    />
                  ) : (
                    <Checkbox
                      id={`${category}-${option.id}`}
                      checked={(formData[category] as string[]).includes(option.id)}
                      onCheckedChange={() => handleTechSelection(category, option.id)}
                      className="mt-0.5"
                    />
                  )}
                  <Label htmlFor={`${category}-${option.id}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end space-x-2">
              <Popover open={popoverStates[category]} onOpenChange={(isOpen) => setPopoverStates(prev => ({ ...prev, [category]: isOpen }))}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    <ListPlus className="h-3 w-3 mr-1.5" />
                    {t('promptGenerator.objective.notInList') || "Não está na lista?"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" side="top" align="end">
                  <div className="space-y-3">
                    <Label htmlFor={`other-${category}-input`} className="text-sm font-medium">
                      {t('promptGenerator.stack.specifyOther') || `Adicionar outra tecnologia ${defaultTitle.toLowerCase()}:`}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input id={`other-${category}-input`} value={currentInputs[category]} onChange={(e) => setCurrentInputs(prev => ({ ...prev, [category]: e.target.value }))} placeholder={t('promptGenerator.stack.otherPlaceholder') || 'Sua tecnologia...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentInputs[category].trim()) handleAddOtherItem(category); }} />
                      <Button size="icon" onClick={() => handleAddOtherItem(category)} disabled={!currentInputs[category].trim() || tempLists[category].length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                    </div>
                    {tempLists[category].length > 0 && (
                      <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">{`Adicionadas (${tempLists[category].length}/10):`}</p>
                        {tempLists[category].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                            <span className="truncate flex-1 mr-2">{item}</span>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherItem(category, idx)} className="h-5 w-5"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {tempLists[category].length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached') || "Limite de 10 atingido."}</p>}
                    <div className="flex justify-end space-x-2 mt-3">
                      <Button size="sm" variant="ghost" onClick={() => setPopoverStates(prev => ({ ...prev, [category]: false }))} className="text-xs h-8">{'Cancelar'}</Button>
                      <Button size="sm" onClick={() => handleSaveOtherList(category)} disabled={tempLists[category].length === 0 && otherItems.length === 0 && !currentInputs[category].trim()} className="text-xs h-8">{'Salvar Outras'}</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentPages(prev => ({...prev, [category]: Math.max(0, prev[category] - 1)}))} disabled={currentPages[category] === 0} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                  <span className="text-xs text-muted-foreground">{`${t('common.page') || 'Página'} ${currentPages[category] + 1} ${t('common.of') || 'de'} ${totalPages}`}</span>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentPages(prev => ({...prev, [category]: Math.min(totalPages - 1, prev[category] + 1)}))} disabled={currentPages[category] === totalPages - 1} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                </div>
              )}
            </div>
            {otherItems.length > 0 && (
              <div className="mt-2 border p-2 rounded-md bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground mb-1">{`Outras tecnologias ${defaultTitle.toLowerCase()} adicionadas:`}</p>
                <div className="flex flex-wrap gap-2">
                  {otherItems.map((item, index) => (
                    <div key={`saved-other-${category}-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                      <span className="truncate mr-1.5">{item}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => {
                          const newOther = otherItems.filter((_: any, i: number) => i !== index);
                          const mainList = Array.isArray(formData[category]) ? formData[category].filter((sel: string) => sel !== item) : [];
                          updateFormData({
                            [otherFieldName]: newOther,
                            [category]: mainList
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
    );
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-1">{t('promptGenerator.stack.title') || "Stack Tecnológica"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.stack.description') || "Defina a stack tecnológica do seu projeto"}
              </CardDescription>
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
                    <span>Obter ajuda do assistente de IA para escolher a stack tecnológica</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || (
                  formData.frontend.length === 0 &&
                  formData.backend.length === 0 &&
                  formData.fullstack.length === 0 &&
                  formData.database.length === 0 &&
                  formData.hosting.length === 0 &&
                  formData.orm.length === 0 &&
                  (!Array.isArray(formData.otherFrontend) || formData.otherFrontend.length === 0) &&
                  (!Array.isArray(formData.otherBackend) || formData.otherBackend.length === 0) &&
                  (!Array.isArray(formData.otherFullstack) || formData.otherFullstack.length === 0) &&
                  (!Array.isArray(formData.otherDatabase) || formData.otherDatabase.length === 0) &&
                  (!Array.isArray(formData.otherHosting) || formData.otherHosting.length === 0) &&
                  (!Array.isArray(formData.otherOrm) || formData.otherOrm.length === 0)
                )}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
              </Button>
              {isFinalized && <CheckCircleIcon className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-3 pt-4">
          <div className="flex items-center space-x-2 py-0 my-0"> {/* Changed classes here */}
            <Switch
              checked={formData.separateFrontendBackend}
              onCheckedChange={(checked) => updateFormData({ separateFrontendBackend: checked })}
              id="separateFrontendBackend-toggle"
            />
            <Label htmlFor="separateFrontendBackend-toggle" className="text-sm font-medium text-foreground">
              {t('promptGenerator.stack.separateFrontendBackend') || "Separar Frontend e Backend?"}
            </Label>
          </div>

          <Accordion type="single" collapsible className="w-full" defaultValue={formData.separateFrontendBackend ? "frontend-accordion" : "fullstack-accordion"}>
            {formData.separateFrontendBackend ? (
              <>
                {renderTechSection('frontend', 'promptGenerator.stack.frontendTitle', 'Frontend', 'promptGenerator.stack.frontendHelp', 'Tecnologias para a interface do usuário.')}
                {renderTechSection('backend', 'promptGenerator.stack.backendTitle', 'Backend', 'promptGenerator.stack.backendHelp', 'Tecnologias para a lógica do servidor.')}
              </>
            ) : (
              renderTechSection('fullstack', 'promptGenerator.stack.fullstackTitle', 'Fullstack') // Changed defaultTitle
            )}
            {/* <Separator className="my-3" />  Removed Separator */}
            {renderTechSection('database', 'promptGenerator.stack.databaseTitle', 'Banco de Dados', 'promptGenerator.stack.databaseHelp', 'Sistemas para armazenamento de dados.')}
            {renderTechSection('orm', 'promptGenerator.stack.ormTitle', 'ORM / Ferramentas de BD', 'promptGenerator.stack.ormHelp', 'Mapeamento Objeto-Relacional e ferramentas.')}
            {renderTechSection('hosting', 'promptGenerator.stack.hostingTitle', 'Hospedagem / Deploy', 'promptGenerator.stack.hostingHelp', 'Plataformas para implantar sua aplicação.')}
          </Accordion>
        </CardContent>
      </Card>
      <AIAssistantPanel
        open={aiOpen}
        onClose={() => setAIOpen(false)}
        items={Array.isArray(stackData) ? stackData : []}
        title={t('promptGenerator.stack.title') || 'Stack Tecnológica'}
      />
    </div>
  );
};

export default StackStep;
