
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/i18n/LanguageContext';
import { Plus, Minus } from 'lucide-react';

interface PopupInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: string[]) => void;
  initialValues?: string[];
  title: string;
}

const PopupInput: React.FC<PopupInputProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValues = [''],
  title
}) => {
  const { t } = useLanguage();
  const [values, setValues] = useState<string[]>(initialValues);
  
  // Reset values when popup is opened
  useEffect(() => {
    if (isOpen) {
      setValues(initialValues.length > 0 ? initialValues : ['']);
    }
  }, [isOpen, initialValues]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const addInput = () => {
    setValues([...values, '']);
  };

  const removeInput = (index: number) => {
    if (values.length > 1) {
      const newValues = values.filter((_, i) => i !== index);
      setValues(newValues);
    }
  };

  const handleSave = () => {
    // Filter out empty values
    const filteredValues = values.filter(val => val.trim() !== '');
    onSave(filteredValues);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {values.map((value, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={t('promptGenerator.common.specifyOther')}
                className="flex-1"
                autoFocus={index === values.length - 1}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeInput(index)}
                disabled={values.length <= 1}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">{t('promptGenerator.common.remove')}</span>
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addInput}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('promptGenerator.common.addMore')}
          </Button>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            {t('common.add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PopupInput;
