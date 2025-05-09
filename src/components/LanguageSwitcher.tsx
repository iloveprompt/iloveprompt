
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Flag } from 'lucide-react';
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
      <SelectTrigger className="w-[130px] h-9 bg-slate-900 border-slate-800 text-white">
        <SelectValue>
          <div className="flex items-center">
            {language === 'pt' ? (
              <>
                <span className="mr-2 text-green-500">●</span>
                <span>Português</span>
              </>
            ) : (
              <>
                <span className="mr-2 text-blue-500">●</span>
                <span>English</span>
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-slate-800 text-white">
        <SelectItem value="pt" className="focus:bg-slate-800 focus:text-white hover:bg-slate-800">
          <div className="flex items-center">
            <span className="mr-2 text-green-500">●</span>
            <span>Português</span>
          </div>
        </SelectItem>
        <SelectItem value="en" className="focus:bg-slate-800 focus:text-white hover:bg-slate-800">
          <div className="flex items-center">
            <span className="mr-2 text-blue-500">●</span>
            <span>English</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
