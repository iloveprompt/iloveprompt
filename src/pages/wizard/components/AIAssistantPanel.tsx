import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface AIAssistantPanelProps {
  prompt: string;
  language: string;
  contextData?: any;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  prompt,
  language,
  contextData
}) => {
  const { toast } = useToast();

  const handleGenerateIdeas = async () => {
    try {
      // Simulate an API call to generate ideas
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              ideas: [
                "Implement a dark mode for better user experience.",
                "Add more detailed tooltips to guide new users.",
                "Incorporate user feedback surveys for continuous improvement."
              ]
            }
          });
        }, 1500); // Simulate a 1.5 second API call
      });

      const ideas = (response as any).data.ideas;

      // Display the generated ideas using the toast
      ideas.forEach((idea: string) => {
        toast({
          title: "AI-Generated Idea",
          description: idea,
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
      });
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>
      <p className="text-sm text-gray-500 mb-4">
        {language === 'pt' ? 'Precisa de ajuda? Peça ao assistente de IA!' :
         language === 'es' ? '¿Necesitas ayuda? ¡Pregúntale al asistente de IA!' :
         'Need help? Ask the AI assistant!'}
      </p>
      <Button onClick={handleGenerateIdeas}>
        {language === 'pt' ? 'Gerar Ideias' :
         language === 'es' ? 'Generar Ideas' :
         'Generate Ideas'}
      </Button>
    </div>
  );
};

export default AIAssistantPanel;
