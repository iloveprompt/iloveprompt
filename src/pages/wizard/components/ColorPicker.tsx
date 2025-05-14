
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
  title?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  onChange, 
  onClose,
  title = "Selecionar cor"
}) => {
  return (
    <div className="p-3 border rounded-md bg-card shadow-sm absolute z-10 w-64">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium">{title}</h4>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <HexColorPicker color={color} onChange={onChange} />
      <div className="flex mt-3 items-center">
        <div className="flex-1 font-mono text-xs">{color}</div>
        <div 
          className="w-6 h-6 rounded border border-gray-300" 
          style={{ backgroundColor: color }} 
        />
      </div>
    </div>
  );
};

export default ColorPicker;
