
import React, { useState, useEffect } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { Plus } from 'lucide-react';
import PopupInput from './PopupInput';

interface OtherSpecifyItemProps {
  id: string;
  label: string;
  checked: boolean;
  value: string;
  placeholder?: string;
  onCheckedChange: (checked: boolean) => void;
  onValueChange: (value: string) => void;
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  
  // Parse items from value string on initial load and when value changes
  useEffect(() => {
    if (value) {
      // Value might be a single string or a JSON array
      try {
        const parsedItems = JSON.parse(value);
        if (Array.isArray(parsedItems)) {
          setItems(parsedItems);
        } else {
          setItems([value]);
        }
      } catch (e) {
        // If parsing fails, treat it as a single string
        setItems([value]);
      }
    } else {
      setItems([]);
    }
  }, [value]);
  
  const handleSaveItems = (newItems: string[]) => {
    if (newItems.length === 0) {
      // If no items, uncheck and clear
      onCheckedChange(false);
      onValueChange('');
    } else if (newItems.length === 1) {
      // If only one item, store as string
      onValueChange(newItems[0]);
    } else {
      // If multiple items, store as JSON string
      onValueChange(JSON.stringify(newItems));
    }
    setItems(newItems);
  };
  
  const openPopup = () => {
    // Make sure checkbox is checked when opening popup
    if (!checked) {
      onCheckedChange(true);
    }
    setIsPopupOpen(true);
  };
  
  return (
    <div className="space-y-2 w-full max-w-full">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(checked) => {
            const isChecked = checked === true;
            onCheckedChange(isChecked);
            if (isChecked && items.length === 0) {
              openPopup();
            }
          }}
        />
        <Label htmlFor={id} className="text-sm cursor-pointer">
          {label}
        </Label>
      </div>
      
      {checked && (
        <div className="ml-6 mt-2">
          {items.length > 0 ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                    {item}
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openPopup}
                type="button"
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                {t('promptGenerator.common.edit')}
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openPopup}
              type="button"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('promptGenerator.common.specify')}
            </Button>
          )}
        </div>
      )}
      
      <PopupInput 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSaveItems}
        initialValues={items.length > 0 ? items : ['']}
        title={t('promptGenerator.common.specifyItems')}
      />
    </div>
  );
};

export default OtherSpecifyItem;
