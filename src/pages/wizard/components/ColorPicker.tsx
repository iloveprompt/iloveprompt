
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface ColorPickerProps {
  currentColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  currentColor, 
  onColorSelect,
  onClose 
}) => {
  const { t, language } = useLanguage();
  const [color, setColor] = React.useState(currentColor || '#000000');
  
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };
  
  const handleConfirm = () => {
    onColorSelect(color);
  };
  
  return (
    <div className="color-picker-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {language === 'pt' ? 'Selecione uma Cor' : 
           language === 'es' ? 'Seleccione un Color' : 'Select a Color'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <HexColorPicker color={color} onChange={handleColorChange} />
        
        <div className="flex items-center space-x-2 w-full">
          <div 
            className="w-10 h-10 rounded-md border border-gray-300"
            style={{ backgroundColor: color }}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1 border rounded-md px-3 py-1"
          />
        </div>
        
        <div className="flex justify-end space-x-2 w-full">
          <Button variant="outline" onClick={onClose}>
            {language === 'pt' ? 'Cancelar' : 
             language === 'es' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button onClick={handleConfirm}>
            {language === 'pt' ? 'Confirmar' : 
             language === 'es' ? 'Confirmar' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
};
