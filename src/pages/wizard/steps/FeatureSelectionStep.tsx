
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RotateCcw, Save, CheckCircle, ChevronLeft, ChevronRight, ListPlus, PlusCircle, XCircle } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface FeatureSelectionFormData {
  selectedFeatures: string[];
  customFeatures?: string[];
}

interface FeatureSelectionStepProps {
  formData: FeatureSelectionFormData;
  updateFormData: (data: Partial<FeatureSelectionFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
  onNext: () => void;
  onPrev: () => void;
  handleSaveProgress: () => void;
}

const FeatureSelectionStep: React.FC<FeatureSelectionStepProps> = ({
  formData,
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized,
  onNext,
  onPrev,
  handleSaveProgress
}) => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [isCustomPopoverOpen, setIsCustomPopoverOpen] = useState(false);
  const [currentCustomInput, setCurrentCustomInput] = useState('');
  const [tempCustomList, setTempCustomList] = useState<string[]>([]);
  
  // Sample feature options - in a real implementation these would come from API or JSON file
  const featureOptions = [
    { id: 'auth', label: 'Authentication', description: 'User login, registration, and account management' },
    { id: 'dashboard', label: 'Dashboard', description: 'User dashboard with analytics and stats' },
    { id: 'notifications', label: 'Notifications', description: 'Email and push notifications' },
    { id: 'payments', label: 'Payment Processing', description: 'Accept and manage payments' },
    { id: 'fileUpload', label: 'File Upload', description: 'Upload and manage files' },
    { id: 'search', label: 'Search Functionality', description: 'Allow users to search content' },
    { id: 'analytics', label: 'Analytics', description: 'Track user behavior and app performance' },
    { id: 'chat', label: 'Chat/Messaging', description: 'Real-time chat between users' },
    { id: 'adminPanel', label: 'Admin Panel', description: 'Administrative dashboard and controls' },
    { id: 'api', label: 'API Integration', description: 'Connect with external services' }
  ];
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(featureOptions.length / itemsPerPage);
  const currentFeaturesToDisplay = featureOptions.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );
  
  const handleFeatureChange = (featureId: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...formData.selectedFeatures, featureId]
      : formData.selectedFeatures.filter(id => id !== featureId);
    
    updateFormData({ selectedFeatures: updatedFeatures });
  };
  
  // Handle custom features
  React.useEffect(() => {
    if (isCustomPopoverOpen) {
      setTempCustomList(Array.isArray(formData.customFeatures) ? formData.customFeatures : []);
      setCurrentCustomInput('');
    }
  }, [isCustomPopoverOpen, formData.customFeatures]);
  
  const handleAddCustomFeature = () => {
    if (currentCustomInput.trim() && tempCustomList.length < 10) {
      setTempCustomList([...tempCustomList, currentCustomInput.trim()]);
      setCurrentCustomInput('');
    }
  };
  
  const handleRemoveCustomFeature = (index: number) => {
    setTempCustomList(tempCustomList.filter((_, i) => i !== index));
  };
  
  const handleSaveCustomFeatures = () => {
    updateFormData({ customFeatures: tempCustomList });
    setIsCustomPopoverOpen(false);
  };
  
  const validateForm = () => {
    return formData.selectedFeatures.length > 0 || 
           (Array.isArray(formData.customFeatures) && formData.customFeatures.length > 0);
  };
  
  const handleFinalize = () => {
    if (validateForm()) {
      markAsFinalized();
    } else {
      alert(t('promptGenerator.features.selectAtLeastOne') || 'Selecione pelo menos uma feature');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t('promptGenerator.features.title') || "Seleção de Features"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.features.description') || "Selecione as features para seu projeto"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={resetStep} size="icon" className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">{t('common.reset') || "Resetar"}</span>
              </Button>
              <Button 
                onClick={handleFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? t('common.finalized') : t('common.saveAndFinalize')}</span>
              </Button>
              {isFinalized && <CheckCircle className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-4">
          <div className="space-y-3">
            {currentFeaturesToDisplay.map(feature => (
              <div key={feature.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`feature-${feature.id}`}
                  checked={formData.selectedFeatures.includes(feature.id)}
                  onCheckedChange={(checked) => 
                    handleFeatureChange(feature.id, checked === true)
                  }
                />
                <div>
                  <Label 
                    htmlFor={`feature-${feature.id}`} 
                    className="font-medium cursor-pointer"
                  >
                    {feature.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Popover open={isCustomPopoverOpen} onOpenChange={setIsCustomPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <ListPlus className="h-3 w-3 mr-1.5" />
                  {t('promptGenerator.features.customFeature') || "Adicionar Feature Personalizada"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" side="top">
                <div className="space-y-3">
                  <Label htmlFor="custom-feature-input" className="text-sm font-medium">
                    {t('promptGenerator.features.customFeaturePlaceholder') || 'Adicionar feature personalizada:'}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="custom-feature-input" 
                      value={currentCustomInput} 
                      onChange={(e) => setCurrentCustomInput(e.target.value)} 
                      placeholder={t('promptGenerator.features.enterFeature') || 'Digite a feature...'}
                      className="text-xs" 
                      onKeyDown={(e) => { if (e.key === 'Enter' && currentCustomInput.trim()) handleAddCustomFeature(); }}
                    />
                    <Button 
                      size="icon" 
                      onClick={handleAddCustomFeature}
                      disabled={!currentCustomInput.trim() || tempCustomList.length >= 10} 
                      className="h-8 w-8 flex-shrink-0"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {tempCustomList.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">
                        {`${t('promptGenerator.features.added') || 'Adicionadas'} (${tempCustomList.length}/10):`}
                      </p>
                      {tempCustomList.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                          <span className="truncate flex-1 mr-2">{item}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveCustomFeature(idx)} className="h-5 w-5">
                            <XCircle className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {tempCustomList.length >= 10 && (
                    <p className="text-xs text-destructive mt-1">
                      {t('promptGenerator.features.limitReached') || "Limite de 10 features personalizada atingido."}
                    </p>
                  )}
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setIsCustomPopoverOpen(false)} 
                      className="text-xs"
                    >
                      {t('common.cancel') || 'Cancelar'}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveCustomFeatures}
                      disabled={tempCustomList.length === 0} 
                      className="text-xs"
                    >
                      {t('common.save') || 'Salvar'}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))} 
                  disabled={currentPage === 0} 
                  className="h-7 w-7"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {`${t('common.page') || 'Página'} ${currentPage + 1} ${t('common.of') || 'de'} ${totalPages}`}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} 
                  disabled={currentPage === totalPages - 1} 
                  className="h-7 w-7"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {Array.isArray(formData.customFeatures) && formData.customFeatures.length > 0 && (
            <div className="mt-4 space-y-2 border p-3 rounded-md bg-muted/20">
              <h4 className="text-sm font-medium">{t('promptGenerator.features.customFeatures') || "Features Personalizadas"}</h4>
              <div className="space-y-1">
                {formData.customFeatures.map((feature, index) => (
                  <div key={index} className="text-sm bg-muted/50 px-2 py-1 rounded">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onPrev}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('common.previous') || "Anterior"}
            </Button>
            
            <Button
              type="button"
              onClick={onNext}
            >
              {t('common.next') || "Próximo"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureSelectionStep;
