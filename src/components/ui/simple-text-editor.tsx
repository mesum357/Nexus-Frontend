import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Type, Palette, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sanitizeHtml, stripHtml } from '@/lib/sanitize-html';

interface SimpleTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
}

const fontSizes = [
  { label: 'Small', value: 'text-sm' },
  { label: 'Normal', value: 'text-base' },
  { label: 'Large', value: 'text-lg' },
  { label: 'Extra Large', value: 'text-xl' },
];

const colors = [
  { label: 'Default', value: 'text-foreground' },
  { label: 'Red', value: 'text-red-600' },
  { label: 'Blue', value: 'text-blue-600' },
  { label: 'Green', value: 'text-green-600' },
  { label: 'Purple', value: 'text-purple-600' },
  { label: 'Orange', value: 'text-orange-600' },
  { label: 'Gray', value: 'text-gray-600' },
];

export function SimpleTextEditor({
  value,
  onChange,
  placeholder = "Enter description...",
  rows = 4,
  maxLength,
  className = ""
}: SimpleTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState('text-base');
  const [selectedColor, setSelectedColor] = useState('text-foreground');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = stripHtml(value);
    }
  }, [value]);

  const handleInput = () => {
    if (textareaRef.current) {
      const text = textareaRef.current.value;
      // Convert plain text to simple HTML with formatting
      let html = text;
      
      if (isBold) {
        html = `<strong>${html}</strong>`;
      }
      if (isItalic) {
        html = `<em>${html}</em>`;
      }
      
      const sanitizedHtml = sanitizeHtml(html);
      onChange(sanitizedHtml);
    }
  };

  const toggleBold = () => {
    setIsBold(!isBold);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleItalic = () => {
    setIsItalic(!isItalic);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const changeFontSize = (size: string) => {
    setSelectedFontSize(size);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const changeColor = (color: string) => {
    setSelectedColor(color);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const getCurrentFontSize = () => {
    return fontSizes.find(fs => fs.value === selectedFontSize)?.label || 'Normal';
  };

  const getCurrentColor = () => {
    return colors.find(c => c.value === selectedColor)?.label || 'Default';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-lg border">
        <Button
          type="button"
          variant={isBold ? "default" : "ghost"}
          size="sm"
          onClick={toggleBold}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant={isItalic ? "default" : "ghost"}
          size="sm"
          onClick={toggleItalic}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Type className="h-4 w-4" />
              {getCurrentFontSize()}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {fontSizes.map((size) => (
              <DropdownMenuItem
                key={size.value}
                onClick={() => changeFontSize(size.value)}
                className={selectedFontSize === size.value ? "bg-accent" : ""}
              >
                {size.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Palette className="h-4 w-4" />
              {getCurrentColor()}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {colors.map((color) => (
              <DropdownMenuItem
                key={color.value}
                onClick={() => changeColor(color.value)}
                className={selectedColor === color.value ? "bg-accent" : ""}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-4 h-4 rounded-full border ${
                      color.value === 'text-foreground' 
                        ? 'bg-foreground' 
                        : color.value.replace('text-', 'bg-')
                    }`}
                  />
                  {color.label}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          onInput={handleInput}
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${
            maxLength && stripHtml(value).length > maxLength * 0.9 ? 'border-orange-300' : ''
          }`}
          style={{ 
            minHeight: `${rows * 1.5}rem`,
            direction: 'ltr',
            textAlign: 'left',
            writingMode: 'horizontal-tb'
          }}
          placeholder={placeholder}
          rows={rows}
          dir="ltr"
        />
        {maxLength && (
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {stripHtml(value).length}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
