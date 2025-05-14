import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Added Input import
import RadioSpecifyItem from '@/components/RadioSpecifyItem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ListPlus, RotateCcw, Save, CheckCircle, Wand2 } from 'lucide-react'; // Added ListPlus, RotateCcw, Save, CheckCircle, Wand2
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import systemTypesData from '../data/systemTypesData.json';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AIAssistantPanel from '../components/AIAssistantPanel';

interface SystemTypeData {
  selected: string;
  otherType: string;
  // examples array was present in PromptGeneratorWizard's initialFormData for systemType,
  // but not used here. If it's needed, add it. For now, keeping it simple.
  // examples?: string[]; 
}

interface SystemTypeStepProps {
  formData: SystemTypeData;
  updateFormData: (stepKey: string, data: any) => void; // This is specific to how SystemTypeStep updates parent
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const SystemTypeStep: React.FC<SystemTypeStepProps> = ({ 
  formData, 
  updateFormData, 
  markAsFinalized, 
  resetStep, 
  isFinalized 
}) => {
  const { t } = useLanguage();

  const [systemTypesList, setSystemTypesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Carregar do JSON externo
      const types = Array.isArray(systemTypesData)
        ? systemTypesData.map((item: any) => item.id)
        : [];
      setSystemTypesList(types);
      setLoading(false);
    } catch (e) {
      setError('Erro ao carregar tipos de sistema');
      setLoading(false);
    }
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; // Changed to 8 for 4 rows of 2 items
  const [isOtherPopoverOpen, setIsOtherPopoverOpen] = useState(false);
  const [aiOpen, setAIOpen] = useState(false);

  const handleSystemTypeChange = (value: string) => {
    // If a regular type is selected, clear otherType
    const newOtherType = value !== 'other' ? '' : formData.otherType;
    updateFormData('systemType', {
      selected: value,
      otherType: newOtherType,
    });
    updateFormData('features', { dynamicFeatures: [] }); 
  };
  
  const handleOtherTypeSave = (specifiedValue: string) => {
    updateFormData('systemType', {
      selected: 'other', // Ensure 'other' is selected
      otherType: specifiedValue,
    });
    updateFormData('features', { dynamicFeatures: [] }); // Also clear/reset features
    setIsOtherPopoverOpen(false); // Close popover on save
  };


  const totalPages = Math.ceil(systemTypesList.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSystemTypesToDisplay = systemTypesList.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    resetStep();
    // Optionally, reset local state like currentPage if needed
    setCurrentPage(0); 
  };

  const handleSaveAndFinalize = () => {
    // Perform any local validation if necessary before finalizing
    markAsFinalized();
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6 relative">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start"> {/* Changed items-center to items-start */}
            <div>
              <CardTitle>{t('promptGenerator.systemType.title') || "Tipo de Sistema"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.systemType.description') || "Que tipo de sistema você está construindo?"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2"> {/* Group for buttons and checkmark */}
              <Button variant="outline" onClick={handleReset} size="icon" className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">{t('common.reset') || "Resetar"}</span>
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
                    <span>Obter ajuda do assistente de IA para escolher o tipo de sistema</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || (!formData.selected && !formData.otherType)}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? (t('common.finalized') || "Finalizado") : (t('common.saveAndFinalize') || "Salvar e Finalizar")}</span>
              </Button>
              {isFinalized && <CheckCircle className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-0 pt-4"> {/* Added pt-4 for spacing */}
          <div className="space-y-0 py-0 my-0">
            <RadioGroup
              value={formData.selected === 'other' ? '' : formData.selected}
              onValueChange={handleSystemTypeChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-2" // Reverted sm:grid-cols-3 to md:grid-cols-2
            >
              {currentSystemTypesToDisplay.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={`system-type-${type}`} />
                  <Label htmlFor={`system-type-${type}`} className="cursor-pointer text-xs font-normal">
                    {t(`promptGenerator.systemType.${type}`) || type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex items-center justify-end space-x-2 mt-3 pt-3"> {/* Removed border-t */}
              <Popover open={isOtherPopoverOpen} onOpenChange={setIsOtherPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs"> {/* Re-added asChild, onClick is implicitly handled by Popover's internal logic */}
                    <ListPlus className="h-3 w-3 mr-1.5" />
                    {'Não está na lista?'} {/* Direct string */}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" side="top" align="end"> {/* Added p-4 directly */}
                  <div>
                    <Label htmlFor="other-type-input" className="text-sm font-medium">
                      {'Especifique o tipo:'}
                    </Label>
                    <Input
                      id="other-type-input"
                      value={formData.otherType}
                      onChange={(e) => {
                        // Update otherType directly, but don't change selected yet
                        updateFormData('systemType', { ...formData, otherType: e.target.value });
                      }}
                      placeholder={'Ex: Blog Pessoal'}
                      className="mt-1 mb-3"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleOtherTypeSave(formData.otherType)}
                      disabled={!formData.otherType.trim()} // Disable if input is empty
                    >
                      {'Salvar Tipo'}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-1">
                  <Button variant="ghost" size="icon" onClick={goToPrevPage} disabled={currentPage === 0} className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {`Página ${currentPage + 1} de ${totalPages}`} {/* Direct strings */}
                  </span>
                  <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages - 1} className="h-7 w-7">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

          </div>
          {/* Action Buttons DIV removed from here */}
        </CardContent>
        <AIAssistantPanel
          open={aiOpen}
          onClose={() => setAIOpen(false)}
          items={Array.isArray(systemTypesData) ? systemTypesData : []}
          title={t('promptGenerator.systemType.title') || 'Tipo de Sistema'}
        />
      </Card>
    </div>
  );
};

export default SystemTypeStep;
