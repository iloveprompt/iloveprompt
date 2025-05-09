
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

// Mock data for Requirements
const initialRequirements: WizardItem[] = [
  {
    id: 1,
    key: 'userTypes',
    active: true,
    translations: {
      en: 'Customer',
      pt: 'Cliente'
    },
    category: 'userType'
  },
  {
    id: 2,
    key: 'userTypes',
    active: true,
    translations: {
      en: 'Administrator',
      pt: 'Administrador'
    },
    category: 'userType'
  },
  {
    id: 3,
    key: 'functional',
    active: true,
    translations: {
      en: 'User Registration',
      pt: 'Registro de Usuários'
    },
    category: 'functionalRequirement'
  },
  {
    id: 4,
    key: 'nonFunctional',
    active: true,
    translations: {
      en: 'Load Time < 2s',
      pt: 'Tempo de Carregamento < 2s'
    },
    category: 'nonFunctionalRequirement'
  }
];

// Mock data for Stack Options
const initialStackOptions: WizardItem[] = [
  {
    id: 1,
    key: 'react',
    active: true,
    translations: {
      en: 'React',
      pt: 'React'
    },
    category: 'frontend'
  },
  {
    id: 2,
    key: 'vue',
    active: true,
    translations: {
      en: 'Vue',
      pt: 'Vue'
    },
    category: 'frontend'
  },
  {
    id: 3,
    key: 'node',
    active: true,
    translations: {
      en: 'Node.js',
      pt: 'Node.js'
    },
    category: 'backend'
  },
  {
    id: 4,
    key: 'postgresql',
    active: true,
    translations: {
      en: 'PostgreSQL',
      pt: 'PostgreSQL'
    },
    category: 'database'
  }
];

// Mock data for Security Options
const initialSecurityOptions: WizardItem[] = [
  {
    id: 1,
    key: 'auth',
    active: true,
    translations: {
      en: 'Authentication System',
      pt: 'Sistema de Autenticação'
    }
  },
  {
    id: 2,
    key: 'authorization',
    active: true,
    translations: {
      en: 'Authorization/Permissions',
      pt: 'Autorização/Permissões'
    }
  },
  {
    id: 3,
    key: 'encryption',
    active: true,
    translations: {
      en: 'Data Encryption',
      pt: 'Criptografia de Dados'
    }
  }
];

// Mock data for Code Structure
const initialCodeStructure: WizardItem[] = [
  {
    id: 1,
    key: 'featureBased',
    active: true,
    translations: {
      en: 'Feature-based',
      pt: 'Baseado em Funcionalidades'
    },
    category: 'folderOrganization'
  },
  {
    id: 2,
    key: 'mvc',
    active: true,
    translations: {
      en: 'MVC',
      pt: 'MVC'
    },
    category: 'architecturalPattern'
  },
  {
    id: 3,
    key: 'solid',
    active: true,
    translations: {
      en: 'SOLID Principles',
      pt: 'Princípios SOLID'
    },
    category: 'bestPractice'
  }
];

// Mock data for Scalability
const initialScalability: WizardItem[] = [
  {
    id: 1,
    key: 'horizontalScaling',
    active: true,
    translations: {
      en: 'Horizontal Scaling',
      pt: 'Escalabilidade Horizontal'
    },
    category: 'scalability'
  },
  {
    id: 2,
    key: 'caching',
    active: true,
    translations: {
      en: 'Caching System',
      pt: 'Sistema de Cache'
    },
    category: 'scalability'
  },
  {
    id: 3,
    key: 'lazyLoading',
    active: true,
    translations: {
      en: 'Lazy Loading',
      pt: 'Carregamento Lento'
    },
    category: 'performance'
  }
];

// Mock data for Restrictions
const initialRestrictions: WizardItem[] = [
  {
    id: 1,
    key: 'classComponents',
    active: true,
    translations: {
      en: 'Class Components',
      pt: 'Componentes de Classe'
    }
  },
  {
    id: 2,
    key: 'jquery',
    active: true,
    translations: {
      en: 'jQuery',
      pt: 'jQuery'
    }
  },
  {
    id: 3,
    key: 'php',
    active: true,
    translations: {
      en: 'PHP',
      pt: 'PHP'
    }
  }
];

