
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SystemTypesManager from './SystemTypesManager';
import { WizardItem } from './ItemManager';
import ItemManager from './ItemManager';

// Mock data for objectives
const initialObjectives: WizardItem[] = [
  {
    id: 1,
    key: 'ecommerce',
    active: true,
    translations: {
      en: 'E-commerce / Online Store',
      pt: 'E-commerce / Loja Online'
    }
  },
  {
    id: 2,
    key: 'crm',
    active: true,
    translations: {
      en: 'CRM System',
      pt: 'Sistema CRM'
    }
  },
  {
    id: 3,
    key: 'social',
    active: true,
    translations: {
      en: 'Social Network',
      pt: 'Rede Social'
    }
  }
];

// Mock data for features
const initialFeatures: WizardItem[] = [
  {
    id: 1,
    key: 'authentication',
    active: true,
    translations: {
      en: 'User Authentication',
      pt: 'Autenticação de Usuário'
    }
  },
  {
    id: 2,
    key: 'payments',
    active: true,
    translations: {
      en: 'Payment Processing',
      pt: 'Processamento de Pagamento'
    }
  },
  {
    id: 3,
    key: 'fileUpload',
    active: true,
    translations: {
      en: 'File Upload',
      pt: 'Upload de Arquivos'
    }
  }
];

// Mock data for UX/UI options
const initialUXUIOptions: WizardItem[] = [
  {
    id: 1,
    key: 'blue',
    active: true,
    translations: {
      en: 'Blue',
      pt: 'Azul'
    },
    category: 'color'
  },
  {
    id: 2,
    key: 'green',
    active: true,
    translations: {
      en: 'Green',
      pt: 'Verde'
    },
    category: 'color'
  },
  {
    id: 3,
    key: 'minimalist',
    active: true,
    translations: {
      en: 'Minimalist',
      pt: 'Minimalista'
    },
    category: 'style'
  }
];

const WizardItemsManager: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('systemTypes');
  const [objectives, setObjectives] = useState<WizardItem[]>(initialObjectives);
  const [features, setFeatures] = useState<WizardItem[]>(initialFeatures);
  const [uxuiOptions, setUXUIOptions] = useState<WizardItem[]>(initialUXUIOptions);

  // Handlers for objectives
  const handleAddObjective = (item: Partial<WizardItem>) => {
    const newId = Math.max(...objectives.map(item => item.id), 0) + 1;
    setObjectives(prev => [...prev, { ...item, id: newId } as WizardItem]);
  };

  const handleUpdateObjective = (id: number, item: Partial<WizardItem>) => {
    setObjectives(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as WizardItem
          : prevItem
      )
    );
  };

  const handleDeleteObjective = (id: number) => {
    setObjectives(prev => prev.filter(item => item.id !== id));
  };

  // Handlers for features
  const handleAddFeature = (item: Partial<WizardItem>) => {
    const newId = Math.max(...features.map(item => item.id), 0) + 1;
    setFeatures(prev => [...prev, { ...item, id: newId } as WizardItem]);
  };

  const handleUpdateFeature = (id: number, item: Partial<WizardItem>) => {
    setFeatures(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as WizardItem
          : prevItem
      )
    );
  };

  const handleDeleteFeature = (id: number) => {
    setFeatures(prev => prev.filter(item => item.id !== id));
  };

  // Handlers for UX/UI options
  const handleAddUXUIOption = (item: Partial<WizardItem>) => {
    const newId = Math.max(...uxuiOptions.map(item => item.id), 0) + 1;
    setUXUIOptions(prev => [...prev, { ...item, id: newId } as WizardItem]);
  };

  const handleUpdateUXUIOption = (id: number, item: Partial<WizardItem>) => {
    setUXUIOptions(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as WizardItem
          : prevItem
      )
    );
  };

  const handleDeleteUXUIOption = (id: number) => {
    setUXUIOptions(prev => prev.filter(item => item.id !== id));
  };

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
            <ItemManager
              title={t('dashboard.objectives')}
              items={objectives}
              onAddItem={handleAddObjective}
              onUpdateItem={handleUpdateObjective}
              onDeleteItem={handleDeleteObjective}
            />
          </TabsContent>
          
          <TabsContent value="features">
            <ItemManager
              title={t('dashboard.featuresItems')}
              items={features}
              onAddItem={handleAddFeature}
              onUpdateItem={handleUpdateFeature}
              onDeleteItem={handleDeleteFeature}
            />
          </TabsContent>
          
          <TabsContent value="uxuiOptions">
            <ItemManager
              title={t('dashboard.uxuiOptions')}
              items={uxuiOptions}
              onAddItem={handleAddUXUIOption}
              onUpdateItem={handleUpdateUXUIOption}
              onDeleteItem={handleDeleteUXUIOption}
            />
          </TabsContent>
          
          <TabsContent value="stackOptions">
            <div className="flex justify-center items-center py-12 text-gray-500">
              {t('dashboard.noItemsFound')}
            </div>
          </TabsContent>
          
          <TabsContent value="securityOptions">
            <div className="flex justify-center items-center py-12 text-gray-500">
              {t('dashboard.noItemsFound')}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WizardItemsManager;
