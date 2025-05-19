import { useLanguage } from '@/i18n/LanguageContext';
import { LLMApisList } from '@/components/dashboard/LLMApisList';

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t('dashboard.title')}</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('dashboard.yourApis')}</h2>
          <LLMApisList />
        </section>
        
        {/* Outras seções do dashboard */}
      </div>
    </div>
  );
} 