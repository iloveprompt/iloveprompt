
import { supabase } from '@/lib/supabase';
import { PostgrestResponse } from '@supabase/supabase-js';

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
  try {
    // Buscar categorias
    const categoriesResponse: PostgrestResponse<any> = await supabase
      .from('wizard_categories')
      .select(`
        id, key, order:sort_order, icon, color, active,
        wizard_category_translations(language, title, description)
      `)
      .eq('active', true)
      .order('sort_order');

    const { data: categories, error: categoriesError } = categoriesResponse;

    if (categoriesError) {
      console.error('Erro ao buscar categorias:', categoriesError);
      return null;
    }

    // Se não houver dados ou erro, retornar null para usar o fallback
    if (!categories || categories.length === 0) {
      return null;
    }

    // Para cada categoria, buscar seus itens
    const wizardData = await Promise.all(
      categories.map(async (category) => {
        // Filtrar traduções para o idioma atual
        const categoryTranslations = category.wizard_category_translations || [];
        const translation = categoryTranslations.find(
          (t: any) => t.language === language
        ) || categoryTranslations[0];

        // Buscar itens da categoria
        const { data: items, error: itemsError } = await supabase
          .from('wizard_items')
          .select(`
            id, key, order:sort_order, type, has_other_option, active,
            wizard_item_translations(language, text, placeholder, help_text),
            wizard_item_options(id, key, order:sort_order, active,
              wizard_option_translations(language, text)
            ),
            wizard_item_examples(text, active)
          `)
          .eq('category_id', category.id)
          .eq('active', true)
          .order('sort_order');

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
        const processedItems = items ? items.map((item) => {
          // Filtrar traduções para o idioma atual
          const itemTranslations = item.wizard_item_translations || [];
          const itemTranslation = Array.isArray(itemTranslations) ? 
            itemTranslations.find((t: any) => t.language === language) || itemTranslations[0]
            : null;

          // Processar opções
          const options = item.wizard_item_options && Array.isArray(item.wizard_item_options) 
            ? item.wizard_item_options
                .filter((option: any) => option.active)
                .map((option: any) => {
                  const optionTranslations = option.wizard_option_translations || [];
                  const optionTranslation = Array.isArray(optionTranslations) ?
                    optionTranslations.find((t: any) => t.language === language) || optionTranslations[0]
                    : null;

                  return {
                    id: option.id,
                    key: option.key,
                    text: optionTranslation?.text || option.key,
                    active: option.active
                  };
                }).sort((a: any, b: any) => a.order - b.order)
            : [];

          // Processar exemplos
          const examples = item.wizard_item_examples && Array.isArray(item.wizard_item_examples)
            ? item.wizard_item_examples
                .filter((example: any) => example.active)
                .map((example: any) => example.text)
            : [];

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
        }) : [];

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
  } catch (error) {
    console.error('Erro ao buscar dados do wizard:', error);
    return null;
  }
};
