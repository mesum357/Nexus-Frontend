import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShopData } from '@/types/shop';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface ShopInformationStepProps {
  data: ShopData;
  updateData: (updates: Partial<ShopData>) => void;
}

const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana'
];

const ShopInformationStep: React.FC<ShopInformationStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shop Name */}
        <div className="space-y-2">
          <Label htmlFor="shopName" className="text-sm font-medium">
            Shop Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="shopName"
            placeholder="Enter your shop name"
            value={data.shopName}
            onChange={(e) => updateData({ shopName: e.target.value })}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* City Selection */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            City <span className="text-destructive">*</span>
          </Label>
          <Select value={data.city} onValueChange={(value) => updateData({ city: value })}>
            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select your city" />
            </SelectTrigger>
            <SelectContent>
              {PAKISTAN_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Shop Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Shop Type <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={data.shopType}
          onValueChange={(value) => updateData({ shopType: value as 'Product Seller' | 'Service Provider' })}
          className="flex flex-col sm:flex-row gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Product Seller" id="product-seller" />
            <Label htmlFor="product-seller" className="cursor-pointer">
              Product Seller
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Service Provider" id="service-provider" />
            <Label htmlFor="service-provider" className="cursor-pointer">
              Service Provider
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Shop Description */}
      <div className="space-y-2">
        <Label htmlFor="shopDescription" className="text-sm font-medium">
          Shop Description <span className="text-destructive">*</span>
        </Label>
        <RichTextEditor
          value={data.shopDescription}
          onChange={(value) => updateData({ shopDescription: value })}
          placeholder="Describe your shop, what you sell/offer, and what makes you unique..."
          rows={4}
          maxLength={500}
        />
      </div>
    </div>
  );
};

export default ShopInformationStep;
