import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { ShopData } from '@/types/shop';
import { useCategories } from '@/hooks/use-categories';

interface BusinessCategoriesStepProps {
  data: ShopData;
  updateData: (updates: Partial<ShopData>) => void;
}

const BusinessCategoriesStep: React.FC<BusinessCategoriesStepProps> = ({ data, updateData }) => {
  const { categories, loading, error } = useCategories();

  // Debug logging
  console.log('BusinessCategoriesStep render:', { 
    categories: categories.length, 
    loading, 
    error, 
    selectedCategories: data.categories 
  });

  const handleCategoryToggle = (categoryValue: string) => {
    console.log('handleCategoryToggle called with:', categoryValue);
    const currentCategories = data.categories || [];
    const isSelected = currentCategories.includes(categoryValue);
    
    if (isSelected) {
      updateData({
        categories: currentCategories.filter(value => value !== categoryValue)
      });
    } else {
      updateData({
        categories: [...currentCategories, categoryValue]
      });
    }
  };

  const removeCategory = (categoryValue: string) => {
    console.log('removeCategory called with:', categoryValue);
    updateData({
      categories: data.categories.filter(value => value !== categoryValue)
    });
  };

  if (loading) {
    console.log('BusinessCategoriesStep: Loading state');
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('BusinessCategoriesStep: Error state:', error);
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <p className="text-destructive">Error loading categories: {error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    console.log('BusinessCategoriesStep: No categories available');
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <p className="text-muted-foreground">No categories available.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please contact support if this issue persists.
          </p>
        </div>
      </div>
    );
  }

  console.log('BusinessCategoriesStep: Rendering with categories:', categories.length);

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
