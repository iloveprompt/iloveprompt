
// Este arquivo contém os dados existentes do wizard para migração

import enTranslations from '@/i18n/locales/en.json';
import ptTranslations from '@/i18n/locales/pt.json';
import esTranslations from '@/i18n/locales/es.json';

// Função para extrair os dados do wizard
export const extractWizardData = () => {
  // Construir a estrutura do wizard a partir dos arquivos de tradução
  const enSteps = getWizardStepsData('en');
  const ptSteps = getWizardStepsData('pt');
  const esSteps = getWizardStepsData('es');

  // Extrair categorias
  const categories = enSteps.map((step, index) => ({
    key: step.id,
    order: index,
    icon: step.icon,
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

  // Definir dados básicos para alguns itens importantes do wizard
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
          text: 'System Type',
          help_text: '',
        },
        {
          language: 'pt',
          text: 'Tipo de Sistema',
          help_text: '',
        },
        {
          language: 'es',
          text: 'Tipo de Sistema',
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
          text: 'Specific Features',
          help_text: '',
        },
        {
          language: 'pt',
          text: 'Funcionalidades Específicas',
          help_text: '',
        },
        {
          language: 'es',
          text: 'Características Específicas',
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
          text: 'Security Features',
          help_text: '',
        },
        {
          language: 'pt',
          text: 'Recursos de Segurança',
          help_text: '',
        },
        {
          language: 'es',
          text: 'Características de Seguridad',
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

// Função auxiliar para obter os passos do wizard com traduções
function getWizardStepsData(language: 'en' | 'pt' | 'es') {
  // Selecionar o arquivo de tradução correto
  const translations = language === 'pt' ? ptTranslations : 
                      language === 'es' ? esTranslations : 
                      enTranslations;
  
  // Construir os passos com base nas traduções
  return [
    { 
      id: 'project', 
      title: translations.promptGenerator?.project?.title || 'Project',
      icon: 'Info',
      color: '#9b87f5'
    },
    { 
      id: 'systemType', 
      title: translations.promptGenerator?.systemType?.title || 'System Type',
      icon: 'Grid2X2',
      color: '#8B5CF6'
    },
    { 
      id: 'objective', 
      title: translations.promptGenerator?.objective?.title || 'Objective',
      icon: 'Target',
      color: '#7E69AB'
    },
    { 
      id: 'requirements', 
      title: translations.promptGenerator?.requirements?.title || 'Requirements',
      icon: 'List',
      color: '#6E59A5'
    },
    { 
      id: 'features', 
      title: translations.promptGenerator?.features?.title || 'Features',
      icon: 'LayoutGrid',
      color: '#D946EF'
    },
    { 
      id: 'uxui', 
      title: translations.promptGenerator?.uxui?.title || 'UX/UI',
      icon: 'Palette',
      color: '#F97316'
    },
    { 
      id: 'stack', 
      title: translations.promptGenerator?.stack?.title || 'Stack',
      icon: 'Server',
      color: '#0EA5E9'
    },
    { 
      id: 'security', 
      title: translations.promptGenerator?.security?.title || 'Security',
      icon: 'Shield',
      color: '#28A745'
    },
    { 
      id: 'codeStructure', 
      title: translations.promptGenerator?.codeStructure?.title || 'Code Structure',
      icon: 'FileText',
      color: '#1EAEDB'
    },
    { 
      id: 'scalability', 
      title: translations.promptGenerator?.scalability?.title || 'Scalability',
      icon: 'TrendingUp',
      color: '#33C3F0'
    },
    { 
      id: 'restrictions', 
      title: translations.promptGenerator?.restrictions?.title || 'Restrictions',
      icon: 'Ban',
      color: '#DC3545'
    },
    { 
      id: 'generate', 
      title: translations.promptGenerator?.generate?.title || 'Generate',
      icon: 'Pencil',
      color: '#FD7E14'
    }
  ];
}

// Função para migrar dados existentes para o banco de dados
export const migrateWizardData = async (data: any) => {
  // Implementação da migração usando o Supabase
  const { supabase } = await import('@/lib/supabase');

  // Verificar se já existem dados no banco
  const { count, error: countError } = await supabase
    .from('wizard_categories')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Erro ao verificar existência de dados:', countError);
    throw countError;
  }

  // Se já existem dados, não realizar a migração
  if (count && count > 0) {
    console.log('Dados já existem no banco. Migração não necessária.');
    return { success: true, message: 'Dados já existem no banco' };
  }

  // Começar transação de inserção de dados
  try {
    // 1. Inserir categorias
    for (const category of data.categories) {
      // Inserir categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from('wizard_categories')
        .insert({
          key: category.key,
          order: category.order,
          icon: category.icon,
          color: category.color,
          active: true
        })
        .select()
        .single();

      if (categoryError) {
        console.error(`Erro ao inserir categoria ${category.key}:`, categoryError);
        throw categoryError;
      }

      // Inserir traduções da categoria
      for (const translation of category.translations) {
        const { error: translationError } = await supabase
          .from('wizard_category_translations')
          .insert({
            category_id: categoryData.id,
            language: translation.language,
            title: translation.title,
            description: translation.description
          });

        if (translationError) {
          console.error(`Erro ao inserir tradução para categoria ${category.key}:`, translationError);
          throw translationError;
        }
      }

      // 2. Inserir itens da categoria
      const categoryItems = data.items.filter((item: any) => item.category_key === category.key);
      
      for (const item of categoryItems) {
        // Inserir item
        const { data: itemData, error: itemError } = await supabase
          .from('wizard_items')
          .insert({
            category_id: categoryData.id,
            key: item.key,
            order: item.order,
            type: item.type,
            has_other_option: item.has_other_option,
            active: true
          })
          .select()
          .single();

        if (itemError) {
          console.error(`Erro ao inserir item ${item.key}:`, itemError);
          throw itemError;
        }

        // Inserir traduções do item
        for (const translation of item.translations) {
          const { error: translationError } = await supabase
            .from('wizard_item_translations')
            .insert({
              item_id: itemData.id,
              language: translation.language,
              text: translation.text,
              placeholder: translation.placeholder || '',
              help_text: translation.help_text || ''
            });

          if (translationError) {
            console.error(`Erro ao inserir tradução para item ${item.key}:`, translationError);
            throw translationError;
          }
        }

        // 3. Inserir opções do item
        const itemOptions = data.options.filter((option: any) => option.item_key === item.key);
        
        for (const option of itemOptions) {
          // Inserir opção
          const { data: optionData, error: optionError } = await supabase
            .from('wizard_item_options')
            .insert({
              item_id: itemData.id,
              key: option.key,
              order: option.order,
              active: true
            })
            .select()
            .single();

          if (optionError) {
            console.error(`Erro ao inserir opção ${option.key}:`, optionError);
            throw optionError;
          }

          // Inserir traduções da opção
          for (const translation of option.translations) {
            const { error: translationError } = await supabase
              .from('wizard_option_translations')
              .insert({
                option_id: optionData.id,
                language: translation.language,
                text: translation.text
              });

            if (translationError) {
              console.error(`Erro ao inserir tradução para opção ${option.key}:`, translationError);
              throw translationError;
            }
          }
        }

        // 4. Inserir exemplos do item
        const itemExamples = data.examples.filter((example: any) => example.item_key === item.key);
        
        for (const example of itemExamples) {
          const { error: exampleError } = await supabase
            .from('wizard_item_examples')
            .insert({
              item_id: itemData.id,
              text: example.text,
              active: true
            });

          if (exampleError) {
            console.error(`Erro ao inserir exemplo para item ${item.key}:`, exampleError);
            throw exampleError;
          }
        }
      }
    }

    return { success: true, message: 'Migração concluída com sucesso' };
  } catch (error) {
    console.error('Erro durante a migração:', error);
    throw error;
  }
};
