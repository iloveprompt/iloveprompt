
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from './translations';

// Define os tipos disponíveis para o idioma
type LanguageType = 'pt' | 'en';

// Define o tipo para o contexto
interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string) => string;
}

// Cria o contexto com um valor padrão
const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: () => '',
});

// Hook personalizado para usar o contexto
export const useLanguage = () => useContext(LanguageContext);

// Componente Provider que vai envolver a aplicação
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>('pt');

  // Função para obter a tradução baseada na chave
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
