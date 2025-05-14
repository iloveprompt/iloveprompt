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
import { useAuth } from '@/hooks/useAuth';
import { getSystemMessages, addSystemMessage, updateSystemMessage, deleteSystemMessage, setDefaultSystemMessage } from '@/services/adminSettingService';

const AdminSettings = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [systemMessages, setSystemMessages] = React.useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [form, setForm] = React.useState({ title: '', content: '', is_default: false });
  const [editId, setEditId] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);

  // Carregar mensagens do sistema
  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const msgs = await getSystemMessages();
      setSystemMessages(msgs);
    } catch (err) {
      // Tratar erro
    } finally {
      setLoadingMessages(false);
    }
  };
  React.useEffect(() => { loadMessages(); }, []);

  // CRUD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim() || !form.title.trim()) return;
    setProcessing(true);
    try {
      if (editId) {
        await updateSystemMessage(editId, { ...form });
      } else {
        await addSystemMessage({ ...form, created_by_admin_id: user?.id });
      }
      setForm({ title: '', content: '', is_default: false });
      setEditId(null);
      loadMessages();
    } finally {
      setProcessing(false);
    }
  };
  const handleEdit = (msg: any) => {
    setForm({ title: msg.title, content: msg.content, is_default: msg.is_default });
    setEditId(msg.id);
  };
  const handleDelete = async (id: string) => {
    setProcessing(true);
    await deleteSystemMessage(id);
    loadMessages();
    setProcessing(false);
  };
  const handleSetDefault = async (id: string) => {
    setProcessing(true);
    await setDefaultSystemMessage(id);
    loadMessages();
    setProcessing(false);
  };

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
          <TabsTrigger value="system-messages">Mensagens do Sistema</TabsTrigger>
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

        <TabsContent value="system-messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mensagens do Sistema (LLM)</CardTitle>
              <CardDescription>Gerencie as mensagens de contexto usadas por todas as IAs do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                  placeholder="Título"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  disabled={processing}
                />
                <Textarea
                  placeholder="Conteúdo da mensagem do sistema..."
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={4}
                  disabled={processing}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))}
                    disabled={processing}
                    id="is_default"
                  />
                  <label htmlFor="is_default">Definir como padrão</label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="submit" disabled={processing}>{editId ? 'Salvar Alterações' : 'Adicionar Mensagem'}</Button>
                  {editId && <Button type="button" variant="ghost" onClick={() => { setEditId(null); setForm({ title: '', content: '', is_default: false }); }}>Cancelar</Button>}
                </div>
              </form>
              <Separator />
              {loadingMessages ? <div>Carregando...</div> : (
                <div className="space-y-2">
                  {systemMessages.length === 0 && <div className="text-gray-400">Nenhuma mensagem cadastrada.</div>}
                  {systemMessages.map(msg => (
                    <Card key={msg.id} className={`border-2 ${msg.is_default ? 'border-blue-500' : 'border-gray-200'}`}>
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{msg.title}</CardTitle>
                          <CardDescription className="text-xs">{msg.content.slice(0, 80)}{msg.content.length > 80 ? '...' : ''}</CardDescription>
                        </div>
                        <div className="flex gap-2 items-center">
                          {!msg.is_default && <Button size="sm" variant="outline" onClick={() => handleSetDefault(msg.id)} disabled={processing}>Definir como padrão</Button>}
                          <Button size="sm" variant="outline" onClick={() => handleEdit(msg)} disabled={processing}>Editar</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(msg.id)} disabled={processing || msg.is_default}>Excluir</Button>
                        </div>
                      </CardHeader>
                      <CardContent className="text-xs text-gray-500 flex justify-between">
                        <span>Criado em: {new Date(msg.created_at).toLocaleString()}</span>
                        <span>{msg.is_default ? 'Padrão' : ''}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
