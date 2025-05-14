import React from 'react';
import { Button } from '@/components/ui/button';
import { ListPlus } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface NotInListButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

const NotInListButton: React.FC<NotInListButtonProps> = ({ 
  onClick, 
  className = '',
  label
}) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`text-xs ${className}`}
      onClick={onClick}
    >
      <ListPlus className="h-3 w-3 mr-1.5" />
      {label || t('common.notInList')}
    </Button>
  );
};

export default NotInListButton; 