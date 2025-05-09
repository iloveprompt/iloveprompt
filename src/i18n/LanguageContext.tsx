
import React, { createContext, useState, useContext, ReactNode } from 'react';
import enTranslations from './locales/en.json';
import ptTranslations from './locales/pt.json';
import esTranslations from './locales/es.json';

// Define the available language types
type LanguageType = 'en' | 'pt' | 'es';

// Define the type for the context
interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string) => string;
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
  const t = (key: string): string => {
    const keys = key.split('.');
    
    let value: any = translations[language];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
