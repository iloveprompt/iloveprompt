
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

interface ColorSwatchProps {
  color: string;
  label: string;
  selected: boolean;
  onToggle: (selected: boolean) => void;
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

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, label, selected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(!selected)}
      className={cn(
        "flex items-center space-x-2 p-2 rounded-md border transition-all",
        selected ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div
        className="w-6 h-6 rounded-full border"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm">{label}</span>
      {selected && (
        <span className="ml-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  );
};

export const HexColorPicker: React.FC<{ color: string; onChange: (color: string) => void }> = ({ color, onChange }) => {
  // A simplified color picker with some preset colors
  const presetColors = [
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', 
    '#0000FF', '#4B0082', '#9400D3', '#000000', 
    '#FFFFFF', '#808080', '#A52A2A', '#FFC0CB'
  ];
  
  return (
    <div className="p-3">
      <Input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 mb-3"
      />
      <div className="grid grid-cols-4 gap-2 mt-2">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            type="button"
            className="w-8 h-8 rounded-full border border-gray-200"
            style={{ backgroundColor: presetColor }}
            onClick={() => onChange(presetColor)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
