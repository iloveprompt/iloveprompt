import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'; // Restoring Button import
import { Checkbox } from '@/components/ui/checkbox';
import { Wand2, ChevronLeft, ChevronRight, ListPlus, PlusCircle, Trash2, RotateCcw, Save, CheckCircle as CheckCircleIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import objectivesData from '../data/objectivesData.json';
import systemTypesData from '../data/systemTypesData.json';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { enhancePrompt } from '@/services/llmService';
import { toast } from '@/components/ui/use-toast';
import AIAssistantPanel from '../components/AIAssistantPanel';
import objectiveData from '../data/objectivesData.json';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useLlm } from '@/contexts/LlmContext';

interface ObjectiveFormData {
  defineObjectives: boolean;
  primaryObjective: string;
  selectedObjectives: string[];
  otherObjective: string[];
  systemType?: string;
  systemTypeCustom?: string;
}

interface ObjectiveStepProps {
  formData: ObjectiveFormData;
  updateFormData: (data: Partial<ObjectiveFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
  onAiEnhanced?: (texto: string) => void;
  systemTypeSelected?: string;
  systemTypeOther?: string;
}

// Definir cor padrão para badge
const BADGE_COLOR = '#4ade80'; // verde

// Função utilitária para exibir o mesmo texto do SystemTypeStep
function getSystemTypeDisplay(typeId: string): string {
  const typeObj = Array.isArray(systemTypesData) ? systemTypesData.find((item: any) => item.id === typeId) : null;
  if (typeObj) {
    if (typeObj.label && typeObj.description) {
      return `${typeObj.label} - ${typeObj.description}`;
    }
    if (typeObj.label) return typeObj.label;
  }
  return typeId ? typeId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : '';
}

const ObjectiveStep: React.FC<ObjectiveStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized,
  onAiEnhanced,
  systemTypeSelected,
  systemTypeOther
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { llms } = useLlm();
  const activeLlm = llms.find(l => l.is_active);
  
