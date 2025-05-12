
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <Select
      value={language}
      onValueChange={(value: 'pt' | 'en' | 'es') => setLanguage(value)}
    >
      <SelectTrigger className="w-[60px] h-9 border-0 focus:ring-0 focus:ring-offset-0" 
        style={{ 
          backgroundColor: 'transparent',
          color: 'inherit'
        }}
      >
        <SelectValue>
          <div className="flex items-center justify-center">
            {language === 'pt' && (
              <>
                <img 
                  src="https://flagcdn.com/w20/br.png" 
                  width="24" 
                  height="18" 
                  alt="Brazil" 
                />
              </>
            )}
            {language === 'en' && (
              <>
                <img 
                  src="https://flagcdn.com/w20/us.png" 
                  width="24" 
                  height="18" 
                  alt="United States" 
                />
              </>
            )}
            {language === 'es' && (
              <>
                <img 
                  src="https://flagcdn.com/w20/es.png" 
                  width="24" 
                  height="18" 
                  alt="Spain" 
                />
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent 
        className="min-w-[60px] border-gray-200 z-50" 
        style={{ 
          backgroundColor: 'white',
          color: 'black'
        }}
      >
        <SelectItem value="pt" className="focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100 flex justify-center">
          <div className="flex items-center">
            <img 
              src="https://flagcdn.com/w20/br.png" 
              width="24" 
              height="18" 
              alt="Brazil" 
            />
          </div>
        </SelectItem>
        <SelectItem value="en" className="focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100 flex justify-center">
          <div className="flex items-center">
            <img 
              src="https://flagcdn.com/w20/us.png" 
              width="24" 
              height="18" 
              alt="United States" 
            />
          </div>
        </SelectItem>
        <SelectItem value="es" className="focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100 flex justify-center">
          <div className="flex items-center">
            <img 
              src="https://flagcdn.com/w20/es.png" 
              width="24" 
              height="18" 
              alt="Spain" 
            />
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
