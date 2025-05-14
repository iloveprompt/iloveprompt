
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocation } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  
  // Check if we're on the landing page or dashboard
  const isLandingPage = !location.pathname.includes('/dashboard') && !location.pathname.includes('/admin');
  
  // Set background colors based on current page
  const contentBgColor = isLandingPage ? 'bg-darkBg' : 'bg-white';
  const contentTextColor = isLandingPage ? 'text-pureWhite' : 'text-black';
  const itemHoverBgColor = isLandingPage ? 'hover:bg-electricBlue/30' : 'hover:bg-gray-100';
  const itemFocusBgColor = isLandingPage ? 'focus:bg-electricBlue/30 focus:text-pureWhite' : 'focus:bg-gray-100 focus:text-gray-900';
  const borderColor = isLandingPage ? 'border-electricBlue/20' : 'border-gray-200';
  
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
        className={`min-w-[60px] ${borderColor} z-50`} 
        style={{ 
          backgroundColor: isLandingPage ? 'rgb(30, 30, 36)' : 'white',
          color: isLandingPage ? 'white' : 'black'
        }}
      >
        <SelectItem 
          value="pt" 
          className={`${itemFocusBgColor} ${itemHoverBgColor} flex justify-center`}
        >
          <div className="flex items-center">
            <img 
              src="https://flagcdn.com/w20/br.png" 
              width="24" 
              height="18" 
              alt="Brazil" 
            />
          </div>
        </SelectItem>
        <SelectItem 
          value="en" 
          className={`${itemFocusBgColor} ${itemHoverBgColor} flex justify-center`}
        >
          <div className="flex items-center">
            <img 
              src="https://flagcdn.com/w20/us.png" 
              width="24" 
              height="18" 
              alt="United States" 
            />
          </div>
        </SelectItem>
        <SelectItem 
          value="es" 
          className={`${itemFocusBgColor} ${itemHoverBgColor} flex justify-center`}
        >
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
