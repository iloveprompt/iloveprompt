import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardTitle from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
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

let isFetchingApis = false;

const UserLlmApisManager: React.FC<{ userId: string }> = ({ userId }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [apis, setApis] = useState<UserLlmApi[]>([]);
  const [newApi, setNewApi] = useState<{ provider: LlmProvider; api_key: string }>({ provider: 'openai', api_key: '' });
  const [loading, setLoading] = useState(false);

  const loadApis = async () => {
    if (isFetchingApis) return; // Proteção contra concorrência/loop
    isFetchingApis = true;
    setLoading(true);
    try {
      const data = await getUserApiKeys(userId);
      setApis(data);
    } catch (err: any) {
      toast({ title: t('llmApisManager.errorFetch'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
      isFetchingApis = false;
    }
  };

  useEffect(() => {
    loadApis();
    // eslint-disable-next-line
  }, [userId]);

  const handleAdd = async () => {
    if (!newApi.api_key) {
      toast({ title: t('llmApisManager.errorAdd'), description: 'A chave de API não pode estar vazia', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Primeiro testamos a conexão
      const testResult = await testConnection({
        id: '', // Placeholder
        user_id: userId,
        provider: newApi.provider,
        api_key: newApi.api_key,
        is_active: false,
        test_status: 'untested',
        models: [],
        last_tested_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (!testResult.success) {
        throw new Error(testResult.error || 'Falha ao validar a chave de API');
      }

      // Se a validação passar, cadastramos
      await addUserApiKey({
        user_id: userId,
        provider: newApi.provider,
        api_key: newApi.api_key,
        is_active: false,
        test_status: 'success', // Já sabemos que é válida
        models: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      setNewApi({ provider: 'openai', api_key: '' });
      await loadApis();
      toast({ 
        title: t('llmApisManager.added'), 
        description: 'Chave validada e cadastrada com sucesso',
        variant: 'default' 
      });
    } catch (err: any) {
      toast({ 
        title: 'Erro ao cadastrar chave', 
        description: err.message || 'Verifique a chave e tente novamente',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteUserApiKey(id);
      await loadApis();
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
      await loadApis();
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
      await loadApis();
      toast({ title: result.success ? t('llmApisManager.testOk') : t('llmApisManager.testFail'), description: result.error, variant: result.success ? 'default' : 'destructive' });
    } catch (err: any) {
      toast({ title: t('llmApisManager.errorTest'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title={t('llmApisManager.title')} />
      <CardContent>
        {apis.length === 0 ? (
          <Box bgcolor="#fffbe6" borderLeft={4} borderColor="#ffe082" p={2} mb={2} borderRadius={1}>
            <Typography variant="body2" color="#8a6d3b" fontWeight={600} gutterBottom>
              Você ainda não cadastrou nenhuma chave de API.
            </Typography>
            <div style={{ color: '#8a6d3b' }}>
              Para utilizar todos os recursos do sistema, é importante cadastrar sua chave de API de LLM (ex: OpenAI, Gemini, etc).<br />
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Sua chave é usada para processar informações importantes e gerar prompts personalizados.</li>
                <li>Ao usar sua própria chave, garantimos total privacidade: <b>sua chave é armazenada de forma criptografada</b> e nunca é compartilhada.</li>
                <li>Quando você fizer login novamente, sua chave estará disponível, sem necessidade de recadastrar.</li>
                <li>Você pode cadastrar, ativar, testar e remover chaves a qualquer momento na aba API das configurações.</li>
              </ul>
            </div>
          </Box>
        ) : (
          <Stack spacing={2}>
            {apis.map(api => (
              <Box key={api.id} display="flex" alignItems="center" gap={2} p={2} border={1} borderColor={api.is_active ? 'success.main' : 'grey.300'} borderRadius={1} bgcolor={api.is_active ? '#e8f5e9' : '#fff'}>
                <Chip label={t(`llmProviders.${api.provider}`)} color={api.is_active ? 'success' : 'default'} size="small" />
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{api.api_key.slice(0, 6)}...{api.api_key.slice(-4)}</Typography>
                <Chip label={api.is_active ? t('llmApisManager.active') : t('llmApisManager.inactive')} color={api.is_active ? 'success' : 'default'} size="small" />
                <Chip label={t(`llmApisManager.${api.test_status}`)} color={api.test_status === 'success' ? 'success' : api.test_status === 'failure' ? 'error' : 'default'} size="small" />
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default UserLlmApisManager;
