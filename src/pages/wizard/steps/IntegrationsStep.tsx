import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { RotateCcw, Save, CheckCircle as CheckCircleIcon, ListPlus, PlusCircle, XCircle, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import integrationsData from '../data/integrationsData.json';
import { Switch } from "@/components/ui/switch";
import AIAssistantPanel from '../components/AIAssistantPanel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IntegrationsFormData {
  selectedIntegrations: string[];
  otherIntegrations?: string[];
}

interface IntegrationsStepProps {
  formData: IntegrationsFormData;
  updateFormData: (data: Partial<IntegrationsFormData>) => void;
  markAsFinalized?: () => void;
  resetStep?: () => void;
  isFinalized?: boolean;
}

const itemsPerPage = 12;

const IntegrationsStep: React.FC<IntegrationsStepProps> = ({ formData, updateFormData, markAsFinalized, resetStep, isFinalized }) => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [isOtherPopoverOpen, setIsOtherPopoverOpen] = useState(false);
  const [currentOtherInput, setCurrentOtherInput] = useState('');
  const [tempOtherList, setTempOtherList] = useState<string[]>([]);
  const [needsIntegrations, setNeedsIntegrations] = useState(false);
  const [aiOpen, setAIOpen] = useState(false);

  const allOptions = integrationsData.map(item => item.id);
  const selected = formData.selectedIntegrations || [];
  const otherItems = formData.otherIntegrations || [];

  const totalPages = Math.ceil(integrationsData.length / itemsPerPage);
  const optionsToShow = integrationsData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Handlers
  const handleCheckboxChange = (option: string, checked: boolean) => {
    const updated = checked
      ? [...selected, option]
      : selected.filter(o => o !== option);
    updateFormData({ selectedIntegrations: updated });
  };
  
  const handleSelectAll = () => {
    if (selected.length === allOptions.length) {
      updateFormData({ selectedIntegrations: [] });
    } else {
      updateFormData({ selectedIntegrations: allOptions });
    }
  };

  // Popover para outros
  useEffect(() => {
    if (isOtherPopoverOpen) {
      setTempOtherList(Array.isArray(otherItems) ? otherItems : []);
      setCurrentOtherInput('');
    }
  }, [isOtherPopoverOpen, otherItems]);
  
  const handleAddOther = () => {
    if (currentOtherInput.trim() && tempOtherList.length < 10) {
      setTempOtherList([...tempOtherList, currentOtherInput.trim()]);
      setCurrentOtherInput('');
    }
  };
  const handleRemoveOther = (index: number) => setTempOtherList(tempOtherList.filter((_, i) => i !== index));
  const handleSaveOther = () => {
    updateFormData({ otherIntegrations: tempOtherList });
    setIsOtherPopoverOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-1">{t('promptGenerator.integrations.title')}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.integrations.description')}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {resetStep && (
                <Button variant="outline" onClick={resetStep} size="icon" className="h-8 w-8">
                  <RotateCcw className="h-4 w-4" />
                  <span className="sr-only">{t('common.reset')}</span>
                </Button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => setAIOpen(true)} size="icon" className="h-8 w-8">
                      <Wand2 className="h-4 w-4 text-blue-500" />
                      <span className="sr-only">Assistente de IA</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <span>Obter ajuda do assistente de IA para escolher as integrações</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {markAsFinalized && (
                <Button 
                  onClick={markAsFinalized} 
                  size="icon" 
                  className="h-8 w-8"
                  disabled={isFinalized || selected.length === 0 || !needsIntegrations}
                >
                  <Save className="h-4 w-4" />
                  <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
                </Button>
              )}
              {isFinalized && <CheckCircleIcon className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-3 pt-4">
          {/* Switch Projeto precisa de Integrações */}
          <div className="flex items-center space-x-1.5 mb-2">
            <Switch
              id="needsIntegrations-switch"
              checked={needsIntegrations}
              onCheckedChange={setNeedsIntegrations}
            />
            <Label htmlFor="needsIntegrations-switch" className="text-sm font-medium">
              {t('promptGenerator.integrations.needsIntegrations')}
            </Label>
          </div>
          {/* Só mostra a lista se needsIntegrations estiver true */}
          {needsIntegrations && (
            <>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  {optionsToShow.map(option => (
                    <div key={option.id} className="flex items-start space-x-1.5">
                      <Checkbox 
                        id={`integration-${option.id}`}
                        checked={selected.includes(option.id)}
                        onCheckedChange={(checked) => handleCheckboxChange(option.id, checked === true)}
                        className="mt-0.5"
                      />
                      <Label htmlFor={`integration-${option.id}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                        {t(`promptGenerator.integrations.options.${option.id}`) || option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              {/* Controles abaixo da lista */}
              <div className="flex items-center justify-between mt-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={handleSelectAll}>
                  {selected.length === allOptions.length ? t('common.unselectAll') : t('common.selectAll')}
                </Button>
                <div className="flex items-center space-x-2">
                  <Popover open={isOtherPopoverOpen} onOpenChange={setIsOtherPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ListPlus className="h-3 w-3 mr-1.5" />
                        {t('promptGenerator.integrations.otherIntegration') || "Não está na lista?"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" side="top" align="end">
                      <div className="space-y-3">
                        <Label htmlFor={`other-integration-input`} className="text-sm font-medium">
                          {t('promptGenerator.integrations.otherPlaceholder') || 'Adicionar outra integração:'}
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input id={`other-integration-input`} value={currentOtherInput} onChange={(e) => setCurrentOtherInput(e.target.value)} placeholder={t('promptGenerator.integrations.otherPlaceholder') || 'Sua integração...'} className="text-xs h-8" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherInput.trim()) handleAddOther(); }} />
                          <Button size="icon" onClick={handleAddOther} disabled={!currentOtherInput.trim() || tempOtherList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                        </div>
                        {tempOtherList.length > 0 && (
                          <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                            <p className="text-xs text-muted-foreground mb-1">{`Adicionadas (${tempOtherList.length}/10):`}</p>
                            {tempOtherList.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                <span className="truncate flex-1 mr-2">{item}</span>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveOther(idx)} className="h-5 w-5"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                              </div>
                            ))}
                          </div>
                        )}
                        {tempOtherList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached') || "Limite de 10 atingido."}</p>}
                        <div className="flex justify-end space-x-2 mt-3">
                          <Button size="sm" variant="ghost" onClick={() => setIsOtherPopoverOpen(false)} className="text-xs h-8">{t('common.cancel') || 'Cancelar'}</Button>
                          <Button size="sm" onClick={handleSaveOther} disabled={tempOtherList.length === 0 && otherItems.length === 0 && !currentOtherInput.trim()} className="text-xs h-8">{t('common.save') || 'Salvar Outras'}</Button>
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
              {/* Outros itens salvos, se houver */}
              {otherItems.length > 0 && (
                <div className="mt-2 space-y-1 border p-2 rounded-md bg-muted/30">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{t('promptGenerator.integrations.otherAdded') || 'Outras integrações adicionadas:'}</p>
                  {otherItems.map((item, index) => (
                    <div key={`saved-other-integration-${index}`} className="text-xs text-foreground p-1 bg-muted/50 rounded">{item}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <AIAssistantPanel
        open={aiOpen}
        onClose={() => setAIOpen(false)}
        items={Array.isArray(integrationsData) ? integrationsData : []}
        title={t('promptGenerator.integrations.title') || 'Integrações'}
      />
    </div>
  );
};

export default IntegrationsStep;
