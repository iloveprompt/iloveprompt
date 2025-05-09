
import { commonTranslations } from './translations/common';
import { authTranslations } from './translations/auth';
import { dashboardTranslations } from './translations/dashboard';
import { landingTranslations } from './translations/landing';
import { promptGeneratorTranslations } from './translations/promptGenerator';

// Create a more flexible type definition that allows for deeply nested objects
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type TranslationValue = string | Record<string, string | Record<string, string | Record<string, string>>>;

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
    ...promptGeneratorTranslations.en
  },
  pt: {
    ...commonTranslations.pt,
    ...authTranslations.pt,
    ...dashboardTranslations.pt,
    ...landingTranslations.pt,
    ...promptGeneratorTranslations.pt
  }
};
