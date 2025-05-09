import { supabase } from '@/lib/supabase';

// Função para extrair dados do wizard para migração
export const extractWizardData = () => {
  try {
    // Dados estáticos do wizard para compatibilidade com versões antigas
    // Manter temporariamente para servir de fallback durante a fase de transição
    const wizardData = {
      categories: [
        {
          key: 'project',
          order: 0,
          icon: 'Info',
          color: '#9b87f5',
          translations: [
            {
              language: 'en',
              title: 'Project',
              description: 'Information about the project'
            },
            {
              language: 'pt',
              title: 'Projeto',
              description: 'Informações sobre o projeto'
            },
            {
              language: 'es',
              title: 'Proyecto',
              description: 'Información sobre el proyecto'
            }
          ]
        },
        {
          key: 'systemType',
          order: 1,
          icon: 'Grid2X2',
          color: '#8B5CF6',
          translations: [
            {
              language: 'en',
              title: 'System Type',
              description: 'Type of system to be developed'
            },
            {
              language: 'pt',
              title: 'Tipo de Sistema',
              description: 'Tipo de sistema a ser desenvolvido'
            },
            {
              language: 'es',
              title: 'Tipo de Sistema',
              description: 'Tipo de sistema a desarrollar'
            }
          ]
        },
        {
          key: 'objective',
          order: 2,
          icon: 'Target',
          color: '#7E69AB',
          translations: [
            {
              language: 'en',
              title: 'Objective',
              description: 'Define the main objective of the system'
            },
            {
              language: 'pt',
              title: 'Objetivo',
              description: 'Defina o objetivo principal do sistema'
            },
            {
              language: 'es',
              title: 'Objetivo',
              description: 'Defina el objetivo principal del sistema'
            }
          ]
        },
        {
          key: 'requirements',
          order: 3,
          icon: 'List',
          color: '#6E59A5',
          translations: [
            {
              language: 'en',
              title: 'Requirements',
              description: 'Specify the requirements for the system'
            },
            {
              language: 'pt',
              title: 'Requisitos',
              description: 'Especifique os requisitos para o sistema'
            },
            {
              language: 'es',
              title: 'Requisitos',
              description: 'Especifique los requisitos para el sistema'
            }
          ]
        },
        {
          key: 'features',
          order: 4,
          icon: 'LayoutGrid',
          color: '#D946EF',
          translations: [
            {
              language: 'en',
              title: 'Features',
              description: 'List the features of the system'
            },
            {
              language: 'pt',
              title: 'Funcionalidades',
              description: 'Liste as funcionalidades do sistema'
            },
            {
              language: 'es',
              title: 'Funcionalidades',
              description: 'Liste las funcionalidades del sistema'
            }
          ]
        },
        {
          key: 'uxui',
          order: 5,
          icon: 'Palette',
          color: '#F97316',
          translations: [
            {
              language: 'en',
              title: 'UX/UI',
              description: 'Define the user experience and interface'
            },
            {
              language: 'pt',
              title: 'UX/UI',
              description: 'Defina a experiência do usuário e a interface'
            },
            {
              language: 'es',
              title: 'UX/UI',
              description: 'Defina la experiencia del usuario y la interfaz'
            }
          ]
        },
        {
          key: 'stack',
          order: 6,
          icon: 'Server',
          color: '#0EA5E9',
          translations: [
            {
              language: 'en',
              title: 'Stack',
              description: 'Specify the technology stack'
            },
            {
              language: 'pt',
              title: 'Stack',
              description: 'Especifique o stack de tecnologia'
            },
            {
              language: 'es',
              title: 'Stack',
              description: 'Especifique el stack de tecnología'
            }
          ]
        },
        {
          key: 'security',
          order: 7,
          icon: 'Shield',
          color: '#28A745',
          translations: [
            {
              language: 'en',
              title: 'Security',
              description: 'Define security measures'
            },
            {
              language: 'pt',
              title: 'Segurança',
              description: 'Defina as medidas de segurança'
            },
            {
              language: 'es',
              title: 'Seguridad',
              description: 'Defina las medidas de seguridad'
            }
          ]
        },
        {
          key: 'codeStructure',
          order: 8,
          icon: 'FileText',
          color: '#1EAEDB',
          translations: [
            {
              language: 'en',
              title: 'Code Structure',
              description: 'Define the code structure'
            },
            {
              language: 'pt',
              title: 'Estrutura do Código',
              description: 'Defina a estrutura do código'
            },
            {
              language: 'es',
              title: 'Estructura del Código',
              description: 'Defina la estructura del código'
            }
          ]
        },
        {
          key: 'scalability',
          order: 9,
          icon: 'TrendingUp',
          color: '#33C3F0',
          translations: [
            {
              language: 'en',
              title: 'Scalability',
              description: 'Define scalability measures'
            },
            {
              language: 'pt',
              title: 'Escalabilidade',
              description: 'Defina as medidas de escalabilidade'
            },
            {
              language: 'es',
              title: 'Escalabilidad',
              description: 'Defina las medidas de escalabilidad'
            }
          ]
        },
        {
          key: 'restrictions',
          order: 10,
          icon: 'Ban',
          color: '#DC3545',
          translations: [
            {
              language: 'en',
              title: 'Restrictions',
              description: 'Define restrictions'
            },
            {
              language: 'pt',
              title: 'Restrições',
              description: 'Defina as restrições'
            },
            {
              language: 'es',
              title: 'Restricciones',
              description: 'Defina las restricciones'
            }
          ]
        }
      ],
      items: [
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
              help_text: 'Select the type of system to be developed'
            },
            {
              language: 'pt',
              text: 'Tipo de Sistema',
              help_text: 'Selecione o tipo de sistema a ser desenvolvido'
            },
            {
              language: 'es',
              text: 'Tipo de Sistema',
              help_text: 'Seleccione el tipo de sistema a desarrollar'
            }
          ]
        },
        {
          category_key: 'objective',
          key: 'defineObjectives',
          order: 0,
          type: 'boolean',
          has_other_option: false,
          translations: [
            {
              language: 'en',
              text: 'Define Objectives',
              help_text: 'Do you want to define objectives for the system?'
            },
            {
              language: 'pt',
              text: 'Definir Objetivos',
              help_text: 'Você quer definir objetivos para o sistema?'
            },
            {
              language: 'es',
              text: 'Definir Objetivos',
              help_text: '¿Quieres definir objetivos para el sistema?'
            }
          ]
        },
        {
          category_key: 'objective',
          key: 'primaryObjective',
          order: 1,
          type: 'text',
          has_other_option: false,
          translations: [
            {
              language: 'en',
              text: 'Primary Objective',
              help_text: 'Define the primary objective of the system'
            },
            {
              language: 'pt',
              text: 'Objetivo Primário',
              help_text: 'Defina o objetivo primário do sistema'
            },
            {
              language: 'es',
              text: 'Objetivo Primario',
              help_text: 'Defina el objetivo primario del sistema'
            }
          ]
        },
        {
          category_key: 'requirements',
          key: 'defineRequirements',
          order: 0,
          type: 'boolean',
          has_other_option: false,
          translations: [
            {
              language: 'en',
              text: 'Define Requirements',
              help_text: 'Do you want to define requirements for the system?'
            },
            {
              language: 'pt',
              text: 'Definir Requisitos',
              help_text: 'Você quer definir requisitos para o sistema?'
            },
            {
              language: 'es',
              text: 'Definir Requisitos',
              help_text: '¿Quieres definir requisitos para el sistema?'
            }
          ]
        }
      ],
      options: [
        {
          item_key: 'selected',
          key: 'microsaas',
          order: 0,
          translations: [
            { language: 'en', text: 'Micro SaaS' },
            { language: 'pt', text: 'Micro SaaS' },
            { language: 'es', text: 'Micro SaaS' }
          ]
        },
        {
          item_key: 'selected',
          key: 'saas',
          order: 1,
          translations: [
            { language: 'en', text: 'SaaS' },
            { language: 'pt', text: 'SaaS' },
            { language: 'es', text: 'SaaS' }
          ]
        },
        {
          item_key: 'selected',
          key: 'ecommerce',
          order: 2,
          translations: [
            { language: 'en', text: 'E-commerce' },
            { language: 'pt', text: 'E-commerce' },
            { language: 'es', text: 'E-commerce' }
          ]
        },
        {
          item_key: 'selected',
          key: 'socialNetwork',
          order: 3,
          translations: [
            { language: 'en', text: 'Social Network' },
            { language: 'pt', text: 'Rede Social' },
            { language: 'es', text: 'Red Social' }
          ]
        },
        {
          item_key: 'selected',
          key: 'blog',
          order: 4,
          translations: [
            { language: 'en', text: 'Blog' },
            { language: 'pt', text: 'Blog' },
            { language: 'es', text: 'Blog' }
          ]
        }
      ],
      examples: [
        { item_key: 'selected', text: 'socialLogin' },
        { item_key: 'selected', text: 'platformWithLanding' },
        { item_key: 'selected', text: 'paymentIntegration' },
        { item_key: 'selected', text: 'userProfile' },
        { item_key: 'selected', text: 'contentManagement' }
      ]
    };

    return wizardData;
  } catch (error) {
    console.error("Erro ao extrair dados do wizard:", error);
    throw error;
  }
};

