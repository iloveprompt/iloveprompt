
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import ItemManager, { WizardItem } from './ItemManager';

// Extended interface for WizardItem that includes Spanish translations
interface WizardItemWithSpanish extends Omit<WizardItem, 'translations'> {
  translations: {
    en: string;
    pt: string;
    es: string;
  };
}

// Mock data for system types
const initialSystemTypes: WizardItemWithSpanish[] = [
  {
    id: 1,
    key: 'webapp',
    active: true,
    translations: {
      en: 'Web Application',
      pt: 'Aplicação Web',
      es: 'Aplicación Web'
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
      pt: 'Aplicativo Móvel',
      es: 'Aplicación Móvil'
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
      pt: 'API / Backend',
      es: 'API / Backend'
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
      pt: 'Aplicação Desktop',
      es: 'Aplicación de Escritorio'
    },
    examples: [
      { id: 9, text: 'Slack', active: true },
      { id: 10, text: 'VS Code', active: true }
    ]
  }
];

const SystemTypesManager: React.FC = () => {
  const { t } = useLanguage();
  const [systemTypes, setSystemTypes] = useState<WizardItemWithSpanish[]>(initialSystemTypes);

  const handleAddItem = (item: Partial<WizardItem>) => {
    const newId = Math.max(...systemTypes.map(item => item.id), 0) + 1;
    // Type assertion to handle conversion from WizardItem to WizardItemWithSpanish
    setSystemTypes(prev => [...prev, { ...item, id: newId } as unknown as WizardItemWithSpanish]);
  };

  const handleUpdateItem = (id: number, item: Partial<WizardItem>) => {
    setSystemTypes(prev => 
      prev.map(prevItem => 
        prevItem.id === id 
          ? { ...prevItem, ...item } as unknown as WizardItemWithSpanish
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
      items={systemTypes as unknown as WizardItem[]}
      onAddItem={handleAddItem}
      onUpdateItem={handleUpdateItem}
      onDeleteItem={handleDeleteItem}
    />
  );
};

export default SystemTypesManager;