  const [businessObjectivesOptions, setBusinessObjectivesOptions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [tempList, setTempList] = useState<string[]>([]);
  const [aiOpen, setAIOpen] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Badge do tipo
  let systemTypeLabel = '';
  if (systemTypeSelected && systemTypeSelected !== 'other') {
    systemTypeLabel = getSystemTypeDisplay(systemTypeSelected);
  } else if (systemTypeSelected === 'other' && systemTypeOther) {
    systemTypeLabel = systemTypeOther;
  }

  // Placeholder ajustado conforme solicitado
  const objetivoPlaceholder = systemTypeLabel
    ? `Criar um ${systemTypeLabel}, com o(s) seguinte(s) objetivo(s) :`
    : 'Criar um [tipo], com o(s) seguinte(s) objetivo(s) :';

  // Preencher automaticamente o campo de objetivo principal com o texto de exemplo se estiver vazio
  useEffect(() => {
    if (!formData.primaryObjective && objetivoPlaceholder) {
      updateFormData({ primaryObjective: objetivoPlaceholder });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objetivoPlaceholder]);

  React.useEffect(() => {
    try {
      setBusinessObjectivesOptions(Array.isArray(objectivesData) ? objectivesData : []);
      setLoading(false);
    } catch (e) {
      setError('Erro ao carregar objetivos de negócio');
      setLoading(false);
    }
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6; 
  const [isOtherPopoverOpen, setIsOtherPopoverOpen] = useState(false);
  const [currentOtherObjectiveInput, setCurrentOtherObjectiveInput] = useState('');
  const [tempOtherObjectivesList, setTempOtherObjectivesList] = useState<string[]>([]);
  
  // Ensure formData.otherObjective is always an array
  const otherObjectivesArray = Array.isArray(formData.otherObjective) ? formData.otherObjective : [];

  // Effect to initialize tempOtherObjectivesList when popover opens
  React.useEffect(() => {
    if (isOtherPopoverOpen) {
      setTempOtherObjectivesList(Array.isArray(formData.otherObjective) ? formData.otherObjective : []);
      setCurrentOtherObjectiveInput(''); // Clear input when popover opens
    }
  }, [isOtherPopoverOpen, formData.otherObjective]);

  const handleObjectiveToggle = (objectiveId: string) => {
    const newSelected = formData.selectedObjectives.includes(objectiveId)
      ? formData.selectedObjectives.filter(id => id !== objectiveId)
      : [...formData.selectedObjectives, objectiveId];
    updateFormData({ selectedObjectives: newSelected });
  };

  const handleAddOtherObjectiveToList = () => { // Renamed: Adds to temporary list
    if (currentOtherObjectiveInput.trim() && tempOtherObjectivesList.length < 10) {
      setTempOtherObjectivesList([...tempOtherObjectivesList, currentOtherObjectiveInput.trim()]);
      setCurrentOtherObjectiveInput(''); 
    }
  };

  const handleRemoveOtherObjectiveFromList = (indexToRemove: number) => { // Renamed: Removes from temporary list
    setTempOtherObjectivesList(tempOtherObjectivesList.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveAllTempObjectives = () => { // New function to save the temp list to formData
    const currentSelected = Array.isArray(formData.selectedObjectives) ? formData.selectedObjectives : [];
    // Combine existing selected objectives with the new temporary "other" objectives, ensuring uniqueness
    // We treat "other" objectives as display strings directly, similar to how specificFeatures are handled in FeaturesStep
    // if they are meant to be keys for translation, this logic would need adjustment.
    // For now, assuming they are direct strings to be added.
    const newSelectedObjectives = Array.from(new Set([...currentSelected, ...tempOtherObjectivesList]));

    updateFormData({ 
      otherObjective: [...tempOtherObjectivesList], // Keep for separate display in this step's UI
      selectedObjectives: newSelectedObjectives   // Add to main list for prompt generation
    });
    setIsOtherPopoverOpen(false);
  };
  
  const enhanceWithAI = async () => {
    if (!formData.primaryObjective || !user?.id) {
      toast({ title: 'Erro', description: 'Preencha o objetivo principal e esteja logado.', variant: 'destructive' });
      return;
    }
    if (!activeLlm || activeLlm.test_status !== 'success') {
      toast({
        title: 'Nenhuma LLM pronta',
        description: 'Ative e teste uma LLM nas configurações antes de usar a IA.',
        variant: 'destructive'
      });
      return;
    }
    setAiLoading(true);
    setAiError(null);
    try {
      console.log('[IA] Enviando para IA:', formData.primaryObjective);
      const enhanced = await enhancePrompt(formData.primaryObjective, user.id);
      console.log('[IA] Resposta da IA:', enhanced);
      if (onAiEnhanced) onAiEnhanced(enhanced);
      toast({ title: 'Objetivo melhorado com IA!' });
    } catch (err: any) {
      console.error('[IA] Erro ao melhorar com IA:', err);
      setAiError(err.message || String(err));
      toast({ title: 'Erro ao melhorar com IA', description: err.message || String(err), variant: 'destructive' });
    } finally {
      setAiLoading(false);
    }
  };

  const totalPages = Math.ceil(businessObjectivesOptions.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentObjectivesToDisplay = businessObjectivesOptions.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const handleReset = () => {
    resetStep();
    // Reset local state if necessary
    setCurrentPage(0);
    setTempOtherObjectivesList([]);
    setCurrentOtherObjectiveInput('');
  };

  // Função para salvar e marcar como salvo
  const handleSaveAndFinalize = () => {
    if (formData.defineObjectives && formData.primaryObjective.trim() === '') {
      alert('O objetivo principal é obrigatório.');
      return;
    }
    markAsFinalized();
  };

  const handleToggleAllBusinessObjectives = () => {
    const allObjectiveIds = businessObjectivesOptions.map(opt => opt.id);
    const allCurrentlySelected = formData.selectedObjectives;
    const allAreSelected = allObjectiveIds.every(id => allCurrentlySelected.includes(id));

    if (allAreSelected) {
      updateFormData({
        selectedObjectives: allCurrentlySelected.filter(id => !allObjectiveIds.includes(id))
      });
    } else {
      const newSelected = Array.from(new Set([...allCurrentlySelected, ...allObjectiveIds]));
      updateFormData({ selectedObjectives: newSelected });
    }
  };

  const allBusinessObjectivesSelected = businessObjectivesOptions.length > 0 && 
                                      businessObjectivesOptions.every(opt => formData.selectedObjectives.includes(opt.id));

  const handleAIAssistantClick = () => {
    alert('Assistente de IA chamado!\n\nDados do JSON:\n' + JSON.stringify(businessObjectivesOptions, null, 2));
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <Dialog open={aiLoading} onOpenChange={(open) => { if (!open) setAiLoading(false); }}>
        <DialogContent className="flex flex-col items-center gap-4">
          <DialogHeader>
            <DialogTitle>Processando com IA</DialogTitle>
            <DialogDescription>
              {activeLlm ? (
                <span>
                  Utilizando <b>{activeLlm.provider.toUpperCase()}</b> modelo <b>{activeLlm.models?.[0]}</b>
                </span>
              ) : (
                <span>Nenhuma LLM ativa</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-base font-medium text-blue-700">Aguardando resposta da IA...</span>
            {aiError && (
              <span className="text-red-600 text-sm mt-2">{aiError}</span>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Card className={`p-4 sm:p-6${isFinalized ? ' border-2 border-green-500' : ''} relative`}>
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-1">{t('promptGenerator.objective.title') || "Objetivo do Projeto"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.objective.description') || "Qual é o objetivo principal do seu projeto?"}
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
                    <span>Obter ajuda do assistente de IA para definir os objetivos</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || (
                  (formData.defineObjectives &&
                    !formData.primaryObjective.trim() &&
                    formData.selectedObjectives.length === 0 &&
                    (!formData.otherObjective || formData.otherObjective.length === 0)
                  ) ||
                  (!formData.defineObjectives &&
                    !formData.primaryObjective.trim() &&
                    formData.selectedObjectives.length === 0 &&
                    (!formData.otherObjective || formData.otherObjective.length === 0)
                  )
                )}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
              </Button>
              {isFinalized && <CheckCircleIcon className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-1 pt-4"> {/* Added pt-4 for spacing */}
          <div className="space-y-0 py-0 my-0 pt-1">
            <div className="flex justify-between items-center mb-0.5">
              <Label htmlFor="primary-objective" className="text-sm font-medium text-foreground">
                {t('promptGenerator.objective.primaryObjective') || "Objetivo Principal"}
              </Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={enhanceWithAI}
                className="flex items-center space-x-1 text-xs h-7"
                disabled={aiLoading || !formData.primaryObjective}
              >
                <Wand2 className="h-3 w-3 mr-1" />
                <span>{aiLoading ? 'Melhorando...' : (t('promptGenerator.objective.enhanceWithAI') || "Melhorar com IA")}</span>
              </Button>
            </div>
            <div className="relative">
              <Textarea 
                id="primary-objective"
                value={formData.primaryObjective}
                onChange={(e) => {
                  if (e.target.value.length <= 150) {
                    updateFormData({ primaryObjective: e.target.value });
                  }
                }}
                placeholder={objetivoPlaceholder}
                rows={2}
                className="py-1 text-sm text-left" // removido pl-28, alinhamento à esquerda
                maxLength={150}
              />
            </div>
            <div className="text-xs text-muted-foreground text-right mt-1">{formData.primaryObjective.length}/150</div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center space-x-2 mb-2">
              <Switch
                checked={formData.defineObjectives}
                onCheckedChange={(checked) => updateFormData({ defineObjectives: checked })}
                id="define-objectives-toggle"
              />
              <Label htmlFor="define-objectives-toggle" className="text-sm font-medium text-foreground">
                Deseja definir objetivos específicos para o projeto?
              </Label>
            </div>
            {formData.defineObjectives && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  {currentObjectivesToDisplay.map((optionObj) => (
                    <div key={optionObj.id} className="flex items-start space-x-1.5">
                      <Checkbox 
                        id={`objective-${optionObj.id}`}
                        checked={formData.selectedObjectives.includes(optionObj.id)}
                        onCheckedChange={(checked) => 
                          handleObjectiveToggle(optionObj.id)
                        }
                        className="mt-0.5"
                      />
                      <Label htmlFor={`objective-${optionObj.id}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                        {optionObj.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end space-x-2 mt-3 pt-2">
                  {businessObjectivesOptions.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs mr-auto" 
                      onClick={handleToggleAllBusinessObjectives}
                    >
                      {allBusinessObjectivesSelected
                        ? (t('common.unselectAll') || "Desmarcar Todos")
                        : (t('common.selectAll') || "Marcar Todos")}
                    </Button>
                  )}
                  <Popover open={isOtherPopoverOpen} onOpenChange={setIsOtherPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ListPlus className="h-3 w-3 mr-1.5" />
                        {t('promptGenerator.objective.notInList') || "Não está na lista?"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" side="top" align="end">
                      <div className="space-y-3">
                        <Label htmlFor="other-objective-input-popover" className="text-sm font-medium">
                          {t('promptGenerator.objective.otherObjectivePrompt') || 'Adicionar outro objetivo:'}
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="other-objective-input-popover"
                            value={currentOtherObjectiveInput}
                            onChange={(e) => setCurrentOtherObjectiveInput(e.target.value)}
                            placeholder={t('promptGenerator.objective.otherObjectivePlaceholder') || 'Seu objetivo...'}
                            className="text-xs"
                            onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherObjectiveInput.trim()) handleAddOtherObjectiveToList(); }}
                          />
                          <Button 
                            size="icon" 
                            onClick={handleAddOtherObjectiveToList}
                            disabled={!currentOtherObjectiveInput.trim() || tempOtherObjectivesList.length >= 10}
                            className="h-8 w-8 flex-shrink-0"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        {tempOtherObjectivesList.length > 0 && (
                          <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                            <p className="text-xs text-muted-foreground mb-1">
                              {`Adicionados (${tempOtherObjectivesList.length}/10):`}
                            </p>
                            {tempOtherObjectivesList.map((obj, index) => (
                              <div key={index} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                <span className="truncate flex-1 mr-2">{obj}</span>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherObjectiveFromList(index)} className="h-5 w-5">
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        {tempOtherObjectivesList.length >= 10 && (
                            <p className="text-xs text-destructive mt-1">
                              {t('promptGenerator.objective.limitReached') || "Limite de 10 objetivos atingido."}
                            </p>
                          )}
                        <div className="flex justify-end space-x-2 mt-3">
                          <Button size="sm" variant="ghost" onClick={() => setIsOtherPopoverOpen(false)} className="text-xs">
                            {'Cancelar'}
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSaveAllTempObjectives}
                            disabled={tempOtherObjectivesList.length === 0 && (!Array.isArray(formData.otherObjective) || formData.otherObjective.length === 0) && !currentOtherObjectiveInput.trim()}
                          >
                            {'Salvar Objetivo(s)'}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={goToPrevPage} disabled={currentPage === 0} className="h-7 w-7">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {`${t('common.page') || 'Página'} ${currentPage + 1} ${t('common.of') || 'de'} ${totalPages}`}
                      </span>
                      <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages - 1} className="h-7 w-7">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {Array.isArray(formData.otherObjective) && formData.otherObjective.length > 0 && (
            <div className="mt-2 border p-2 rounded-md bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground mb-1">Outros Objetivos Adicionados:</p>
              <div className="flex flex-wrap gap-2">
                {formData.otherObjective.map((item, index) => (
                  <div key={`saved-other-objective-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                    <span className="truncate mr-1.5">{item}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => {
                        const newOther = formData.otherObjective.filter((_, i) => i !== index);
                        const newSelected = Array.isArray(formData.selectedObjectives) ? formData.selectedObjectives.filter(sel => sel !== item) : [];
                        updateFormData({
                          otherObjective: newOther,
                          selectedObjectives: newSelected
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

        </CardContent>
        <AIAssistantPanel
          open={aiOpen}
          onClose={() => setAIOpen(false)}
          items={Array.isArray(objectiveData) ? objectiveData : []}
          title={t('promptGenerator.objective.title') || 'Objetivos'}
        />
      </Card>
    </div>
  );
};

export default ObjectiveStep;
