import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ''
}) => {
  const { t } = useLanguage();

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onPageChange(Math.max(0, currentPage - 1))} 
        disabled={currentPage === 0} 
        className="h-7 w-7"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs text-muted-foreground">
        {`${t('common.page')} ${currentPage + 1} ${t('common.of')} ${totalPages}`}
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))} 
        disabled={currentPage === totalPages - 1} 
        className="h-7 w-7"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination; 