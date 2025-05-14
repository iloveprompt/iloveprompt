import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  getUserApiKeys,
  addUserApiKey,
  updateUserApiKey,
  deleteUserApiKey,
  setActiveApiKey,
  UserLlmApi,
  LlmProvider
} from '@/services/userSettingService';
import { testConnection } from '@/services/llmService';

const PROVIDERS: LlmProvider[] = ['openai', 'gemini', 'groq', 'deepseek'];

const UserLlmApisManager: React.FC<{ userId: string }> = ({ userId }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [apis, setApis] = useState<UserLlmApi[]>([]);
  const [newApi, setNewApi] = useState<{ provider: LlmProvider; api_key: string }>({ provider: 'openai', api_key: '' });
  const [loading, setLoading] = useState(false);

  const loadApis = async () => {
    setLoading(true);
    try {
      const data = await getUserApiKeys(userId);
      setApis(data);
    } catch (err: any) {
      toast({ title: t('llmApisManager.errorFetch'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApis(); /* eslint-disable-next-line */ }, [userId]);

  const handleAdd = async () => {
    if (!newApi.api_key) return;
    setLoading(true);
    try {
      await addUserApiKey({
        user_id: userId,
        provider: newApi.provider,
        api_key: newApi.api_key,
        is_active: false,
        test_status: 'untested',
        models: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setNewApi({ provider: 'openai', api_key: '' });
      loadApis();
      toast({ title: t('llmApisManager.added'), variant: 'default' });
    } catch (err: any) {
      toast({ title: t('llmApisManager.errorAdd'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteUserApiKey(id);
      loadApis();
      toast({ title: t('llmApisManager.deleted'), variant: 'default' });
    } catch (err: any) {
      toast({ title: t('llmApisManager.errorDelete'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: string) => {
    setLoading(true);
    try {
      await setActiveApiKey(userId, id);
      loadApis();
      toast({ title: t('llmApisManager.activated'), variant: 'default' });
    } catch (err: any) {
      toast({ title: t('llmApisManager.errorActivate'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (api: UserLlmApi) => {
    setLoading(true);
    try {
      const result = await testConnection(api);
      loadApis();
      toast({ title: result.success ? t('llmApisManager.testOk') : t('llmApisManager.testFail'), description: result.error, variant: result.success ? 'default' : 'destructive' });
    } catch (err: any) {
      toast({ title: t('llmApisManager.errorTest'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('llmApisManager.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-end">
          <Select value={newApi.provider} onValueChange={val => setNewApi(n => ({ ...n, provider: val as LlmProvider }))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('llmApisManager.provider')} />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p.toUpperCase()}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input
            placeholder={t('llmApisManager.apiKeyPlaceholder')}
            value={newApi.api_key}
            onChange={e => setNewApi(n => ({ ...n, api_key: e.target.value }))}
            className="w-64"
          />
          <Button onClick={handleAdd} size="sm" disabled={loading}>{t('llmApisManager.add')}</Button>
        </div>
        <div>
          {apis.map(api => (
            <div key={api.id} className={`border rounded p-2 mb-2 flex items-center gap-2 ${api.is_active ? 'border-green-500' : ''}`}> 
              <span className="font-semibold">{api.provider.toUpperCase()}</span>
              <span className="text-xs">{api.api_key.slice(0, 6)}...{api.api_key.slice(-4)}</span>
              <span className={`text-xs ${api.is_active ? 'text-green-600' : 'text-gray-400'}`}>{api.is_active ? t('llmApisManager.active') : t('llmApisManager.inactive')}</span>
              <span className={`text-xs ${api.test_status === 'success' ? 'text-green-600' : api.test_status === 'failure' ? 'text-red-600' : 'text-gray-400'}`}>{t(`llmApisManager.${api.test_status}`)}</span>
              <Button onClick={() => handleTest(api)} size="sm" variant="secondary">{t('llmApisManager.test')}</Button>
              {!api.is_active && <Button onClick={() => handleActivate(api.id)} size="sm" variant="outline">{t('llmApisManager.activate')}</Button>}
              <Button onClick={() => handleDelete(api.id)} size="sm" variant="destructive">{t('llmApisManager.delete')}</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserLlmApisManager; 