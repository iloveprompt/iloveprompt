import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxItemProps {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  register?: any; // For react-hook-form compatibility
  name?: string; // For react-hook-form compatibility
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({
  id,
  label,
  description,
  checked = false,
  onCheckedChange,
  disabled = false,
  register,
  name,
}) => {
  // If register and name are provided, use react-hook-form
  // Otherwise use the component in controlled mode
  if (register && name) {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          {...register(name)}
          disabled={disabled}
        />
        <label
          htmlFor={id}
          className={`text-sm cursor-pointer ${disabled ? 'text-gray-400' : ''}`}
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    );
  }
  
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
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};
