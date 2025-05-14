import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wand2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { enhancePrompt } from '@/services/llmService';

interface AIAssistantPanelProps {
  open: boolean;
  onClose: () => void;
  items: { id: string; label: string; description?: string }[];
  title?: string;
}

const ITEMS_PER_PAGE = 6; // 2 colunas x 3 linhas

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ open, onClose, items, title }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ia'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Obter nome do usuário logado
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'usuário';

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  useEffect(() => {
    if (selectedItem) {
      const item = items.find(i => i.id === selectedItem);
      setChatMessages([
        {
          sender: 'ia',
          text: `Olá, ${userName}! Você selecionou "${item?.label}". ${item?.description ? 'Descrição: ' + item.description : ''} Como posso ajudar?`,
        },
      ]);
      setInput('');
    }
  }, [selectedItem, userName]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSelect = async (id: string) => {
    setSelectedItem(id);
    const item = items.find(i => i.id === id);
    setChatMessages([]); // Limpa o chat ao selecionar novo item
    setLoading(true);
    try {
      // Envia o label/descrição do item como primeira pergunta para a LLM
      const pergunta = item?.label + (item?.description ? (': ' + item.description) : '');
      const resposta = await enhancePrompt(pergunta, user?.id);
      setChatMessages([
        { sender: 'user', text: pergunta },
        { sender: 'ia', text: resposta },
        { sender: 'ia', text: 'Como posso ajudar?' }
      ]);
    } catch (err: any) {
      setChatMessages([
        { sender: 'user', text: item?.label || '' },
        { sender: 'ia', text: 'Erro ao obter resposta da IA. Tente novamente.' }
      ]);
    } finally {
      setLoading(false);
    }
    setInput('');
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    setSelectedItem(null);
  };
  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    setSelectedItem(null);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setChatMessages((msgs) => [
      ...msgs,
      { sender: 'user', text: input },
    ]);
    setInput('');
    setLoading(true);
    try {
      const resposta = await enhancePrompt(input, user?.id);
      setChatMessages((msgs) => [
        ...msgs,
        { sender: 'ia', text: resposta }
      ]);
    } catch (err: any) {
      setChatMessages((msgs) => [
        ...msgs,
        { sender: 'ia', text: 'Erro ao obter resposta da IA. Tente novamente.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-blue-500" /> {title || 'Assistente de IA'}
          </DialogTitle>
          <DialogDescription>
            Sobre qual item você tem dúvida ou precisa de ajuda?
          </DialogDescription>
        </DialogHeader>
        {!selectedItem ? (
          <div className="flex flex-col gap-2 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentItems.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="justify-start text-left whitespace-normal"
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
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-2 h-72">
            <div className="flex-1 overflow-y-auto border rounded p-2 bg-muted/50" style={{ minHeight: 180 }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`} >
                  <div className={`rounded px-3 py-1 max-w-xs ${msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`} >
                    <span className="text-xs">{msg.text}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form
              className="flex gap-2 mt-2"
              onSubmit={e => {
                e.preventDefault();
                if (!loading) handleSend();
              }}
            >
              <textarea
                className="flex-1 border rounded px-2 py-2 text-sm min-h-[48px] resize-y"
                placeholder="Digite sua dúvida..."
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={3}
                style={{ minHeight: 48 }}
                disabled={loading}
              />
              <Button type="submit" variant="default" className="px-4 h-auto" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</Button>
            </form>
            <div className="flex justify-end mt-1">
              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                Voltar para lista de itens
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistantPanel; 