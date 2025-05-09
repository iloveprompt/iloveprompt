
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { pt, enUS } from 'date-fns/locale';

interface ProjectStepProps {
  formData: {
    title: string;
    author: string;
    email: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    version: string;
  };
  updateFormData: (data: Partial<ProjectStepProps['formData']>) => void;
}

const ProjectStep: React.FC<ProjectStepProps> = ({ formData, updateFormData }) => {
  const { t, language } = useLanguage();
  
  const dateLocale = language === 'pt' ? pt : enUS;
  
  const formatDate = (date: Date) => {
    return format(date, 'PPpp', {
      locale: dateLocale,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('promptGenerator.project.title')}</CardTitle>
          <CardDescription>
            {t('promptGenerator.project.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-title" className="text-base font-medium">
              {t('promptGenerator.project.projectTitle')} <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="project-title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder={t('promptGenerator.project.projectTitlePlaceholder')}
              className="text-base"
              required
            />
            <p className="text-sm text-gray-500">
              {t('promptGenerator.project.projectTitleHelp')}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project-author" className="text-base font-medium">
              {t('promptGenerator.project.author')}
            </Label>
            <Input 
              id="project-author"
              value={formData.author}
              onChange={(e) => updateFormData({ author: e.target.value })}
              placeholder={t('promptGenerator.project.authorPlaceholder')}
              className="text-base"
            />
            <p className="text-sm text-gray-500">
              {t('promptGenerator.project.authorHelp')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-email" className="text-base font-medium">
              {t('promptGenerator.project.email')}
            </Label>
            <Input 
              id="project-email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              disabled
              className="text-base bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-url" className="text-base font-medium">
              {t('promptGenerator.project.url')} <span className="text-sm text-gray-500">({t('promptGenerator.common.optional')})</span>
            </Label>
            <Input 
              id="project-url"
              value={formData.url || ''}
              onChange={(e) => updateFormData({ url: e.target.value })}
              placeholder={t('promptGenerator.project.urlPlaceholder')}
              className="text-base"
            />
            <p className="text-sm text-gray-500">
              {t('promptGenerator.project.urlHelp')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="created-date" className="text-base font-medium">
                {t('promptGenerator.project.createdDate')}
              </Label>
              <Input 
                id="created-date"
                value={formatDate(formData.createdAt)}
                disabled
                className="text-base bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="updated-date" className="text-base font-medium">
                {t('promptGenerator.project.updatedDate')}
              </Label>
              <Input 
                id="updated-date"
                value={formatDate(formData.updatedAt)}
                disabled
                className="text-base bg-gray-50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project-version" className="text-base font-medium">
              {t('promptGenerator.project.version')}
            </Label>
            <Input 
              id="project-version"
              value={formData.version}
              disabled
              className="text-base bg-gray-50 w-32"
            />
            <p className="text-sm text-gray-500">
              {t('promptGenerator.project.versionHelp')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectStep;
