
import React, { useState, useEffect } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  maxDisplayed?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className = "",
  maxDisplayed = 3
}) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleSelectAll = () => {
    onChange(options.map(option => option.value));
  };

  const handleUnselectAll = () => {
    onChange([]);
  };

  const selectAllActive = selected.length === options.length;
  const noneSelected = selected.length === 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex flex-wrap gap-1 items-center">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <>
                  {selected.length <= maxDisplayed ? (
                    selected.map(value => {
                      const option = options.find(opt => opt.value === value);
                      return (
                        <Badge variant="secondary" key={value} className="mr-1">
                          {option?.label || value}
                        </Badge>
                      );
                    })
                  ) : (
                    <Badge variant="secondary">
                      {selected.length} {t('common.selected')}
                    </Badge>
                  )}
                </>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search options..." />
            <div className="flex items-center justify-between border-b px-3 py-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSelectAll}
                disabled={selectAllActive}
              >
                {t('common.selectAll')}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleUnselectAll}
                disabled={noneSelected}
              >
                {t('common.unselectAll')}
              </Button>
            </div>
            <CommandEmpty>No results found.</CommandEmpty>
            <ScrollArea className="max-h-[200px]">
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        {isSelected && <Check className="h-4 w-4 ml-2" />}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
