
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

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

  // Technology options
  const frontendOptions = [
    { value: 'react', label: 'React' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'tailwind', label: 'Tailwind CSS' },
    { value: 'mui', label: 'Material UI' },
    { value: 'bootstrap', label: 'Bootstrap' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  const backendOptions = [
    { value: 'nodejs', label: 'Node.js' },
    { value: 'express', label: 'Express' },
    { value: 'nestjs', label: 'NestJS' },
    { value: 'django', label: 'Django' },
    { value: 'flask', label: 'Flask' },
    { value: 'laravel', label: 'Laravel' },
    { value: 'dotnet', label: '.NET Core' },
    { value: 'spring', label: 'Spring Boot' },
    { value: 'go', label: 'Go' }
  ];

  const databaseOptions = [
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'postgres', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'supabase', label: 'Supabase' },
    { value: 'firebase', label: 'Firebase' },
    { value: 'redis', label: 'Redis' }
  ];

  const hostingOptions = [
    { value: 'vercel', label: 'Vercel' },
    { value: 'netlify', label: 'Netlify' },
    { value: 'heroku', label: 'Heroku' },
    { value: 'aws', label: 'AWS' },
    { value: 'gcp', label: 'Google Cloud' },
    { value: 'azure', label: 'Azure' },
    { value: 'digitalocean', label: 'DigitalOcean' }
  ];

  const fullstackOptions = [
    { value: 'nextjs', label: 'Next.js' },
    { value: 'remix', label: 'Remix' },
    { value: 'nuxt', label: 'Nuxt.js' },
    { value: 'blitzjs', label: 'Blitz.js' },
    { value: 'redwood', label: 'RedwoodJS' },
    { value: 'meteor', label: 'Meteor' }
  ];

  const ormOptions = [
    { value: 'prisma', label: 'Prisma' },
    { value: 'sequelize', label: 'Sequelize' },
    { value: 'mongoose', label: 'Mongoose' },
    { value: 'typeorm', label: 'TypeORM' },
    { value: 'hibernate', label: 'Hibernate' }
  ];

  // Handle checkbox changes for various categories
  const handleTechSelection = (category: keyof StackData, value: string, checked: boolean) => {
    if (category === 'frontend' || category === 'backend' || category === 'database' || 
        category === 'hosting' || category === 'fullstack' || category === 'orm') {
      const updatedSelection = checked
        ? [...formData[category], value]
        : formData[category].filter(item => item !== value);

      updateFormData({ [category]: updatedSelection });
    }
  };

  // Toggle select all for each category
  const toggleSelectAll = (category: keyof StackData, options: Array<{ value: string; label: string }>) => {
    if (category === 'frontend' || category === 'backend' || category === 'database' || 
        category === 'hosting' || category === 'fullstack' || category === 'orm') {
      
      const values = options.map(option => option.value);
      const allSelected = formData[category].length === values.length;
      
      if (allSelected) {
        updateFormData({ [category]: [] });
      } else {
        updateFormData({ [category]: values });
      }
    }
  };

  // Check if all options are selected
  const isAllSelected = (category: keyof StackData, options: Array<{ value: string; label: string }>) => {
    if (category === 'frontend' || category === 'backend' || category === 'database' || 
        category === 'hosting' || category === 'fullstack' || category === 'orm') {
      
      return formData[category].length === options.length;
    }
    return false;
  };

  // Render technology checkboxes
  const renderTechOptions = (
    category: keyof StackData, 
    options: Array<{ value: string; label: string }>,
    title: string,
    help?: string
  ) => {
    const allSelected = isAllSelected(category, options);
    
    return (
      <Card className="p-6 mb-4">
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h4 className="font-medium">{title}</h4>
              {help && <p className="text-sm text-gray-500">{help}</p>}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toggleSelectAll(category, options)}
            >
              {allSelected 
                ? t('promptGenerator.common.unselectAll') 
                : t('promptGenerator.common.selectAll')}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${category}-${option.value}`}
                  checked={
                    category === 'frontend' || category === 'backend' || category === 'database' || 
                    category === 'hosting' || category === 'fullstack' || category === 'orm'
                      ? formData[category].includes(option.value)
                      : false
                  }
                  onCheckedChange={(checked) => 
                    handleTechSelection(category, option.value, checked === true)
                  }
                />
                <Label htmlFor={`${category}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2">{t('promptGenerator.stack.title')}</h3>
        <p className="text-gray-500 mb-4">{t('promptGenerator.stack.description')}</p>
      </div>

      {/* Frontend/Backend Separation Option */}
      <Card className="p-6">
        <div>
          <h4 className="font-medium mb-4">{t('promptGenerator.stack.separateFrontendBackend')}</h4>
          <RadioGroup
            value={formData.separateFrontendBackend ? 'separate' : 'fullstack'}
            onValueChange={(value) => updateFormData({ separateFrontendBackend: value === 'separate' })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="separate" id="separate" />
              <Label htmlFor="separate">{t('promptGenerator.stack.hasSeparation')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fullstack" id="fullstack" />
              <Label htmlFor="fullstack">{t('promptGenerator.stack.noSeparation')}</Label>
            </div>
          </RadioGroup>
        </div>
      </Card>

      {/* Separate Frontend/Backend or Fullstack */}
      {formData.separateFrontendBackend ? (
        <>
          {renderTechOptions(
            'frontend',
            frontendOptions,
            t('promptGenerator.stack.frontendTitle'),
            t('promptGenerator.stack.frontendHelp')
          )}
          {renderTechOptions(
            'backend',
            backendOptions,
            t('promptGenerator.stack.backendTitle'),
            t('promptGenerator.stack.backendHelp')
          )}
        </>
      ) : (
        renderTechOptions(
          'fullstack',
          fullstackOptions,
          t('promptGenerator.stack.fullstack')
        )
      )}

      {/* Database and Hosting options */}
      <Separator className="my-6" />
      
      {renderTechOptions(
        'database',
        databaseOptions,
        t('promptGenerator.stack.databaseTitle'),
        t('promptGenerator.stack.databaseHelp')
      )}
      
      {renderTechOptions(
        'orm',
        ormOptions,
        t('promptGenerator.stack.orm')
      )}
      
      {renderTechOptions(
        'hosting',
        hostingOptions,
        t('promptGenerator.stack.hostingTitle'),
        t('promptGenerator.stack.hostingHelp')
      )}
    </div>
  );
};

export default StackStep;
