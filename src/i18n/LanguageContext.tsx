import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import enTranslations from './locales/en.json';
import ptTranslations from './locales/pt.json';
import esTranslations from './locales/es.json';

// Define the available language types
type LanguageType = 'en' | 'pt' | 'es';

// Define the type for the context
interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

// Create context with a default value
const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: () => '',
});

// Custom hook to use the context
export const useLanguage = () => useContext(LanguageContext);

// Provider component that will wrap the application
interface LanguageProviderProps {
  children: ReactNode;
}

// Consolidate all translations in one object
const translations = {
  en: enTranslations,
  pt: ptTranslations,
  es: esTranslations
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get language from localStorage or default to Portuguese
  const getInitialLanguage = (): LanguageType => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'pt' || savedLanguage === 'es') ? savedLanguage as LanguageType : 'pt';
  };
  
  const [language, setLanguageState] = useState<LanguageType>(getInitialLanguage);
  
  // Save language preference to localStorage
  const setLanguage = (lang: LanguageType) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  // Function to get translation based on key
  const t = (key: string, params?: Record<string, any>): string => {
    if (!key) return '';
    
    const keys = key.split('.');
    
    let value: any = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}, current path: ${keys.slice(0, keys.indexOf(k)).join('.')}`);
        return key;
      }
    }
    
    if (value === undefined) {
      console.warn(`Translation value is undefined for key: ${key}`);
      return key;
    }
    
    if (typeof value === 'object') {
      console.warn(`Translation value is an object for key: ${key}`);
      return key;
    }
    
    // Handle interpolation
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => {
        return params[key]?.toString() ?? match;
      });
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

