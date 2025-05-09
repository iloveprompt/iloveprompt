
import React, { useState, useEffect } from 'react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { Check } from 'lucide-react';

interface OtherSpecifyItemProps {
  id: string;
  label: string;
  checked: boolean;
  value: string;
  placeholder?: string;
  onCheckedChange: (checked: boolean) => void;
  onValueChange: (value: string) => void;
}

const OtherSpecifyItem: React.FC<OtherSpecifyItemProps> = ({
  id,
  label,
  checked,
  value,
  placeholder,
  onCheckedChange,
  onValueChange,
}) => {
  const { t } = useLanguage();
  const [tempValue, setTempValue] = useState(value);
  
  useEffect(() => {
    setTempValue(value);
  }, [value]);
  
  const handleSave = () => {
    onValueChange(tempValue);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(checked) => onCheckedChange(checked === true)}
        />
        <Label htmlFor={id} className="text-sm cursor-pointer">
          {label}
        </Label>
      </div>
      
      {checked && (
        <div className="ml-6 mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
            className="text-sm flex-1 min-w-0"
            autoFocus
          />
          <Button 
            size="sm" 
            className="mt-2 sm:mt-0 whitespace-nowrap" 
            onClick={handleSave}
            disabled={tempValue === value}
          >
            <Check className="h-4 w-4 mr-1" /> {t('promptGenerator.common.save')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OtherSpecifyItem;
