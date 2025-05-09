
import React, { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
        <div className="ml-6 mt-2">
          <Input
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={placeholder}
            className="text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default OtherSpecifyItem;
