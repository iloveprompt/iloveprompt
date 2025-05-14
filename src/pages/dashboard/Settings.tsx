import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from '@/i18n/LanguageContext';
import { getActiveApiKey, getUserLlmApis, updateUserApiKey, createUserApiKey, deleteUserApiKey } from '@/services/userSettingService';
import { ApiTestStatus, testConnection } from '@/services/llmService';
import { Loader2 } from 'lucide-react';

// Ajuste na definição dos tipos permitidos
type ProviderType = "openai" | "gemini" | "groq" | "deepseek";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [apiKey, setApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderType>("openai");
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [activeApiKeyId, setActiveApiKeyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: ApiTestStatus }>({});

  // Ao definir defaultProvider, certifique-se de que ele seja do tipo correto
  const defaultProvider: ProviderType = "openai";

  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        try {
          const keys = await getUserLlmApis(user.id);
          setApiKeys(keys);

          const activeKey = await getActiveApiKey(user.id);
          setActiveApiKeyId(activeKey?.id || null);
          setSelectedProvider(activeKey?.provider || defaultProvider);
          setApiKey(activeKey?.api_key || '');
        } catch (error) {
          console.error("Error loading settings:", error);
          toast({
            title: t('settings.errorLoading'),
            description: t('settings.errorLoadingDescription'),
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadSettings();
  }, [user, t]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  // Certifique-se de que newProvider seja do tipo correto
  const handleProviderChange = (newProvider: ProviderType) => {
    setSelectedProvider(newProvider);
  };

  const handleSaveApiKey = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const newApiKeyData = {
        user_id: user.id,
        api_key: apiKey,
        provider: selectedProvider,
        is_active: true,
      };

      // Se já existe uma chave ativa, desativa-a
      if (activeApiKeyId) {
        await updateUserApiKey(activeApiKeyId, { is_active: false });
      }

      // Cria a nova chave
      const newApiKey = await createUserApiKey(newApiKeyData);
      setApiKeys(prevKeys => [...prevKeys, newApiKey]);
      setActiveApiKeyId(newApiKey.id);

      toast({
        title: t('settings.apiKeySaved'),
        description: t('settings.apiKeySavedDescription'),
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: t('settings.errorSaving'),
        description: t('settings.errorSavingDescription'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActive = async (keyId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Desativa todas as chaves
      for (const key of apiKeys) {
        await updateUserApiKey(key.id, { is_active: false });
      }

      // Ativa a chave selecionada
      await updateUserApiKey(keyId, { is_active: true });
      setActiveApiKeyId(keyId);

      toast({
        title: t('settings.apiKeyActivated'),
        description: t('settings.apiKeyActivatedDescription'),
      });
    } catch (error) {
      console.error("Error setting active API key:", error);
      toast({
        title: t('settings.errorActivating'),
        description: t('settings.errorActivatingDescription'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      await deleteUserApiKey(keyId);
      setApiKeys(prevKeys => prevKeys.filter(key => key.id !== keyId));

      if (activeApiKeyId === keyId) {
        setActiveApiKeyId(null);
      }

      toast({
        title: t('settings.apiKeyDeleted'),
        description: t('settings.apiKeyDeletedDescription'),
      });
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast({
        title: t('settings.errorDeleting'),
        description: t('settings.errorDeletingDescription'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (keyId: string) => {
    setIsTesting(true);
    setTestResults(prev => ({ ...prev, [keyId]: 'testing' }));

    try {
      const apiKeyToTest = apiKeys.find(key => key.id === keyId);
      if (!apiKeyToTest) {
        throw new Error("API key not found");
      }

      const result = await testConnection(apiKeyToTest);
      setTestResults(prev => ({ ...prev, [keyId]: result.status || 'failure' }));

      if (!result.success) {
        toast({
          title: t('settings.testFailed'),
          description: result.error || t('settings.testFailedDescription'),
          variant: "destructive"
        });
      } else {
        toast({
          title: t('settings.testSuccess'),
          description: t('settings.testSuccessDescription'),
        });
      }
    } catch (error: any) {
      console.error("Error testing connection:", error);
      setTestResults(prev => ({ ...prev, [keyId]: 'failure' }));
      toast({
        title: t('settings.testFailed'),
        description: error.message || t('settings.testFailedDescription'),
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return <div>{t('common.loading')}...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.title')}</CardTitle>
          <CardDescription>{t('settings.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="provider">{t('settings.provider')}</Label>
            <Select onValueChange={handleProviderChange} defaultValue={selectedProvider}>
              <SelectTrigger id="provider">
                <SelectValue placeholder={t('settings.selectProvider')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="groq">Groq</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="api-key">{t('settings.apiKey')}</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveApiKey} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              t('settings.saveApiKey')
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t('settings.existingKeys')}</h2>
        {apiKeys.length > 0 ? (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <Card key={key.id}>
                <CardHeader>
                  <CardTitle>{key.provider}</CardTitle>
                  <CardDescription>
                    {t('settings.created')}: {new Date(key.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    {t('settings.apiKey')}: {key.api_key.substring(0, 4)}...
                  </div>
                  <div>
                    {testResults[key.id] === 'testing' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleTestConnection(key.id)}
                        disabled={isTesting}
                      >
                        {t('settings.testConnection')}
                      </Button>
                    )}
                    {testResults[key.id] === 'success' && (
                      <span className="text-green-500 ml-2">{t('settings.testSuccess')}</span>
                    )}
                    {testResults[key.id] === 'failure' && (
                      <span className="text-red-500 ml-2">{t('settings.testFailed')}</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetActive(key.id)}
                    disabled={isLoading || activeApiKeyId === key.id}
                  >
                    {activeApiKeyId === key.id ? t('settings.active') : t('settings.setActive')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteApiKey(key.id)}
                    disabled={isLoading}
                  >
                    {t('settings.delete')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p>{t('settings.noKeys')}</p>
        )}
      </div>
    </div>
  );
};

export default Settings;
