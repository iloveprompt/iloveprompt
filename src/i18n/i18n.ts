import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Recursos de tradução
const resources = {
  pt: {
    translation: {
      pricing: {
        mostPopular: 'Mais Popular',
        perMonth: '/mês',
        saveDiscount: 'Economize 20% neste plano',
        apiKeyDiscount: 'Use suas próprias chaves de API e ganhe 20% de desconto na assinatura'
      }
    }
  },
  en: {
    translation: {
      pricing: {
        mostPopular: 'Most Popular',
        perMonth: '/month',
        saveDiscount: 'Save 20% on this plan',
        apiKeyDiscount: 'Use your own API keys and get 20% off the subscription price'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // idioma padrão
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 