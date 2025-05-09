
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
      onValueChange={(value: 'pt' | 'en') => setLanguage(value)}
    >
      <SelectTrigger className="w-[130px] h-9 bg-white border-gray-200 text-gray-800">
        <SelectValue>
          <div className="flex items-center">
            {language === 'pt' ? (
              <>
                <img 
                  src="https://flagcdn.com/w20/br.png" 
                  width="20" 
                  height="15" 
                  alt="Brazil" 
                  className="mr-2"
                />
                <span className="text-gray-800">Português</span>
              </>
            ) : (
              <>
                <img 
                  src="https://flagcdn.com/w20/us.png" 
                  width="20" 
                  height="15" 
                  alt="United States" 
                  className="mr-2"
                />
                <span className="text-gray-800">English</span>
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border-gray-200 text-gray-800">
        <SelectItem value="pt" className="focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100">
          <div className="flex items-center">
            <img 
              src="https://flagcdn.com/w20/br.png" 
              width="20" 
              height="15" 
              alt="Brazil" 
              className="mr-2"
            />
            <span className="text-gray-800">Português</span>
          </div>
        </SelectItem>
        <SelectItem value="en" className="focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100">
          <div className="flex items-center">
            <img 
              src="https://flagcdn.com/w20/us.png" 
              width="20" 
              height="15" 
              alt="United States" 
              className="mr-2"
            />
            <span className="text-gray-800">English</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
