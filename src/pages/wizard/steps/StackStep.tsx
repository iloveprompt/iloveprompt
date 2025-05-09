
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface StackData {
  separateFrontendBackend: boolean;
  frontend: string[];
  backend: string[];
  database: string[];
  hosting: string[];
  fullstack: string[];
  orm: string[];
}

interface StackStepProps {
  formData: StackData;
  updateFormData: (data: Partial<StackData>) => void;
}

const StackStep: React.FC<StackStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  
  // Technology options for each category
  const frontendOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'nuxtjs', label: 'Nuxt.js' },
    { value: 'gatsby', label: 'Gatsby' },
  ];
  
  const backendOptions = [
    { value: 'nodejs', label: 'Node.js' },
    { value: 'express', label: 'Express' },
    { value: 'nestjs', label: 'NestJS' },
    { value: 'fastify', label: 'Fastify' },
    { value: 'python', label: 'Python' },
    { value: 'flask', label: 'Flask' },
    { value: 'django', label: 'Django' },
    { value: 'ruby', label: 'Ruby on Rails' },
    { value: 'php', label: 'PHP/Laravel' },
    { value: 'dotnet', label: '.NET Core' },
    { value: 'java', label: 'Java/Spring Boot' },
    { value: 'go', label: 'Go' },
  ];
  
  const databaseOptions = [
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'firestore', label: 'Firestore' },
    { value: 'dynamodb', label: 'DynamoDB' },
    { value: 'redis', label: 'Redis' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'supabase', label: 'Supabase' },
  ];
  
  const hostingOptions = [
    { value: 'vercel', label: 'Vercel' },
    { value: 'netlify', label: 'Netlify' },
    { value: 'aws', label: 'AWS' },
    { value: 'gcp', label: 'Google Cloud' },
    { value: 'azure', label: 'Azure' },
    { value: 'digitalocean', label: 'Digital Ocean' },
    { value: 'heroku', label: 'Heroku' },
    { value: 'firebase', label: 'Firebase' },
  ];
  
  const fullstackOptions = [
    { value: 'nextjs', label: 'Next.js (App Router)' },
    { value: 'remix', label: 'Remix' },
    { value: 'nuxtjs', label: 'Nuxt.js' },
    { value: 'redwoodjs', label: 'RedwoodJS' },
    { value: 'blitzjs', label: 'BlitzJS' },
    { value: 'sveltekit', label: 'SvelteKit' },
  ];
  
  const ormOptions = [
    { value: 'prisma', label: 'Prisma' },
    { value: 'sequelize', label: 'Sequelize' },
    { value: 'typeorm', label: 'TypeORM' },
    { value: 'mongoose', label: 'Mongoose' },
    { value: 'drizzle', label: 'Drizzle ORM' },
    { value: 'sqlx', label: 'sqlx (Rust)' },
    { value: 'gorm', label: 'GORM (Go)' },
  ];
  
  // Handle separate frontend/backend toggle
  const handleSeparationToggle = (value: string) => {
    updateFormData({
      separateFrontendBackend: value === 'hasSeparation',
      ...(value === 'hasSeparation' 
        ? { fullstack: [] } 
        : { frontend: [], backend: [] })
    });
  };

  // Handle technology selection
  const handleTechChange = (category: keyof StackData, value: string, checked: boolean) => {
    const currentValues = formData[category] as string[];
    const updatedValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    updateFormData({ [category]: updatedValues } as Partial<StackData>);
  };

  // Select all in a category
  const selectAllInCategory = (category: keyof StackData, options: { value: string }[]) => {
    updateFormData({ [category]: options.map(opt => opt.value) } as Partial<StackData>);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.stack.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.stack.description')}</p>
      </div>

      <Card className="p-6">
        <h4 className="font-medium mb-4">{t('promptGenerator.stack.separateFrontendBackend')}</h4>
        <RadioGroup
          value={formData.separateFrontendBackend ? 'hasSeparation' : 'noSeparation'}
          onValueChange={handleSeparationToggle}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hasSeparation" id="separate-yes" />
            <Label htmlFor="separate-yes">{t('promptGenerator.stack.hasSeparation')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="noSeparation" id="separate-no" />
            <Label htmlFor="separate-no">{t('promptGenerator.stack.noSeparation')}</Label>
          </div>
        </RadioGroup>
      </Card>

      {formData.separateFrontendBackend ? (
        <>
          {/* Frontend */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-medium">{t('promptGenerator.stack.frontendTitle')}</h4>
                <p className="text-sm text-gray-500">{t('promptGenerator.stack.frontendHelp')}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => selectAllInCategory('frontend', frontendOptions)}
              >
                {t('promptGenerator.common.selectAll')}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {frontendOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`frontend-${option.value}`}
                    checked={formData.frontend.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleTechChange('frontend', option.value, checked === true)
                    }
                  />
                  <label htmlFor={`frontend-${option.value}`} className="cursor-pointer text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </Card>

          {/* Backend */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-medium">{t('promptGenerator.stack.backendTitle')}</h4>
                <p className="text-sm text-gray-500">{t('promptGenerator.stack.backendHelp')}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => selectAllInCategory('backend', backendOptions)}
              >
                {t('promptGenerator.common.selectAll')}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {backendOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`backend-${option.value}`}
                    checked={formData.backend.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleTechChange('backend', option.value, checked === true)
                    }
                  />
                  <label htmlFor={`backend-${option.value}`} className="cursor-pointer text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        /* Fullstack */
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-medium">{t('promptGenerator.stack.fullstack')}</h4>
              <p className="text-sm text-gray-500">{t('promptGenerator.stack.frontendHelp')}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => selectAllInCategory('fullstack', fullstackOptions)}
            >
              {t('promptGenerator.common.selectAll')}
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {fullstackOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`fullstack-${option.value}`}
                  checked={formData.fullstack.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleTechChange('fullstack', option.value, checked === true)
                  }
                />
                <label htmlFor={`fullstack-${option.value}`} className="cursor-pointer text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Database */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-medium">{t('promptGenerator.stack.databaseTitle')}</h4>
            <p className="text-sm text-gray-500">{t('promptGenerator.stack.databaseHelp')}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => selectAllInCategory('database', databaseOptions)}
          >
            {t('promptGenerator.common.selectAll')}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {databaseOptions.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`database-${option.value}`}
                checked={formData.database.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleTechChange('database', option.value, checked === true)
                }
              />
              <label htmlFor={`database-${option.value}`} className="cursor-pointer text-sm">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* ORM/ODM */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-medium">{t('promptGenerator.stack.orm')}</h4>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => selectAllInCategory('orm', ormOptions)}
          >
            {t('promptGenerator.common.selectAll')}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {ormOptions.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`orm-${option.value}`}
                checked={formData.orm.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleTechChange('orm', option.value, checked === true)
                }
              />
              <label htmlFor={`orm-${option.value}`} className="cursor-pointer text-sm">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Hosting */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-medium">{t('promptGenerator.stack.hostingTitle')}</h4>
            <p className="text-sm text-gray-500">{t('promptGenerator.stack.hostingHelp')}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => selectAllInCategory('hosting', hostingOptions)}
          >
            {t('promptGenerator.common.selectAll')}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {hostingOptions.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`hosting-${option.value}`}
                checked={formData.hosting.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleTechChange('hosting', option.value, checked === true)
                }
              />
              <label htmlFor={`hosting-${option.value}`} className="cursor-pointer text-sm">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StackStep;
