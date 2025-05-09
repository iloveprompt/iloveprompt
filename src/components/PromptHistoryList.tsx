
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { pt, enUS, es } from 'date-fns/locale';
import { Trash, Copy, Eye } from 'lucide-react';

interface PromptHistoryListProps {
  onSelectPrompt?: (prompt: any) => void;
}

const PromptHistoryList: React.FC<PromptHistoryListProps> = ({ onSelectPrompt }) => {
  const { t, language } = useLanguage();
  const { prompts, isLoading, error, deletePrompt, refreshPrompts } = usePromptHistory();
  const { toast } = useToast();

  const dateLocale = language === 'pt' ? pt : language === 'es' ? es : enUS;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PP', { locale: dateLocale });
  };

  const handleDelete = async (promptId: string) => {
    const success = await deletePrompt(promptId);
    if (success) {
      toast({
        title: t('promptGenerator.history.deleted'),
        description: t('promptGenerator.history.deleteSuccess'),
      });
    } else {
      toast({
        title: t('promptGenerator.history.error'),
        description: t('promptGenerator.history.deleteError'),
        variant: 'destructive',
      });
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: t('promptGenerator.generate.copied'),
      description: t('promptGenerator.generate.copiedToClipboard'),
    });
  };

  const handleSelect = (prompt: any) => {
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardHeader>
          <CardTitle>{t('promptGenerator.history.error')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('promptGenerator.history.fetchError')}</p>
          <Button 
            onClick={() => refreshPrompts()} 
            className="mt-4"
          >
            {t('promptGenerator.history.retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (prompts.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>{t('promptGenerator.history.noPrompts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('promptGenerator.history.emptyDescription')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {prompts.map((prompt) => (
        <Card key={prompt.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{prompt.title}</CardTitle>
            <CardDescription>
              {formatDate(prompt.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-28 overflow-hidden text-sm text-gray-600 font-mono">
              {prompt.content.substring(0, 200)}
              {prompt.content.length > 200 && '...'}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-gray-50 p-2">
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleCopy(prompt.content)}
                className="mr-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                {t('promptGenerator.generate.copy')}
              </Button>
              {onSelectPrompt && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSelect(prompt)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t('promptGenerator.history.view')}
                </Button>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDelete(prompt.id)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PromptHistoryList;
