import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { generateDiagram as generateDiagramViaLLM } from './llmService'; // Assuming llmService is ready

export type DocumentType = 'prd' | 'readme' | 'roadmap' | 'phases' | 'flow'; // Added 'flow'

export type GeneratedDocument = Database['public']['Tables']['generated_documents']['Row'];
export type NewGeneratedDocument = Database['public']['Tables']['generated_documents']['Insert'];

export type DocumentTemplate = Database['public']['Tables']['document_templates']['Row'];
export type NewDocumentTemplate = Database['public']['Tables']['document_templates']['Insert'];

/**
 * Generates a Markdown document based on a template and form data.
 * @param type - The type of document to generate ('prd', 'readme', etc.).
 * @param formData - The data collected from the wizard.
 * @returns A promise resolving to the generated Markdown content string.
 */
export const generateMarkdownDoc = async (
  type: Exclude<DocumentType, 'flow'>,
  formData: any
): Promise<string> => {
  console.log(`Generating ${type} document...`);

  // TODO: Implement template loading (from src/templates/ or custom user templates)
  // TODO: Implement placeholder replacement logic (e.g., replace {{projectName}} with formData.project.title)

  // Placeholder implementation
  let content = `# ${type.toUpperCase()} Document for ${formData.project?.title || 'Untitled Project'}\n\n`;
  content += `## Generated based on Wizard Data:\n`;
  content += `\`\`\`json\n${JSON.stringify(formData, null, 2)}\n\`\`\`\n`;
  content += `\n-- Template processing not fully implemented yet. --`;

  // Simulate async operation if needed
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay

  return content;
};

/**
 * Generates a flow diagram using the LLM service.
 * @param formData - The data collected from the wizard.
 * @param userId - The ID of the user making the request.
 * @returns A promise resolving to the diagram syntax (e.g., Mermaid) or image URL.
 */
export const generateFlowDiagram = async (
  formData: any,
  userId: string
): Promise<string> => {
  console.log(`Generating flow diagram via LLM...`);
  try {
    // Assuming generateDiagramViaLLM returns Mermaid syntax for now
    const diagramSyntax = await generateDiagramViaLLM(formData, userId);
    return diagramSyntax;
  } catch (error) {
    console.error('Error generating flow diagram:', error);
    throw new Error('Failed to generate flow diagram via LLM.');
  }
};

/**
 * Saves a generated document to the database.
 * (Requires a 'generated_documents' table).
 * @param userId - The ID of the user saving the document.
 * @param promptId - The ID of the original prompt this document relates to.
 * @param type - The type of document being saved.
 * @param content - The content of the document (Markdown or diagram syntax/URL).
 * @param metadata - Optional metadata for the document.
 * @returns A promise resolving to the saved document record.
 */
export const saveGeneratedDocument = async (
  userId: string,
  promptId: string,
  type: DocumentType,
  content: string,
  metadata?: any // Novo parâmetro opcional para metadados do wizard
): Promise<GeneratedDocument> => {
  console.log(`Saving ${type} document for prompt ${promptId}...`);

  const saveData: NewGeneratedDocument = {
    user_id: userId,
    prompt_id: promptId,
    type: type,
    content: content,
    metadata: metadata || null,
    // created_at e updated_at são automáticos
  };

  const { data, error } = await supabase
    .from('generated_documents')
    .insert(saveData)
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar documento gerado:', error);
    throw error;
  }

  return data as GeneratedDocument;
};

/**
 * Initiates a file download in the browser.
 * @param content - The string content of the file.
 * @param filename - The desired name for the downloaded file (e.g., 'readme.md').
 * @param mimeType - The MIME type for the blob (e.g., 'text/markdown', 'image/png').
 */
export const downloadDocument = (
    content: string,
    filename: string,
    mimeType: string = 'text/plain'
): void => {
  if (typeof window === 'undefined') {
    console.error('Download function can only be called in a browser environment.');
    return;
  }

  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`Initiated download for ${filename}`);
  } catch (error) {
      console.error(`Error initiating download for ${filename}:`, error);
      // Optionally show a toast or alert to the user
  }
};

/**
 * Busca templates de documentação disponíveis (globais e do usuário).
 * @param userId - O ID do usuário (opcional, se não informado retorna só globais)
 * @param type - Tipo de documento ('prd', 'readme', ...)
 */
export const fetchDocumentTemplates = async (type: DocumentType, userId?: string): Promise<DocumentTemplate[]> => {
  let query = supabase.from('document_templates').select('*').eq('type', type);
  if (userId) {
    query = query.or(`user_id.is.null,user_id.eq.${userId}`);
  } else {
    query = query.is('user_id', null);
  }
  const { data, error } = await query.order('is_default', { ascending: false }).order('created_at');
  if (error) throw error;
  return data || [];
};

/**
 * Cria um novo template de documentação.
 */
export const createDocumentTemplate = async (template: NewDocumentTemplate): Promise<DocumentTemplate> => {
  const { data, error } = await supabase.from('document_templates').insert(template).select().single();
  if (error) throw error;
  return data;
};

/**
 * Atualiza um template de documentação.
 */
export const updateDocumentTemplate = async (id: string, updates: Partial<NewDocumentTemplate>): Promise<DocumentTemplate> => {
  const { data, error } = await supabase.from('document_templates').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

/**
 * Deleta um template de documentação.
 */
export const deleteDocumentTemplate = async (id: string): Promise<void> => {
  const { error } = await supabase.from('document_templates').delete().eq('id', id);
  if (error) throw error;
};

/**
 * Define um template como padrão para o tipo e usuário.
 */
export const setDefaultDocumentTemplate = async (id: string, type: DocumentType, userId?: string): Promise<void> => {
  // Remove o default dos outros
  let query = supabase.from('document_templates').update({ is_default: false }).eq('type', type);
  if (userId) query = query.eq('user_id', userId); else query = query.is('user_id', null);
  await query;
  // Seta o novo default
  const { error } = await supabase.from('document_templates').update({ is_default: true }).eq('id', id);
  if (error) throw error;
};
