import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Save, CheckCircle as CheckCircleIcon, ListPlus, PlusCircle, Trash2, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AIAssistantPanel from '../components/AIAssistantPanel';
import scalabilityData from '../data/scalabilityData.json';

interface ScalabilityFormData {
  isScalable: boolean;
  scalabilityFeatures: string[];
  otherScalabilityFeature: string[]; // Changed
  performanceFeatures: string[];
  otherPerformanceFeature: string[]; // Changed
}

interface ScalabilityStepProps {
  formData: ScalabilityFormData;
  updateFormData: (data: Partial<ScalabilityFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const itemsPerPage = 6;

const ScalabilityStep: React.FC<ScalabilityStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  const { t } = useLanguage();
  
  const [currentPageScalability, setCurrentPageScalability] = useState(0);
  const [isOtherScalabilityPopoverOpen, setIsOtherScalabilityPopoverOpen] = useState(false);
  const [currentOtherScalabilityInput, setCurrentOtherScalabilityInput] = useState('');
  const [tempOtherScalabilityList, setTempOtherScalabilityList] = useState<string[]>([]);

  const [currentPagePerformance, setCurrentPagePerformance] = useState(0);
  const [isOtherPerformancePopoverOpen, setIsOtherPerformancePopoverOpen] = useState(false);
  const [currentOtherPerformanceInput, setCurrentOtherPerformanceInput] = useState('');
  const [tempOtherPerformanceList, setTempOtherPerformanceList] = useState<string[]>([]);

  const [scalabilityOptions, setScalabilityOptions] = useState<any[]>([]);
  const [performanceOptions, setPerformanceOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiOpen, setAIOpen] = useState(false);

  useEffect(() => {
    try {
      if (Array.isArray(scalabilityData)) {
        setScalabilityOptions(scalabilityData.filter((item: any) => item.category === 'scalability').map((item: any) => item.id));
        setPerformanceOptions(scalabilityData.filter((item: any) => item.category === 'performance').map((item: any) => item.id));
      }
      setLoading(false);
    } catch (e) {
      setError('Erro ao carregar opções de escalabilidade');
      setLoading(false);
    }
  }, []);

  const handleIsScalableChange = useCallback((value: boolean) => {
    updateFormData({ isScalable: value });
    if (!value) { // If toggled off, clear related fields
      updateFormData({ 
        scalabilityFeatures: [], 
        otherScalabilityFeature: [],
        performanceFeatures: [],
        otherPerformanceFeature: []
      });
    }
  }, [updateFormData]);

  const handleCheckboxChange = (category: 'scalabilityFeatures' | 'performanceFeatures', option: string, checked: boolean) => {
    const currentSelection = formData[category] as string[];
    const updatedOptions = checked
      ? [...currentSelection, option]
      : currentSelection.filter(o => o !== option);
    updateFormData({ [category]: updatedOptions } as Partial<ScalabilityFormData>);
  };

  const createPopoverHandlers = (
    popoverOpenState: boolean,
    setPopoverOpenState: React.Dispatch<React.SetStateAction<boolean>>,
    currentInputState: string,
    setCurrentInputState: React.Dispatch<React.SetStateAction<string>>,
    tempListState: string[],
    setTempListState: React.Dispatch<React.SetStateAction<string[]>>,
    formFieldKey: 'otherScalabilityFeature' | 'otherPerformanceFeature'
  ) => {
    useEffect(() => {
      if (popoverOpenState) {
        setTempListState(Array.isArray(formData[formFieldKey]) ? formData[formFieldKey] : []);
        setCurrentInputState('');
      }
    }, [popoverOpenState, formData[formFieldKey]]);

    const handleAddItem = () => {
      if (currentInputState.trim() && tempListState.length < 10) {
        setTempListState([...tempListState, currentInputState.trim()]);
        setCurrentInputState('');
      }
    };
    const handleRemoveItem = (index: number) => setTempListState(tempListState.filter((_, i) => i !== index));
    const handleSaveList = () => {
      // Determine the main list key, e.g., 'scalabilityFeatures' from 'otherScalabilityFeature'
      const mainListKey = formFieldKey.replace('other', '').replace('Feature', 'Features').toLowerCase() as keyof ScalabilityFormData;
      
      // Ensure the first letter of mainListKey is lowercase if it's not already, e.g. scalabilityFeatures
      const correctedMainListKey = mainListKey.charAt(0).toLowerCase() + mainListKey.slice(1) as 'scalabilityFeatures' | 'performanceFeatures';

      const currentMainList = Array.isArray(formData[correctedMainListKey]) ? formData[correctedMainListKey] as string[] : [];
      const newMainListItems = Array.from(new Set([...currentMainList, ...tempListState]));

      updateFormData({ 
        [formFieldKey]: tempListState, // otherScalabilityFeature or otherPerformanceFeature
        [correctedMainListKey]: newMainListItems // scalabilityFeatures or performanceFeatures
      } as Partial<ScalabilityFormData>);
      setPopoverOpenState(false);
    };
    return { handleAddItem, handleRemoveItem, handleSaveList };
  };

  const scalabilityPopover = createPopoverHandlers(isOtherScalabilityPopoverOpen, setIsOtherScalabilityPopoverOpen, currentOtherScalabilityInput, setCurrentOtherScalabilityInput, tempOtherScalabilityList, setTempOtherScalabilityList, 'otherScalabilityFeature');
  const performancePopover = createPopoverHandlers(isOtherPerformancePopoverOpen, setIsOtherPerformancePopoverOpen, currentOtherPerformanceInput, setCurrentOtherPerformanceInput, tempOtherPerformanceList, setTempOtherPerformanceList, 'otherPerformanceFeature');

  const handleReset = () => {
    resetStep();
    setCurrentPageScalability(0); setIsOtherScalabilityPopoverOpen(false); setCurrentOtherScalabilityInput(''); setTempOtherScalabilityList([]);
    setCurrentPagePerformance(0); setIsOtherPerformancePopoverOpen(false); setCurrentOtherPerformanceInput(''); setTempOtherPerformanceList([]);
  };

  const handleSaveAndFinalize = () => {
    if (formData.isScalable && 
        formData.scalabilityFeatures.length === 0 && 
        (!Array.isArray(formData.otherScalabilityFeature) || formData.otherScalabilityFeature.length === 0) &&
        formData.performanceFeatures.length === 0 &&
        (!Array.isArray(formData.otherPerformanceFeature) || formData.otherPerformanceFeature.length === 0)
        ) {
      alert(t('promptGenerator.scalability.atLeastOneFeatureWhenScalableError') || "Selecione ou especifique ao menos um recurso de escalabilidade ou performance quando o projeto é escalável.");
      return;
    }
    markAsFinalized();
  };

  const renderFeatureSection = (
    titleKey: string,
    defaultTitle: string,
    options: string[],
    formDataKey: 'scalabilityFeatures' | 'performanceFeatures',
    otherFormFieldKey: 'otherScalabilityFeature' | 'otherPerformanceFeature',
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    isPopoverOpen: boolean,
    setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>,
    currentInput: string,
    setCurrentInput: React.Dispatch<React.SetStateAction<string>>,
    tempList: string[],
    popoverHandlers: { handleAddItem: () => void; handleRemoveItem: (index: number) => void; handleSaveList: () => void; }
  ) => {
    const totalPages = Math.ceil(options.length / itemsPerPage);
    const currentItemsToDisplay = options.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const allSelected = options.length > 0 && options.every(opt => (formData[formDataKey] as string[]).includes(opt));
    const otherItems = (Array.isArray(formData[otherFormFieldKey]) ? formData[otherFormFieldKey] : []) as string[];

    const toggleSelectAllForSection = () => {
      if (allSelected) {
        updateFormData({ [formDataKey]: [] } as Partial<ScalabilityFormData>);
      } else {
        updateFormData({ [formDataKey]: [...options] } as Partial<ScalabilityFormData>);
      }
    };
    
    return (
      <AccordionItem value={`${formDataKey}-accordion`} className="border-0">
        <AccordionTrigger className="text-base font-medium text-foreground py-2 hover:no-underline">
          {t(titleKey) || defaultTitle}
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-0">
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5"> {/* Removed minHeight style */}
              {currentItemsToDisplay.map((option) => (
                <div key={option} className="flex items-start space-x-1.5"> {/* Removed h-7 */}
                  <Checkbox 
                    id={`${formDataKey}-${option}`}
                    checked={(formData[formDataKey] as string[]).includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange(formDataKey, option, checked === true)}
                    className="mt-0.5"
                  />
                  <Label htmlFor={`${formDataKey}-${option}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                    {t(`promptGenerator.scalability.${option}`) || option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between space-x-2 mt-2 pt-2">
              {options.length > 0 && (
                <Button variant="outline" size="sm" className="text-xs" onClick={toggleSelectAllForSection}>
                  {allSelected ? (t('common.unselectAll') || 'Desmarcar Todos') : (t('common.selectAll') || 'Selecionar Todos')}
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <ListPlus className="h-3 w-3 mr-1.5" />
                      {t('promptGenerator.objective.notInList') || "Não está na lista?"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" side="top" align="end">
                    <div className="space-y-3">
                      <Label htmlFor={`other-${formDataKey}-input`} className="text-sm font-medium">
                        {t(`promptGenerator.scalability.${otherFormFieldKey}Placeholder`) || `Adicionar outra característica de ${defaultTitle.toLowerCase()}:`}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input id={`other-${formDataKey}-input`} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} placeholder={t(`promptGenerator.scalability.${otherFormFieldKey}Placeholder`) || 'Sua característica...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentInput.trim()) popoverHandlers.handleAddItem(); }} />
                        <Button size="icon" onClick={popoverHandlers.handleAddItem} disabled={!currentInput.trim() || tempList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                      </div>
                      {tempList.length > 0 && (
                        <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                          <p className="text-xs text-muted-foreground mb-1">{`Adicionadas (${tempList.length}/10):`}</p>
                          {tempList.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                              <span className="truncate flex-1 mr-2">{item}</span>
                              <Button variant="ghost" size="icon" onClick={() => popoverHandlers.handleRemoveItem(idx)} className="h-5 w-5"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                            </div>
                          ))}
                        </div>
                      )}
                      {tempList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached') || "Limite de 10 atingido."}</p>}
                      <div className="flex justify-end space-x-2 mt-3">
                        <Button size="sm" variant="ghost" onClick={() => setIsPopoverOpen(false)} className="text-xs h-8">{'Cancelar'}</Button>
                        <Button size="sm" onClick={popoverHandlers.handleSaveList} disabled={tempList.length === 0 && otherItems.length === 0 && !currentInput.trim()} className="text-xs h-8">{'Salvar Outras'}</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-xs text-muted-foreground">{`${t('common.page') || 'Página'} ${currentPage + 1} ${t('common.of') || 'de'} ${totalPages}`}</span>
                    <Button variant="ghost" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            </div>
            {otherItems.length > 0 && (
              <div className="mt-2 border p-2 rounded-md bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground mb-1">{`Outras características de ${defaultTitle.toLowerCase()} adicionadas:`}</p>
                <div className="flex flex-wrap gap-2">
                  {otherItems.map((item, index) => (
                    <div key={`saved-other-${formDataKey}-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                      <span className="truncate mr-1.5">{item}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => {
                          const newOther = otherItems.filter((_, i) => i !== index);
                          const mainList = Array.isArray(formData[formDataKey]) ? formData[formDataKey].filter((sel: string) => sel !== item) : [];
                          updateFormData({
                            [otherFormFieldKey]: newOther,
                            [formDataKey]: mainList
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
      <Card className={`p-4 sm:p-6 relative${isFinalized ? ' border-2 border-green-500' : ''}`}>
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-1">{t('promptGenerator.scalability.title') || "Escalabilidade"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.scalability.description') || "Defina os requisitos de escalabilidade do seu projeto"}
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
                    <span>Obter ajuda do assistente de IA para definir os requisitos de escalabilidade</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || (
                  formData.scalabilityFeatures.length === 0 &&
                  formData.performanceFeatures.length === 0 &&
                  (!Array.isArray(formData.otherScalabilityFeature) || formData.otherScalabilityFeature.length === 0) &&
                  (!Array.isArray(formData.otherPerformanceFeature) || formData.otherPerformanceFeature.length === 0)
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
          <div className="flex items-center space-x-1.5">
            <Switch
              id="isScalable-switch"
              checked={formData.isScalable}
              onCheckedChange={handleIsScalableChange}
            />
            <Label htmlFor="isScalable-switch" className="text-sm font-medium">
              {t('promptGenerator.scalability.isScalable') || "Seu projeto precisa ser altamente escalável?"}
            </Label>
          </div>

          {formData.isScalable && (
            <Accordion type="single" collapsible className="w-full" defaultValue="scalabilityFeatures-accordion">
              {renderFeatureSection('promptGenerator.scalability.scalability', "Escalabilidade", scalabilityOptions, 'scalabilityFeatures', 'otherScalabilityFeature', currentPageScalability, setCurrentPageScalability, isOtherScalabilityPopoverOpen, setIsOtherScalabilityPopoverOpen, currentOtherScalabilityInput, setCurrentOtherScalabilityInput, tempOtherScalabilityList, scalabilityPopover)}
              {renderFeatureSection('promptGenerator.scalability.performance', "Performance", performanceOptions, 'performanceFeatures', 'otherPerformanceFeature', currentPagePerformance, setCurrentPagePerformance, isOtherPerformancePopoverOpen, setIsOtherPerformancePopoverOpen, currentOtherPerformanceInput, setCurrentOtherPerformanceInput, tempOtherPerformanceList, performancePopover)}
            </Accordion>
          )}
        </CardContent>

        <AIAssistantPanel
          open={aiOpen}
          onClose={() => setAIOpen(false)}
          items={Array.isArray(scalabilityData) ? scalabilityData : []}
          title={t('promptGenerator.scalability.title') || 'Escalabilidade'}
        />
      </Card>
    </div>
  );
};

export default ScalabilityStep;
