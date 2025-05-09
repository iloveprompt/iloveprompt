
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroupItem } from './ui/radio-group';
import { Button } from './ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { Check } from 'lucide-react';

interface RadioSpecifyItemProps {
  id: string;
  groupValue: string;
  value: string;
  label: string;
  specifyValue: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  onSpecifyValueChange: (value: string) => void;
}

const RadioSpecifyItem: React.FC<RadioSpecifyItemProps> = ({
  id,
  groupValue,
  value,
  label,
  specifyValue,
  placeholder,
  onValueChange,
  onSpecifyValueChange,
}) => {
  const { t } = useLanguage();
  const isSelected = groupValue === value;
  const [tempValue, setTempValue] = useState(specifyValue);
  
  const handleSave = () => {
    onSpecifyValueChange(tempValue);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <RadioGroupItem 
          value={value} 
          id={id}
          onClick={() => {
            if (groupValue !== value) {
              onValueChange(value);
            }
          }}
        />
        <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
      </div>
      
      {isSelected && (
        <div className="ml-6 mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-start">
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
            className="text-sm flex-1 min-w-0"
            autoFocus
          />
          <Button 
            size="sm" 
            className="mt-2 sm:mt-0" 
            onClick={handleSave}
            disabled={tempValue === specifyValue}
          >
            <Check className="h-4 w-4 mr-1" /> {t('promptGenerator.common.save')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RadioSpecifyItem;
