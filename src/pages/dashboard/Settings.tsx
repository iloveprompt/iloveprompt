
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, Edit, Trash2, KeyRound, Zap } from 'lucide-react';
import {
  getUserApiKeys,
  addUserApiKey,
  setActiveApiKey,
  deleteUserApiKey,
  updateUserApiKey,
  UserLlmApi,
  LlmProvider
} from '@/services/userSettingService';

const LLM_MODELS: Record<string, string[]> = {
  OpenAI: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o'],
  Gemini: ['gemini-pro', 'gemini-1.5-pro', 'gemini-ultra', 'gemini-1.5-flash'],
  Groq: ['llama3-70b-8192', 'llama3-8b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'],
  Grok: ['grok-1', 'grok-1.5'],
  DeepSeek: ['deepseek-chat', 'deepseek-coder'],
  Outros: ['Outro modelo...'],
};

// Map display names to valid provider enum values
const providerMapping: Record<string, LlmProvider> = {
  'OpenAI': 'openai',
  'Gemini': 'gemini',
  'Groq': 'groq',
  'Grok': 'groq', // Assuming Grok is handled via Groq
  'DeepSeek': 'deepseek',
  'Outros': 'openai' // Default fallback
};

const Settings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  // CRUD LLMs persistente
  const [llms, setLlms] = useState<UserLlmApi[]>([]); // Persistente
  const [form, setForm] = useState({ provider: 'OpenAI', model: 'gpt-4', key: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Carregar LLMs do usuário ao montar
  React.useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getUserApiKeys(user.id)
      .then(data => setLlms(Array.isArray(data) ? data : []))
      .catch(err => {
        setLlms([]);
        toast({ title: 'Erro ao carregar LLMs', description: err.message, variant: 'destructive' });
      })
      .finally(() => setLoading(false));
  }, [user?.id, toast]);

  // Atualiza modelos ao trocar provedor
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value;
    setForm(f => ({ ...f, provider, model: LLM_MODELS[provider][0] }));
  };

  // Cadastro/edição de LLM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.key.trim()) {
      toast({ title: 'Informe a chave secreta.' });
      return;
    }
    if (!user?.id) return;
    setLoading(true);
    try {
      if (editId) {
        await updateUserApiKey(editId, {
          provider: providerMapping[form.provider] || 'openai',
          api_key: form.key,
          models: [form.model],
          updated_at: new Date().toISOString()
        });
        toast({ title: 'LLM atualizada!' });
      } else {
        await addUserApiKey({
          user_id: user.id,
          provider: providerMapping[form.provider] || 'openai',
          api_key: form.key,
          is_active: llms.length === 0, // Primeira já ativa
          test_status: 'untested',
          models: [form.model],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        toast({ title: 'LLM cadastrada!' });
      }
      // Recarregar lista
      const data = await getUserApiKeys(user.id);
      setLlms(Array.isArray(data) ? data : []);
      setForm({ provider: 'OpenAI', model: 'gpt-4', key: '' });
      setEditId(null);
    } catch (err: any) {
      toast({ title: 'Erro ao cadastrar/editar LLM', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Ativar LLM
  const handleActivate = async (id: string) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await setActiveApiKey(user.id, id);
      const data = await getUserApiKeys(user.id);
      setLlms(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({ title: 'Erro ao ativar LLM', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Excluir LLM
  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await deleteUserApiKey(id);
      const data = await getUserApiKeys(user.id);
      setLlms(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({ title: 'Erro ao excluir LLM', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Editar LLM (preenche o form para edição)
  const handleEdit = (llm: any) => {
    setForm({ provider: llm.provider.charAt(0).toUpperCase() + llm.provider.slice(1), model: llm.models?.[0] || '', key: llm.api_key });
    setEditId(llm.id);
  };

  // Gerenciar chave: abre edição da LLM
  const handleManageKey = (llm: any) => {
    setForm({ provider: llm.provider.charAt(0).toUpperCase() + llm.provider.slice(1), model: llm.models?.[0] || '', key: llm.api_key });
    setEditId(llm.id);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
          <TabsTrigger value="api-keys">{t('settings.apiAccess')}</TabsTrigger>
          <TabsTrigger value="subscription">{t('settings.subscription')}</TabsTrigger>
        </TabsList>
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
                <Button>{t('settings.savePreferences')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* API Keys Settings */}
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar LLMs e Chaves de API</CardTitle>
              <CardDescription>Cadastre e gerencie suas conexões com LLMs (OpenAI, Gemini, Groq, Grok, DeepSeek, etc). Você pode cadastrar várias, mas apenas uma pode estar ativa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cadastro/edição de nova LLM */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="llm-provider">Provedor</Label>
                    <select id="llm-provider" className="w-full border rounded px-2 py-2" value={form.provider} onChange={handleProviderChange}>
                      {Object.keys(LLM_MODELS).map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="llm-model">Modelo</Label>
                    <select id="llm-model" className="w-full border rounded px-2 py-2" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))}>
                      {LLM_MODELS[form.provider].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="llm-key">Chave Secreta</Label>
                    <Input id="llm-key" type="password" placeholder="sk-..." value={form.key} onChange={e => setForm(f => ({ ...f, key: e.target.value }))} />
                  </div>
                  <div className="md:col-span-3 flex justify-end mt-2">
                    <Button type="submit">{editId ? 'Salvar Alterações' : 'Cadastrar LLM'}</Button>
                    {editId && <Button type="button" variant="ghost" className="ml-2" onClick={() => { setEditId(null); setForm({ provider: 'OpenAI', model: 'gpt-4', key: '' }); }}>Cancelar</Button>}
                  </div>
                </form>
              </div>
              {/* Listagem de LLMs cadastradas (cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(llms) && llms.length === 0 && <div className="text-center text-gray-400 col-span-2">Nenhuma LLM cadastrada ainda.</div>}
                {Array.isArray(llms) && llms.map(llm => (
                  <Card key={llm.id} className={`relative border-2 ${llm.is_active ? 'border-blue-500' : 'border-gray-200'}`}>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button size="icon" variant={llm.is_active ? 'default' : 'outline'} title={llm.is_active ? 'Desativar' : 'Ativar'} onClick={() => handleActivate(llm.id)}>
                        {llm.is_active ? <Check className="h-4 w-4 text-green-600" /> : <Zap className="h-4 w-4 text-green-600" />}
                      </Button>
                      <Button size="icon" variant="outline" title="Editar" onClick={() => handleEdit(llm)}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="outline" title="Excluir" onClick={() => handleDelete(llm.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <span className="font-bold">{llm.provider}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{llm.models?.[0]}</span>
                        {llm.is_active && <span className="ml-2 text-green-600 flex items-center"><Check className="h-4 w-4 mr-1" /> Ativa</span>}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className={llm.test_status === 'success' ? 'text-green-600' : llm.test_status === 'failure' ? 'text-red-600' : 'text-gray-400'}>●</span> {llm.test_status === 'success' ? 'Conexão ativa' : llm.test_status === 'failure' ? 'Erro na conexão' : 'Não testada'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Chave:</span>
                        <span className="text-xs font-mono truncate max-w-[120px] block" title={llm.api_key}>{llm.api_key.length > 8 ? `****${llm.api_key.slice(-4)}` : llm.api_key}</span>
                        <Button size="sm" variant="outline" onClick={() => handleManageKey(llm)}><KeyRound className="h-4 w-4 mr-1" /> Gerenciar Chave</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
