
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface StackStepProps {
  formData: {
    frontend: string[];
    backend: string[];
    database: string[];
    hosting: string[];
  };
  updateFormData: (data: Partial<StackStepProps['formData']>) => void;
}

const frontendOptions = [
  'React', 'Angular', 'Vue.js', 'Next.js', 'Nuxt.js', 'Svelte',
  'Ember.js', 'Backbone.js', 'jQuery', 'Vanilla JavaScript',
  'TypeScript', 'Bootstrap', 'Tailwind CSS', 'Material UI',
  'Chakra UI', 'Redux', 'MobX', 'React Query'
];

const backendOptions = [
  'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI',
  'Ruby on Rails', 'Spring Boot', 'Laravel', 'ASP.NET Core',
  'Phoenix (Elixir)', 'Gin (Go)', 'Echo (Go)', 'Play Framework',
  'Kotlin with Ktor', 'PHP', 'WordPress'
];

const databaseOptions = [
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
  'Microsoft SQL Server', 'MariaDB', 'CouchDB', 'Firestore',
  'Elasticsearch', 'Cassandra', 'DynamoDB', 'Fauna'
];

const hostingOptions = [
  'AWS', 'Google Cloud', 'Microsoft Azure', 'Heroku', 'Vercel',
  'Netlify', 'Digital Ocean', 'Firebase', 'GitHub Pages',
  'Cloudflare', 'Render', 'OVHcloud', 'Linode', 'Kubernetes'
];

const StackStep: React.FC<StackStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  const [showingTech, setShowingTech] = React.useState<string | null>(null);
  
  const handleToggleTech = (category: string) => {
    setShowingTech(showingTech === category ? null : category);
  };
  
  const handleTechToggle = (category: keyof typeof formData, tech: string) => {
    if (formData[category].includes(tech)) {
      updateFormData({
        [category]: formData[category].filter(item => item !== tech)
      });
    } else {
      updateFormData({
        [category]: [...formData[category], tech]
      });
    }
  };
  
  const handleSelectAll = (category: keyof typeof formData, options: string[]) => {
    if (formData[category].length === options.length) {
      // Deselect all
      updateFormData({ [category]: [] });
    } else {
      // Select all
      updateFormData({ [category]: [...options] });
    }
  };
  
  const getCategoryOptions = (category: string) => {
    switch(category) {
      case 'frontend':
        return frontendOptions;
      case 'backend':
        return backendOptions;
      case 'database':
        return databaseOptions;
      case 'hosting':
        return hostingOptions;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('promptGenerator.stack.title')}</CardTitle>
          <CardDescription>
            {t('promptGenerator.stack.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Frontend Section */}
          <div className="space-y-2">
            <Button 
              onClick={() => handleToggleTech('frontend')} 
              variant="outline"
              className="w-full justify-between font-semibold"
            >
              {t('promptGenerator.stack.frontend')}
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {formData.frontend.length} {t('promptGenerator.common.selected')}
              </span>
            </Button>
            
            {showingTech === 'frontend' && (
              <div className="mt-2 border rounded-md p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{t('promptGenerator.stack.frontendTitle')}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSelectAll('frontend', frontendOptions)}
                  >
                    {formData.frontend.length === frontendOptions.length ? 
                      t('promptGenerator.common.unselectAll') : 
                      t('promptGenerator.common.selectAll')}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {frontendOptions.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`frontend-${tech}`}
                        checked={formData.frontend.includes(tech)}
                        onCheckedChange={() => handleTechToggle('frontend', tech)}
                      />
                      <Label 
                        htmlFor={`frontend-${tech}`}
                        className="cursor-pointer"
                      >
                        {tech}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Backend Section */}
          <div className="space-y-2">
            <Button 
              onClick={() => handleToggleTech('backend')} 
              variant="outline"
              className="w-full justify-between font-semibold"
            >
              {t('promptGenerator.stack.backend')}
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {formData.backend.length} {t('promptGenerator.common.selected')}
              </span>
            </Button>
            
            {showingTech === 'backend' && (
              <div className="mt-2 border rounded-md p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{t('promptGenerator.stack.backendTitle')}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSelectAll('backend', backendOptions)}
                  >
                    {formData.backend.length === backendOptions.length ? 
                      t('promptGenerator.common.unselectAll') : 
                      t('promptGenerator.common.selectAll')}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {backendOptions.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`backend-${tech}`}
                        checked={formData.backend.includes(tech)}
                        onCheckedChange={() => handleTechToggle('backend', tech)}
                      />
                      <Label 
                        htmlFor={`backend-${tech}`}
                        className="cursor-pointer"
                      >
                        {tech}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Database Section */}
          <div className="space-y-2">
            <Button 
              onClick={() => handleToggleTech('database')} 
              variant="outline"
              className="w-full justify-between font-semibold"
            >
              {t('promptGenerator.stack.database')}
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {formData.database.length} {t('promptGenerator.common.selected')}
              </span>
            </Button>
            
            {showingTech === 'database' && (
              <div className="mt-2 border rounded-md p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{t('promptGenerator.stack.databaseTitle')}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSelectAll('database', databaseOptions)}
                  >
                    {formData.database.length === databaseOptions.length ? 
                      t('promptGenerator.common.unselectAll') : 
                      t('promptGenerator.common.selectAll')}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {databaseOptions.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`database-${tech}`}
                        checked={formData.database.includes(tech)}
                        onCheckedChange={() => handleTechToggle('database', tech)}
                      />
                      <Label 
                        htmlFor={`database-${tech}`}
                        className="cursor-pointer"
                      >
                        {tech}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Hosting Section */}
          <div className="space-y-2">
            <Button 
              onClick={() => handleToggleTech('hosting')} 
              variant="outline"
              className="w-full justify-between font-semibold"
            >
              {t('promptGenerator.stack.hosting')}
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {formData.hosting.length} {t('promptGenerator.common.selected')}
              </span>
            </Button>
            
            {showingTech === 'hosting' && (
              <div className="mt-2 border rounded-md p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{t('promptGenerator.stack.hostingTitle')}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSelectAll('hosting', hostingOptions)}
                  >
                    {formData.hosting.length === hostingOptions.length ? 
                      t('promptGenerator.common.unselectAll') : 
                      t('promptGenerator.common.selectAll')}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {hostingOptions.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`hosting-${tech}`}
                        checked={formData.hosting.includes(tech)}
                        onCheckedChange={() => handleTechToggle('hosting', tech)}
                      />
                      <Label 
                        htmlFor={`hosting-${tech}`}
                        className="cursor-pointer"
                      >
                        {tech}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StackStep;
