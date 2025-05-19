import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminWizardTabs from './AdminWizardTabs';

const AdminPrompts = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('wizardItems');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.promptManagement')}</h1>
          <p className="text-gray-500">
            {t('dashboard.wizardItems')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.wizardItems')}</CardTitle>
          <CardDescription>
            {t('dashboard.manageWizardItems')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminWizardTabs />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPrompts;
