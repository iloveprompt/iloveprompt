import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { enhancePrompt } from '@/services/llmService';
import { toast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ObjectiveStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  markAsFinalized: () => void;
  isFinalized: boolean;
}

const ObjectiveStep: React.FC<ObjectiveStepProps> = ({
  formData,
  updateFormData,
  markAsFinalized,
  isFinalized,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [primaryObjective, setPrimaryObjective] = useState(formData.objective?.primaryObjective || '');
  const [defineObjectives, setDefineObjectives] = useState(formData.objective?.defineObjectives || false);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>(formData.objective?.selectedObjectives || []);
  const [otherObjective, setOtherObjective] = useState(formData.objective?.otherObjective || '');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedObjectives([...selectedObjectives, value]);
    } else {
      setSelectedObjectives(selectedObjectives.filter((item) => item !== value));
    }
  };

  const handleDefineObjectivesChange = (checked: boolean) => {
    setDefineObjectives(checked);
    updateFormData({
      ...formData,
      objective: {
        ...formData.objective,
        defineObjectives: checked,
      },
    });
  };

  const handlePrimaryObjectiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPrimaryObjective(value);
    updateFormData({
      ...formData,
      objective: {
        ...formData.objective,
        primaryObjective: value,
      },
    });
  };

  const handleOtherObjectiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setOtherObjective(value);
    updateFormData({
      ...formData,
      objective: {
        ...formData.objective,
        otherObjective: value,
      },
    });
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherObjective(event.target.value);
  };

  const isOtherSelected = selectedObjectives.includes('Other');

  React.useEffect(() => {
    updateFormData({
      ...formData,
      objective: {
        defineObjectives,
        primaryObjective,
        selectedObjectives,
        otherObjective,
      },
    });
  }, [defineObjectives, primaryObjective, selectedObjectives, otherObjective, updateFormData, formData]);

  const enhanceWithAI = async (objective: string, setObjective: (value: string) => void, userId: string) => {
    if (!objective.trim()) {
      toast({
        title: "Erro",
        description: "É necessário definir um objetivo primeiro.",
        variant: "destructive"
      });
      return false;
    }

    if (!userId) {
      toast({
        title: "Usuário não autenticado",
        description: "É necessário estar logado para usar esta funcionalidade.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Preparar prompt para melhoria com IA
      const enhancementPrompt = `Melhore o seguinte objetivo de projeto de software, tornando-o mais claro, específico e alinhado com boas práticas de engenharia de software:

"${objective}"

Por favor, reescreva mantendo a essência do objetivo, mas adicionando mais clareza, precisão técnica e detalhes relevantes. Limite a resposta a um parágrafo conciso.`;

      // Chamar a API da IA ativa
      const enhancedObjective = await enhancePrompt(enhancementPrompt, userId);
      
      // Atualizar o objetivo
      setObjective(enhancedObjective);
      
      toast({
        title: "Objetivo melhorado",
        description: "O objetivo foi aprimorado utilizando IA.",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao melhorar objetivo com IA:', error);
      toast({
        title: "Erro ao melhorar objetivo",
        description: "Não foi possível melhorar o objetivo. Verifique se você tem uma LLM ativa configurada.",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('promptGenerator.objective.title')}</CardTitle>
          <CardDescription>
            {t('promptGenerator.objective.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                id="defineObjectives"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={defineObjectives}
                onChange={(e) => handleDefineObjectivesChange(e.target.checked)}
              />
              <label
                htmlFor="defineObjectives"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('promptGenerator.objective.defineObjectives')}
              </label>
            </div>
            <Card className="ml-6">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryObjective">{t('promptGenerator.objective.primaryObjectiveLabel')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryObjective"
                      placeholder={t('promptGenerator.objective.primaryObjectivePlaceholder')}
                      value={primaryObjective}
                      onChange={handlePrimaryObjectiveChange}
                      disabled={!defineObjectives}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        setIsEnhancing(true);
                        await enhanceWithAI(primaryObjective, setPrimaryObjective, user?.id || '');
                        setIsEnhancing(false);
                      }}
                      disabled={isEnhancing || !primaryObjective.trim() || !user}
                      className="flex items-center gap-2"
                    >
                      {isEnhancing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Melhorando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Melhorar com IA
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('promptGenerator.objective.businessObjectives')}</Label>
                  <div className="ml-4 space-y-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="IncreaseRevenue"
                          value="IncreaseRevenue"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedObjectives.includes('IncreaseRevenue')}
                          onChange={handleCheckboxChange}
                          disabled={!defineObjectives}
                        />
                        <label
                          htmlFor="IncreaseRevenue"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('promptGenerator.objective.increaseRevenue')}
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="ReduceCosts"
                          value="ReduceCosts"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedObjectives.includes('ReduceCosts')}
                          onChange={handleCheckboxChange}
                          disabled={!defineObjectives}
                        />
                        <label
                          htmlFor="ReduceCosts"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('promptGenerator.objective.reduceCosts')}
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="ImproveCustomerSatisfaction"
                          value="ImproveCustomerSatisfaction"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedObjectives.includes('ImproveCustomerSatisfaction')}
                          onChange={handleCheckboxChange}
                          disabled={!defineObjectives}
                        />
                        <label
                          htmlFor="ImproveCustomerSatisfaction"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('promptGenerator.objective.improveCustomerSatisfaction')}
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="IncreaseMarketShare"
                          value="IncreaseMarketShare"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedObjectives.includes('IncreaseMarketShare')}
                          onChange={handleCheckboxChange}
                          disabled={!defineObjectives}
                        />
                        <label
                          htmlFor="IncreaseMarketShare"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('promptGenerator.objective.increaseMarketShare')}
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="Other"
                          value="Other"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedObjectives.includes('Other')}
                          onChange={handleCheckboxChange}
                          disabled={!defineObjectives}
                        />
                        <label
                          htmlFor="Other"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('promptGenerator.objective.other')}
                        </label>
                      </div>
                      {isOtherSelected && (
                        <div className="ml-6 mt-2">
                          <Textarea
                            placeholder={t('promptGenerator.objective.otherObjectivePlaceholder')}
                            value={otherObjective}
                            onChange={handleTextareaChange}
                            disabled={!defineObjectives}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectiveStep;
