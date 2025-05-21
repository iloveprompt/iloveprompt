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
import { Check, Edit, Trash2, KeyRound, Zap, RefreshCw } from 'lucide-react';
import {
  getUserApiKeys,
  addUserApiKey,
  setActiveApiKey,
  deleteUserApiKey,
  updateUserApiKey,
  UserLlmApi,
  ApiTestStatus,
  LlmProvider,
  getActiveApiKey
} from '@/services/userSettingService';
import { testConnection } from '@/services/llmService';
import { supabase } from '@/lib/supabase';
import { useLlm } from '@/contexts/LlmContext';

// Define allowed provider types
type ProviderType = 'openai' | 'gemini' | 'groq' | 'deepseek' | 'grok';

const LLM_MODELS: Record<ProviderType, string[]> = {
  openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o'],
  gemini: [
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-ultra'
  ],
  groq: ['llama3-70b-8192', 'llama3-8b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'],
  grok: ['grok-1', 'grok-1.5'],
  deepseek: ['deepseek-chat', 'deepseek-coder'],
};

const Settings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { llms, loading: llmsLoading, loadLlms } = useLlm();

  const [form, setForm] = useState({ provider: 'openai', model: 'gpt-4', key: '' });
  const [loading, setLoading] = useState(false);
  const [loadingById, setLoadingById] = useState<Record<string, boolean>>({});

  // Atualiza modelos ao trocar provedor
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as ProviderType;
    setForm(f => ({ ...f, provider, model: LLM_MODELS[provider][0] }));
  };

  // Convert provider name to lowercase for API
  const getProviderType = (provider: string): ProviderType => {
    return provider as ProviderType;
  };

  // Editar LLM (preenche o form para edição)
  const handleEdit = (llm: any) => {
    setForm({
      provider: llm.provider.toLowerCase(),
      model: llm.models?.[0] || '',
      key: llm.api_key
    });
  };

  // Gerenciar chave: abre edição da LLM
  const handleManageKey = (llm: any) => {
    setForm({
      provider: llm.provider.toLowerCase(),
      model: llm.models?.[0] || '',
      key: llm.api_key
    });
  };

  // Cadastro/edição de LLM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({ 
        title: 'Erro', 
        description: 'Usuário não encontrado',
        variant: 'destructive'
      });
      return;
    }

    if (!form.key.trim()) {
      toast({ 
        title: 'Erro', 
        description: 'Informe a chave API',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Se já existe uma LLM ativa, desativa ela primeiro
      if (llms.some(llm => llm.is_active)) {
        const { error: updateError } = await supabase
          .from('user_llm_apis')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (updateError) throw updateError;
      }

      // Insere a nova LLM
      const { error: insertError } = await supabase
        .from('user_llm_apis')
        .insert({
          user_id: user.id,
          provider: form.provider as LlmProvider,
          api_key: form.key,
          models: [form.model],
          is_active: true,
          test_status: 'untested' as ApiTestStatus
        });

      if (insertError) throw insertError;

      // Recarrega a lista usando o contexto
      await loadLlms();
      
      // Limpa o formulário
      setForm({ provider: 'openai', model: 'gpt-4', key: '' });
      
      toast({ 
        title: 'Sucesso!',
        description: 'LLM cadastrada com sucesso',
        variant: 'default'
      });
    } catch (err: any) {
      console.error('Erro:', err);
      toast({ 
        title: 'Erro ao cadastrar LLM', 
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      await loadLlms(); // Garante atualização do contexto após qualquer erro
    }
  };

  // Ativar LLM
  const handleActivate = async (id: string) => {
    if (!user?.id) return;
    // Zera todos os loadings exceto o atual
    setLoadingById({ [id]: true });
    try {
      await setActiveApiKey(user.id, id);
      const activeLlm = await getActiveApiKey(user.id);
      if (activeLlm) {
        const testResult = await testConnection({ ...activeLlm, is_active: true });
        if (!testResult.success) {
          toast({ 
            title: 'Erro ao ativar LLM', 
            description: testResult.error || 'A chave ativada não está funcionando. Corrija ou teste outra LLM.', 
            variant: 'destructive' 
          });
        } else {
          toast({ title: 'LLM ativada e pronta para uso!' });
        }
      } else {
        toast({ title: 'Erro', description: 'Não foi possível encontrar a LLM ativada.', variant: 'destructive' });
      }
      await loadLlms();
    } catch (err: any) {
      toast({ title: 'Erro ao ativar LLM', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingById({});
      await loadLlms();
    }
  };

  // Testar LLM
  const handleTest = async (llm: UserLlmApi) => {
    setLoadingById(prev => ({ ...prev, [llm.id]: true }));
    try {
      const testResult = await testConnection(llm);
      toast({ 
        title: testResult.success ? 'Conexão testada com sucesso!' : 'Erro ao testar conexão', 
        description: testResult.success ? 'A LLM está pronta para uso.' : (testResult.error || 'Falha ao testar a LLM.'),
        variant: testResult.success ? 'default' : 'destructive' 
      });
      await loadLlms();
    } catch (err: any) {
      toast({ 
        title: 'Erro inesperado ao testar conexão', 
        description: err?.message || String(err), 
        variant: 'destructive' 
      });
    } finally {
      setLoadingById(prev => ({ ...prev, [llm.id]: false }));
      await loadLlms();
    }
  };

  // Excluir LLM
  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    setLoadingById(prev => ({ ...prev, [id]: true }));
    try {
      await deleteUserApiKey(id);
      await loadLlms();
      toast({ title: 'LLM excluída!' });
    } catch (err: any) {
      toast({ title: 'Erro ao excluir LLM', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingById(prev => ({ ...prev, [id]: false }));
      await loadLlms();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">{t('settings.general')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('settings.appearance')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
          <TabsTrigger value="security">{t('settings.security')}</TabsTrigger>
          <TabsTrigger value="subscription">{t('settings.subscription')}</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.generalSettings')}</CardTitle>
              <CardDescription>{t('settings.generalDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.language')}</p>
                    <p className="text-sm text-gray-500">{t('settings.languageDescription')}</p>
                  </div>
                  <select className="w-40 border rounded px-2 py-1">
                    <option value="pt-BR">Português (BR)</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.timezone')}</p>
                    <p className="text-sm text-gray-500">{t('settings.timezoneDescription')}</p>
                  </div>
                  <select className="w-40 border rounded px-2 py-1">
                    <option value="America/Sao_Paulo">America/São Paulo</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Aparência */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.appearanceSettings')}</CardTitle>
              <CardDescription>{t('settings.appearanceDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.theme')}</p>
                    <p className="text-sm text-gray-500">{t('settings.themeDescription')}</p>
                  </div>
                  <select className="w-40 border rounded px-2 py-1">
                    <option value="light">{t('settings.light')}</option>
                    <option value="dark">{t('settings.dark')}</option>
                    <option value="system">{t('settings.system')}</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.fontSize')}</p>
                    <p className="text-sm text-gray-500">{t('settings.fontSizeDescription')}</p>
                  </div>
                  <select className="w-40 border rounded px-2 py-1">
                    <option value="small">{t('settings.small')}</option>
                    <option value="medium">{t('settings.medium')}</option>
                    <option value="large">{t('settings.large')}</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Notificações */}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.securitySettings')}</CardTitle>
              <CardDescription>{t('settings.securityDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.twoFactor')}</p>
                    <p className="text-sm text-gray-500">{t('settings.twoFactorDescription')}</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.sessionTimeout')}</p>
                    <p className="text-sm text-gray-500">{t('settings.sessionTimeoutDescription')}</p>
                  </div>
                  <select className="w-40 border rounded px-2 py-1">
                    <option value="30">30 {t('settings.minutes')}</option>
                    <option value="60">60 {t('settings.minutes')}</option>
                    <option value="120">120 {t('settings.minutes')}</option>
                  </select>
                </div>
                <Button variant="outline" className="w-full">
                  {t('settings.changePassword')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Assinatura */}
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

        {/* API Settings */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar LLMs e Chaves de API</CardTitle>
              <CardDescription>Cadastre e gerencie suas conexões com LLMs (OpenAI, Gemini, Groq, Grok, DeepSeek). Você pode cadastrar várias, mas apenas uma pode estar ativa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulário de cadastro */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <form 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end" 
                  onSubmit={handleSubmit}
                >
                  <div>
                    <Label htmlFor="llm-provider">Provedor</Label>
                    <select 
                      id="llm-provider" 
                      className="w-full border rounded px-2 py-2" 
                      value={form.provider} 
                      onChange={handleProviderChange}
                      disabled={loading}
                    >
                      {Object.keys(LLM_MODELS).map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="llm-model">Modelo</Label>
                    <select 
                      id="llm-model" 
                      className="w-full border rounded px-2 py-2" 
                      value={form.model} 
                      onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
                      disabled={loading}
                    >
                      {LLM_MODELS[form.provider as ProviderType].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="llm-key">Chave Secreta</Label>
                    <Input 
                      id="llm-key" 
                      type="password" 
                      placeholder="sk-..." 
                      value={form.key} 
                      onChange={e => setForm(f => ({ ...f, key: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end mt-2">
                    <Button 
                      type="submit" 
                      disabled={loading || !form.key.trim()}
                      variant="default"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                          <span>Cadastrando...</span>
                        </div>
                      ) : (
                        'Cadastrar LLM'
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Lista de LLMs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {llms.length === 0 && (
                  <div className="text-center text-gray-400 col-span-2">
                    Nenhuma LLM cadastrada ainda.
                  </div>
                )}
                {llms.map(llm => (
                  <Card key={llm.id} className={`relative border-2 ${llm.is_active ? 'border-blue-500' : 'border-gray-200'}`}>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button 
                        size="icon" 
                        variant={llm.is_active ? 'default' : 'outline'} 
                        title={llm.test_status === 'failure' ? 'Corrija a conexão antes de ativar' : (llm.is_active ? 'Desativar' : 'Ativar')} 
                        onClick={() => handleActivate(llm.id)} 
                        disabled={!!loadingById[llm.id] || llm.test_status === 'failure'}
                      >
                        {loadingById[llm.id] ? <div className="w-4 h-4 border-2 border-t-transparent border-green-500 rounded-full animate-spin" /> : <Check className="h-4 w-4 text-green-600" />}
                      </Button>
                      <Button size="icon" variant="outline" title="Editar/gerenciar chave" onClick={() => handleEdit(llm)} disabled={!!loadingById[llm.id]}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="outline" title="Excluir" onClick={() => handleDelete(llm.id)} disabled={!!loadingById[llm.id]}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      <Button size="icon" variant="outline" title="Testar" onClick={() => handleTest(llm)} disabled={!!loadingById[llm.id]}>
                        {loadingById[llm.id] ? <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" /> : <RefreshCw className="h-4 w-4 text-blue-500" />}
                      </Button>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <span className="font-bold">{llm.provider}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{llm.models?.[0]}</span>
                        {llm.is_active && <span className="ml-2 text-green-600 flex items-center"><Check className="h-4 w-4 mr-1" /> Ativa</span>}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className={llm.test_status === 'success' ? 'text-green-600' : llm.test_status === 'failure' ? 'text-red-600' : 'text-gray-400'}>●</span> 
                        {llm.test_status === 'success' ? 'Conexão ativa' : llm.test_status === 'failure' ? 'Erro na conexão' : 'Não testada'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Chave:</span>
                        <span className="text-xs font-mono truncate max-w-[120px] block" title={llm.api_key}>
                          {llm.api_key.length > 8 ? `****${llm.api_key.slice(-4)}` : llm.api_key}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;