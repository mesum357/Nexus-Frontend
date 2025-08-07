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

interface RichTextEditorProps {
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

const fontFamilies = [
  { label: 'Default', value: 'font-sans', style: 'sans-serif' },
  { label: 'Serif', value: 'font-serif', style: 'serif' },
  { label: 'Monospace', value: 'font-mono', style: 'monospace' },
  { label: 'Georgia', value: 'font-georgia', style: 'Georgia, serif' },
  { label: 'Times New Roman', value: 'font-times', style: '"Times New Roman", Times, serif' },
  { label: 'Arial', value: 'font-arial', style: 'Arial, Helvetica, sans-serif' },
  { label: 'Courier New', value: 'font-courier', style: '"Courier New", Courier, monospace' },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter description...",
  rows = 4,
  maxLength,
  className = ""
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState('text-base');
  const [selectedColor, setSelectedColor] = useState('text-foreground');
  const [selectedFontFamily, setSelectedFontFamily] = useState('font-sans');

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
      // Force left-to-right direction
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.setAttribute('dir', 'ltr');
    }
  }, [value]);

  // Monitor and fix text direction issues
  useEffect(() => {
    if (editorRef.current) {
      const observer = new MutationObserver(() => {
        if (editorRef.current) {
          // Ensure direction is maintained
          editorRef.current.style.direction = 'ltr';
          editorRef.current.style.textAlign = 'left';
          editorRef.current.setAttribute('dir', 'ltr');
          
          // Force cursor to end if it's at the beginning
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (range.collapsed && range.startOffset === 0) {
              // Move cursor to end
              const textNode = editorRef.current.firstChild || editorRef.current;
              if (textNode.nodeType === Node.TEXT_NODE) {
                range.setStart(textNode, textNode.textContent?.length || 0);
                range.setEnd(textNode, textNode.textContent?.length || 0);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          }
        }
      });
      
      observer.observe(editorRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      return () => observer.disconnect();
    }
  }, []);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  const restoreSelection = (range: Range | null) => {
    if (range) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const applyFormatting = (tag: string, className?: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }

    try {
      range.surroundContents(element);
      editorRef.current?.focus();
      handleInput();
    } catch (error) {
      // If surroundContents fails, try a different approach
      const fragment = range.extractContents();
      element.appendChild(fragment);
      range.insertNode(element);
      editorRef.current?.focus();
      handleInput();
    }
  };

  const toggleFormatting = (tag: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    // Check if the selection is already formatted
    const parentElement = range.commonAncestorContainer.parentElement;
    if (parentElement && parentElement.tagName.toLowerCase() === tag.toLowerCase()) {
      // Remove formatting
      const parent = parentElement.parentElement;
      if (parent) {
        parent.replaceChild(document.createTextNode(parentElement.textContent || ''), parentElement);
      }
    } else {
      // Add formatting
      applyFormatting(tag);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const sanitizedHtml = sanitizeHtml(html);
      onChange(sanitizedHtml);
      
      // Ensure cursor stays at the end
      setTimeout(() => {
        if (editorRef.current) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false); // collapse to end
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  };

  const toggleBold = () => {
    const savedRange = saveSelection();
    toggleFormatting('strong');
    restoreSelection(savedRange);
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    const savedRange = saveSelection();
    toggleFormatting('em');
    restoreSelection(savedRange);
    setIsItalic(!isItalic);
  };

  const changeFontSize = (size: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement('span');
    span.className = size;
    
    try {
      range.surroundContents(span);
      editorRef.current?.focus();
      handleInput();
    } catch (error) {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
      editorRef.current?.focus();
      handleInput();
    }
    
    setSelectedFontSize(size);
  };

  const changeColor = (color: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement('span');
    span.className = color;
    
    try {
      range.surroundContents(span);
      editorRef.current?.focus();
      handleInput();
    } catch (error) {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
      editorRef.current?.focus();
      handleInput();
    }
    
    setSelectedColor(color);
  };

  const changeFontFamily = (font: string, style: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement('span');
    span.className = font;
    span.style.fontFamily = style;

    try {
      range.surroundContents(span);
      editorRef.current?.focus();
      handleInput();
    } catch (error) {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
      editorRef.current?.focus();
      handleInput();
    }

    setSelectedFontFamily(font);
  };

  const getCurrentFontSize = () => {
    return fontSizes.find(fs => fs.value === selectedFontSize)?.label || 'Normal';
  };

  const getCurrentColor = () => {
    return colors.find(c => c.value === selectedColor)?.label || 'Default';
  };

  const getCurrentFontFamily = () => {
    return fontFamilies.find(f => f.value === selectedFontFamily)?.label || 'Default';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      toggleBold();
    } else if (e.key === 'i' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      toggleItalic();
    }
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
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant={isItalic ? "default" : "ghost"}
          size="sm"
          onClick={toggleItalic}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Type className="h-4 w-4" />
              {getCurrentFontFamily()}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {fontFamilies.map((font) => (
              <DropdownMenuItem
                key={font.value}
                onClick={() => changeFontFamily(font.value, font.style)}
                className={selectedFontFamily === font.value ? "bg-accent" : ""}
              >
                <span style={{ fontFamily: font.style }}>{font.label}</span>
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
        <div
          ref={editorRef}
          contentEditable
          dir="ltr"
          onInput={e => { console.log('onInput', e.currentTarget.innerText, e.currentTarget.dir, e.currentTarget.style.direction); handleInput(); }}
          onKeyDown={e => { console.log('onKeyDown', e.key, e.currentTarget.dir, e.currentTarget.style.direction); handleKeyDown(e); }}
          onFocus={e => { console.log('onFocus', e.currentTarget.dir, e.currentTarget.style.direction); }}
          className={`min-h-[${rows * 1.5}rem] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-left rich-text-editor ${
            maxLength && stripHtml(value).length > maxLength * 0.9 ? 'border-orange-300' : ''
          }`}
          style={{ 
            minHeight: `${rows * 1.5}rem`,
            direction: 'ltr'
          }}
          data-placeholder={placeholder}
        />
        {maxLength && (
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {stripHtml(value).length}/{maxLength}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-text-editor:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
            direction: ltr !important;
            text-align: left !important;
            unicode-bidi: embed !important;
          }
          .rich-text-editor {
            direction: ltr !important;
            text-align: left !important;
            unicode-bidi: embed !important;
          }
          .rich-text-editor * {
            direction: ltr !important;
            text-align: left !important;
            unicode-bidi: embed !important;
          }
        `
      }} />
    </div>
  );
}
