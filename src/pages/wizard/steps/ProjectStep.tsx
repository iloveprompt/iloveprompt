import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { pt, enUS } from 'date-fns/locale';

interface ProjectFormData {
  title: string;
  author: string;
  email: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

interface ProjectStepProps {
  formData: ProjectFormData;
  updateFormData: (data: Partial<ProjectFormData>) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const ProjectStep: React.FC<ProjectStepProps> = ({ 
  formData, 
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  const { t, language } = useLanguage();
  
  const dateLocale = language === 'pt' ? pt : enUS;
  
  const formatDate = (date: Date) => {
    return format(date, 'PPpp', {
      locale: dateLocale,
    });
  };

  const handleReset = () => {
    resetStep();
  };

  const handleSaveAndFinalize = () => {
    // Basic validation: check if title is filled
    if (formData.title.trim() === '') {
      alert(t('promptGenerator.project.titleRequiredError') || "O título do projeto é obrigatório.");
      return;
    }
    markAsFinalized();
  };

  return (
    <div className="space-y-6">
      <Card className={`p-4 sm:p-6 relative${isFinalized ? ' border-2 border-green-500' : ''}`}>
        <CardHeader className="px-0 pt-0 sm:px-0 sm:pt-0">
          <div className="flex justify-between items-start"> {/* Changed items-center to items-start */}
            <div>
              <CardTitle className="mb-1">{t('promptGenerator.project.title') || "Informações do Projeto"}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('promptGenerator.project.description') || "Informações básicas sobre seu projeto"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2"> {/* Group for version, buttons, and checkmark */}
              <div className="text-right mr-2"> {/* Version display */}
                <span className="block text-xs text-muted-foreground">
                  {t('promptGenerator.project.version') || "Versão"}
                </span>
                <span className="block text-sm font-semibold text-foreground">
                  {formData.version}
                </span>
              </div>
              {/* Action Buttons Moved Here */}
              <Button variant="outline" onClick={handleReset} size="icon" className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">{t('common.reset') || "Resetar"}</span>
              </Button>
              <Button 
                onClick={handleSaveAndFinalize} 
                size="icon" 
                className="h-8 w-8"
                disabled={isFinalized || !formData.title.trim()}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">{isFinalized ? (t('common.finalized') || "Finalizado") : (t('common.saveAndFinalize') || "Salvar e Finalizar")}</span>
              </Button>
              {isFinalized && <CheckCircle className="h-6 w-6 text-green-500 ml-2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0 sm:pb-0 space-y-0"> {/* Removed pt-4 */}
          <div className="space-y-0 py-0 my-0">
            <Label htmlFor="project-title" className="text-sm font-medium text-foreground">
              {t('promptGenerator.project.projectTitle') || "Título do Projeto"} <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="project-title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder={t('promptGenerator.project.projectTitlePlaceholder') || "Nome do projeto"}
              required
            />
          </div>
          
          <div className="space-y-0 py-0 my-0 mt-4">
            <Label htmlFor="project-author" className="text-sm font-medium text-foreground">
              {t('promptGenerator.project.author') || "Autor"}
            </Label>
            <Input 
              id="project-author"
              value={formData.author}
              onChange={(e) => updateFormData({ author: e.target.value })}
              placeholder={t('promptGenerator.project.authorPlaceholder') || "Seu nome"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-0 my-0 mt-4">
            <div className="space-y-0">
              <Label htmlFor="project-email" className="text-sm font-medium text-foreground">
                {t('promptGenerator.project.email') || "Email"}
              </Label>
              <Input 
                id="project-email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-0">
              <Label htmlFor="project-url" className="text-sm font-medium text-foreground">
                {t('promptGenerator.project.url') || "Website"} <span className="text-xs text-muted-foreground">({t('common.optional') || "Opcional"})</span>
              </Label>
              <Input 
                id="project-url"
                value={formData.url || ''}
                onChange={(e) => updateFormData({ url: e.target.value })}
                placeholder={t('promptGenerator.project.urlPlaceholder') || "URL do seu site"}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-0 my-0 mt-4">
            <div className="space-y-0">
              <Label htmlFor="created-date" className="text-sm font-medium text-foreground">
                {t('promptGenerator.project.createdDate') || "Data de Criação"}
              </Label>
              <Input 
                id="created-date"
                value={formatDate(formData.createdAt)}
                disabled
                className="bg-muted/50"
              />
            </div>
            
            <div className="space-y-0">
              <Label htmlFor="updated-date" className="text-sm font-medium text-foreground">
                {t('promptGenerator.project.updatedDate') || "Última Atualização"}
              </Label>
              <Input 
                id="updated-date"
                value={formatDate(formData.updatedAt)}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>

        </CardContent>
        {/* Action Buttons DIV removed from here */}
      </Card>
    </div>
  );
};

export default ProjectStep;
