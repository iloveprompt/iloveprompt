
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import PromptHistoryList from '@/components/PromptHistoryList';
import { ArrowLeft } from 'lucide-react';

const PromptHistoryPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('promptGenerator.generate.copied'),
      description: t('promptGenerator.generate.copiedToClipboard'),
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => window.history.back()}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('promptGenerator.history.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('promptGenerator.history.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('promptGenerator.history.yourPrompts')}</CardTitle>
              <CardDescription>
                {t('promptGenerator.history.promptsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromptHistoryList onSelectPrompt={setSelectedPrompt} />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {selectedPrompt ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedPrompt.title}</CardTitle>
                <CardDescription>
                  {t('promptGenerator.history.generatedOn')} {new Date(selectedPrompt.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4 bg-gray-50">
                  <h3 className="font-semibold mb-2">{t('promptGenerator.generate.result')}</h3>
                  <Textarea 
                    value={selectedPrompt.content}
                    readOnly
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleCopyToClipboard(selectedPrompt.content)} 
                    variant="outline"
                  >
                    {t('promptGenerator.generate.copyToClipboard')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('promptGenerator.history.noPromptSelected')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  {t('promptGenerator.history.selectPromptInstruction')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptHistoryPage;
