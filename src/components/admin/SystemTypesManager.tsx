
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import ItemManager, { WizardItem } from './ItemManager';
import { fetchSystemTypes, createWizardItem, updateWizardItem, deleteWizardItem } from '@/services/wizardManagementService';
import { Loader2 } from 'lucide-react';

const SystemTypesManager: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [systemTypes, setSystemTypes] = useState<WizardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadSystemTypes();
  }, []);

  const loadSystemTypes = async () => {
    setIsLoading(true);
    try {
      const items = await fetchSystemTypes();
      setSystemTypes(items);
    } catch (error) {
      console.error('Error loading system types:', error);
      toast({
        title: t('dashboard.errorLoading'),
        description: t('dashboard.errorLoadingItems'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (item: Partial<WizardItem>) => {
    setIsProcessing(true);
    try {
      const result = await createWizardItem(item, 'system_type');
      
      if (result.success && result.id) {
        toast({
          title: t('dashboard.itemSaved'),
          description: item.translations?.['en'] || item.key
        });
        
        // Reload data to get the updated list
        await loadSystemTypes();
      } else {
        toast({
          title: t('dashboard.errorSaving'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error adding system type:', error);
      toast({
        title: t('dashboard.errorSaving'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateItem = async (id: string, item: Partial<WizardItem>) => {
    setIsProcessing(true);
    try {
      const result = await updateWizardItem(id, item);
      
      if (result.success) {
        toast({
          title: t('dashboard.itemUpdated'),
          description: item.translations?.['en'] || item.key
        });
        
        // Reload data to get the updated list
        await loadSystemTypes();
      } else {
        toast({
          title: t('dashboard.errorUpdating'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating system type:', error);
      toast({
        title: t('dashboard.errorUpdating'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    setIsProcessing(true);
    try {
      const result = await deleteWizardItem(id);
      
      if (result.success) {
        toast({
          title: t('dashboard.itemDeleted'),
          variant: 'default'
        });
        
        // Reload data to get the updated list
        await loadSystemTypes();
      } else {
        toast({
          title: t('dashboard.errorDeleting'),
          description: result.error || t('dashboard.unknownError'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting system type:', error);
      toast({
        title: t('dashboard.errorDeleting'),
        description: t('dashboard.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">{t('dashboard.loading')}</span>
      </div>
    );
  }

  return (
    <ItemManager
      title={t('dashboard.systemTypes')}
      items={systemTypes}
      onAddItem={handleAddItem}
      onUpdateItem={handleUpdateItem}
      onDeleteItem={handleDeleteItem}
      isProcessing={isProcessing}
      emptyStateMessage={t('dashboard.noSystemTypes')}
    />
  );
};

export default SystemTypesManager;
