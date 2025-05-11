import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Plus, Trash, ChevronLeft, ChevronRight, ListPlus, PlusCircle, XCircle, RotateCcw, Save, CheckCircle as CheckCircleIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RequirementsFormData {
  defineRequirements: boolean;
  userTypes: string[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  otherRequirement: string[];
}

interface RequirementsStepProps {
  formData: RequirementsFormData;
  updateFormData: (data: Partial<RequirementsFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const commonNonFunctionalOptions = [
  { key: 'performance', defaultText: 'Performance (velocidade de carregamento)' },
  { key: 'dataSecurity', defaultText: 'Segurança de dados' },
  { key: 'scalability', defaultText: 'Escalabilidade (capacidade de crescimento)' },
  { key: 'usability', defaultText: 'Usabilidade (facilidade de uso)' },
  { key: 'accessibilityReq', defaultText: 'Acessibilidade (WCAG)' },
  { key: 'mobileCompatibility', defaultText: 'Compatibilidade com dispositivos móveis' },
  { key: 'multiLanguageSupport', defaultText: 'Suporte a múltiplos idiomas' },
  { key: 'compliance', defaultText: 'Conformidade com normas (LGPD, GDPR, etc.)' },
  { key: 'monitoringLogging', defaultText: 'Monitoramento e logs' },
  { key: 'backupRecovery', defaultText: 'Backup e recuperação de dados' },
  { key: 'highAvailability', defaultText: 'Alta disponibilidade (uptime)' },
  { key: 'browserCompatibility', defaultText: 'Compatibilidade com navegadores' }
];

const MAX_ITEMS = 10;
const LIST_ITEMS_PER_PAGE = 4; 
const NFR_CHECKBOXES_PER_PAGE = 6; // 2 cols * 3 rows

const RequirementsStep: React.FC<RequirementsStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  const { t } = useLanguage();
  
  const [newUserType, setNewUserType] = useState('');
  const [newFunctionalRequirement, setNewFunctionalRequirement] = useState('');

  const [currentUserTypesPage, setCurrentUserTypesPage] = useState(0);
  const [currentFunctionalReqsPage, setCurrentFunctionalReqsPage] = useState(0);
  
  const [currentNfrCheckboxPage, setCurrentNfrCheckboxPage] = useState(0);
  const [isOtherNfrPopoverOpen, setIsOtherNfrPopoverOpen] = useState(false);
  const [currentOtherNfrInput, setCurrentOtherNfrInput] = useState('');
  const [tempOtherNfrList, setTempOtherNfrList] = useState<string[]>([]);

  const otherNfrArray = Array.isArray(formData.otherRequirement) ? formData.otherRequirement : [];

  useEffect(() => {
    if (isOtherNfrPopoverOpen) {
      setTempOtherNfrList(Array.isArray(formData.otherRequirement) ? formData.otherRequirement : []);
      setCurrentOtherNfrInput('');
    }
  }, [isOtherNfrPopoverOpen, formData.otherRequirement]);

  const handleAddUserType = () => {
    if (newUserType.trim() && formData.userTypes.length < MAX_ITEMS) {
      updateFormData({ userTypes: [...formData.userTypes, newUserType.trim()] });
      setNewUserType('');
    }
  };
  const handleRemoveUserType = (indexToRemove: number) => {
    const actualIndex = currentUserTypesPage * LIST_ITEMS_PER_PAGE + indexToRemove;
    const newList = formData.userTypes.filter((_, i) => i !== actualIndex);
    updateFormData({ userTypes: newList });
    if (newList.length > 0 && newList.length % LIST_ITEMS_PER_PAGE === 0 && currentUserTypesPage > 0 && currentUserTypesPage * LIST_ITEMS_PER_PAGE >= newList.length) {
      setCurrentUserTypesPage(currentUserTypesPage - 1);
    } else if (newList.length === 0) {
      setCurrentUserTypesPage(0);
    }
  };
  const totalUserTypesPages = Math.ceil(formData.userTypes.length / LIST_ITEMS_PER_PAGE);
  const userTypesToDisplay = formData.userTypes.slice(currentUserTypesPage * LIST_ITEMS_PER_PAGE, (currentUserTypesPage + 1) * LIST_ITEMS_PER_PAGE);

  const handleAddFunctionalRequirement = () => {
    if (newFunctionalRequirement.trim() && formData.functionalRequirements.length < MAX_ITEMS) {
      updateFormData({ functionalRequirements: [...formData.functionalRequirements, newFunctionalRequirement.trim()] });
      setNewFunctionalRequirement('');
    }
  };
  const handleRemoveFunctionalRequirement = (indexToRemove: number) => {
    const actualIndex = currentFunctionalReqsPage * LIST_ITEMS_PER_PAGE + indexToRemove;
    const newList = formData.functionalRequirements.filter((_, i) => i !== actualIndex);
    updateFormData({ functionalRequirements: newList });
     if (newList.length > 0 && newList.length % LIST_ITEMS_PER_PAGE === 0 && currentFunctionalReqsPage > 0 && currentFunctionalReqsPage * LIST_ITEMS_PER_PAGE >= newList.length) {
      setCurrentFunctionalReqsPage(currentFunctionalReqsPage - 1);
    } else if (newList.length === 0) {
      setCurrentFunctionalReqsPage(0);
    }
  };
  const totalFunctionalReqsPages = Math.ceil(formData.functionalRequirements.length / LIST_ITEMS_PER_PAGE);
  const functionalReqsToDisplay = formData.functionalRequirements.slice(currentFunctionalReqsPage * LIST_ITEMS_PER_PAGE, (currentFunctionalReqsPage + 1) * LIST_ITEMS_PER_PAGE);

  const handleNonFunctionalRequirementToggle = (requirementKey: string) => {
    const newSelection = formData.nonFunctionalRequirements.includes(requirementKey)
      ? formData.nonFunctionalRequirements.filter(rKey => rKey !== requirementKey)
      : [...formData.nonFunctionalRequirements, requirementKey];
    updateFormData({ nonFunctionalRequirements: newSelection });
  };
  
  const handleToggleAllNfrCheckboxes = () => {
    const allNfrKeys = commonNonFunctionalOptions.map(opt => opt.key);
    const allSelected = allNfrKeys.every(key => formData.nonFunctionalRequirements.includes(key));
    if (allSelected) {
      const newSelection = formData.nonFunctionalRequirements.filter(key => !allNfrKeys.includes(key) || key === 'Other');
      updateFormData({ nonFunctionalRequirements: newSelection });
    } else {
      updateFormData({ nonFunctionalRequirements: Array.from(new Set([...formData.nonFunctionalRequirements, ...allNfrKeys])) });
    }
  };
  const allNfrCheckboxesSelected = commonNonFunctionalOptions.length > 0 && commonNonFunctionalOptions.every(opt => formData.nonFunctionalRequirements.includes(opt.key));
  
  const totalNfrCheckboxPages = Math.ceil(commonNonFunctionalOptions.length / NFR_CHECKBOXES_PER_PAGE);
  const nfrCheckboxesToDisplay = commonNonFunctionalOptions.slice(currentNfrCheckboxPage * NFR_CHECKBOXES_PER_PAGE, (currentNfrCheckboxPage + 1) * NFR_CHECKBOXES_PER_PAGE);

  const handleAddOtherNfrToList = () => {
    if (currentOtherNfrInput.trim() && tempOtherNfrList.length < MAX_ITEMS) {
      setTempOtherNfrList([...tempOtherNfrList, currentOtherNfrInput.trim()]);
      setCurrentOtherNfrInput('');
    }
  };
  const handleRemoveOtherNfrFromList = (indexToRemove: number) => {
    setTempOtherNfrList(tempOtherNfrList.filter((_, index) => index !== indexToRemove));
  };
  const handleSaveAllTempNfrs = () => {
    updateFormData({ otherRequirement: tempOtherNfrList });
    const currentNfrs = formData.nonFunctionalRequirements.filter(r => r !== 'Other');
    if (tempOtherNfrList.length > 0) {
        updateFormData({ nonFunctionalRequirements: Array.from(new Set([...currentNfrs, 'Other'])) });
    } else {
        updateFormData({ nonFunctionalRequirements: currentNfrs });
    }
    setIsOtherNfrPopoverOpen(false);
  };

  const handleReset = () => {
    resetStep();
    setNewUserType('');
    setNewFunctionalRequirement('');
    setCurrentUserTypesPage(0);
    setCurrentFunctionalReqsPage(0);
    setCurrentNfrCheckboxPage(0);
    setTempOtherNfrList([]);
    setCurrentOtherNfrInput('');
  };

  const handleSaveAndFinalize = () => {
    if (formData.defineRequirements && 
        formData.userTypes.length === 0 &&
        formData.functionalRequirements.length === 0 &&
        formData.nonFunctionalRequirements.length === 0 &&
        otherNfrArray.length === 0) {
      alert(t('promptGenerator.requirements.atLeastOneRequirementError') || "Defina ao menos um tipo de requisito quando a definição detalhada está ativa.");
      return;
    }
    markAsFinalized();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-0">
          <div className="flex justify-between items-start"> {/* Changed items-center to items-start */}
            <div>
              <CardTitle>{t('promptGenerator.requirements.title') || "Requisitos"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.requirements.description') || "Especifique os requisitos para seu projeto"}
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
                disabled={isFinalized || (formData.defineRequirements && formData.userTypes.length === 0 && formData.functionalRequirements.length === 0 && formData.nonFunctionalRequirements.length === 0 && otherNfrArray.length === 0)}
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
            <Switch checked={formData.defineRequirements} onCheckedChange={(checked) => updateFormData({ defineRequirements: checked })} id="define-requirements-toggle"/>
            <Label htmlFor="define-requirements-toggle" className="text-sm font-medium text-foreground">{t('promptGenerator.requirements.defineRequirements') || "Definir requisitos detalhados"}</Label>
          </div>

          {formData.defineRequirements && (
            <>
              <div className="space-y-1 py-0 my-0 pt-1">
                <Label className="text-base font-medium text-foreground block pb-0.5">{t('promptGenerator.requirements.userTypes') || "Tipos de Usuários"}</Label>
                <p className="text-xs text-muted-foreground mb-1">{t('promptGenerator.requirements.userTypesHelp') || "Quem usará o sistema? Defina os diferentes papéis."}</p>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input value={newUserType} onChange={(e) => setNewUserType(e.target.value)} placeholder={t('promptGenerator.requirements.userTypesPlaceholder') || "Ex: clientes, administradores"} onKeyDown={(e) => {if (e.key === 'Enter') handleAddUserType();}} className="h-8 text-xs py-1" disabled={formData.userTypes.length >= MAX_ITEMS}/>
                    <Button type="button" onClick={handleAddUserType} className="whitespace-nowrap h-8 text-xs px-3" disabled={formData.userTypes.length >= MAX_ITEMS || !newUserType.trim()}><Plus className="h-3.5 w-3.5 mr-1" />{t('promptGenerator.common.add') || "Adicionar"}</Button>
                  </div>
                  {formData.userTypes.length >= MAX_ITEMS && (<p className="text-xs text-destructive">{`Limite de ${MAX_ITEMS} tipos de usuários atingido.`}</p>)}
                  {formData.userTypes.length > 0 ? (<>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 min-h-[50px]">
                      {userTypesToDisplay.map((userType, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/50 p-1.5 rounded-md text-xs">
                          <span className="truncate flex-1 mr-1">{userType}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveUserType(index)} className="h-6 w-6 flex-shrink-0"><Trash className="h-3.5 w-3.5 text-destructive" /></Button>
                        </div>))}
                    </div>
                    {totalUserTypesPages > 1 && (<div className="flex items-center justify-center space-x-1 mt-1">
                      <Button variant="ghost" size="icon" onClick={() => setCurrentUserTypesPage(p => Math.max(0, p - 1))} disabled={currentUserTypesPage === 0} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                      <span className="text-xs text-muted-foreground">{`${t('common.page') || 'Página'} ${currentUserTypesPage + 1} ${t('common.of') || 'de'} ${totalUserTypesPages}`}</span>
                      <Button variant="ghost" size="icon" onClick={() => setCurrentUserTypesPage(p => Math.min(totalUserTypesPages - 1, p + 1))} disabled={currentUserTypesPage === totalUserTypesPages - 1} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                    </div>)}
                  </>) : (<p className="text-xs italic text-muted-foreground pt-0.5">{t('promptGenerator.requirements.noUserTypes') || "Nenhum tipo de usuário adicionado."}</p>)}
                </div>
              </div>
              
              <div className="space-y-1 py-0 my-0 pt-2 border-t">
                <Label className="text-base font-medium text-foreground block pb-0.5 pt-1">{t('promptGenerator.requirements.functionalRequirements') || "Requisitos Funcionais"}</Label>
                <p className="text-xs text-muted-foreground mb-1">{t('promptGenerator.requirements.functionalRequirementsHelp') || "O que o sistema deve ser capaz de fazer? Liste as funcionalidades principais."}</p>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input value={newFunctionalRequirement} onChange={(e) => setNewFunctionalRequirement(e.target.value)} placeholder={t('promptGenerator.requirements.functionalPlaceholder') || "Descreva um requisito funcional"} onKeyDown={(e) => {if (e.key === 'Enter') handleAddFunctionalRequirement();}} className="h-8 text-xs py-1" disabled={formData.functionalRequirements.length >= MAX_ITEMS}/>
                    <Button type="button" onClick={handleAddFunctionalRequirement} className="whitespace-nowrap h-8 text-xs px-3" disabled={formData.functionalRequirements.length >= MAX_ITEMS || !newFunctionalRequirement.trim()}><Plus className="h-3.5 w-3.5 mr-1" />{t('promptGenerator.common.add') || "Adicionar"}</Button>
                  </div>
                  {formData.functionalRequirements.length >= MAX_ITEMS && (<p className="text-xs text-destructive">{`Limite de ${MAX_ITEMS} requisitos funcionais atingido.`}</p>)}
                  {formData.functionalRequirements.length > 0 ? (<>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 min-h-[50px]">
                      {functionalReqsToDisplay.map((requirement, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/50 p-1.5 rounded-md text-xs">
                          <span className="truncate flex-1 mr-1">{requirement}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveFunctionalRequirement(index)} className="h-6 w-6 flex-shrink-0"><Trash className="h-3.5 w-3.5 text-destructive" /></Button>
                        </div>))}
                    </div>
                    {totalFunctionalReqsPages > 1 && (<div className="flex items-center justify-center space-x-1 mt-1">
                      <Button variant="ghost" size="icon" onClick={() => setCurrentFunctionalReqsPage(p => Math.max(0, p - 1))} disabled={currentFunctionalReqsPage === 0} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                      <span className="text-xs text-muted-foreground">{`${t('common.page') || 'Página'} ${currentFunctionalReqsPage + 1} ${t('common.of') || 'de'} ${totalFunctionalReqsPages}`}</span>
                      <Button variant="ghost" size="icon" onClick={() => setCurrentFunctionalReqsPage(p => Math.min(totalFunctionalReqsPages - 1, p + 1))} disabled={currentFunctionalReqsPage === totalFunctionalReqsPages - 1} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                    </div>)}
                  </>) : (<p className="text-xs italic text-muted-foreground pt-0.5">{t('promptGenerator.requirements.noFunctionalRequirements') || "Nenhum requisito funcional adicionado."}</p>)}
                </div>
              </div>
              
              <div className="pt-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="non-functional-requirements" className="border-0">
                    <AccordionTrigger className="text-base font-medium text-foreground py-2 hover:no-underline border-b-0">
                      {t('promptGenerator.requirements.nonFunctionalRequirements') || "Requisitos Não-Funcionais"}
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {nfrCheckboxesToDisplay.map((reqOpt) => (
                          <div key={reqOpt.key} className="flex items-start space-x-1.5">
                            <Checkbox id={`nfr-${reqOpt.key}`} checked={formData.nonFunctionalRequirements.includes(reqOpt.key)} onCheckedChange={() => handleNonFunctionalRequirementToggle(reqOpt.key)} className="mt-0.5"/>
                            <Label htmlFor={`nfr-${reqOpt.key}`} className="cursor-pointer text-xs font-normal whitespace-normal leading-tight">{t(`promptGenerator.requirements.${reqOpt.key}`) || reqOpt.defaultText}</Label>
                          </div>))}
                      </div>
                      <div className="flex items-center justify-end space-x-2 mt-3 pt-2">
                        {commonNonFunctionalOptions.length > 0 && (
                          <Button variant="outline" size="sm" className="text-xs mr-auto" onClick={handleToggleAllNfrCheckboxes}>
                            {allNfrCheckboxesSelected ? (t('common.unselectAll') || "Desmarcar Todos") : (t('common.selectAll') || "Marcar Todos")}
                          </Button>)}
                        <Popover open={isOtherNfrPopoverOpen} onOpenChange={setIsOtherNfrPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs">
                              <ListPlus className="h-3 w-3 mr-1.5" />{t('promptGenerator.requirements.notInList') || "Não está na lista?"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-4" side="top" align="end">
                            <div className="space-y-3">
                              <Label htmlFor="other-nfr-input-popover" className="text-sm font-medium">{t('promptGenerator.requirements.otherRequirementPrompt') || 'Adicionar outro requisito:'}</Label>
                              <div className="flex items-center space-x-2">
                                <Input id="other-nfr-input-popover" value={currentOtherNfrInput} onChange={(e) => setCurrentOtherNfrInput(e.target.value)} placeholder={t('promptGenerator.requirements.otherRequirementPlaceholder') || 'Seu requisito...'} className="text-xs" onKeyDown={(e) => { if (e.key === 'Enter' && currentOtherNfrInput.trim()) handleAddOtherNfrToList(); }}/>
                                <Button size="icon" onClick={handleAddOtherNfrToList} disabled={!currentOtherNfrInput.trim() || tempOtherNfrList.length >= MAX_ITEMS} className="h-8 w-8 flex-shrink-0"><PlusCircle className="h-4 w-4" /></Button>
                              </div>
                              {tempOtherNfrList.length > 0 && (<div className="mt-2 space-y-1 max-h-28 overflow-y-auto border p-2 rounded-md">
                                <p className="text-xs text-muted-foreground mb-1">{`Adicionados (${tempOtherNfrList.length}/${MAX_ITEMS}):`}</p>
                                {tempOtherNfrList.map((obj, index) => (<div key={index} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                                  <span className="truncate flex-1 mr-2">{obj}</span>
                                  <Button variant="ghost" size="icon" onClick={() => handleRemoveOtherNfrFromList(index)} className="h-5 w-5"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                                </div>))}
                              </div>)}
                              {tempOtherNfrList.length >= MAX_ITEMS && (<p className="text-xs text-destructive mt-1">{`Limite de ${MAX_ITEMS} requisitos atingido.`}</p>)}
                              <div className="flex justify-end space-x-2 mt-3">
                                <Button size="sm" variant="ghost" onClick={() => setIsOtherNfrPopoverOpen(false)} className="text-xs">{t('common.cancel') || 'Cancelar'}</Button>
                                <Button size="sm" onClick={handleSaveAllTempNfrs} disabled={tempOtherNfrList.length === 0 && otherNfrArray.length === 0 && !currentOtherNfrInput.trim()}>{t('promptGenerator.requirements.saveNfrsButton') || 'Salvar Requisito(s)'}</Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        {totalNfrCheckboxPages > 1 && (<div className="flex items-center justify-center space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => setCurrentNfrCheckboxPage(p => Math.max(0, p - 1))} disabled={currentNfrCheckboxPage === 0} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                          <span className="text-xs text-muted-foreground">{`${t('common.page') || 'Página'} ${currentNfrCheckboxPage + 1} ${t('common.of') || 'de'} ${totalNfrCheckboxPages}`}</span>
                          <Button variant="ghost" size="icon" onClick={() => setCurrentNfrCheckboxPage(p => Math.min(totalNfrCheckboxPages - 1, p + 1))} disabled={currentNfrCheckboxPage === totalNfrCheckboxPages - 1} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                        </div>)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </>
          )}

        </CardContent>
        {/* Action Buttons DIV removed from here */}
      </Card>
    </div>
  );
};

export default RequirementsStep;
