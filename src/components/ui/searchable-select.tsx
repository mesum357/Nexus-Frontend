import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  className?: string;
  allowCustom?: boolean; // Enable custom value entry
  customPlaceholder?: string; // Placeholder for custom input
}

export function SearchableSelect({
  value,
  onValueChange,
  placeholder,
  options,
  className,
  allowCustom = true, // Default to allowing custom values
  customPlaceholder = "Type your custom value..."
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const customInputRef = useRef<HTMLInputElement>(null);

  // Check if current value is a custom value (not in options)
  const isCustomValue = value && !options.find(option => option.value === value);
  const selectedOption = options.find(option => option.value === value);

  // Display label: either selected option label, custom value, or placeholder
  const displayLabel = selectedOption 
    ? selectedOption.label 
    : (isCustomValue ? value : null);

  // Focus custom input when shown
  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [showCustomInput]);

  // Handle custom value submission
  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onValueChange(customValue.trim());
      setCustomValue('');
      setShowCustomInput(false);
      setOpen(false);
      setSearchValue('');
    }
  };

  // Handle key press in custom input
  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setShowCustomInput(false);
        setCustomValue('');
        setSearchValue('');
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between transition-all duration-200 focus:ring-2 focus:ring-primary/20 h-10 sm:h-10",
            className
          )}
        >
          {displayLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter(option => 
                  option.label.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                      setSearchValue('');
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
            
            {/* Custom Option */}
            {allowCustom && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  {showCustomInput ? (
                    <div className="p-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          ref={customInputRef}
                          value={customValue}
                          onChange={(e) => setCustomValue(e.target.value)}
                          onKeyDown={handleCustomKeyDown}
                          placeholder={customPlaceholder}
                          className="h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={handleCustomSubmit}
                          disabled={!customValue.trim()}
                          className="h-8 px-3"
                        >
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Press Enter to add, Escape to cancel
                      </p>
                    </div>
                  ) : (
                    <CommandItem
                      onSelect={() => setShowCustomInput(true)}
                      className="text-primary cursor-pointer"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Enter Custom Value
                    </CommandItem>
                  )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
