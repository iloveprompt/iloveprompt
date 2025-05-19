
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { addUserApiKey } from '../services/userSettingService';
import { useLanguage } from '@/i18n/LanguageContext';

const PROVIDERS = ['openai', 'gemini', 'groq', 'deepseek'] as const;
const MODELS = {
  openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  gemini: ['gemini-pro'],
  groq: ['llama2-70b', 'mixtral-8x7b'],
  deepseek: ['deepseek-chat', 'deepseek-coder']
} as const;

const Settings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedProvider, setSelectedProvider] = useState<typeof PROVIDERS[number]>('openai');
  const [selectedModel, setSelectedModel] = useState(MODELS.openai[0]);
  const [apiKey, setApiKey] = useState('');

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as typeof PROVIDERS[number];
    setSelectedProvider(provider);
    setSelectedModel(MODELS[provider][0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiData = {
        provider: selectedProvider,
        model: selectedModel,
        api_key: apiKey,
        user_id: user?.id || ''
      };

      await addUserApiKey(apiData);
      setApiKey('');
      // Recarrega a lista de APIs
      window.location.reload();
    } catch (error) {
      console.error('Erro no submit:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Provedor</label>
          <select value={selectedProvider} onChange={handleProviderChange}>
            {PROVIDERS.map(provider => (
              <option key={provider} value={provider}>
                {provider.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Modelo</label>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {MODELS[selectedProvider].map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Chave API</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Insira sua chave API"
          />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default Settings;
