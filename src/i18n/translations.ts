
import { commonTranslations } from './translations/common';
import { authTranslations } from './translations/auth';
import { dashboardTranslations } from './translations/dashboard';
import { landingTranslations } from './translations/landing';
import { promptGeneratorTranslations } from './translations/promptGenerator';

// Create a more flexible type definition that allows for deeply nested objects
type DeepRecord<T> = {
  [key: string]: T | DeepRecord<T>;
};

type TranslationValue = string | DeepRecord<string>;

type Translation = {
  [key: string]: TranslationValue;
};

// Merge all translation modules into one object
export const translations: Record<string, Translation> = {
  en: {
    ...commonTranslations.en,
    ...authTranslations.en,
    ...dashboardTranslations.en,
    ...landingTranslations.en,
    ...promptGeneratorTranslations.en,
    common: {
      ...commonTranslations.en.common,
      addedItems: "Added items",
      addMoreItems: "Add more items",
      deleteItem: "Delete"
    }
  },
  pt: {
    ...commonTranslations.pt,
    ...authTranslations.pt,
    ...dashboardTranslations.pt,
    ...landingTranslations.pt,
    ...promptGeneratorTranslations.pt,
    common: {
      ...commonTranslations.pt.common,
      addedItems: "Itens adicionados",
      addMoreItems: "Adicionar mais itens",
      deleteItem: "Excluir"
    }
  }
};
