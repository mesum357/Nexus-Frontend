import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { ShopData } from '@/types/shop';




interface BusinessCategoriesStepProps {
  data: ShopData;
  updateData: (updates: Partial<ShopData>) => void;
}

const BUSINESS_CATEGORIES = [
  { id: 'garments', label: 'Garments', icon: '👕' },
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'food', label: 'Food', icon: '🍕' },
  { id: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { id: 'carpentry', label: 'Carpentry', icon: '🪚' },
  { id: 'services', label: 'Services', icon: '⚡' },
  { id: 'beauty', label: 'Beauty', icon: '💄' },
  { id: 'health', label: 'Health', icon: '🏥' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'automotive', label: 'Automotive', icon: '🚗' },
];

const BusinessCategoriesStep: React.FC<BusinessCategoriesStepProps> = ({ data, updateData }) => {
  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = data.categories || [];
    const isSelected = currentCategories.includes(categoryId);
    
    if (isSelected) {
      updateData({
        categories: currentCategories.filter(id => id !== categoryId)
      });
    } else {
      updateData({
        categories: [...currentCategories, categoryId]
      });
    }
  };

  const removeCategory = (categoryId: string) => {
    updateData({
      categories: data.categories.filter(id => id !== categoryId)
    });
  };

  const selectedCategoryLabels = data.categories.map(id => 
    BUSINESS_CATEGORIES.find(cat => cat.id === id)?.label || id
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <p className="text-muted-foreground">
          Select the business categories that best describe your shop. You can choose multiple categories.
        </p>
      </div>

      {/* Selected Categories */}
      {data.categories.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Selected Categories:</Label>
          <div className="flex flex-wrap gap-2">
            {data.categories.map((categoryId) => {
              const category = BUSINESS_CATEGORIES.find(cat => cat.id === categoryId);
              return (
                <Badge
                  key={categoryId}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <span>{category?.icon}</span>
                  <span>{category?.label}</span>
                  <button
                    onClick={() => removeCategory(categoryId)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUSINESS_CATEGORIES.map((category) => {
            const isSelected = data.categories.includes(category.id);
            
            return (
              <div
                key={category.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleCategoryToggle(category.id)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={category.id}
                    checked={isSelected}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="transition-all duration-200"
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-2xl">{category.icon}</span>
                    <Label
                      htmlFor={category.id}
                      className="font-medium cursor-pointer flex-1"
                    >
                      {category.label}
                    </Label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {data.categories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Please select at least one category for your business.</p>
        </div>
      )}
    </div>
  );
};

export default BusinessCategoriesStep;
