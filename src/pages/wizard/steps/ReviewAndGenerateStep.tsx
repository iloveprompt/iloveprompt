
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Copy, Download, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from '@/components/ui/use-toast';

interface ReviewAndGenerateStepProps {
  formData: any;
  handleSaveProgress: () => void;
}

const ReviewAndGenerateStep: React.FC<ReviewAndGenerateStepProps> = ({
  formData,
  handleSaveProgress
}) => {
  const { t } = useLanguage();
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const generatePrompt = () => {
    setIsGenerating(true);
    
    // Simulate prompt generation (in reality, this would call an API)
    setTimeout(() => {
      // Basic prompt assembly - in a real implementation this would be more sophisticated
      const prompt = `
# Project Prompt: ${formData.projectName || 'Untitled Project'}

## Project Description
${formData.projectDescription || 'No description provided.'}

## Selected Features
${formData.selectedFeatures?.join(', ') || 'None selected'}
${formData.customFeatures?.length > 0 ? `\n### Custom Features\n${formData.customFeatures.join('\n')}` : ''}

## Color Palette
Primary: ${formData.primaryColor || 'Not specified'}
Secondary: ${formData.secondaryColor || 'Not specified'}
Accent: ${formData.accentColor || 'Not specified'}

## Visual Style
${formData.visualStyle || 'Not specified'}

## Integrations
${formData.selectedIntegrations?.join(', ') || 'None selected'}

## Additional Requirements
${formData.otherUXUIRequirements?.join('\n') || 'None specified'}
      `;
      
      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      handleSaveProgress();
    }, 2000);
  };
  
  const handleCopyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast({
        title: t('promptGenerator.review.promptCopied') || "Prompt copiado!",
        description: t('promptGenerator.review.promptCopiedDesc') || "O prompt foi copiado para a área de transferência.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleDownload = () => {
    if (generatedPrompt) {
      const blob = new Blob([generatedPrompt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.projectName || 'project'}-prompt.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: t('promptGenerator.review.promptDownloaded') || "Prompt baixado!",
        description: t('promptGenerator.review.promptDownloadedDesc') || "O arquivo com o prompt foi baixado com sucesso.",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0 pb-4">
          <CardTitle>{t('promptGenerator.review.title') || "Revisar e Gerar"}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {t('promptGenerator.review.description') || "Revise os detalhes do projeto e gere seu prompt"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="project-details">
              <AccordionTrigger className="text-base font-medium">
                {t('promptGenerator.projectDetails.title') || "Detalhes do Projeto"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium">
                      {t('promptGenerator.projectDetails.projectName') || "Nome do Projeto"}
                    </h4>
                    <p className="text-sm">{formData.projectName || 'Não especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      {t('promptGenerator.projectDetails.projectDescription') || "Descrição do Projeto"}
                    </h4>
                    <p className="text-sm">{formData.projectDescription || 'Não especificado'}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="features">
              <AccordionTrigger className="text-base font-medium">
                {t('promptGenerator.features.title') || "Features"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {formData.selectedFeatures?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {formData.selectedFeatures.map((feature: string) => (
                        <li key={feature} className="text-sm">{feature}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">Nenhuma feature selecionada</p>
                  )}
                  
                  {formData.customFeatures?.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Features Personalizadas</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {formData.customFeatures.map((feature: string, index: number) => (
                          <li key={index} className="text-sm">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="uxui">
              <AccordionTrigger className="text-base font-medium">
                {t('promptGenerator.uxui.title') || "UX/UI"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium">Estilo Visual</h4>
                    <p className="text-sm">{formData.visualStyle || 'Não especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Cores</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.primaryColor && (
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300" 
                            style={{ backgroundColor: formData.primaryColor }}
                          ></div>
                          <span className="text-xs">Primária: {formData.primaryColor}</span>
                        </div>
                      )}
                      {formData.secondaryColor && (
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300" 
                            style={{ backgroundColor: formData.secondaryColor }}
                          ></div>
                          <span className="text-xs">Secundária: {formData.secondaryColor}</span>
                        </div>
                      )}
                      {formData.accentColor && (
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300" 
                            style={{ backgroundColor: formData.accentColor }}
                          ></div>
                          <span className="text-xs">Destaque: {formData.accentColor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="integrations">
              <AccordionTrigger className="text-base font-medium">
                {t('promptGenerator.integrations.title') || "Integrações"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {formData.selectedIntegrations?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {formData.selectedIntegrations.map((integration: string) => (
                        <li key={integration} className="text-sm">{integration}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">Nenhuma integração selecionada</p>
                  )}
                  
                  {formData.otherIntegrations?.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Outras Integrações</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {formData.otherIntegrations.map((integration: string, index: number) => (
                          <li key={index} className="text-sm">{integration}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="my-6 space-y-4">
            {!generatedPrompt ? (
              <Button 
                onClick={generatePrompt} 
                className="w-full py-6" 
                disabled={isGenerating}
              >
                {isGenerating 
                  ? (t('promptGenerator.review.generating') || "Gerando...")
                  : (t('promptGenerator.review.generatePrompt') || "Gerar Prompt")}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{t('promptGenerator.review.generatedPrompt') || "Prompt Gerado"}</h3>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8" 
                        onClick={handleCopyToClipboard}
                      >
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {copied 
                          ? (t('promptGenerator.review.copied') || "Copiado") 
                          : (t('promptGenerator.review.copy') || "Copiar")}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8" 
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {t('promptGenerator.review.download') || "Baixar"}
                      </Button>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap text-sm bg-background p-3 rounded border max-h-96 overflow-y-auto">
                    {generatedPrompt}
                  </div>
                </div>
                
                <Button onClick={generatePrompt} variant="outline" className="w-full">
                  {t('promptGenerator.review.regenerate') || "Regenerar Prompt"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewAndGenerateStep;
