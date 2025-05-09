
import React, { useState, useEffect } from 'react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { Check, Trash2, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

interface OtherSpecifyItemProps {
  id: string;
  label: string;
  checked: boolean;
  value: string | string[];
  placeholder?: string;
  onCheckedChange: (checked: boolean) => void;
  onValueChange: (value: string | string[]) => void;
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
  const { t } = useLanguage();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [inputValues, setInputValues] = useState<string[]>([]);
  
  // Convert string value to array for backward compatibility
  useEffect(() => {
    if (typeof value === 'string') {
      if (value) {
        setInputValues([value]);
      } else {
        setInputValues([]);
      }
    } else {
      setInputValues(value || []);
    }
  }, [value]);

  const handleAddInput = () => {
    setInputValues([...inputValues, '']);
  };

  const handleInputChange = (index: number, newValue: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = newValue;
    setInputValues(newInputValues);
  };

  const handleDeleteInput = (index: number) => {
    const newInputValues = inputValues.filter((_, i) => i !== index);
    setInputValues(newInputValues);
  };

  const handleSave = () => {
    // Filter out empty values
    const nonEmptyValues = inputValues.filter(v => v.trim() !== '');
    
    // Use first value if there's only one for backward compatibility
    if (nonEmptyValues.length === 1 && typeof value === 'string') {
      onValueChange(nonEmptyValues[0]);
    } else {
      onValueChange(nonEmptyValues);
    }
    
    setPopoverOpen(false);
  };

  // For displaying in UI - handle both string and array scenarios
  const displayValues = Array.isArray(value) ? value : (value ? [value] : []);

  return (
    <div className="space-y-2 w-full max-w-full">
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
        <div className="ml-6 mt-2 space-y-2">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                type="button"
                className="flex items-center gap-1"
              >
                {displayValues.length > 0 ? t('common.addedItems') : t('common.add')}
                {displayValues.length > 0 && <span className="text-xs bg-primary/20 rounded-full px-1.5">{displayValues.length}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div className="font-medium text-sm">{label}</div>
                
                <div className="space-y-2">
                  {inputValues.map((inputValue, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder={placeholder}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteInput(index)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={handleAddInput}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> {t('common.addMoreItems')}
                  </Button>
                  
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" /> {t('common.add')}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {displayValues.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">{t('common.addedItems')}:</div>
              <div className="space-y-1">
                {displayValues.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-secondary/50 text-sm rounded px-2 py-1 flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        const newValues = displayValues.filter((_, i) => i !== index);
                        if (typeof value === 'string') {
                          onValueChange(newValues[0] || '');
                        } else {
                          onValueChange(newValues);
                        }
                      }}
                      className="h-5 w-5"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OtherSpecifyItem;
