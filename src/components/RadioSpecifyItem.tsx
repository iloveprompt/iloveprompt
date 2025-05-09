
import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroupItem } from './ui/radio-group';

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
  const isSelected = groupValue === value;
  
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
        <div className="ml-6 mt-2">
          <Input
            value={specifyValue}
            onChange={(e) => onSpecifyValueChange(e.target.value)}
            placeholder={placeholder}
            className="text-sm"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default RadioSpecifyItem;