const WizardItemsManager: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('systemTypes');
  const [objectives, setObjectives] = useState<WizardItem[]>(initialObjectives);
  const [features, setFeatures] = useState<WizardItem[]>(initialFeatures);
  const [uxuiOptions, setUXUIOptions] = useState<WizardItem[]>(initialUXUIOptions);
  const [requirements, setRequirements] = useState<WizardItem[]>(initialRequirements);
  const [stackOptions, setStackOptions] = useState<WizardItem[]>(initialStackOptions);
  const [securityOptions, setSecurityOptions] = useState<WizardItem[]>(initialSecurityOptions);
  const [codeStructure, setCodeStructure] = useState<WizardItem[]>(initialCodeStructure);
  const [scalability, setScalability] = useState<WizardItem[]>(initialScalability);
  const [restrictions, setRestrictions] = useState<WizardItem[]>(initialRestrictions);

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

  // Handlers for Requirements
  const handleAddRequirement = (item: Partial<WizardItem>) => {
    const newId = Math.max(...requirements.map(item => item.id), 0) + 1;
    setRequirements(prev => [...prev, { ...item, id: newId } as WizardItem]);
  };

  const handleUpdateRequirement = (id: number, item: Partial<WizardItem>) => {
    setRequirements(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as WizardItem
          : prevItem
      )
    );
  };

  const handleDeleteRequirement = (id: number) => {
    setRequirements(prev => prev.filter(item => item.id !== id));
  };

  // Handlers for Stack Options
  const handleAddStackOption = (item: Partial<WizardItem>) => {
    const newId = Math.max(...stackOptions.map(item => item.id), 0) + 1;
    setStackOptions(prev => [...prev, { ...item, id: newId } as WizardItem]);
  };

  const handleUpdateStackOption = (id: number, item: Partial<WizardItem>) => {
    setStackOptions(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as WizardItem
          : prevItem
      )
    );
  };

  const handleDeleteStackOption = (id: number) => {
    setStackOptions(prev => prev.filter(item => item.id !== id));
  };

  // Handlers for Security Options
  const handleAddSecurityOption = (item: Partial<WizardItem>) => {
    const newId = Math.max(...securityOptions.map(item => item.id), 0) + 1;
    setSecurityOptions(prev => [...prev, { ...item, id: newId } as WizardItem]);
  };

  const handleUpdateSecurityOption = (id: number, item: Partial<WizardItem>) => {
    setSecurityOptions(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as WizardItem
          : prevItem
      )
    );
  };

  const handleDeleteSecurityOption = (id: number) => {
    setSecurityOptions(prev => prev.filter(item => item.id !== id));
  };

  // Handlers for Code Structure
  const handleAddCodeStructure = (item: Partial<WizardItem>) => {
    const newId = Math.max(...codeStructure.map(item => item.id), 0) + 1;
    setCodeStructure(prev => [...prev, { ...item, id: newId } as WizardItem]);
  };

  const handleUpdateCodeStructure = (id: number, item: Partial<WizardItem>) => {
    setCodeStructure(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as WizardItem
          : prevItem
      )
    );
  };

  const handleDeleteCodeStructure = (id: number) => {
    setCodeStructure(prev => prev.filter(item => item.id !== id));
  };

  // Handlers for Scalability
  const handleAddScalability = (item: Partial<WizardItem>) => {
    const newId = Math.max(...scalability.map(item => item.id), 0) + 1;
    setScalability(prev => [...prev, { ...item, id: newId } as WizardItem]);
  };

  const handleUpdateScalability = (id: number, item: Partial<WizardItem>) => {
    setScalability(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as WizardItem
          : prevItem
      )
    );
  };

  const handleDeleteScalability = (id: number) => {
    setScalability(prev => prev.filter(item => item.id !== id));
  };

  // Handlers for Restrictions
  const handleAddRestriction = (item: Partial<WizardItem>) => {
    const newId = Math.max(...restrictions.map(item => item.id), 0) + 1;
    setRestrictions(prev => [...prev, { ...item, id: newId } as WizardItem]);
  };

  const handleUpdateRestriction = (id: number, item: Partial<WizardItem>) => {
    setRestrictions(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as WizardItem
          : prevItem
      )
    );
  };

  const handleDeleteRestriction = (id: number) => {
    setRestrictions(prev => prev.filter(item => item.id !== id));
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
            <TabsTrigger value="requirements">{t('dashboard.requirements')}</TabsTrigger>
            <TabsTrigger value="features">{t('dashboard.featuresItems')}</TabsTrigger>
            <TabsTrigger value="uxuiOptions">{t('dashboard.uxuiOptions')}</TabsTrigger>
            <TabsTrigger value="stackOptions">{t('dashboard.stackOptions')}</TabsTrigger>
          </TabsList>
          
          <TabsList className="grid grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
            <TabsTrigger value="securityOptions">{t('dashboard.securityOptions')}</TabsTrigger>
            <TabsTrigger value="codeStructure">{t('dashboard.codeStructure')}</TabsTrigger>
            <TabsTrigger value="scalability">{t('dashboard.scalability')}</TabsTrigger>
            <TabsTrigger value="restrictions">{t('dashboard.restrictions')}</TabsTrigger>
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
          
          <TabsContent value="requirements">
            <ItemManager
              title={t('dashboard.requirements')}
              items={requirements}
              onAddItem={handleAddRequirement}
              onUpdateItem={handleUpdateRequirement}
              onDeleteItem={handleDeleteRequirement}
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
            <ItemManager
              title={t('dashboard.stackOptions')}
              items={stackOptions}
              onAddItem={handleAddStackOption}
              onUpdateItem={handleUpdateStackOption}
              onDeleteItem={handleDeleteStackOption}
            />
          </TabsContent>
          
          <TabsContent value="securityOptions">
            <ItemManager
              title={t('dashboard.securityOptions')}
              items={securityOptions}
              onAddItem={handleAddSecurityOption}
              onUpdateItem={handleUpdateSecurityOption}
              onDeleteItem={handleDeleteSecurityOption}
            />
          </TabsContent>
          
          <TabsContent value="codeStructure">
            <ItemManager
              title={t('dashboard.codeStructure')}
              items={codeStructure}
              onAddItem={handleAddCodeStructure}
              onUpdateItem={handleUpdateCodeStructure}
              onDeleteItem={handleDeleteCodeStructure}
            />
          </TabsContent>
          
          <TabsContent value="scalability">
            <ItemManager
              title={t('dashboard.scalability')}
              items={scalability}
              onAddItem={handleAddScalability}
              onUpdateItem={handleUpdateScalability}
              onDeleteItem={handleDeleteScalability}
            />
          </TabsContent>
          
          <TabsContent value="restrictions">
            <ItemManager
              title={t('dashboard.restrictions')}
              items={restrictions}
              onAddItem={handleAddRestriction}
              onUpdateItem={handleUpdateRestriction}
              onDeleteItem={handleDeleteRestriction}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WizardItemsManager;
