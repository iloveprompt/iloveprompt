
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminSettings = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.settings')}</h1>
          <p className="text-gray-500">
            {t('dashboard.manageSettings')}
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t('dashboard.general')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('dashboard.appearance')}</TabsTrigger>
          <TabsTrigger value="security">{t('dashboard.security')}</TabsTrigger>
          <TabsTrigger value="ai">{t('dashboard.ai')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.generalSettings')}</CardTitle>
              <CardDescription>
                {t('dashboard.configureGeneralSettings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('dashboard.siteName')}</label>
                  <Input defaultValue="iloveprompt" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('dashboard.siteUrl')}</label>
                  <Input defaultValue="https://iloveprompt.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('dashboard.defaultLanguage')}</label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('dashboard.timeZone')}</label>
                  <Select defaultValue="UTC">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New York</SelectItem>
                      <SelectItem value="America/Sao_Paulo">America/Sao Paulo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('dashboard.enableRegistration')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.allowNewAccounts')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('dashboard.requireEmailVerification')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.verifyEmailBeforeLogin')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button>{t('dashboard.saveChanges')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.appearanceSettings')}</CardTitle>
              <CardDescription>
                {t('dashboard.customizeAppearance')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('dashboard.darkMode')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.enableDarkMode')}</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('dashboard.showLogo')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.displayLogo')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button>{t('dashboard.saveChanges')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.securitySettings')}</CardTitle>
              <CardDescription>
                {t('dashboard.configureSecuritySettings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('dashboard.twoFactorAuth')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.require2FA')}</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('dashboard.passwordComplexity')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.requireStrongPasswords')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button>{t('dashboard.saveChanges')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.aiSettings')}</CardTitle>
              <CardDescription>
                {t('dashboard.configureAI')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('dashboard.apiKey')}</label>
                <Input type="password" defaultValue="sk-••••••••••••••••••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('dashboard.model')}</label>
                <Select defaultValue="gpt-4">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('dashboard.enableAI')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.useAIFeatures')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button>{t('dashboard.saveChanges')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
