import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wand2, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { enhancePrompt } from '@/services/llmService';
import { toast } from '@/components/ui/use-toast';
import { useLlm } from '@/contexts/LlmContext';

interface AIAssistantPanelProps {
  open: boolean;
  onClose: () => void;
  items: { id: string; label: string; description?: string }[];
  title?: string;
}

const ITEMS_PER_PAGE = 6; // 2 colunas x 3 linhas

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ open, onClose, items, title }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ia' | 'system'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showMultipleSelectionConfirm, setShowMultipleSelectionConfirm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [contextDetails, setContextDetails] = useState<{ label: string; description: string }[]>([]);

  // Obter nome do usuário logado
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'usuário';

  const { llms } = useLlm();
  const activeLlm = llms.find(l => l.is_active);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      // Wait a bit before resetting to avoid visual glitches
      const timer = setTimeout(() => {
        setShowChat(false);
        setShowMultipleSelectionConfirm(false);
        setSelectedItem(null);
        setChatHistory([]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Format selected items for display
  const formatSelectedItemsText = () => {
    const selectedLabels = selectedItems.map(id => {
      const item = items.find(i => i.id === id);
      return item?.label || '';
    });

    if (selectedLabels.length === 0) return '';
    if (selectedLabels.length === 1) return selectedLabels[0];
    
    const lastLabel = selectedLabels.pop();
    return `${selectedLabels.join(', ')} e ${lastLabel}`;
  };

  const handleSelect = (id: string) => {
    // Toggle item selection
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleConfirmSelection = async () => {
    if (selectedItems.length === 0) {
      toast({
        description: "Por favor, selecione pelo menos um item para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setHasError(false);
    
    // Get selected items details
    const selectedItemsDetails = selectedItems.map(id => {
      const item = items.find(i => i.id === id);
      return {
        label: item?.label || '',
        description: item?.description || ''
      };
    });
    
    setContextDetails(selectedItemsDetails);
    
    // Mensagem única combinada
    const selectedTopicsText = formatSelectedItemsText();
    const contextMsg = `Contexto: ${selectedItemsDetails.map(item => `${item.label}${item.description ? ' - ' + item.description : ''}`).join('; ')}`;
    const welcomeMessage = `Olá, ${userName}! ${contextMsg} Vejo que você está interessado em \"${selectedTopicsText}\". Eu vou te ajudar com esse tema. A seguir algumas informações importantes.`;
    
    // Mensagens iniciais
    setChatHistory([
      { sender: 'system', text: welcomeMessage }
    ]);

    try {
      // Prompt inicial com contexto explícito
      const detailPrompt = `${contextMsg}\n\nO usuário selecionou os seguintes tópicos: \n${selectedItemsDetails.map(item => `- ${item.label}${item.description ? ': ' + item.description : ''}`).join('\n')}\n\nResponda apenas sobre o contexto acima. Não mude de assunto.\nSua resposta deve ser em Português, clara, informativa e de 2-3 parágrafos.`;
      setShowChat(true);
      setShowMultipleSelectionConfirm(false);

      try {
        const aiResponse = await enhancePrompt(detailPrompt, user?.id || '');
        // Add AI detailed response
        setChatHistory(prev => [...prev, { sender: 'ia', text: aiResponse }]);
      } catch (err: any) {
        console.error('Error getting initial AI response:', err);
        // Still proceed to chat but show error message
        setChatHistory(prev => [...prev, { sender: 'ia', text: 'Não foi possível obter uma resposta detalhada da IA neste momento, mas você pode continuar a conversa digitando abaixo.' }]);
      }
    } catch (err: any) {
      console.error('Error during confirmation:', err);
      toast({
        description: "Houve um erro ao processar sua seleção. Por favor, tente novamente.",
        variant: "destructive"
      });
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };
  
  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input;
    setChatHistory((msgs) => [...msgs, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);
    setHasError(false);
    
    try {
      // Montar contexto para a IA
      const contextMsg = `Contexto: ${contextDetails.map(item => `${item.label}${item.description ? ' - ' + item.description : ''}`).join('; ')}`;
      const chatMsgs = chatHistory.map(msg => `${msg.sender === 'user' ? 'Usuário' : msg.sender === 'ia' ? 'IA' : 'Sistema'}: ${msg.text}`).join('\n');
      const fullPrompt = `${contextMsg}\n${chatMsgs}\nUsuário: ${userMessage}\n\nResponda apenas sobre o contexto acima. Não mude de assunto.`;
      const resposta = await enhancePrompt(fullPrompt, user?.id || '');
      setChatHistory((msgs) => [...msgs, { sender: 'ia', text: resposta }]);
    } catch (err: any) {
      console.error('Error during handleSend:', err);
      setHasError(true);
      setChatHistory((msgs) => [...msgs, { sender: 'ia', text: 'Erro ao obter resposta da IA. Tente novamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  const retryLastMessage = async () => {
    if (loading) return;
    
    // Find the last user message
    const lastUserMessageIndex = [...chatHistory].reverse().findIndex(msg => msg.sender === 'user');
    
    if (lastUserMessageIndex === -1) return;
    
    const lastUserMessage = chatHistory[chatHistory.length - 1 - lastUserMessageIndex];
    setLoading(true);
    setHasError(false);
    
    try {
      const resposta = await enhancePrompt(lastUserMessage.text, user?.id || '');
      // Remove last error message and add the new response
      setChatHistory((msgs) => {
        const newMsgs = [...msgs];
        // If last message is an error message, replace it
        if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].sender === 'ia' && 
            newMsgs[newMsgs.length - 1].text.includes('Erro')) {
          newMsgs.pop();
        }
        return [...newMsgs, { sender: 'ia', text: resposta }];
      });
    } catch (err: any) {
      console.error('Error during retry:', err);
      setHasError(true);
      toast({
        description: "Não foi possível obter resposta da IA. Verifique as configurações da API.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset to selection screen
  const handleBackToSelection = () => {
    setSelectedItem(null);
    setSelectedItems([]);
    setChatHistory([]);
    setShowChat(false);
    setShowMultipleSelectionConfirm(false);
    setCurrentPage(0);
  };
  
  // Selection Screen
  if (!showChat && !showMultipleSelectionConfirm) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-blue-500" /> {title || 'Assistente de IA'}
            </DialogTitle>
            <DialogDescription>
              Selecione um ou mais itens sobre os quais você tem dúvida ou precisa de ajuda:
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentItems.map((item) => (
                <Button
                  key={item.id}
                  variant={selectedItems.includes(item.id) ? "default" : "outline"}
                  className={`justify-start text-left whitespace-normal ${selectedItems.includes(item.id) ? 'bg-blue-500 text-white' : ''}`}
                  onClick={() => !loading && handleSelect(item.id)}
                  disabled={loading}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Button variant="ghost" size="icon" onClick={goToPrevPage} disabled={currentPage === 0} className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages - 1} className="h-7 w-7">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => setShowMultipleSelectionConfirm(true)} 
                disabled={selectedItems.length === 0}
                className="px-4"
              >
                Continuar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Confirmation screen for multiple selections
  if (showMultipleSelectionConfirm && !showChat) {
    const selectedItemsText = formatSelectedItemsText();
    
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-blue-500" /> Confirmar seleção
            </DialogTitle>
            <DialogDescription>
              Você selecionou: <span className="font-medium">{selectedItemsText}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-sm">
              A IA irá gerar uma resposta considerando todos estes tópicos selecionados.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMultipleSelectionConfirm(false)}>
                Voltar para seleção
              </Button>
              <Button onClick={handleConfirmSelection} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                  </>
                ) : (
                  'Confirmar e continuar'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Chat interface
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-blue-500" /> {title || 'Assistente de IA'}
          </DialogTitle>
          <DialogDescription>
            Chat de assistência especializada em Desenvolvimento de Software
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto border rounded p-6 bg-muted/50 space-y-4" style={{ minHeight: 200, maxHeight: 'none', overflowX: 'hidden' }}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-2xl px-5 py-3 shadow`}
                  style={{
                    maxWidth: '95%',
                    background: msg.sender === 'user' ? '#DBEAFE' : msg.sender === 'ia' ? '#EFF6FF' : '#F3F4F6',
                    border: msg.sender === 'ia' ? '1.5px solid #60A5FA' : msg.sender === 'system' ? '1.5px solid #E5E7EB' : undefined,
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                    fontSize: msg.sender === 'system' ? 15 : 16,
                    fontWeight: msg.sender === 'system' ? 500 : 400,
                    wordBreak: 'break-word',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.sender === 'system' && <span className="text-xs text-gray-500 font-semibold">Sistema</span>}
                    {msg.sender === 'ia' && (
                      <span className="text-xs text-blue-700 font-semibold bg-blue-100 border border-blue-400 rounded px-2 py-0.5">{activeLlm ? `${activeLlm.provider.toUpperCase()} - ${activeLlm.models?.[0]}` : 'LLM'}</span>
                    )}
                    {msg.sender === 'user' && <span className="text-xs text-gray-700 font-semibold">Você</span>}
                  </div>
                  <div className="text-base whitespace-pre-line">{msg.text}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-center my-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            )}
            {hasError && (
              <div className="flex justify-center my-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={retryLastMessage} 
                  className="text-xs flex items-center gap-1"
                  disabled={loading}
                >
                  Tentar novamente <AlertCircle className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="w-full flex flex-col gap-2 mt-2">
            <form
              className="flex gap-2 w-full"
              onSubmit={e => {
                e.preventDefault();
                if (!loading) handleSend();
              }}
            >
              <textarea
                className="flex-1 border rounded px-3 py-2 text-base min-h-[48px] resize-y"
                placeholder="Digite sua dúvida..."
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={3}
                style={{ minHeight: 48 }}
                disabled={loading}
              />
              <Button type="submit" variant="default" className="px-6 h-auto text-base font-semibold" disabled={loading || !input.trim()}>
                {loading ? 'Enviando...' : 'Enviar'}
              </Button>
            </form>
            <div className="flex justify-end w-full">
              <Button variant="ghost" size="sm" onClick={handleBackToSelection}>
                Voltar para lista de itens
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistantPanel;
