import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'; // Restoring Button import
import { Checkbox } from '@/components/ui/checkbox';
import { Wand2, ChevronLeft, ChevronRight, ListPlus, PlusCircle, XCircle, RotateCcw, Save, CheckCircle as CheckCircleIcon } from 'lucide-react'; // Added RotateCcw, Save, CheckCircleIcon
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ObjectiveFormData {
  defineObjectives: boolean;
  primaryObjective: string;
  selectedObjectives: string[];
  otherObjective: string[];
}

interface ObjectiveStepProps {
  formData: ObjectiveFormData;
  updateFormData: (data: Partial<ObjectiveFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const ObjectiveStep: React.FC<ObjectiveStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized 
}) => {
  const { t } = useLanguage();
  
  const businessObjectivesOptions = [
    { key: 'increaseRevenue', defaultText: 'Increase Revenue' },
    { key: 'reduceCosts', defaultText: 'Reduce Costs' },
    { key: 'improveCustomerExperience', defaultText: 'Improve Customer Experience' },
    { key: 'enhanceBrandAwareness', defaultText: 'Enhance Brand Awareness' },
    { key: 'expandMarketReach', defaultText: 'Expand Market Reach' },
    { key: 'streamlineOperations', defaultText: 'Streamline Operations' },
    { key: 'driveInnovation', defaultText: 'Drive Innovation' },
    { key: 'boostUserEngagement', defaultText: 'Boost User Engagement' },
    { key: 'improveDataInsights', defaultText: 'Improve Data Insights' },
    { key: 'complianceWithRegulations', defaultText: 'Compliance with Regulations' },
    { key: 'enhanceSecurity', defaultText: 'Enhance Security' },
  ];

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

  const handleObjectiveToggle = (objectiveKey: string) => {
    const newSelected = formData.selectedObjectives.includes(objectiveKey)
      ? formData.selectedObjectives.filter(objKey => objKey !== objectiveKey)
      : [...formData.selectedObjectives, objectiveKey];
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
  
  const enhanceWithAI = () => {
    setTimeout(() => {
      if (formData.primaryObjective) {
        const enhanced = formData.primaryObjective + " [Enhanced with AI: This objective has been refined for clarity and impact.]";
        updateFormData({ primaryObjective: enhanced });
      }
    }, 1000);
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

  const handleSaveAndFinalize = () => {
    // Basic validation: if defineObjectives is true, primaryObjective should not be empty
    if (formData.defineObjectives && formData.primaryObjective.trim() === '') {
      alert(t('promptGenerator.objective.primaryObjectiveRequiredError') || "O objetivo principal é obrigatório quando a definição específica está ativa.");
      return;
    }
    // Or, if defineObjectives is false, it can be considered complete.
    // Or, if defineObjectives is true, at least one selected/other objective.
    if (formData.defineObjectives && formData.selectedObjectives.length === 0 && otherObjectivesArray.length === 0 && !formData.primaryObjective.trim()) {
        alert(t('promptGenerator.objective.atLeastOneObjectiveError') || "Defina ao menos um objetivo principal ou selecione/adicione objetivos de negócio.");
        return;
    }
    markAsFinalized();
  };

  const handleToggleAllBusinessObjectives = () => {
    const allObjectiveKeys = businessObjectivesOptions.map(opt => opt.key);
    const allCurrentlySelected = formData.selectedObjectives;
    // Check if all possible business objectives are selected
    const allAreSelected = allObjectiveKeys.every(key => allCurrentlySelected.includes(key));

    if (allAreSelected) {
      // Unselect all business objectives
      updateFormData({
        selectedObjectives: allCurrentlySelected.filter(key => !allObjectiveKeys.includes(key))
        // Keep other selected objectives if they are not part of businessObjectivesOptions (e.g. 'Other')
      });
    } else {
      // Select all business objectives
      const newSelected = Array.from(new Set([...allCurrentlySelected, ...allObjectiveKeys]));
      updateFormData({ selectedObjectives: newSelected });
    }
  };

  // Determine if all business objectives (not just visible) are selected
  const allBusinessObjectivesSelected = businessObjectivesOptions.length > 0 && 
                                      businessObjectivesOptions.every(opt => formData.selectedObjectives.includes(opt.key));

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start"> {/* Changed items-center to items-start */}
            <div>
              <CardTitle>{t('promptGenerator.objective.title') || "Objetivo do Projeto"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.objective.description') || "Qual é o objetivo principal do seu projeto?"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2"> {/* Group for buttons and checkmark */}
              <Button variant="outline" onClick={handleReset} size="icon" className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">{t('common.reset')}</span>
              </Button>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || (formData.defineObjectives && !formData.primaryObjective.trim() && formData.selectedObjectives.length === 0 && otherObjectivesArray.length === 0)}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
              </Button>
              {isFinalized && <CheckCircleIcon className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-1 pt-4"> {/* Added pt-4 for spacing */}
          <div className="flex items-center space-x-2 py-0 my-0">
            <Switch
              checked={formData.defineObjectives}
              onCheckedChange={(checked) => updateFormData({ defineObjectives: checked })}
              id="define-objectives-toggle"
            />
            <Label htmlFor="define-objectives-toggle" className="text-sm font-medium text-foreground">
              {t('promptGenerator.objective.defineObjectives') || "Definir objetivos específicos"}
            </Label>
          </div>

          {formData.defineObjectives && (
            <>
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
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    <span>{t('promptGenerator.objective.enhanceWithAI') || "Melhorar com IA"}</span>
                  </Button>
                </div>
                <Textarea 
                  id="primary-objective"
                  value={formData.primaryObjective}
                  onChange={(e) => updateFormData({ primaryObjective: e.target.value })}
                  placeholder={t('promptGenerator.objective.primaryObjectivePlaceholder') || "Descreva o objetivo principal..."}
                  rows={2}
                  className="py-1 text-sm" 
                />
              </div>
              
              <div className="pt-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="business-objectives-accordion" className="border-0"> {/* Remove border from item */}
                    <AccordionTrigger className="text-base font-medium text-foreground py-2 hover:no-underline border-b-0"> {/* Remove bottom border from trigger */}
                      {t('promptGenerator.objective.businessObjectives') || "Objetivos de Negócio Adicionais"}
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {currentObjectivesToDisplay.map((objectiveOpt) => (
                          <div key={objectiveOpt.key} className="flex items-start space-x-1.5">
                            <Checkbox 
                              id={`objective-${objectiveOpt.key}`}
                              checked={formData.selectedObjectives.includes(objectiveOpt.key)}
                              onCheckedChange={() => handleObjectiveToggle(objectiveOpt.key)}
                              className="mt-0.5"
                            />
                            <Label 
                              htmlFor={`objective-${objectiveOpt.key}`}
                              className="cursor-pointer text-xs font-normal whitespace-normal leading-tight"
                            >
                              {t(`promptGenerator.objective.${objectiveOpt.key}`) || objectiveOpt.defaultText}
                            </Label>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-end space-x-2 mt-3 pt-2">
                        {businessObjectivesOptions.length > 0 && ( // Show button only if there are options to select/unselect
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
                                        <XCircle className="h-3.5 w-3.5 text-destructive" />
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </>
          )}

        </CardContent>
        {/* Action Buttons DIV removed from here, they are in CardHeader now */}
      </Card>
    </div>
  );
};

export default ObjectiveStep;
