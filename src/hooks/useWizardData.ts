
import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { getWizardData } from '@/services/wizardService';
import { extractWizardData } from '@/services/migration/wizardMigrationData';
import { supabase } from '@/lib/supabase';

export const useWizardData = () => {
  const { language } = useLanguage();
  const [wizardData, setWizardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWizardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Tentar buscar dados do banco de dados
        const data = await getWizardData(language);

        if (data) {
          setWizardData(data);
        } else {
          // Se não há dados no banco, extrair os dados existentes
          const extractedData = extractWizardData();
          
          try {
            // Tentar migrar os dados para o banco
            const { migrateWizardData } = await import('@/services/migration/wizardMigrationData');
            await migrateWizardData(extractedData);
            
            // Buscar dados novamente após a migração
            const migratedData = await getWizardData(language);
            
            if (migratedData) {
              setWizardData(migratedData);
            } else {
              // Se ainda não houver dados, usar os dados extraídos como fallback
              setWizardData(extractedData);
            }
          } catch (migrationError) {
            console.error('Erro na migração de dados:', migrationError);
            // Usar dados extraídos como fallback
            setWizardData(extractedData);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar dados do wizard:', err);
        setError(err as Error);
        
        // Tentar usar dados extraídos como fallback
        try {
          const extractedData = extractWizardData();
          setWizardData(extractedData);
        } catch (extractError) {
          console.error('Erro ao extrair dados do wizard:', extractError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWizardData();
  }, [language]);

  return { wizardData, isLoading, error };
};
