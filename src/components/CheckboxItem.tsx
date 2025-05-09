
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxItemProps {
  id: string;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({
  id,
  label,
  checked = false,
  onCheckedChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className={`text-sm cursor-pointer ${disabled ? 'text-gray-400' : ''}`}
      >
        {label}
      </label>
    </div>
  );
};
