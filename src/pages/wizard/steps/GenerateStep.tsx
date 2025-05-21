import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { savePromptToDatabase } from '@/services/promptService';
import { enhancePrompt } from '@/services/llmService';
import { FileText, Wand2, Sparkles, Loader2, CheckCircle, Circle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLlm } from '@/contexts/LlmContext';
import { generatePreviewMarkdownWithAI } from '../PromptGeneratorWizard';

interface GenerateStepProps {
  formData: any;
  markAsFinalized: () => void;
  isFinalized: boolean;
  onPromptGenerated?: (prompt: string) => void;
  onTryGeneratePrompt?: () => boolean;
  goToPromptTab?: () => void;
}

const GenerateStep: React.FC<GenerateStepProps> = ({ 
  formData,
  markAsFinalized,
  isFinalized,
  onPromptGenerated,
  onTryGeneratePrompt,
  goToPromptTab
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressStep, setProgressStep] = useState<'preparando'|'enviando'|'aguardando'|'finalizado'>('preparando');
  const [llmInfo, setLlmInfo] = useState<{provider: string, model: string}|null>(null);
  const { llms } = useLlm();
  
  // Importar os steps do wizard para exibir no modal
  const wizardSteps = [
    { id: 'project', label: t('promptGenerator.project.title') },
    { id: 'systemType', label: t('promptGenerator.systemType.title') },
    { id: 'objective', label: t('promptGenerator.objective.title') },
    { id: 'requirements', label: t('promptGenerator.requirements.title') },
    { id: 'features', label: t('promptGenerator.features.title') },
    { id: 'uxui', label: t('promptGenerator.uxui.title') },
    { id: 'stack', label: t('promptGenerator.stack.title') },
    { id: 'security', label: t('promptGenerator.security.title') },
    { id: 'codeStructure', label: t('promptGenerator.codeStructure.title') },
    { id: 'scalability', label: t('promptGenerator.scalability.title') },
    { id: 'restrictions', label: t('promptGenerator.restrictions.title') },
    { id: 'integrations', label: t('promptGenerator.integrations.title') },
  ];
  // Função para checar se o step está preenchido
  const isStepFilled = (stepId: string) => {
    switch (stepId) {
      case 'project':
        return !!formData.project?.title;
      case 'systemType':
        return !!formData.systemType?.selected && (formData.systemType.selected !== 'other' || !!formData.systemType.otherType);
      case 'objective':
        return !!formData.objective?.primaryObjective || (formData.objective?.selectedObjectives?.length > 0);
      case 'requirements':
        return (formData.requirements?.userTypes?.length > 0 || formData.requirements?.functionalRequirements?.length > 0 || formData.requirements?.nonFunctionalRequirements?.length > 0);
      case 'features':
        return (formData.features?.specificFeatures?.length > 0 || formData.features?.dynamicFeatures?.length > 0 || formData.features?.otherSpecificFeatures?.length > 0);
      case 'uxui':
        return (formData.uxui?.colorPalette?.length > 0 || formData.uxui?.visualStyle || formData.uxui?.menuType || formData.uxui?.authentication?.length > 0);
      case 'stack':
        return (formData.stack?.frontend?.length > 0 || formData.stack?.backend?.length > 0 || formData.stack?.fullstack?.length > 0 || formData.stack?.database?.length > 0 || formData.stack?.hosting?.length > 0 || formData.stack?.orm?.length > 0);
      case 'security':
        return (formData.security?.selectedSecurity?.length > 0 || formData.security?.otherSecurityFeature?.length > 0);
      case 'codeStructure':
        return (formData.codeStructure?.folderOrganization?.length > 0 || formData.codeStructure?.architecturalPattern?.length > 0 || formData.codeStructure?.bestPractices?.length > 0);
      case 'scalability':
        return (formData.scalability?.scalabilityFeatures?.length > 0 || formData.scalability?.performanceFeatures?.length > 0);
      case 'restrictions':
        return (formData.restrictions?.avoidInCode?.length > 0 || formData.restrictions?.otherRestriction?.length > 0);
      case 'integrations':
        return (formData.integrations?.selectedIntegrations?.length > 0);
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    if (onTryGeneratePrompt && !onTryGeneratePrompt()) {
      setIsGenerating(false);
      return;
    }
    // Validação obrigatória dos campos principais
    const mainObjective = formData.objective?.primaryObjective || formData.objective;
    if (!formData.systemType || (formData.systemType === 'outro' && !formData.systemTypeCustom?.trim())) {
      toast({
        title: 'Tipo de sistema obrigatório',
        description: 'Escolha um tipo de sistema ou especifique um personalizado antes de gerar o prompt.',
        variant: 'destructive'
      });
      setIsGenerating(false);
      return;
    }
    if (!mainObjective || typeof mainObjective !== 'string' || !mainObjective.trim()) {
      toast({
        title: 'Objetivo principal obrigatório',
        description: 'Preencha o objetivo principal do projeto antes de gerar o prompt.',
        variant: 'destructive'
      });
      setIsGenerating(false);
      return;
    }
    setShowProgressModal(true);
    setProgressStep('preparando');
    // Buscar LLM ativa
    let activeLlm = llms.find(l => l.is_active);
    setLlmInfo(activeLlm ? { provider: activeLlm.provider, model: activeLlm.models?.[0] || '' } : { provider: 'Desconhecido', model: '' });
    try {
      await new Promise(res => setTimeout(res, 800));
      setProgressStep('enviando');
      const prompt = generatePreviewMarkdownWithAI(formData, '', t);
      await new Promise(res => setTimeout(res, 600));
      setProgressStep('aguardando');
      let promptLLM = prompt;
      if (user) {
        try {
          promptLLM = await enhancePrompt(prompt, user.id);
        } catch (e) {
          setShowProgressModal(false);
          setIsGenerating(false);
          toast({
            title: 'Erro ao gerar com IA',
            description: 'Não foi possível gerar o prompt com a LLM ativa.',
            variant: 'destructive'
          });
          return;
        }
      }
      setGeneratedPrompt(promptLLM);
      if (onPromptGenerated) onPromptGenerated(promptLLM);
      setProgressStep('finalizado');
      await new Promise(res => setTimeout(res, 1200));
      setShowProgressModal(false);
      setIsGenerating(false);
      if (goToPromptTab) goToPromptTab();
      toast({
        title: t('promptGenerator.generate.success'),
        description: t('promptGenerator.generate.promptGenerated'),
      });
    } catch (e) {
      setShowProgressModal(false);
      setIsGenerating(false);
      toast({
        title: 'Erro ao gerar prompt',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive'
      });
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: t('promptGenerator.generate.copied'),
      description: t('promptGenerator.generate.copiedToClipboard'),
    });
  };
  
  // Novo método para melhorar o prompt com IA
  const handleEnhanceWithAI = async () => {
    if (!generatedPrompt || !user) {
      toast({
        title: "Erro",
        description: "É necessário gerar um prompt primeiro e estar logado.",
        variant: "destructive"
      });
      return;
    }
    
    setIsEnhancing(true);
    try {
      // Preparar prompt para melhoria com IA
      const enhancementPrompt = `Por favor, melhore o seguinte prompt para geração de projeto de software:
      
${generatedPrompt}

Melhore-o tornando mais detalhado, estruturado, e eficaz para gerar um resultado de alta qualidade. Mantenha a mesma estrutura geral, mas adicione detalhes técnicos e clareza onde for possível.`;

      // Chamar a API da IA ativa
      const enhancedPrompt = await enhancePrompt(enhancementPrompt, user.id);
      
      // Atualizar o prompt gerado
      setGeneratedPrompt(enhancedPrompt);
      
      toast({
        title: "Prompt melhorado com sucesso",
        description: "O prompt foi aprimorado utilizando IA.",
      });
      
      // Auto-save do prompt melhorado
      if (user) {
        try {
          setIsSaving(true);
          await savePromptToDatabase({
            user_id: user.id,
            title: `${formData.project.title || 'Prompt sem título'} (Melhorado)`,
            content: enhancedPrompt,
            wizard_data: formData,
            created_at: new Date(),
            updated_at: new Date(),
          });
        } catch (error) {
          console.error('Erro ao salvar prompt melhorado:', error);
        } finally {
          setIsSaving(false);
        }
      }
    } catch (error) {
      console.error('Erro ao melhorar prompt com IA:', error);
      toast({
        title: "Erro ao melhorar prompt",
        description: "Não foi possível melhorar o prompt. Verifique se você tem uma LLM ativa configurada.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // Método para gerar documentação com IA (placeholder)
  const handleGenerateDocumentation = async () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A geração de documentação estará disponível em breve.",
    });
  };
  
  const generatePromptFromFormData = (data: any) => {
    let prompt = '';
    // Título
    prompt += `# ${data.project.title || 'Sem título'}\n`;
    prompt += `## Informações do Projeto\n`;
    prompt += `**Autor:** ${data.project.author || 'Não especificado'}\n`;
    prompt += `**E-mail:** ${data.project.email || 'Não especificado'}\n`;
    if (data.project.url) prompt += `**URL:** ${data.project.url}\n`;
    prompt += `**Versão:** ${data.project.version || '1.0.0'}\n\n`;
    prompt += `## Tipo de Sistema\n- ${data.systemTypeCustom || data.systemType || 'Não especificado'}\n\n`;
    
    // Objective
    if (data.objective.defineObjectives) {
      prompt += `## Objetivo\n`;
      if (data.objective.primaryObjective) {
        prompt += `${data.objective.primaryObjective}\n\n`;
      }
      
      if (data.objective.selectedObjectives.length > 0) {
        prompt += `Objetivos de Negócios:\n`;
        data.objective.selectedObjectives.forEach((obj: string) => {
          if (obj === 'Other') {
            prompt += `- ${data.objective.otherObjective}\n`;
          } else {
            prompt += `- ${obj}\n`;
          }
        });
        prompt += '\n';
      }
    }
    
    // Requirements
    if (data.requirements.defineRequirements) {
      prompt += `## Requisitos\n`;
      
      if (data.requirements.userTypes.length > 0) {
        prompt += `### Tipos de Usuários:\n`;
        data.requirements.userTypes.forEach((user: string) => {
          prompt += `- ${user}\n`;
        });
        prompt += '\n';
      }
      
      if (data.requirements.functionalRequirements.length > 0) {
        prompt += `### Requisitos Funcionais:\n`;
        data.requirements.functionalRequirements.forEach((req: string) => {
          prompt += `- ${req}\n`;
        });
        prompt += '\n';
      }
      
      if (data.requirements.nonFunctionalRequirements.length > 0) {
        prompt += `### Requisitos Não Funcionais:\n`;
        data.requirements.nonFunctionalRequirements.forEach((req: string) => {
          if (req === 'Other') {
            prompt += `- ${data.requirements.otherRequirement}\n`;
          } else {
            prompt += `- ${req}\n`;
          }
        });
        prompt += '\n';
      }
    }
    
    // Stack
    prompt += `## Stack Tecnológica\n`;
    
    if (data.stack.frontend.length > 0) {
      prompt += `### Frontend:\n`;
      data.stack.frontend.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    if (data.stack.backend.length > 0) {
      prompt += `### Backend:\n`;
      data.stack.backend.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    if (data.stack.database.length > 0) {
      prompt += `### Banco de Dados:\n`;
      data.stack.database.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    if (data.stack.hosting.length > 0) {
      prompt += `### Hospedagem/Infraestrutura:\n`;
      data.stack.hosting.forEach((tech: string) => {
        prompt += `- ${tech}\n`;
      });
      prompt += '\n';
    }
    
    // Security
    if (data.security.selectedSecurity.length > 0) {
      prompt += `## Segurança\n`;
      data.security.selectedSecurity.forEach((security: string) => {
        if (security === 'Other') {
          prompt += `- ${data.security.otherSecurityFeature}\n`;
        } else {
          prompt += `- ${security}\n`;
        }
      });
      prompt += '\n';
    }
    
    // UX/UI (Design)
    if (data.uxui) {
      prompt += `## Design e UX/UI\n`;
      // Estilo Visual
      if (data.uxui.visualStyle) {
        const visualStyleLabel = t('promptGenerator.uxui.visualStyleOptions.' + data.uxui.visualStyle);
        prompt += `- Estilo Visual: ${visualStyleLabel && !visualStyleLabel.startsWith('promptGenerator') ? visualStyleLabel : data.uxui.visualStyle}\n`;
      }
      // Tipo de Menu
      if (data.uxui.menuType) {
        const menuTypeLabel = t('promptGenerator.uxui.menuTypeOptions.' + data.uxui.menuType);
        prompt += `- Tipo de Menu: ${menuTypeLabel && !menuTypeLabel.startsWith('promptGenerator') ? menuTypeLabel : data.uxui.menuType}\n`;
      }
      // Autenticação
      if (data.uxui.authentication && Array.isArray(data.uxui.authentication) && data.uxui.authentication.length > 0) {
        const authLabels = data.uxui.authentication.map((a: string) => {
          const label = t('promptGenerator.uxui.authOptions.' + a);
          return label && !label.startsWith('promptGenerator') ? label : a;
        }).join(', ');
        prompt += `- Autenticação: ${authLabels}\n`;
      }
      prompt += '\n';
    }
    
    prompt += `\nCom base nas informações acima, por favor desenvolva um prompt detalhado para o meu sistema.`;
    
    return prompt;
  };

  return (
    <>
      {/* Modal de progresso da geração do prompt via LLM */}
      <Dialog open={showProgressModal} onOpenChange={setShowProgressModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerando Prompt com IA</DialogTitle>
            <DialogDescription asChild>
              <section>
                {llmInfo && (
                  <div className="mb-2">
                    <span className="font-bold">LLM:</span> {llmInfo.provider.toUpperCase()}<br/>
                    <span className="font-bold">Modelo:</span> {llmInfo.model}
                  </div>
                )}
                {/* NOVO: Lista de steps preenchidos e não preenchidos */}
                <div className="mb-3">
                  <h4 className="font-semibold mb-1">Etapas do Wizard:</h4>
                  <ul className="grid grid-cols-2 gap-1">
                    {wizardSteps.map(step => (
                      <li key={step.id} className="flex items-center gap-2 text-xs">
                        {isStepFilled(step.id)
                          ? <CheckCircle className="text-green-500 w-4 h-4" />
                          : <Circle className="text-gray-400 w-4 h-4" />
                        }
                        <span className={isStepFilled(step.id) ? 'text-green-700 font-medium' : 'text-gray-500'}>
                          {step.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1 text-xs text-gray-500">
                    <span>Somente as etapas preenchidas serão consideradas na geração do prompt.</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <span className={progressStep==='preparando' ? 'font-bold text-blue-600' : ''}>1. Preparando dados...</span>
                  <span className={progressStep==='enviando' ? 'font-bold text-blue-600' : ''}>2. Enviando para LLM...</span>
                  <span className={progressStep==='aguardando' ? 'font-bold text-blue-600' : ''}>3. Aguardando resposta da IA...</span>
                  <span className={progressStep==='finalizado' ? 'font-bold text-green-600' : ''}>4. Prompt gerado!</span>
                </div>
              </section>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="flex flex-row gap-2 mb-4 items-center">
        <Button 
          onClick={handleGenerate} 
          className="flex items-center gap-2 px-4 py-2 text-sm"
          disabled={isGenerating || isSaving || isEnhancing}
          size="sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {t('promptGenerator.generate.generating')}
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" /> {t('promptGenerator.generate.createPrompt')}
            </>
          )}
        </Button>
        <Button 
          onClick={handleGenerateDocumentation}
          disabled={!generatedPrompt || isGenerating || isSaving || isEnhancing}
          className="flex items-center gap-2 px-4 py-2 text-sm"
          size="sm"
        >
          <FileText className="h-4 w-4" />
          {t('promptGenerator.generate.generateDocs') || 'Gerar Documentação'}
        </Button>
        <Button 
          onClick={handleEnhanceWithAI}
          disabled={!generatedPrompt || isGenerating || isSaving || isEnhancing}
          className="flex items-center gap-2 px-4 py-2 text-sm"
          size="sm"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Melhorando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> {t('promptGenerator.generate.enhanceWithAI') || 'Melhorar com IA'}
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default GenerateStep;
