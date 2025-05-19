import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import codeStructureData from '../data/codeStructureData.json';

interface CodeStructureFormData {
  folderOrganization: string[];
  otherOrganizationStyle: string[]; // Changed
  architecturalPattern: string[];
  otherArchPattern: string[]; // Changed
  bestPractices: string[];
  otherBestPractice: string[]; // Changed
}

interface CodeStructureStepProps {
  formData: CodeStructureFormData;
  updateFormData: (data: Partial<CodeStructureFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const itemsPerPage = 6;

const CodeStructureStep: React.FC<CodeStructureStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized 
}) => {
  const { t } = useLanguage();

  const [currentPageFolder, setCurrentPageFolder] = useState(0);
  const [isOtherFolderPopoverOpen, setIsOtherFolderPopoverOpen] = useState(false);
  const [currentOtherFolderInput, setCurrentOtherFolderInput] = useState('');
  const [tempOtherFolderList, setTempOtherFolderList] = useState<string[]>([]);

  const [currentPageArch, setCurrentPageArch] = useState(0);
  const [isOtherArchPopoverOpen, setIsOtherArchPopoverOpen] = useState(false);
  const [currentOtherArchInput, setCurrentOtherArchInput] = useState('');
  const [tempOtherArchList, setTempOtherArchList] = useState<string[]>([]);

  const [currentPageBest, setCurrentPageBest] = useState(0);
  const [isOtherBestPopoverOpen, setIsOtherBestPopoverOpen] = useState(false);
  const [currentOtherBestInput, setCurrentOtherBestInput] = useState('');
  const [tempOtherBestList, setTempOtherBestList] = useState<string[]>([]);

  const [folderOptions, setFolderOptions] = useState<any[]>([]);
  const [architectureOptions, setArchitectureOptions] = useState<any[]>([]);
  const [bestPracticeOptions, setBestPracticeOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiOpen, setAIOpen] = useState(false);

  const singleChoiceCategories: Array<'folderOrganization' | 'architecturalPattern'> = ['folderOrganization', 'architecturalPattern'];

  useEffect(() => {
    try {
      if (Array.isArray(codeStructureData)) {
        setFolderOptions(codeStructureData.filter((item: any) => item.category === 'folderOrganization').map((item: any) => item.id));
        setArchitectureOptions(codeStructureData.filter((item: any) => item.category === 'architecturalPattern').map((item: any) => item.id));
        setBestPracticeOptions(codeStructureData.filter((item: any) => item.category === 'bestPractice').map((item: any) => item.id));
      }
      setLoading(false);
    } catch (e) {
      setError('Erro ao carregar estrutura de código');
      setLoading(false);
    }
  }, []);

  const formatKeyAsFallback = (key: string, prefix: string = "") => {
    const effectiveKey = key.startsWith(prefix) ? key.substring(prefix.length) : key;
    return effectiveKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const handleOptionChange = (category: keyof CodeStructureFormData, option: string) => {
    if (singleChoiceCategories.includes(category as any)) {
      updateFormData({ [category]: [option] } as Partial<CodeStructureFormData>);
    } else {
      const currentSelection = formData[category] as string[];
      const updatedOptions = currentSelection.includes(option)
        ? currentSelection.filter(o => o !== option)
        : [...currentSelection, option];
      updateFormData({ [category]: updatedOptions } as Partial<CodeStructureFormData>);
    }
  };

  const createPopoverHandlers = (
    popoverOpenState: boolean,
    setPopoverOpenState: React.Dispatch<React.SetStateAction<boolean>>,
    currentInputState: string,
    setCurrentInputState: React.Dispatch<React.SetStateAction<string>>,
    tempListState: string[],
    setTempListState: React.Dispatch<React.SetStateAction<string[]>>,
    formFieldKey: 'otherOrganizationStyle' | 'otherArchPattern' | 'otherBestPractice'
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
      // Determine the main list key, e.g., 'folderOrganization' from 'otherOrganizationStyle'
      const mainListKey = formFieldKey.replace('other', '').replace('Style', '').replace('Pattern', '').replace('Practice', '') as keyof CodeStructureFormData;
      // Ensure the first letter of mainListKey is lowercase if it's not already, e.g. folderOrganization
      const correctedMainListKey = mainListKey.charAt(0).toLowerCase() + mainListKey.slice(1) as 'folderOrganization' | 'architecturalPattern' | 'bestPractices';

      const currentMainList = Array.isArray(formData[correctedMainListKey]) ? formData[correctedMainListKey] as string[] : [];
      const newMainListItems = Array.from(new Set([...currentMainList, ...tempListState]));
      
      updateFormData({ 
        [formFieldKey]: [...tempListState], // e.g. otherOrganizationStyle
        [correctedMainListKey]: newMainListItems // e.g. folderOrganization
      } as Partial<CodeStructureFormData>);
      setPopoverOpenState(false);
    };
    return { handleAddItem, handleRemoveItem, handleSaveList };
  };

  const folderPopover = createPopoverHandlers(isOtherFolderPopoverOpen, setIsOtherFolderPopoverOpen, currentOtherFolderInput, setCurrentOtherFolderInput, tempOtherFolderList, setTempOtherFolderList, 'otherOrganizationStyle');
  const archPopover = createPopoverHandlers(isOtherArchPopoverOpen, setIsOtherArchPopoverOpen, currentOtherArchInput, setCurrentOtherArchInput, tempOtherArchList, setTempOtherArchList, 'otherArchPattern');
  const bestPopover = createPopoverHandlers(isOtherBestPopoverOpen, setIsOtherBestPopoverOpen, currentOtherBestInput, setCurrentOtherBestInput, tempOtherBestList, setTempOtherBestList, 'otherBestPractice');

  const handleReset = () => {
    resetStep();
    setCurrentPageFolder(0); setIsOtherFolderPopoverOpen(false); setCurrentOtherFolderInput(''); setTempOtherFolderList([]);
    setCurrentPageArch(0); setIsOtherArchPopoverOpen(false); setCurrentOtherArchInput(''); setTempOtherArchList([]);
    setCurrentPageBest(0); setIsOtherBestPopoverOpen(false); setCurrentOtherBestInput(''); setTempOtherBestList([]);
  };

  const handleSaveAndFinalize = () => {
    if (formData.folderOrganization.length === 0 && (!Array.isArray(formData.otherOrganizationStyle) || formData.otherOrganizationStyle.length === 0) &&
        formData.architecturalPattern.length === 0 && (!Array.isArray(formData.otherArchPattern) || formData.otherArchPattern.length === 0) &&
        formData.bestPractices.length === 0 && (!Array.isArray(formData.otherBestPractice) || formData.otherBestPractice.length === 0)) {
      alert(t('promptGenerator.codeStructure.atLeastOneOptionError') || "Selecione ou especifique ao menos uma preferência de estrutura de código.");
      return;
    }
    markAsFinalized();
  };
  
  const toggleSelectAllBestPractices = () => {
    const allSelected = bestPracticeOptions.length > 0 && bestPracticeOptions.every(opt => formData.bestPractices.includes(opt));
    if (allSelected) {
      updateFormData({ bestPractices: [] });
    } else {
      updateFormData({ bestPractices: [...bestPracticeOptions] });
    }
  };

  const renderSection = (
    titleKey: string,
    defaultTitle: string,
    options: string[],
    formDataKey: 'folderOrganization' | 'architecturalPattern' | 'bestPractices',
    otherFormFieldKey: 'otherOrganizationStyle' | 'otherArchPattern' | 'otherBestPractice',
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

    return (
      <AccordionItem value={`${formDataKey}-accordion`} className="border-0">
        <AccordionTrigger className="text-base font-medium text-foreground py-2 hover:no-underline">
          {t(titleKey) || defaultTitle}
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-0">
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {currentItemsToDisplay.map((option) => (
                <div key={option} className="flex items-start space-x-1.5">
                  {(formDataKey === 'folderOrganization' || formDataKey === 'architecturalPattern') ? (
                    <input
                      type="radio"
                      id={`${formDataKey}-${option}`}
                      name={`radio-${formDataKey}`}
                      checked={(formData[formDataKey] as string[])[0] === option}
                      onChange={() => handleOptionChange(formDataKey, option)}
                      className="mt-0.5 accent-primary h-4 w-4"
                    />
                  ) : (
                    <Checkbox
                      id={`${formDataKey}-${option}`}
                      checked={(formData[formDataKey] as string[]).includes(option)}
                      onCheckedChange={(checked) => handleOptionChange(formDataKey, option)}
                      className="mt-0.5"
                    />
                  )}
                  <Label htmlFor={`${formDataKey}-${option}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                    {t(`promptGenerator.codeStructure.${option}`) || formatKeyAsFallback(option)}
                  </Label>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between space-x-2 mt-2 pt-2">
              {formDataKey === 'bestPractices' && options.length > 0 && (
                <Button variant="outline" size="sm" className="text-xs" onClick={toggleSelectAllBestPractices}>
                  {bestPracticeOptions.length > 0 && bestPracticeOptions.every(opt => formData.bestPractices.includes(opt))
                    ? (t('common.unselectAll') || 'Desmarcar Todos')
                    : (t('common.selectAll') || 'Selecionar Todos')}
                </Button>
              )}
              <div className={(formDataKey === 'folderOrganization' || formDataKey === 'architecturalPattern') ? 'flex justify-end flex-1' : ''}>
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
                        {t(`promptGenerator.codeStructure.${otherFormFieldKey}Placeholder`) || `Adicionar outro ${defaultTitle.toLowerCase()}:`}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input id={`other-${formDataKey}-input`} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} placeholder={t(`promptGenerator.codeStructure.${otherFormFieldKey}Placeholder`) || 'Sua preferência...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentInput.trim()) popoverHandlers.handleAddItem(); }} />
                        <Button size="icon" onClick={popoverHandlers.handleAddItem} disabled={!currentInput.trim() || tempList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                      </div>
                      {tempList.length > 0 && (
                        <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                          <p className="text-xs text-muted-foreground mb-1">{`Adicionados (${tempList.length}/10):`}</p>
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
                        <Button size="sm" onClick={popoverHandlers.handleSaveList} disabled={tempList.length === 0 && otherItems.length === 0 && !currentInput.trim()} className="text-xs h-8">{'Salvar Outros'}</Button>
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
                <p className="text-xs font-medium text-muted-foreground mb-1">{`Outros ${defaultTitle.toLowerCase()} adicionados:`}</p>
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
                          updateFormData({
                            [otherFormFieldKey]: newOther,
                            [formDataKey]: (formData[formDataKey] as string[]).filter(sel => sel !== item)
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
              <CardTitle className="mb-1">{t('promptGenerator.codeStructure.title') || "Estrutura de Código"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.codeStructure.description') || "Defina a estrutura do código do seu projeto"}
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
                    <span>Obter ajuda do assistente de IA para definir a estrutura do código</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || (
                  formData.folderOrganization.length === 0 && (!Array.isArray(formData.otherOrganizationStyle) || formData.otherOrganizationStyle.length === 0) &&
                  formData.architecturalPattern.length === 0 && (!Array.isArray(formData.otherArchPattern) || formData.otherArchPattern.length === 0) &&
                  formData.bestPractices.length === 0 && (!Array.isArray(formData.otherBestPractice) || formData.otherBestPractice.length === 0)
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
          <Accordion type="single" collapsible className="w-full" defaultValue="folderOrganization-accordion">
            {renderSection('promptGenerator.codeStructure.folderOrganization', "Organização de Pastas", folderOptions, 'folderOrganization', 'otherOrganizationStyle', currentPageFolder, setCurrentPageFolder, isOtherFolderPopoverOpen, setIsOtherFolderPopoverOpen, currentOtherFolderInput, setCurrentOtherFolderInput, tempOtherFolderList, folderPopover)}
            {renderSection('promptGenerator.codeStructure.architecturalPattern', "Padrão Arquitetural", architectureOptions, 'architecturalPattern', 'otherArchPattern', currentPageArch, setCurrentPageArch, isOtherArchPopoverOpen, setIsOtherArchPopoverOpen, currentOtherArchInput, setCurrentOtherArchInput, tempOtherArchList, archPopover)}
            {renderSection('promptGenerator.codeStructure.bestPractices', "Melhores Práticas", bestPracticeOptions, 'bestPractices', 'otherBestPractice', currentPageBest, setCurrentPageBest, isOtherBestPopoverOpen, setIsOtherBestPopoverOpen, currentOtherBestInput, setCurrentOtherBestInput, tempOtherBestList, bestPopover)}
          </Accordion>
        </CardContent>
      </Card>
      <AIAssistantPanel
        open={aiOpen}
        onClose={() => setAIOpen(false)}
        items={Array.isArray(codeStructureData) ? codeStructureData : []}
        title={t('promptGenerator.codeStructure.title') || 'Estrutura de Código'}
      />
    </div>
  );
};

export default CodeStructureStep;
