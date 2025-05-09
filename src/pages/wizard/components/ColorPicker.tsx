
import React from 'react';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, className }) => {
  return (
    <div className={`flex ${className}`}>
      <div 
        className="w-10 h-10 border rounded-l-md flex-shrink-0" 
        style={{ backgroundColor: value || '#fff' }}
      />
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-l-none"
      />
    </div>
  );
};

export default ColorPicker;
