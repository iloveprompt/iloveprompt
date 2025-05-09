
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
    // If the key is empty or not a string, return empty string
    if (!key || typeof key !== 'string') return '';
    
    // Split the key by dots to navigate through nested objects
    const keys = key.split('.');
    
    // Get the translation object for the current language
    let value: any = translations[language];
    
    // If we don't have translations for this language, fallback to English
    if (!value) {
      value = translations.en;
      console.warn(`Missing translations for language: ${language}, falling back to English`);
    }
    
    // Navigate through the nested keys
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // If translation is missing, check if it exists in English as fallback
        const englishValue = getNestedEnglishValue(keys);
        if (englishValue !== null) {
          return englishValue;
        }
        
        console.warn(`Translation key not found: ${key} in language ${language}`);
        return key; // Return the key as fallback
      }
    }
    
    // Return the translation or the key if the value is not a string
    return typeof value === 'string' ? value : key;
  };
  
  // Helper function to get nested English value as fallback
  const getNestedEnglishValue = (keys: string[]): string | null => {
    let englishValue: any = translations.en;
    
    for (const k of keys) {
      if (englishValue && englishValue[k] !== undefined) {
        englishValue = englishValue[k];
      } else {
        return null;
      }
    }
    
    return typeof englishValue === 'string' ? englishValue : null;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
