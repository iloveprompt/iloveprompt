import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save, CheckCircle as CheckCircleIcon, ListPlus, PlusCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface FeaturesFormData {
  specificFeatures: string[]; // This will now hold all features
  otherSpecificFeatures: string[]; 
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

  const initialSpecificFeaturesOptions = [ // These are i18n keys
    'uploadFiles', 'notifications', 'advancedFilters', 'interactiveDashboards',
    'scheduling', 'export', 'rolePermissions', 'apiIntegration', 
    'multiLanguage', 'accessibility', 'darkMode', 'customLandingPage'
  ];

  const getSuggestedFeaturesBySystemType = (systemType: string, t: (key: string) => string): string[] => {
    // This function now returns display strings directly
    switch (systemType) {
      case 'ecommerce':
        return [
          t('promptGenerator.features.ecommerceFeatures.catalog') || "Catálogo de Produtos com Filtros e Busca Avançada",
          t('promptGenerator.features.ecommerceFeatures.cart') || "Carrinho de Compras Persistente",
          t('promptGenerator.features.ecommerceFeatures.checkout') || "Checkout Seguro com Múltiplas Formas de Pagamento",
          t('promptGenerator.features.ecommerceFeatures.inventoryManagement') || "Gerenciamento de Pedidos e Estoque",
          // ... add other ecommerce features with t()
        ];
      case 'saas':
      case 'microsaas':
        return [
          t('promptGenerator.features.saasFeatures.userAuthentication') || "Autenticação de Usuários (Email/Senha, Social Login)",
          t('promptGenerator.features.saasFeatures.subscriptionManagement') || "Gerenciamento de Assinaturas e Planos (Ex: Stripe, Paddle)",
          // ... add other saas features with t()
        ];
      // Add other cases as before, ensuring to use t() for translatable strings
      default:
        return [
          t('promptGenerator.features.default.auth') || "Autenticação de Usuários",
          t('promptGenerator.features.default.dashboard') || "Painel de Controle (Dashboard)",
          t('promptGenerator.features.default.contentManagement') || "Gerenciamento de Conteúdo Básico",
          t('promptGenerator.features.default.profileSettings') || "Configurações de Perfil",
        ];
    }
  };
  
  // Combine initial specific options (keys) with suggested features (display strings)
  // For display, we'll try to translate keys, otherwise show the key/string
  const suggestedFeatures = getSuggestedFeaturesBySystemType(systemType, t);
  
  // Create a unified list of options for display and selection management
  // We need to be careful here: specificFeaturesOptions are keys, suggestedFeatures are display strings.
  // For simplicity in this merge, we'll treat all as display strings.
  // The `formData.specificFeatures` will store the selected *display strings*.
  
  const allFeaturesOptions: string[] = React.useMemo(() => {
    const translatedSpecificOptions = initialSpecificFeaturesOptions.map(key => t(`promptGenerator.features.${key}`) || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
    return Array.from(new Set([...translatedSpecificOptions, ...suggestedFeatures]));
  }, [t, systemType, initialSpecificFeaturesOptions, suggestedFeatures]);


  const handleSpecificFeatureChange = (featureDisplayString: string, checked: boolean) => {
    const currentSelected = Array.isArray(formData.specificFeatures) ? formData.specificFeatures : [];
    const updatedFeatures = checked
      ? [...currentSelected, featureDisplayString]
      : currentSelected.filter(f => f !== featureDisplayString);
    updateFormData({ specificFeatures: updatedFeatures });
  };

  const toggleSelectAllSpecific = () => {
    const allCurrentlySelected = formData.specificFeatures || [];
    const allAreSelected = allFeaturesOptions.length > 0 && allFeaturesOptions.every(opt => allCurrentlySelected.includes(opt));

    if (allAreSelected) {
      updateFormData({ specificFeatures: [] });
    } else {
      updateFormData({ specificFeatures: [...allFeaturesOptions] });
    }
  };
  
  const specificAllSelected = allFeaturesOptions.length > 0 && 
                            allFeaturesOptions.every(opt => (formData.specificFeatures || []).includes(opt));

  const handleReset = () => {
    resetStep(); 
    setCurrentPageSpecific(0);
    setTempOtherSpecificList([]);
    setCurrentOtherSpecificInput('');
  };

  const handleSaveAndFinalize = () => {
    const otherSpecificCount = Array.isArray(formData.otherSpecificFeatures) ? formData.otherSpecificFeatures.length : 0;
    const specificSelectedCount = Array.isArray(formData.specificFeatures) ? formData.specificFeatures.length : 0;

    if (specificSelectedCount === 0 && otherSpecificCount === 0) {
      alert(t('promptGenerator.features.atLeastOneFeatureError') || "Selecione ou especifique ao menos uma funcionalidade.");
      return;
    }
    markAsFinalized();
  };

  const totalPagesSpecific = Math.ceil(allFeaturesOptions.length / itemsPerPage);
  const currentSpecificToDisplay = allFeaturesOptions.slice(currentPageSpecific * itemsPerPage, (currentPageSpecific + 1) * itemsPerPage);

  React.useEffect(() => {
    if (isOtherSpecificPopoverOpen) {
      setTempOtherSpecificList(Array.isArray(formData.otherSpecificFeatures) ? formData.otherSpecificFeatures : []);
      setCurrentOtherSpecificInput('');
    }
  }, [isOtherSpecificPopoverOpen, formData.otherSpecificFeatures]);

  const handleAddOtherSpecificToList = () => {
    if (currentOtherSpecificInput.trim() && tempOtherSpecificList.length < 10) {
      setTempOtherSpecificList([...tempOtherSpecificList, currentOtherSpecificInput.trim()]);
      setCurrentOtherSpecificInput('');
    }
  };
  const handleRemoveOtherSpecificFromList = (index: number) => setTempOtherSpecificList(tempOtherSpecificList.filter((_, i) => i !== index));
  const handleSaveOtherSpecificList = () => {
    const currentSpecific = Array.isArray(formData.specificFeatures) ? formData.specificFeatures : [];
    // Combine existing specific features with the new temporary "other" features, ensuring uniqueness
    const newSpecificFeatures = Array.from(new Set([...currentSpecific, ...tempOtherSpecificList]));
    
    updateFormData({ 
      otherSpecificFeatures: [...tempOtherSpecificList], // Keep for separate display in this step's UI
      specificFeatures: newSpecificFeatures        // Add to main list for prompt generation
    });
    setIsOtherSpecificPopoverOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t('promptGenerator.features.title')}</CardTitle>
              <CardDescription>{t('promptGenerator.features.description')}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleReset} size="icon" className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">{t('common.reset')}</span>
              </Button>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || (
                  (!Array.isArray(formData.specificFeatures) || formData.specificFeatures.length === 0) && 
                  (!Array.isArray(formData.otherSpecificFeatures) || formData.otherSpecificFeatures.length === 0)
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
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              {/* Title can remain generic or be updated if needed */}
              <h4 className="font-medium">{t('promptGenerator.features.specificFeatures')}</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1.5 gap-y-2.5">
              {currentSpecificToDisplay.map((featureDisplayString) => (
                <div key={featureDisplayString} className="flex items-start space-x-1.5"> 
                  <Checkbox 
                    id={`specific-${featureDisplayString.replace(/\s+/g, '-')}`} // Create a unique ID
                    checked={(formData.specificFeatures || []).includes(featureDisplayString)}
                    onCheckedChange={(checked) => 
                      handleSpecificFeatureChange(featureDisplayString, checked === true)
                    }
                    className="mt-0.5" 
                  />
                  <Label htmlFor={`specific-${featureDisplayString.replace(/\s+/g, '-')}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">
                    {featureDisplayString} {/* Directly display the string */}
                  </Label>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between space-x-2 mt-2 pt-2">
              {allFeaturesOptions.length > 0 && (
                <Button variant="outline" size="sm" className="text-xs" onClick={toggleSelectAllSpecific}>
                  {specificAllSelected ? (t('common.unselectAll') || "Desmarcar Todos") : (t('common.selectAll') || "Marcar Todos")}
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <Popover open={isOtherSpecificPopoverOpen} onOpenChange={setIsOtherSpecificPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <ListPlus className="h-3 w-3 mr-1.5" />
                      {t('promptGenerator.objective.notInList') || "Não está na lista?"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" side="top" align="end">
                    <div className="space-y-3">
                      <Label htmlFor="other-specific-input" className="text-sm font-medium">
                        {t('promptGenerator.features.otherFeaturePlaceholder') || 'Adicionar outra funcionalidade:'}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input id="other-specific-input" value={currentOtherSpecificInput} onChange={(e) => setCurrentOtherSpecificInput(e.target.value)} placeholder={t('promptGenerator.features.otherFeaturePlaceholder') || 'Sua funcionalidade...'} className="text-xs" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherSpecificInput.trim()) handleAddOtherSpecificToList(); }} />
                        <Button size="icon" onClick={handleAddOtherSpecificToList} disabled={!currentOtherSpecificInput.trim() || tempOtherSpecificList.length >= 10} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                      </div>
                      {tempOtherSpecificList.length > 0 && (
                        <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                          <p className="text-xs text-muted-foreground mb-1">{`Adicionadas (${tempOtherSpecificList.length}/10):`}</p>
                          {tempOtherSpecificList.map((feat, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                              <span className="truncate flex-1 mr-2">{feat}</span>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherSpecificFromList(idx)} className="h-5 w-5"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                            </div>
                          ))}
                        </div>
                      )}
                      {tempOtherSpecificList.length >= 10 && <p className="text-xs text-destructive mt-1">{t('promptGenerator.objective.limitReached') || "Limite de 10 atingido."}</p>}
                      <div className="flex justify-end space-x-2 mt-3">
                        <Button size="sm" variant="ghost" onClick={() => setIsOtherSpecificPopoverOpen(false)} className="text-xs">{'Cancelar'}</Button>
                        <Button size="sm" onClick={handleSaveOtherSpecificList} disabled={tempOtherSpecificList.length === 0 && (!Array.isArray(formData.otherSpecificFeatures) || formData.otherSpecificFeatures.length === 0) && !currentOtherSpecificInput.trim()}>{'Salvar Outras'}</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {totalPagesSpecific > 1 && (
                  <div className="flex items-center justify-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentPageSpecific(p => Math.max(0, p - 1))} disabled={currentPageSpecific === 0} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-xs text-muted-foreground">{`${t('common.page') || 'Página'} ${currentPageSpecific + 1} ${t('common.of') || 'de'} ${totalPagesSpecific}`}</span>
                    <Button variant="ghost" size="icon" onClick={() => setCurrentPageSpecific(p => Math.min(totalPagesSpecific - 1, p + 1))} disabled={currentPageSpecific === totalPagesSpecific - 1} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            </div>
            {Array.isArray(formData.otherSpecificFeatures) && formData.otherSpecificFeatures.length > 0 && (
              <div className="mt-2 space-y-1 border p-2 rounded-md bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground mb-1">Outras Funcionalidades Adicionadas:</p>
                {formData.otherSpecificFeatures.map((feat, index) => (
                  <div key={`saved-other-spec-${index}`} className="text-xs text-foreground p-1 bg-muted/50 rounded">{feat}</div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesStep;
