
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroupItem } from './ui/radio-group';
import { Button } from './ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { Check, Edit3, Save } from 'lucide-react'; // Added Edit3 and Save

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
  // Initialize isEditing based on whether there's an initial specifyValue when the component mounts or when it becomes selected
  const [isEditing, setIsEditing] = useState(!(specifyValue && isSelected));

  React.useEffect(() => {
    setTempValue(specifyValue); // Sync tempValue when specifyValue prop changes
    // Adjust editing state when the item's selection or initial value changes
    if (isSelected) {
      setIsEditing(!specifyValue); // If selected and has a value, not editing. If selected and no value, editing.
    } else {
      setIsEditing(true); // If not selected, reset to allow editing when next selected (if no value)
    }
  }, [specifyValue, isSelected]);
  
  const handleSave = () => {
    onSpecifyValueChange(tempValue);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
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
            autoFocus
            disabled={!isEditing}
            className={`text-sm flex-1 min-w-0 ${!isEditing ? 'bg-muted/50 cursor-not-allowed' : ''}`}
          />
          {isEditing ? (
            <Button 
              size="sm" 
              className="mt-2 sm:mt-0" 
              onClick={handleSave}
              disabled={tempValue === specifyValue} // Disable save if no change from the persisted specifyValue
            >
              <Save className="h-4 w-4 mr-1" /> {t('promptGenerator.common.save') || "Salvar"}
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              className="mt-2 sm:mt-0" 
              onClick={handleEdit}
            >
              <Edit3 className="h-4 w-4 mr-1" /> {t('promptGenerator.common.edit') || "Editar"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default RadioSpecifyItem;
