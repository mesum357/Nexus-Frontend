import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { ShopData } from '@/types/shop';
import { useCategories } from '@/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/category';
import { API_BASE_URL } from '@/lib/config';

interface BusinessCategoriesStepProps {
  data: ShopData;
  updateData: (updates: Partial<ShopData>) => void;
}

const BusinessCategoriesStep: React.FC<BusinessCategoriesStepProps> = ({ data, updateData }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryToggle = (categoryValue: string) => {
    const currentCategories = data.categories || [];
    const isSelected = currentCategories.includes(categoryValue);
    
    let newCategories: string[];
    if (isSelected) {
      newCategories = currentCategories.filter(cat => cat !== categoryValue);
    } else {
      newCategories = [...currentCategories, categoryValue];
    }
    
    updateData({ categories: newCategories });
  };

  const removeCategory = (categoryValue: string) => {
    const currentCategories = data.categories || [];
    const newCategories = currentCategories.filter(cat => cat !== categoryValue);
    updateData({ categories: newCategories });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading categories: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">No categories available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <p className="text-muted-foreground">
          Select the business categories that best describe your shop. You can choose multiple categories.
        </p>
      </div>

      {/* Selected Categories */}
      {data.categories && data.categories.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Selected Categories:</Label>
          <div className="flex flex-wrap gap-2">
            {data.categories.map((categoryValue) => {
              const category = categories.find(cat => cat.value === categoryValue);
              return (
                <Badge
                  key={categoryValue}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <span>{category?.icon || '🏪'}</span>
                  <span>{category?.label || categoryValue}</span>
                  <button
                    onClick={() => removeCategory(categoryValue)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Available Categories <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border rounded-md">
          {categories.map((category) => {
            const isSelected = data.categories && data.categories.includes(category.value);
            
            return (
              <div
                key={category.value}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-border'
                }`}
                onClick={() => handleCategoryToggle(category.value)}
              >
                <span className="text-sm">{category.icon}</span>
                <span className="text-xs font-medium truncate">{category.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {(!data.categories || data.categories.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Please select at least one category for your business.</p>
        </div>
      )}
    </div>
  );
};

export default BusinessCategoriesStep;
