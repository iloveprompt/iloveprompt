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
import restrictionsData from '../data/restrictionsData.json';

interface RestrictionsFormData {
  avoidInCode: string[];
  otherRestriction: string[]; // Changed
}

interface RestrictionsStepProps {
  formData: RestrictionsFormData;
  updateFormData: (data: Partial<RestrictionsFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const itemsPerPage = 6;

const RestrictionsStep: React.FC<RestrictionsStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized 
}) => {
  const { t } = useLanguage();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [isOtherPopoverOpen, setIsOtherPopoverOpen] = useState(false);
  const [currentOtherInput, setCurrentOtherInput] = useState('');
  const [tempOtherList, setTempOtherList] = useState<string[]>([]);
  const [restrictionOptions, setRestrictionOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiOpen, setAIOpen] = useState(false);

  useEffect(() => {
    try {
      setRestrictionOptions(Array.isArray(restrictionsData) ? restrictionsData.map((item: any) => item.id) : []);
      setLoading(false);
    } catch (e) {
      setError('Erro ao carregar restrições');
      setLoading(false);
    }
  }, []);

  const handleRestrictionChange = (option: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...formData.avoidInCode, option]
      : formData.avoidInCode.filter(o => o !== option);
    updateFormData({ avoidInCode: updatedOptions });
  };

  const toggleSelectAll = () => {
    const allSelectedCurrently = restrictionOptions.every(opt => formData.avoidInCode.includes(opt));
    if (allSelectedCurrently) {
      updateFormData({ avoidInCode: formData.avoidInCode.filter(r => !restrictionOptions.includes(r)) });
    } else {
      updateFormData({ avoidInCode: Array.from(new Set([...formData.avoidInCode, ...restrictionOptions])) });
    }
  };

  const allSelected = restrictionOptions.length > 0 && restrictionOptions.every(opt => formData.avoidInCode.includes(opt));

  useEffect(() => {
    if (isOtherPopoverOpen) {
      setTempOtherList(Array.isArray(formData.otherRestriction) ? formData.otherRestriction : []);
      setCurrentOtherInput('');
    }
  }, [isOtherPopoverOpen, formData.otherRestriction]);

  const handleAddOtherItem = () => {
    if (currentOtherInput.trim() && tempOtherList.length < 10) {
      setTempOtherList([...tempOtherList, currentOtherInput.trim()]);
      setCurrentOtherInput('');
    }
  };
  const handleRemoveOtherItem = (index: number) => setTempOtherList(tempOtherList.filter((_, i) => i !== index));
  const handleSaveOtherList = () => {
    // Remove duplicados entre avoidInCode e tempOtherList
    const currentAvoidInCode = Array.isArray(formData.avoidInCode) ? formData.avoidInCode.filter(item => !tempOtherList.includes(item)) : [];
    const newAvoidInCode = Array.from(new Set([...currentAvoidInCode, ...tempOtherList]));
    updateFormData({ 
      otherRestriction: tempOtherList, // Só para exibir no campo visual
      avoidInCode: newAvoidInCode    // Só para o Preview, sem duplicidade
    });
    setIsOtherPopoverOpen(false);
  };

  const handleReset = () => {
    resetStep();
    setCurrentPage(0);
    setIsOtherPopoverOpen(false);
    setCurrentOtherInput('');
    setTempOtherList([]);
  };

  const handleSaveAndFinalize = () => {
    // This step can be finalized even if empty, as restrictions are optional.
    markAsFinalized();
  };
  
  const totalPages = Math.ceil(restrictionOptions.length / itemsPerPage);
  const currentItemsToDisplay = restrictionOptions.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <Card className={`p-4 sm:p-6 relative${isFinalized ? ' border-2 border-green-500' : ''}`}>
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-1">{t('promptGenerator.restrictions.title') || "Restrições"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.restrictions.description') || "Defina as restrições do seu projeto"}
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
                    <span>Obter ajuda do assistente de IA para definir as restrições</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || (formData.avoidInCode.length === 0 && (!Array.isArray(formData.otherRestriction) || formData.otherRestriction.length === 0))}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
              </Button>
              {isFinalized && <CheckCircleIcon className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-3 pt-4">
          <Accordion type="single" collapsible className="w-full" defaultValue="restrictions-accordion">
            <AccordionItem value="restrictions-accordion" className="border-0">
              <AccordionTrigger className="text-base font-medium text-foreground py-2 hover:no-underline">
                {t('promptGenerator.restrictions.avoidInCode') || "Coisas a Evitar no Código"}
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-0">
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5"> {/* Removed minHeight style */}
                    {currentItemsToDisplay.map((option) => (
                      <div key={option} className="flex items-start space-x-1.5"> {/* Removed h-7 */}
                        <Checkbox 
                          id={`restriction-${option}`}
                          checked={formData.avoidInCode.includes(option)}
                          onCheckedChange={(checked) => 
                            handleRestrictionChange(option, checked === true)
                          }
                          className="mt-0.5"
                        />
                        <Label htmlFor={`restriction-${option}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                          {t(`promptGenerator.restrictions.${option}`) || option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between space-x-2 mt-2 pt-2">
                    {restrictionOptions.length > 0 && (
                      <Button variant="outline" size="sm" className="text-xs" onClick={toggleSelectAll}>
                        {allSelected ? (t('common.unselectAll') || 'Desmarcar Todos') : (t('common.selectAll') || 'Selecionar Todos')}
                      </Button>
                    )}
                    <div className="flex items-center space-x-2">
                      <Popover open={isOtherPopoverOpen} onOpenChange={setIsOtherPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs">
                            <ListPlus className="h-3 w-3 mr-1.5" />
                            {t('promptGenerator.objective.notInList') || "Não está na lista?"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" side="top" align="end">
                          <div className="space-y-3">
                            <Label htmlFor="other-restriction-input" className="text-sm font-medium">
                              {t('promptGenerator.restrictions.otherRestrictionPlaceholder') || 'Adicionar outra restrição:'}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Input id="other-restriction-input" value={currentOtherInput} onChange={(e) => setCurrentOtherInput(e.target.value)} placeholder={t('promptGenerator.restrictions.otherRestrictionPlaceholder') || 'Sua restrição...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherInput.trim()) handleAddOtherItem(); }} />
                              <Button size="icon" onClick={handleAddOtherItem} disabled={!currentOtherInput.trim() || tempOtherList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                            </div>
                            {tempOtherList.length > 0 && (
                              <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                <p className="text-xs text-muted-foreground mb-1">{`Adicionadas (${tempOtherList.length}/10):`}</p>
                                {tempOtherList.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                    <span className="truncate flex-1 mr-2">{item}</span>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherItem(idx)} className="h-5 w-5"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {tempOtherList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached') || "Limite de 10 atingido."}</p>}
                            <div className="flex justify-end space-x-2 mt-3">
                              <Button size="sm" variant="ghost" onClick={() => setIsOtherPopoverOpen(false)} className="text-xs h-8">{'Cancelar'}</Button>
                              <Button size="sm" onClick={handleSaveOtherList} disabled={tempOtherList.length === 0 && (!Array.isArray(formData.otherRestriction) || formData.otherRestriction.length === 0) && !currentOtherInput.trim()} className="text-xs h-8">{'Salvar Outras'}</Button>
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
                  {Array.isArray(formData.otherRestriction) && formData.otherRestriction.length > 0 && (
                    <div className="mt-2 border p-2 rounded-md bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Outras Restrições Adicionadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.otherRestriction.map((item, index) => (
                          <div key={`saved-other-restriction-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                            <span className="truncate mr-1.5">{item}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => {
                                const newOther = formData.otherRestriction.filter((_, i) => i !== index);
                                // Remove também de avoidInCode se existir
                                const newAvoid = Array.isArray(formData.avoidInCode) ? formData.avoidInCode.filter(r => r !== item) : [];
                                updateFormData({
                                  otherRestriction: newOther,
                                  avoidInCode: newAvoid
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
        </CardContent>
        <AIAssistantPanel
          open={aiOpen}
          onClose={() => setAIOpen(false)}
          items={Array.isArray(restrictionsData) ? restrictionsData : []}
          title={t('promptGenerator.restrictions.title') || 'Restrições'}
        />
      </Card>
    </div>
  );
};

export default RestrictionsStep;