// Função para migrar os dados do wizard para o banco de dados
export const migrateWizardData = async (wizardData: any) => {
  try {
    console.log('Iniciando migração de dados para o banco de dados...');
    
    // Verificar se já existem dados no banco
    const { count: categoryCount, error: countError } = await supabase
      .from('wizard_categories')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Erro ao verificar dados existentes:', countError);
      return { success: false, message: 'Erro ao verificar dados existentes' };
    }

    // Se já existem dados, não fazer a migração
    if (categoryCount && categoryCount > 0) {
      console.log('Já existem dados no banco. Migração não necessária.');
      return { success: true, message: 'Dados já existem no banco. Nenhuma alteração necessária.' };
    }

    // 1. Inserir categorias
    for (const category of wizardData.categories) {
      // Inserir categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from('wizard_categories')
        .insert({
          key: category.key,
          sort_order: category.order,
          icon: category.icon,
          color: category.color,
          active: true
        })
        .select()
        .single();

      if (categoryError) {
        console.error(`Erro ao inserir categoria ${category.key}:`, categoryError);
        return { success: false, message: `Erro ao inserir categoria ${category.key}: ${categoryError.message}` };
      }

      // Inserir traduções da categoria
      if (category.translations && Array.isArray(category.translations)) {
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
          }
        }
      }
    }

    // 2. Inserir itens e suas relações
    // Primeiro obter mapeamento de chaves para IDs das categorias
    const { data: categoryMap, error: mapError } = await supabase
      .from('wizard_categories')
      .select('id, key');

    if (mapError) {
      console.error('Erro ao obter mapeamento de categorias:', mapError);
      return { success: false, message: 'Erro ao obter mapeamento de categorias' };
    }

    const categoryKeyToId = Object.fromEntries(
      (categoryMap || []).map(cat => [cat.key, cat.id])
    );

    // Agora inserir os itens
    for (const item of wizardData.items) {
      const categoryId = categoryKeyToId[item.category_key];
      
      if (!categoryId) {
        console.warn(`Categoria ${item.category_key} não encontrada para o item ${item.key}`);
        continue;
      }

      // Inserir item
      const { data: itemData, error: itemError } = await supabase
        .from('wizard_items')
        .insert({
          category_id: categoryId,
          key: item.key,
          sort_order: item.order,
          type: item.type,
          has_other_option: item.has_other_option || false,
          active: true
        })
        .select()
        .single();

      if (itemError) {
        console.error(`Erro ao inserir item ${item.key}:`, itemError);
        continue;
      }

      // Inserir traduções do item
      if (item.translations && Array.isArray(item.translations)) {
        for (const translation of item.translations) {
          const { error: translationError } = await supabase
            .from('wizard_item_translations')
            .insert({
              item_id: itemData.id,
              language: translation.language,
              text: translation.text,
              placeholder: translation.placeholder,
              help_text: translation.help_text
            });

          if (translationError) {
            console.error(`Erro ao inserir tradução para item ${item.key}:`, translationError);
          }
        }
      }
    }

    // 3. Inserir opções
    // Obter mapeamento de chaves para IDs dos itens
    const { data: itemMap, error: itemMapError } = await supabase
      .from('wizard_items')
      .select('id, key');

    if (itemMapError) {
      console.error('Erro ao obter mapeamento de itens:', itemMapError);
      return { success: false, message: 'Erro ao obter mapeamento de itens' };
    }

    const itemKeyToId = Object.fromEntries(
      (itemMap || []).map(item => [item.key, item.id])
    );

    // Agora inserir as opções
    for (const option of wizardData.options) {
      const itemId = itemKeyToId[option.item_key];
      
      if (!itemId) {
        console.warn(`Item ${option.item_key} não encontrado para a opção ${option.key}`);
        continue;
      }

      // Inserir opção
      const { data: optionData, error: optionError } = await supabase
        .from('wizard_item_options')
        .insert({
          item_id: itemId,
          key: option.key,
          sort_order: option.order,
          active: true
        })
        .select()
        .single();

      if (optionError) {
        console.error(`Erro ao inserir opção ${option.key}:`, optionError);
        continue;
      }

      // Inserir traduções da opção
      if (option.translations && Array.isArray(option.translations)) {
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
          }
        }
      }
    }

    // 4. Inserir exemplos
    for (const example of wizardData.examples) {
      const itemId = itemKeyToId[example.item_key];
      
      if (!itemId) {
        console.warn(`Item ${example.item_key} não encontrado para o exemplo ${example.text}`);
        continue;
      }

      // Inserir exemplo
      const { error: exampleError } = await supabase
        .from('wizard_item_examples')
        .insert({
          item_id: itemId,
          text: example.text,
          active: true
        });

      if (exampleError) {
        console.error(`Erro ao inserir exemplo ${example.text}:`, exampleError);
      }
    }

    return { success: true, message: 'Migração concluída com sucesso!' };
  } catch (error) {
    console.error('Erro durante o processo de migração:', error);
    return { 
      success: false, 
      message: `Erro durante o processo de migração: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
    };
  }
};
