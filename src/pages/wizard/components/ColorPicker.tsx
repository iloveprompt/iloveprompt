
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ColorSwatchProps {
  color: string;
  label: string;
  selected: boolean;
  onToggle: (selected: boolean) => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, label, selected, onToggle }) => {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-center space-y-1 p-2 rounded-md border transition-all",
        selected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
      )}
      onClick={() => onToggle(!selected)}
    >
      <div 
        className="w-8 h-8 rounded-full border border-gray-200" 
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-center">{label}</span>
    </button>
  );
};

export const HexColorPicker: React.FC<{ color: string; onChange: (color: string) => void }> = ({ color, onChange }) => {
  const [value, setValue] = useState(color);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="p-4">
      <input
        type="color"
        value={value}
        onChange={handleChange}
        className="w-48 h-48 cursor-pointer"
      />
    </div>
  );
};
