import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save, CheckCircle as CheckCircleIcon, ListPlus, PlusCircle, Trash2, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AIAssistantPanel from '../components/AIAssistantPanel';
import featuresData from '../data/featuresData.json';

interface FeaturesFormData {
  specificFeatures: string[];
  otherSpecificFeatures: string[];
  dynamicFeatures: string[];
}

interface FeaturesStepProps {
  formData: FeaturesFormData;
  systemType: string;
  updateFormData: (data: Partial<FeaturesFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const FeaturesStep: React.FC<FeaturesStepProps> = ({
  formData,
  systemType,
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  const { t } = useLanguage();
  const itemsPerPage = 6;

  const [currentPageSpecific, setCurrentPageSpecific] = React.useState(0);
  const [isOtherSpecificPopoverOpen, setIsOtherSpecificPopoverOpen] = React.useState(false);
  const [currentOtherSpecificInput, setCurrentOtherSpecificInput] = React.useState('');
  const [tempOtherSpecificList, setTempOtherSpecificList] = React.useState<string[]>([]);
  const [featuresOptions, setFeaturesOptions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [aiOpen, setAIOpen] = useState(false);

  React.useEffect(() => {
    try {
      if (Array.isArray(featuresData)) {
        setFeaturesOptions(featuresData);
      }
      setLoading(false);
    } catch (e) {
      console.error('Erro ao carregar funcionalidades:', e);
      setError('Erro ao carregar funcionalidades');
      setLoading(false);
    }
  }, []);

  const getSuggestedFeaturesBySystemType = (systemType: string): string[] => {
    switch (systemType) {
      case 'ecommerce':
        return [
          'catalog',
          'cart',
          'checkout',
          'inventoryManagement',
        ];
      case 'saas':
      case 'microsaas':
        return [
          'userAuthentication',
          'subscriptionManagement',
        ];
      default:
        return [
          'auth',
          'dashboard',
          'contentManagement',
          'profileSettings',
        ];
    }
  };
  
  // Combine initial specific options (keys) with suggested features (display strings)
  // For display, we'll try to translate keys, otherwise show the key/string
  const suggestedFeatures = getSuggestedFeaturesBySystemType(systemType);
  
  // Create a unified list of options for display and selection management
  // We need to be careful here: specificFeaturesOptions are keys, suggestedFeatures are display strings.
  // For simplicity in this merge, we'll treat all as display strings.
  // The `formData.specificFeatures` will store the selected *display strings*.
  
  const allFeaturesOptions: string[] = React.useMemo(() => {
    const specificOptionValues = featuresOptions.map(opt => opt.value);
    return Array.from(new Set([...specificOptionValues, ...suggestedFeatures]));
  }, [systemType, featuresOptions, suggestedFeatures]);


  const handleSpecificFeatureChange = (featureValue: string, checked: boolean) => {
    const currentSelected = formData.specificFeatures || [];
    const updatedFeatures = checked
      ? [...currentSelected, featureValue]
      : currentSelected.filter(value => value !== featureValue);
    updateFormData({ specificFeatures: updatedFeatures });
  };

  const toggleSelectAllSpecific = () => {
    const allOptionValues = featuresOptions.map(opt => opt.value);
    const allCurrentlySelected = formData.specificFeatures || [];
    const allAreSelected = allOptionValues.length > 0 && allOptionValues.every(value => allCurrentlySelected.includes(value));

    if (allAreSelected) {
      updateFormData({ specificFeatures: [] });
    } else {
      updateFormData({ specificFeatures: [...allOptionValues] });
    }
  };
  
  const specificAllSelected = featuresOptions.length > 0 && 
    featuresOptions.every(opt => (formData.specificFeatures || []).includes(opt.value));

  const handleReset = () => {
    resetStep();
    setCurrentPageSpecific(0);
    setTempOtherSpecificList([]);
    setCurrentOtherSpecificInput('');
  };

  const handleSaveAndFinalize = () => {
    const specificSelectedCount = (formData.specificFeatures || []).length;
    const otherSpecificCount = (formData.otherSpecificFeatures || []).length;

    if (specificSelectedCount === 0 && otherSpecificCount === 0) {
      alert(t('promptGenerator.features.atLeastOneFeatureError'));
      return;
    }
    markAsFinalized();
  };

  const totalPagesSpecific = Math.ceil(featuresOptions.length / itemsPerPage);
  const currentSpecificToDisplay = featuresOptions.slice(currentPageSpecific * itemsPerPage, (currentPageSpecific + 1) * itemsPerPage);

  React.useEffect(() => {
    if (isOtherSpecificPopoverOpen) {
      setTempOtherSpecificList(formData.otherSpecificFeatures || []);
      setCurrentOtherSpecificInput('');
    }
  }, [isOtherSpecificPopoverOpen, formData.otherSpecificFeatures]);

  const handleAddOtherSpecificToList = () => {
    if (currentOtherSpecificInput.trim() && tempOtherSpecificList.length < 10) {
      setTempOtherSpecificList([...tempOtherSpecificList, currentOtherSpecificInput.trim()]);
      setCurrentOtherSpecificInput('');
    }
  };

  const handleRemoveOtherSpecificFromList = (index: number) => {
    setTempOtherSpecificList(tempOtherSpecificList.filter((_, i) => i !== index));
  };

  const handleSaveOtherSpecificList = () => {
    updateFormData({
      otherSpecificFeatures: [...tempOtherSpecificList],
      specificFeatures: Array.from(new Set([...(formData.specificFeatures || []), ...tempOtherSpecificList]))
    });
    setIsOtherSpecificPopoverOpen(false);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <Card className={`p-4 sm:p-6 relative${isFinalized ? ' border-2 border-green-500' : ''}`}>
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-1">{t('promptGenerator.features.title')}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.features.description')}
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
                    <span>Obter ajuda do assistente de IA para escolher as funcionalidades</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || ((formData.specificFeatures.length === 0 && formData.otherSpecificFeatures.length === 0))}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
              </Button>
              {isFinalized && <CheckCircleIcon className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 pt-4">
          <div className="grid grid-cols-1 gap-1">
            <div className="space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1" style={{ minHeight: `${Math.ceil(itemsPerPage / 2) * 24}px` }}>
                {currentSpecificToDisplay.map((feature) => (
                  <div key={feature.value} className="flex items-start space-x-1">
                    <Checkbox
                      id={`feature-${feature.value}`}
                      checked={formData.specificFeatures.includes(feature.value)}
                      onCheckedChange={(checked) => handleSpecificFeatureChange(feature.value, checked === true)}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={`feature-${feature.value}`}
                      className="cursor-pointer text-xs font-normal whitespace-normal leading-tight"
                    >
                      {
                        (() => {
                          // Busca o label do featuresData.json
                          const featureObj = featuresOptions.find(opt => opt.value === feature.value);
                          // Tenta traduzir
                          const translated = t(`promptGenerator.features.default.${feature.value}`);
                          // Se a tradução não existir ou for igual à chave, usa o label do JSON
                          if (translated && !translated.startsWith('promptGenerator.features.default.')) {
                            return translated;
                          }
                          return featureObj?.label || feature.value;
                        })()
                      }
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between space-x-2 mt-2 pt-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={toggleSelectAllSpecific}>
                  {specificAllSelected ? t('common.unselectAll') : t('common.selectAll')}
                </Button>
                <div className="flex items-center space-x-2">
                  <Popover open={isOtherSpecificPopoverOpen} onOpenChange={setIsOtherSpecificPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ListPlus className="h-3 w-3 mr-1.5" />
                        {t('promptGenerator.objective.notInList')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" side="top" align="end">
                      <div className="space-y-3">
                        <Label htmlFor="other-specific-input" className="text-sm font-medium">
                          {t('promptGenerator.features.otherFeaturePlaceholder')}
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="other-specific-input"
                            value={currentOtherSpecificInput}
                            onChange={(e) => setCurrentOtherSpecificInput(e.target.value)}
                            placeholder={t('promptGenerator.features.otherFeaturePlaceholder')}
                            className="text-xs h-8"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && currentOtherSpecificInput.trim()) {
                                handleAddOtherSpecificToList();
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            onClick={handleAddOtherSpecificToList}
                            disabled={!currentOtherSpecificInput.trim() || tempOtherSpecificList.length >= 10}
                            className="h-8 w-8 flex-shrink-0"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        {tempOtherSpecificList.length > 0 && (
                          <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                            <p className="text-xs text-muted-foreground mb-1">{`Adicionadas (${tempOtherSpecificList.length}/10):`}</p>
                            {tempOtherSpecificList.map((feat, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                <span className="truncate flex-1 mr-2">{feat}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveOtherSpecificFromList(idx)}
                                  className="h-5 w-5"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        {tempOtherSpecificList.length >= 10 && (
                          <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached')}</p>
                        )}
                        <div className="flex justify-end space-x-2 mt-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsOtherSpecificPopoverOpen(false)}
                            className="text-xs h-8"
                          >
                            {t('common.cancel')}
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveOtherSpecificList}
                            disabled={tempOtherSpecificList.length === 0}
                            className="text-xs h-8"
                          >
                            {t('common.saveOtherItems')}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {totalPagesSpecific > 1 && (
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentPageSpecific(p => Math.max(0, p - 1))}
                        disabled={currentPageSpecific === 0}
                        className="h-7 w-7"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {`${t('common.page')} ${currentPageSpecific + 1} ${t('common.of')} ${totalPagesSpecific}`}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentPageSpecific(p => Math.min(totalPagesSpecific - 1, p + 1))}
                        disabled={currentPageSpecific === totalPagesSpecific - 1}
                        className="h-7 w-7"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {Array.isArray(formData.otherSpecificFeatures) && formData.otherSpecificFeatures.length > 0 && (
                <div className="mt-2 border p-2 rounded-md bg-muted/30">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Outras Funcionalidades Adicionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.otherSpecificFeatures.map((item, index) => (
                      <div key={`saved-other-feature-${index}`} className="flex items-center bg-muted/50 rounded px-2 py-1 text-xs text-foreground">
                        <span className="truncate mr-1.5">{item}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => {
                            const newOther = formData.otherSpecificFeatures.filter((_, i) => i !== index);
                            const newSpecific = Array.isArray(formData.specificFeatures) ? formData.specificFeatures.filter(sel => sel !== item) : [];
                            updateFormData({
                              otherSpecificFeatures: newOther,
                              specificFeatures: newSpecific
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
        </CardContent>
      </Card>
      <AIAssistantPanel
        open={aiOpen}
        onClose={() => setAIOpen(false)}
        items={Array.isArray(featuresData) ? featuresData : []}
        title={t('promptGenerator.features.title') || 'Funcionalidades'}
      />
    </div>
  );
};

export default FeaturesStep;
