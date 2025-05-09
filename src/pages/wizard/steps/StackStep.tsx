
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/MultiSelect';

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
            <h4 className="font-medium mb-2">{t('promptGenerator.stack.frontendTitle')}</h4>
            <p className="text-sm text-gray-500 mb-4">{t('promptGenerator.stack.frontendHelp')}</p>
            <MultiSelect
              options={frontendOptions}
              selected={formData.frontend}
              onChange={(values) => updateFormData({ frontend: values })}
              placeholder="Select frontend technologies"
            />
          </Card>

          {/* Backend */}
          <Card className="p-6">
            <h4 className="font-medium mb-2">{t('promptGenerator.stack.backendTitle')}</h4>
            <p className="text-sm text-gray-500 mb-4">{t('promptGenerator.stack.backendHelp')}</p>
            <MultiSelect
              options={backendOptions}
              selected={formData.backend}
              onChange={(values) => updateFormData({ backend: values })}
              placeholder="Select backend technologies"
            />
          </Card>
        </>
      ) : (
        /* Fullstack */
        <Card className="p-6">
          <h4 className="font-medium mb-2">{t('promptGenerator.stack.fullstack')}</h4>
          <p className="text-sm text-gray-500 mb-4">{t('promptGenerator.stack.frontendHelp')}</p>
          <MultiSelect
            options={fullstackOptions}
            selected={formData.fullstack}
            onChange={(values) => updateFormData({ fullstack: values })}
            placeholder="Select fullstack technologies"
          />
        </Card>
      )}

      {/* Database */}
      <Card className="p-6">
        <h4 className="font-medium mb-2">{t('promptGenerator.stack.databaseTitle')}</h4>
        <p className="text-sm text-gray-500 mb-4">{t('promptGenerator.stack.databaseHelp')}</p>
        <MultiSelect
          options={databaseOptions}
          selected={formData.database}
          onChange={(values) => updateFormData({ database: values })}
          placeholder="Select database technologies"
        />
      </Card>

      {/* ORM/ODM */}
      <Card className="p-6">
        <h4 className="font-medium mb-2">{t('promptGenerator.stack.orm')}</h4>
        <MultiSelect
          options={ormOptions}
          selected={formData.orm}
          onChange={(values) => updateFormData({ orm: values })}
          placeholder="Select ORM/ODM technologies"
        />
      </Card>

      {/* Hosting */}
      <Card className="p-6">
        <h4 className="font-medium mb-2">{t('promptGenerator.stack.hostingTitle')}</h4>
        <p className="text-sm text-gray-500 mb-4">{t('promptGenerator.stack.hostingHelp')}</p>
        <MultiSelect
          options={hostingOptions}
          selected={formData.hosting}
          onChange={(values) => updateFormData({ hosting: values })}
          placeholder="Select hosting options"
        />
      </Card>
    </div>
  );
};

export default StackStep;
