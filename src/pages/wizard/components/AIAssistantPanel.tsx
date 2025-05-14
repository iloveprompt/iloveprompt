import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { enhancePrompt } from '@/services/llmService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIAssistantPanelProps {
  formData: any;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ formData }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [aiResponse, setAiResponse] = useState<string>('');
  const [userMessage, setUserMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Adicione um estado para controlar quando o chat deve ser exibido
  const [showChat, setShowChat] = useState(false);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userMessage.trim()) return;

    setMessageLoading(true);
    try {
      // Aqui você pode adicionar lógica para enviar a mensagem do usuário e receber uma resposta da IA
      // Por exemplo, você pode usar a função enhancePrompt para obter uma resposta com base na mensagem do usuário
      const combinedPrompt = `Com base nas informações do projeto:\n${JSON.stringify(formData)}\n\nPergunta do usuário: ${userMessage}`;
      const aiAnswer = await enhancePrompt(combinedPrompt, user?.id || '');
      setAiResponse(prevResponse => prevResponse + '\n\n' + aiAnswer);
      setUserMessage(''); // Limpa a mensagem após o envio
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Erro ao enviar a mensagem');
    } finally {
      setMessageLoading(false);
    }
  };

  // Modifique a função de processamento para mostrar o chat mesmo em caso de erro
  const processData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Chame a API para processar os dados
      const enhancedPrompt = await enhancePrompt(JSON.stringify(formData), user?.id || '');
      setAiResponse(enhancedPrompt);
      setShowChat(true); // Sempre mostrar o chat após processamento, mesmo com erro
    } catch (err: any) {
      console.error('Error processing data:', err);
      setError(err.message || 'Erro ao processar os dados');
      // Ainda mostramos o chat mesmo com erro
      setShowChat(true);
    } finally {
      setLoading(false);
    }
  };

  // No render, mostre o chat baseado no estado showChat, não apenas quando há resposta
  return (
    <div className="h-full flex flex-col">
      {!showChat ? (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <h2 className="text-xl font-semibold mb-4">{t('promptGenerator.assistant.title')}</h2>
          <p className="text-center mb-6">{t('promptGenerator.assistant.description')}</p>
          <Button 
            onClick={processData} 
            className="w-full md:w-auto" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('promptGenerator.assistant.processing')}
              </>
            ) : (
              t('promptGenerator.assistant.continueButton')
            )}
          </Button>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4 bg-gray-50 rounded-md">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="prose max-w-none">
                {error ? (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md mb-4">
                    {error}
                    <p className="mt-2">Você ainda pode fazer perguntas sobre seu projeto.</p>
                  </div>
                ) : null}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {aiResponse || t('promptGenerator.assistant.defaultMessage')}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={t('promptGenerator.assistant.messagePlaceholder')}
                className="flex-1"
              />
              <Button type="submit" disabled={!userMessage.trim() || messageLoading}>
                {messageLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPanel;
