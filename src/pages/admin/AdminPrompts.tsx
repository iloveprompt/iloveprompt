
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WizardItemsManager from '@/components/admin/WizardItemsManager';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('dashboard.information')}</AlertTitle>
        <AlertDescription>
          {t('dashboard.wizardItemsHelpText') || 
            "Here you can manage all the items that appear in the prompt generator wizard. Changes made here will be immediately available to users."}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.wizardItems')}</CardTitle>
          <CardDescription>
            {t('dashboard.manageWizardItems')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WizardItemsManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPrompts;
