
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import ItemManager, { WizardItem } from './ItemManager';

// Mock data for system types
const initialSystemTypes: WizardItem[] = [
  {
    id: 1,
    key: 'webapp',
    active: true,
    translations: {
      en: 'Web Application',
      pt: 'Aplicação Web'
    },
    examples: [
      { id: 1, text: 'Facebook', active: true },
      { id: 2, text: 'Twitter', active: true },
      { id: 3, text: 'LinkedIn', active: true }
    ]
  },
  {
    id: 2,
    key: 'mobileapp',
    active: true,
    translations: {
      en: 'Mobile App',
      pt: 'Aplicativo Móvel'
    },
    examples: [
      { id: 4, text: 'Instagram', active: true },
      { id: 5, text: 'WhatsApp', active: true },
      { id: 6, text: 'Uber', active: true }
    ]
  },
  {
    id: 3,
    key: 'api',
    active: true,
    translations: {
      en: 'API / Backend',
      pt: 'API / Backend'
    },
    examples: [
      { id: 7, text: 'REST API', active: true },
      { id: 8, text: 'GraphQL', active: true }
    ]
  },
  {
    id: 4,
    key: 'desktop',
    active: true,
    translations: {
      en: 'Desktop Application',
      pt: 'Aplicação Desktop'
    },
    examples: [
      { id: 9, text: 'Slack', active: true },
      { id: 10, text: 'VS Code', active: true }
    ]
  }
];

const SystemTypesManager: React.FC = () => {
  const { t } = useLanguage();
  const [systemTypes, setSystemTypes] = useState<WizardItem[]>(initialSystemTypes);

  const handleAddItem = (item: Partial<WizardItem>) => {
    const newId = Math.max(...systemTypes.map(item => item.id), 0) + 1;
    setSystemTypes(prev => [...prev, { ...item, id: newId } as WizardItem]);
  };

  const handleUpdateItem = (id: number, item: Partial<WizardItem>) => {
    setSystemTypes(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as WizardItem
          : prevItem
      )
    );
  };

  const handleDeleteItem = (id: number) => {
    setSystemTypes(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ItemManager
      title={t('dashboard.systemTypes')}
      items={systemTypes}
      onAddItem={handleAddItem}
      onUpdateItem={handleUpdateItem}
      onDeleteItem={handleDeleteItem}
    />
  );
};

export default SystemTypesManager;
