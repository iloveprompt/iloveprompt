
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { WizardItem } from '@/components/admin/ItemManager';
import { useLanguage } from '@/i18n/LanguageContext';

// Interface for wizard items with database fields
export interface DbWizardItem extends Omit<WizardItem, 'translations'> {
  id: string; // Changed from number to string to match UUID
  key: string;
  active: boolean;
  type?: string;
  category_id?: string; // Changed from category_id?: string
  has_other_option?: boolean;
  sort_order?: number;
  translations: Record<string, string>;
  examples?: Array<{id: string, text: string, active: boolean}>; // Changed from id: number
}

// Function to transform database items to the format expected by the components
export const transformWizardItems = (
  dbItems: any[], 
  itemType: string = 'system_type'
): WizardItem[] => {
  if (!dbItems || !Array.isArray(dbItems)) return [];
  
  return dbItems.map(item => {
    // Process translations
    const translations: Record<string, string> = {};
    
    if (item.wizard_item_translations && Array.isArray(item.wizard_item_translations)) {
      item.wizard_item_translations.forEach((translation: any) => {
        if (translation.language && translation.text) {
          translations[translation.language] = translation.text;
        }
      });
    }
    
    // Process examples if they exist
    const examples = item.wizard_item_examples && Array.isArray(item.wizard_item_examples) 
      ? item.wizard_item_examples
          .filter((ex: any) => ex.active)
          .map((ex: any) => ({ 
            id: ex.id, // This is a string UUID now
            text: ex.text, 
            active: ex.active 
          }))
      : undefined;
      
    // Create the wizard item object
    const wizardItem: WizardItem = {
      id: item.id,
      key: item.key,
      active: item.active,
      translations: {
        en: translations.en || item.key,
        pt: translations.pt || item.key
      },
      category: itemType,
    };
    
    if (examples) {
      wizardItem.examples = examples;
    }
    
    return wizardItem;
  });
};

// Function to fetch system types from the database
export const fetchSystemTypes = async (): Promise<WizardItem[]> => {
  try {
    const { data, error } = await supabase
      .from('wizard_items')
      .select(`
        id, key, sort_order, type, has_other_option, active,
        wizard_item_translations(language, text),
        wizard_item_examples(id, text, active)
      `)
      .eq('type', 'system_type')
      .order('sort_order');
      
    if (error) {
      console.error('Error fetching system types:', error);
      return [];
    }
    
    return transformWizardItems(data || [], 'system_type');
  } catch (error) {
    console.error('Exception fetching system types:', error);
    return [];
  }
};

// Function to fetch wizard items by type
export const fetchWizardItemsByType = async (itemType: string): Promise<WizardItem[]> => {
  try {
    const { data, error } = await supabase
      .from('wizard_items')
      .select(`
        id, key, sort_order, type, has_other_option, active,
        wizard_item_translations(language, text),
        wizard_item_examples(id, text, active)
      `)
      .eq('type', itemType)
      .order('sort_order');
      
    if (error) {
      console.error(`Error fetching ${itemType} items:`, error);
      return [];
    }
    
    return transformWizardItems(data || [], itemType);
  } catch (error) {
    console.error(`Exception fetching ${itemType} items:`, error);
    return [];
  }
};

// Create a new wizard item
export const createWizardItem = async (
  item: Partial<WizardItem>, 
  itemType: string
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // First, insert the main item
    const { data: itemData, error: itemError } = await supabase
      .from('wizard_items')
      .insert({
        key: item.key,
        active: item.active ?? true,
        type: itemType,
        sort_order: 999, // Default high order, will be sorted later
        has_other_option: item.has_other_option ?? false
      })
      .select('id')
      .single();
      
    if (itemError || !itemData) {
      console.error('Error creating wizard item:', itemError);
      return { success: false, error: itemError?.message };
    }
    
    const itemId = itemData.id;
    
    // Then, insert translations
    if (item.translations) {
      const translations = [];
      
      for (const [lang, text] of Object.entries(item.translations)) {
        translations.push({
          item_id: itemId,
          language: lang,
          text: text
        });
      }
      
      if (translations.length > 0) {
        const { error: translationError } = await supabase
          .from('wizard_item_translations')
          .insert(translations);
          
        if (translationError) {
          console.error('Error creating item translations:', translationError);
          // Note: We don't fail the whole operation if translations fail
        }
      }
    }
    
    // Insert examples if present
    if (item.examples && Array.isArray(item.examples) && item.examples.length > 0) {
      const examples = item.examples.map(example => ({
        item_id: itemId,
        text: example.text,
        active: example.active ?? true
      }));
      
      const { error: examplesError } = await supabase
        .from('wizard_item_examples')
        .insert(examples);
        
      if (examplesError) {
        console.error('Error creating item examples:', examplesError);
        // Note: We don't fail the whole operation if examples fail
      }
    }
    
    return { success: true, id: itemId };
  } catch (error: any) {
    console.error('Exception creating wizard item:', error);
    return { success: false, error: error.message };
  }
};

// Update an existing wizard item
export const updateWizardItem = async (
  id: string, // Changed from number to string
  item: Partial<WizardItem>
): Promise<{ success: boolean; error?: string }> => {
  try {
    // First, update the main item
    const { error: itemError } = await supabase
      .from('wizard_items')
      .update({
        key: item.key,
        active: item.active,
        has_other_option: item.has_other_option
      })
      .eq('id', id);
      
    if (itemError) {
      console.error('Error updating wizard item:', itemError);
      return { success: false, error: itemError.message };
    }
    
    // Then, update translations
    if (item.translations) {
      for (const [lang, text] of Object.entries(item.translations)) {
        // Check if translation exists
        const { data: existingTranslation } = await supabase
          .from('wizard_item_translations')
          .select('id')
          .eq('item_id', id)
          .eq('language', lang)
          .maybeSingle();
          
        if (existingTranslation) {
          // Update existing translation
          const { error: updateError } = await supabase
            .from('wizard_item_translations')
            .update({ text })
            .eq('id', existingTranslation.id);
            
          if (updateError) {
            console.error(`Error updating ${lang} translation:`, updateError);
          }
        } else {
          // Insert new translation
          const { error: insertError } = await supabase
            .from('wizard_item_translations')
            .insert({
              item_id: id,
              language: lang,
              text
            });
            
          if (insertError) {
            console.error(`Error creating ${lang} translation:`, insertError);
          }
        }
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Exception updating wizard item:', error);
    return { success: false, error: error.message };
  }
};

// Delete a wizard item
export const deleteWizardItem = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Due to cascading deletes, we only need to delete the main item
    const { error } = await supabase
      .from('wizard_items')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting wizard item:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Exception deleting wizard item:', error);
    return { success: false, error: error.message };
  }
};
