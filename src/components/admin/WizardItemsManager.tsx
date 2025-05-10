
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, InfoIcon } from 'lucide-react';
import SystemTypesManager from './SystemTypesManager';
import { WizardItem } from './ItemManager';
import ItemManager from './ItemManager';
import { 
  fetchWizardItemsByType, 
  createWizardItem, 
  updateWizardItem,
  deleteWizardItem
} from '@/services/wizardManagementService';
import { useToast } from '@/hooks/use-toast';

const WizardItemsManager: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('systemTypes');
  
  // Item states
  const [objectives, setObjectives] = useState<WizardItem[]>([]);
  const [features, setFeatures] = useState<WizardItem[]>([]);
  const [uxuiOptions, setUXUIOptions] = useState<WizardItem[]>([]);
  const [stackOptions, setStackOptions] = useState<WizardItem[]>([]);
  const [securityOptions, setSecurityOptions] = useState<WizardItem[]>([]);
  
  // Loading states
  const [loadingObjectives, setLoadingObjectives] = useState(false);
  const [loadingFeatures, setLoadingFeatures] = useState(false);
  const [loadingUXUI, setLoadingUXUI] = useState(false);
  const [loadingStack, setLoadingStack] = useState(false);
  const [loadingSecurity, setLoadingSecurity] = useState(false);
  
  // Processing states
  const [processingObjectives, setProcessingObjectives] = useState(false);
  const [processingFeatures, setProcessingFeatures] = useState(false);
  const [processingUXUI, setProcessingUXUI] = useState(false);
  const [processingStack, setProcessingStack] = useState(false);
  const [processingSecurity, setProcessingSecurity] = useState(false);
  
  // Error states
  const [objectivesError, setObjectivesError] = useState<string | null>(null);
  const [featuresError, setFeaturesError] = useState<string | null>(null);
  const [uxuiError, setUXUIError] = useState<string | null>(null);
  const [stackError, setStackError] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  // Load data when tab changes
  useEffect(() => {
    const loadDataForActiveTab = () => {
      switch(activeTab) {
        case 'objectives':
          if (objectives.length === 0 && !objectivesError) {
            loadObjectives();
          }
          break;
        case 'features':
          if (features.length === 0 && !featuresError) {
            loadFeatures();
          }
          break;
        case 'uxuiOptions':
          if (uxuiOptions.length === 0 && !uxuiError) {
            loadUXUI();
          }
          break;
        case 'stackOptions':
          if (stackOptions.length === 0 && !stackError) {
            loadStack();
          }
          break;
        case 'securityOptions':
          if (securityOptions.length === 0 && !securityError) {
            loadSecurity();
          }
          break;
      }
    };
    
    loadDataForActiveTab();
  }, [activeTab]);

  // Load data functions
  const loadObjectives = async () => {
    setLoadingObjectives(true);
    setObjectivesError(null);
    try {
      const items = await fetchWizardItemsByType('objective');
      setObjectives(items);
    } catch (error: any) {
      console.error('Error loading objectives:', error);
      setObjectivesError(error.message || 'Error loading data');
    } finally {
      setLoadingObjectives(false);
    }
  };

  const loadFeatures = async () => {
    setLoadingFeatures(true);
    setFeaturesError(null);
    try {
      const items = await fetchWizardItemsByType('feature');
      setFeatures(items);
    } catch (error: any) {
      console.error('Error loading features:', error);
      setFeaturesError(error.message || 'Error loading data');
    } finally {
      setLoadingFeatures(false);
    }
  };

  const loadUXUI = async () => {
    setLoadingUXUI(true);
    setUXUIError(null);
    try {
      const items = await fetchWizardItemsByType('uxui');
      setUXUIOptions(items);
    } catch (error: any) {
      console.error('Error loading UX/UI options:', error);
      setUXUIError(error.message || 'Error loading data');
    } finally {
      setLoadingUXUI(false);
    }
  };

  const loadStack = async () => {
    setLoadingStack(true);
    setStackError(null);
    try {
      const items = await fetchWizardItemsByType('stack');
      setStackOptions(items);
    } catch (error: any) {
      console.error('Error loading stack options:', error);
      setStackError(error.message || 'Error loading data');
    } finally {
      setLoadingStack(false);
    }
  };

  const loadSecurity = async () => {
    setLoadingSecurity(true);
    setSecurityError(null);
    try {
      const items = await fetchWizardItemsByType('security');
      setSecurityOptions(items);
    } catch (error: any) {
      console.error('Error loading security options:', error);
      setSecurityError(error.message || 'Error loading data');
    } finally {
      setLoadingSecurity(false);
    }
  };

  // CRUD operations for objectives
  const handleAddObjective = async (item: Partial<WizardItem>) => {
    setProcessingObjectives(true);
    try {
      const result = await createWizardItem(item, 'objective');
      if (result.success) {
        toast({
          title: t('dashboard.itemSaved'),
          description: item.translations?.['en'] || item.key
        });
        await loadObjectives();
      } else {
        toast({
          title: t('dashboard.errorSaving'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error adding objective:', error);
      toast({
        title: t('dashboard.errorSaving'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setProcessingObjectives(false);
    }
  };

  const handleUpdateObjective = async (id: number, item: Partial<WizardItem>) => {
    setProcessingObjectives(true);
    try {
      const result = await updateWizardItem(id, item);
      if (result.success) {
        toast({
          title: t('dashboard.itemUpdated'),
          description: item.translations?.['en'] || item.key
        });
        await loadObjectives();
      } else {
        toast({
          title: t('dashboard.errorUpdating'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating objective:', error);
      toast({
        title: t('dashboard.errorUpdating'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setProcessingObjectives(false);
    }
  };

  const handleDeleteObjective = async (id: number) => {
    setProcessingObjectives(true);
    try {
      const result = await deleteWizardItem(id);
      if (result.success) {
        toast({
          title: t('dashboard.itemDeleted'),
          variant: 'default'
        });
        await loadObjectives();
      } else {
        toast({
          title: t('dashboard.errorDeleting'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting objective:', error);
      toast({
        title: t('dashboard.errorDeleting'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setProcessingObjectives(false);
    }
  };

  // CRUD operations for features
  const handleAddFeature = async (item: Partial<WizardItem>) => {
    setProcessingFeatures(true);
    try {
      const result = await createWizardItem(item, 'feature');
      if (result.success) {
        toast({
          title: t('dashboard.itemSaved'),
          description: item.translations?.['en'] || item.key
        });
        await loadFeatures();
      } else {
        toast({
          title: t('dashboard.errorSaving'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error adding feature:', error);
      toast({
        title: t('dashboard.errorSaving'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setProcessingFeatures(false);
    }
  };

  const handleUpdateFeature = async (id: number, item: Partial<WizardItem>) => {
    setProcessingFeatures(true);
    try {
      const result = await updateWizardItem(id, item);
      if (result.success) {
        toast({
          title: t('dashboard.itemUpdated'),
          description: item.translations?.['en'] || item.key
        });
        await loadFeatures();
      } else {
        toast({
          title: t('dashboard.errorUpdating'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating feature:', error);
      toast({
        title: t('dashboard.errorUpdating'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setProcessingFeatures(false);
    }
  };

  const handleDeleteFeature = async (id: number) => {
    setProcessingFeatures(true);
    try {
      const result = await deleteWizardItem(id);
      if (result.success) {
        toast({
          title: t('dashboard.itemDeleted'),
          variant: 'default'
        });
        await loadFeatures();
      } else {
        toast({
          title: t('dashboard.errorDeleting'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast({
        title: t('dashboard.errorDeleting'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setProcessingFeatures(false);
    }
  };

  // CRUD operations for UX/UI options
  const handleAddUXUIOption = async (item: Partial<WizardItem>) => {
    setProcessingUXUI(true);
    try {
      const result = await createWizardItem(item, 'uxui');
      if (result.success) {
        toast({
          title: t('dashboard.itemSaved'),
          description: item.translations?.['en'] || item.key
        });
        await loadUXUI();
      } else {
        toast({
          title: t('dashboard.errorSaving'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error adding UX/UI option:', error);
      toast({
        title: t('dashboard.errorSaving'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setProcessingUXUI(false);
    }
  };

  const handleUpdateUXUIOption = async (id: number, item: Partial<WizardItem>) => {
    setProcessingUXUI(true);
    try {
      const result = await updateWizardItem(id, item);
      if (result.success) {
        toast({
          title: t('dashboard.itemUpdated'),
          description: item.translations?.['en'] || item.key
        });
        await loadUXUI();
      } else {
        toast({
          title: t('dashboard.errorUpdating'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating UX/UI option:', error);
      toast({
        title: t('dashboard.errorUpdating'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setProcessingUXUI(false);
    }
  };

  const handleDeleteUXUIOption = async (id: number) => {
    setProcessingUXUI(true);
    try {
      const result = await deleteWizardItem(id);
      if (result.success) {
        toast({
          title: t('dashboard.itemDeleted'),
          variant: 'default'
        });
        await loadUXUI();
      } else {
        toast({
          title: t('dashboard.errorDeleting'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting UX/UI option:', error);
      toast({
        title: t('dashboard.errorDeleting'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setProcessingUXUI(false);
    }
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      <span>{t('dashboard.loading')}</span>
    </div>
  );

  // Render error state
  const renderError = (error: string | null) => (
    <Alert variant="destructive" className="my-6">
      <AlertDescription>
        {error || t('dashboard.errorLoadingItems')}
      </AlertDescription>
    </Alert>
  );

  // Render no items state
  const renderEmpty = () => (
    <div className="flex justify-center items-center flex-col py-12 text-gray-500">
      <InfoIcon className="h-12 w-12 mb-2 text-gray-400" />
      {t('dashboard.noItemsFound')}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.wizardItems')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="systemTypes" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="systemTypes">{t('dashboard.systemTypes')}</TabsTrigger>
            <TabsTrigger value="objectives">{t('dashboard.objectives')}</TabsTrigger>
            <TabsTrigger value="features">{t('dashboard.featuresItems')}</TabsTrigger>
            <TabsTrigger value="uxuiOptions">{t('dashboard.uxuiOptions')}</TabsTrigger>
            <TabsTrigger value="stackOptions">{t('dashboard.stackOptions')}</TabsTrigger>
            <TabsTrigger value="securityOptions">{t('dashboard.securityOptions')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="systemTypes">
            <SystemTypesManager />
          </TabsContent>
          
          <TabsContent value="objectives">
            {loadingObjectives ? renderLoading() : 
              objectivesError ? renderError(objectivesError) :
                objectives.length === 0 ? renderEmpty() :
                  <ItemManager
                    title={t('dashboard.objectives')}
                    items={objectives}
                    onAddItem={handleAddObjective}
                    onUpdateItem={handleUpdateObjective}
                    onDeleteItem={handleDeleteObjective}
                    isProcessing={processingObjectives}
                    emptyStateMessage={t('dashboard.noObjectivesFound')}
                  />
            }
          </TabsContent>
          
          <TabsContent value="features">
            {loadingFeatures ? renderLoading() : 
              featuresError ? renderError(featuresError) :
                features.length === 0 ? renderEmpty() :
                  <ItemManager
                    title={t('dashboard.featuresItems')}
                    items={features}
                    onAddItem={handleAddFeature}
                    onUpdateItem={handleUpdateFeature}
                    onDeleteItem={handleDeleteFeature}
                    isProcessing={processingFeatures}
                    emptyStateMessage={t('dashboard.noFeaturesFound')}
                  />
            }
          </TabsContent>
          
          <TabsContent value="uxuiOptions">
            {loadingUXUI ? renderLoading() : 
              uxuiError ? renderError(uxuiError) :
                uxuiOptions.length === 0 ? renderEmpty() :
                  <ItemManager
                    title={t('dashboard.uxuiOptions')}
                    items={uxuiOptions}
                    onAddItem={handleAddUXUIOption}
                    onUpdateItem={handleUpdateUXUIOption}
                    onDeleteItem={handleDeleteUXUIOption}
                    isProcessing={processingUXUI}
                    emptyStateMessage={t('dashboard.noUXUIOptionsFound')}
                  />
            }
          </TabsContent>
          
          <TabsContent value="stackOptions">
            {loadingStack ? renderLoading() : 
              stackError ? renderError(stackError) :
                stackOptions.length === 0 ? renderEmpty() :
                  <ItemManager
                    title={t('dashboard.stackOptions')}
                    items={stackOptions}
                    isProcessing={processingStack}
                    emptyStateMessage={t('dashboard.noStackOptionsFound')}
                  />
            }
          </TabsContent>
          
          <TabsContent value="securityOptions">
            {loadingSecurity ? renderLoading() : 
              securityError ? renderError(securityError) :
                securityOptions.length === 0 ? renderEmpty() :
                  <ItemManager
                    title={t('dashboard.securityOptions')}
                    items={securityOptions}
                    isProcessing={processingSecurity}
                    emptyStateMessage={t('dashboard.noSecurityOptionsFound')}
                  />
            }
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WizardItemsManager;
