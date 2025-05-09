
import { supabase } from '@/lib/supabase';
import { extractWizardData, migrateWizardData } from './migration/wizardMigrationData';

export const initializeDatabase = async () => {
  // Verificar se as tabelas já existem
  const { data: tables, error: tablesError } = await supabase.rpc('get_tables');

  if (tablesError) {
    console.error('Erro ao verificar tabelas:', tablesError);
    return { success: false, message: 'Erro ao verificar estrutura do banco de dados' };
  }

  // Se as tabelas necessárias não existirem, exibir mensagem orientando o usuário
  const necessaryTables = [
    'prompts', 
    'wizard_categories', 
    'wizard_items',
  ];

  const missingTables = necessaryTables.filter(table => !tables.includes(table));

  if (missingTables.length > 0) {
    console.warn('Tabelas necessárias não encontradas:', missingTables);
    return { 
      success: false, 
      message: 'Estrutura do banco de dados não encontrada. Execute o script SQL para criar as tabelas necessárias.' 
    };
  }

  // Verificar se já existem dados no banco
  const { count, error: countError } = await supabase
    .from('wizard_categories')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Erro ao verificar existência de dados:', countError);
    return { success: false, message: 'Erro ao verificar dados existentes' };
  }

  // Se não houver dados, migrar os dados existentes
  if (count === 0) {
    try {
      console.log('Iniciando migração de dados...');
      const extractedData = extractWizardData();
      const migrationResult = await migrateWizardData(extractedData);
      
      return { 
        success: true, 
        message: 'Banco de dados inicializado com sucesso. Dados migrados.' 
      };
    } catch (error) {
      console.error('Erro ao migrar dados:', error);
      return { 
        success: false, 
        message: 'Erro ao migrar dados para o banco de dados.' 
      };
    }
  }

  return { 
    success: true, 
    message: 'Banco de dados já inicializado.' 
  };
};
