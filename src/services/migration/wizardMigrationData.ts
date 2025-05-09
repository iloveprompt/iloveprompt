
// Este arquivo contém os dados existentes do wizard para migração

import enTranslations from '@/i18n/locales/en.json';
import ptTranslations from '@/i18n/locales/pt.json';
import esTranslations from '@/i18n/locales/es.json';
import { getWizardSteps } from '@/pages/wizard/PromptGeneratorWizard';

// Função para extrair os dados do wizard
export const extractWizardData = () => {
  // Usar a função getWizardSteps para obter as categorias do wizard
  const enSteps = getWizardSteps((key) => {
    const keys = key.split('.');
    let value = enTranslations;
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }
    return value;
  });

  const ptSteps = getWizardSteps((key) => {
    const keys = key.split('.');
    let value = ptTranslations;
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }
    return value;
  });

  const esSteps = getWizardSteps((key) => {
    const keys = key.split('.');
    let value = esTranslations;
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }
    return value;
  });

  // Extrair categorias
  const categories = enSteps.map((step, index) => ({
    key: step.id,
    order: index,
    icon: step.icon.name,
    color: step.color,
    translations: [
      {
        language: 'en',
        title: step.title,
        description: enTranslations.promptGenerator?.[step.id]?.description || '',
      },
      {
        language: 'pt',
        title: ptSteps[index].title,
        description: ptTranslations.promptGenerator?.[step.id]?.description || '',
      },
      {
        language: 'es',
        title: esSteps[index].title,
        description: esTranslations.promptGenerator?.[step.id]?.description || '',
      },
    ],
  }));

  // Extrair dados para cada categoria
  // Aqui precisaríamos extrair todos os dados de cada componente Step
  // Como exemplo, vamos extrair alguns dados do SystemTypeStep

  const systemTypeOptions = [
    'microsaas', 'saas', 'erp', 'crm', 'ecommerce', 'cms', 'apiBackend',
    'mobileApp', 'schedulingSystem', 'helpdesk', 'educationalPlatform',
    'streamingPlatform', 'staticPage', 'other'
  ];

  const specificFeaturesOptions = [
    'uploadFiles', 'notifications', 'advancedFilters', 'interactiveDashboards',
    'scheduling', 'export', 'rolePermissions', 'apiIntegration', 
    'multiLanguage', 'accessibility', 'darkMode', 'customLandingPage'
  ];

  const securityOptions = [
    'protection',
    'authenticationSec',
    'https',
    'auditLogs',
    'apiSecurity'
  ];

  // Exemplos para demonstração - em um caso real, extrairíamos mais dados
  const items = [
    // System Type Items
    {
      category_key: 'systemType',
      key: 'selected',
      order: 0,
      type: 'radio',
      has_other_option: true,
      translations: [
        {
          language: 'en',
          text: enTranslations.promptGenerator?.systemType?.systemTypeHelp || 'System Type',
          help_text: '',
        },
        {
          language: 'pt',
          text: ptTranslations.promptGenerator?.systemType?.systemTypeHelp || 'Tipo de Sistema',
          help_text: '',
        },
        {
          language: 'es',
          text: esTranslations.promptGenerator?.systemType?.systemTypeHelp || 'Tipo de Sistema',
          help_text: '',
        },
      ],
    },
    // Features Item
    {
      category_key: 'features',
      key: 'specificFeatures',
      order: 0,
      type: 'checkbox',
      has_other_option: true,
      translations: [
        {
          language: 'en',
          text: enTranslations.promptGenerator?.features?.specificFeatures || 'Specific Features',
          help_text: '',
        },
        {
          language: 'pt',
          text: ptTranslations.promptGenerator?.features?.specificFeatures || 'Funcionalidades Específicas',
          help_text: '',
        },
        {
          language: 'es',
          text: esTranslations.promptGenerator?.features?.specificFeatures || 'Características Específicas',
          help_text: '',
        },
      ],
    },
    // Security Item
    {
      category_key: 'security',
      key: 'selectedSecurity',
      order: 0,
      type: 'checkbox',
      has_other_option: true,
      translations: [
        {
          language: 'en',
          text: enTranslations.promptGenerator?.security?.securityFeatures || 'Security Features',
          help_text: '',
        },
        {
          language: 'pt',
          text: ptTranslations.promptGenerator?.security?.securityFeatures || 'Recursos de Segurança',
          help_text: '',
        },
        {
          language: 'es',
          text: esTranslations.promptGenerator?.security?.securityFeatures || 'Características de Seguridad',
          help_text: '',
        },
      ],
    },
  ];

  // Opções para os itens
  const options = [
    // System Type Options
    ...systemTypeOptions.map((option, index) => ({
      item_key: 'selected',
      key: option,
      order: index,
      translations: [
        {
          language: 'en',
          text: enTranslations.promptGenerator?.systemType?.[option] || option,
        },
        {
          language: 'pt',
          text: ptTranslations.promptGenerator?.systemType?.[option] || option,
        },
        {
          language: 'es',
          text: esTranslations.promptGenerator?.systemType?.[option] || option,
        },
      ],
    })),
    // Features Options
    ...specificFeaturesOptions.map((option, index) => ({
      item_key: 'specificFeatures',
      key: option,
      order: index,
      translations: [
        {
          language: 'en',
          text: enTranslations.promptGenerator?.features?.[option] || option,
        },
        {
          language: 'pt',
          text: ptTranslations.promptGenerator?.features?.[option] || option,
        },
        {
          language: 'es',
          text: esTranslations.promptGenerator?.features?.[option] || option,
        },
      ],
    })),
    // Security Options
    ...securityOptions.map((option, index) => ({
      item_key: 'selectedSecurity',
      key: option,
      order: index,
      translations: [
        {
          language: 'en',
          text: enTranslations.promptGenerator?.security?.[option] || option,
        },
        {
          language: 'pt',
          text: ptTranslations.promptGenerator?.security?.[option] || option,
        },
        {
          language: 'es',
          text: esTranslations.promptGenerator?.security?.[option] || option,
        },
      ],
    })),
  ];

  // Exemplos
  const examples = [
    { item_key: 'selected', text: 'socialLogin' },
    { item_key: 'selected', text: 'platformWithLanding' },
    { item_key: 'selected', text: 'interactiveDashboards' },
    { item_key: 'selected', text: 'jwtAuth' },
    { item_key: 'selected', text: 'webhooks' },
    { item_key: 'selected', text: 'pushNotifications' },
    { item_key: 'selected', text: 'schedulingReminders' },
    { item_key: 'selected', text: 'subscriptionPlatform' },
  ];

  return {
    categories,
    items,
    options,
    examples,
  };
};
