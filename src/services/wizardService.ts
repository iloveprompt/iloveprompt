
import { supabase } from '@/lib/supabase';

// Interface para os dados existentes do wizard para migração
interface WizardMigrationData {
  categories: WizardCategory[];
  items: WizardItem[];
  options: WizardOption[];
  examples: WizardExample[];
}

interface WizardCategory {
  key: string;
  order: number;
  icon: string;
  color: string;
  translations: {
    language: string;
    title: string;
    description: string;
  }[];
}

interface WizardItem {
  category_key: string;
  key: string;
  order: number;
  type: string;
  has_other_option: boolean;
  translations: {
    language: string;
    text: string;
    placeholder?: string;
    help_text?: string;
  }[];
}

interface WizardOption {
  item_key: string;
  key: string;
  order: number;
  translations: {
    language: string;
    text: string;
  }[];
}

interface WizardExample {
  item_key: string;
  text: string;
}

// Função para obter dados do wizard do banco
export const getWizardData = async (language: string) => {
  // Buscar categorias
  const { data: categories, error: categoriesError } = await supabase
    .from('wizard_categories')
    .select(`
      id, key, order, icon, color, active,
      wizard_category_translations(language, title, description)
    `)
    .eq('active', true)
    .order('order');

  if (categoriesError) {
    console.error('Erro ao buscar categorias:', categoriesError);
    // Continuar com fallback
  }

  // Se não houver dados ou erro, retornar null para usar o fallback
  if (!categories || categories.length === 0) {
    return null;
  }

  // Para cada categoria, buscar seus itens
  const wizardData = await Promise.all(
    categories.map(async (category) => {
      // Filtrar traduções para o idioma atual
      const translation = category.wizard_category_translations?.find(
        (t: any) => t.language === language
      ) || category.wizard_category_translations?.[0];

      // Buscar itens da categoria
      const { data: items, error: itemsError } = await supabase
        .from('wizard_items')
        .select(`
          id, key, order, type, has_other_option, active,
          wizard_item_translations(language, text, placeholder, help_text),
          wizard_item_options(id, key, order, active,
            wizard_option_translations(language, text)
          ),
          wizard_item_examples(text, active)
        `)
        .eq('category_id', category.id)
        .eq('active', true)
        .order('order');

      if (itemsError) {
        console.error('Erro ao buscar itens:', itemsError);
        return {
          id: category.id,
          key: category.key,
          title: translation?.title || category.key,
          description: translation?.description || '',
          icon: category.icon,
          color: category.color,
          items: []
        };
      }

      // Processar itens
      const processedItems = items.map((item) => {
        // Filtrar traduções para o idioma atual
        const itemTranslation = item.wizard_item_translations?.find(
          (t: any) => t.language === language
        ) || item.wizard_item_translations?.[0];

        // Processar opções
        const options = item.wizard_item_options.map((option: any) => {
          const optionTranslation = option.wizard_option_translations?.find(
            (t: any) => t.language === language
          ) || option.wizard_option_translations?.[0];

          return {
            id: option.id,
            key: option.key,
            text: optionTranslation?.text || option.key,
            active: option.active
          };
        });

        // Processar exemplos
        const examples = item.wizard_item_examples
          .filter((example: any) => example.active)
          .map((example: any) => example.text);

        return {
          id: item.id,
          key: item.key,
          text: itemTranslation?.text || item.key,
          placeholder: itemTranslation?.placeholder || '',
          help_text: itemTranslation?.help_text || '',
          type: item.type,
          has_other_option: item.has_other_option,
          options,
          examples
        };
      });

      return {
        id: category.id,
        key: category.key,
        title: translation?.title || category.key,
        description: translation?.description || '',
        icon: category.icon,
        color: category.color,
        items: processedItems
      };
    })
  );

  return wizardData;
};

// Função para migrar dados existentes para o banco de dados
export const migrateWizardData = async (data: WizardMigrationData) => {
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
      const categoryItems = data.items.filter(item => item.category_key === category.key);
      
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
        const itemOptions = data.options.filter(option => option.item_key === item.key);
        
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
        const itemExamples = data.examples.filter(example => example.item_key === item.key);
        
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
