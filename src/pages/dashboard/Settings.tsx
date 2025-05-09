
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Settings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const handleSaveProfile = () => {
    toast({
      title: t('settings.profileUpdated'),
      description: t('settings.profileUpdateSuccess'),
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: t('settings.preferencesUpdated'),
      description: t('settings.preferencesUpdateSuccess'),
    });
  };
  
  const handleSaveApiKeys = () => {
    toast({
      title: t('settings.apiKeysUpdated'),
      description: t('settings.apiKeysUpdateSuccess'),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">{t('settings.profile')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
          <TabsTrigger value="api-keys">{t('settings.apiKeys')}</TabsTrigger>
          <TabsTrigger value="subscription">{t('settings.subscription')}</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.profileSettings')}</CardTitle>
              <CardDescription>{t('settings.updateProfileInfo')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('settings.name')}</Label>
                  <Input id="name" defaultValue={user?.user_metadata?.full_name || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('settings.email')}</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">{t('settings.bio')}</Label>
                <textarea 
                  id="bio" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  rows={4}
                  placeholder={t('settings.bioPlaceholder')}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>{t('settings.saveChanges')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notificationPreferences')}</CardTitle>
              <CardDescription>{t('settings.manageNotifications')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.emailNotifications')}</p>
                    <p className="text-sm text-gray-500">{t('settings.receiveEmails')}</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.marketingEmails')}</p>
                    <p className="text-sm text-gray-500">{t('settings.receiveMarketing')}</p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.promptUpdates')}</p>
                    <p className="text-sm text-gray-500">{t('settings.notifyPromptUpdates')}</p>
                  </div>
                  <Switch id="prompt-updates" defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>{t('settings.savePreferences')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* API Keys Settings */}
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.apiKeyManagement')}</CardTitle>
              <CardDescription>{t('settings.manageApiKeys')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">{t('settings.openAIApiKey')}</Label>
                  <Input id="openai-key" type="password" placeholder="sk-..." />
                  <p className="text-xs text-gray-500">{t('settings.openAIKeyDesc')}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">{t('settings.anthropicApiKey')}</Label>
                  <Input id="anthropic-key" type="password" placeholder="sk-ant-..." />
                  <p className="text-xs text-gray-500">{t('settings.anthropicKeyDesc')}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveApiKeys}>{t('settings.saveApiKeys')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Subscription Settings */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.subscriptionPlan')}</CardTitle>
              <CardDescription>{t('settings.managePlan')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-blue-700">{t('settings.currentPlan')}: Free</h3>
                    <p className="text-sm text-blue-600">{t('settings.usageLimit')}: 5 prompts/month</p>
                  </div>
                  <Button variant="outline">{t('settings.upgradePlan')}</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">{t('settings.usageStats')}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-sm text-gray-600">3/5 prompts used this month</p>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  {t('settings.cancelSubscription')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
