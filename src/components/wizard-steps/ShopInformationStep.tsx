import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShopData } from '@/types/shop';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { SearchableSelect } from '@/components/ui/searchable-select';

interface ShopInformationStepProps {
  data: ShopData;
  updateData: (updates: Partial<ShopData>) => void;
}

const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana',
  'Sheikhupura', 'Mardan', 'Gujrat', 'Kasur', 'Dera Ghazi Khan',
  'Sahiwal', 'Nawabshah', 'Mingora', 'Burewala', 'Jhelum',
  'Kamoke', 'Hafizabad', 'Khanewal', 'Vehari', 'Dera Ismail Khan',
  'Nowshera', 'Charsadda', 'Jhang', 'Mandi Bahauddin', 'Ahmadpur East',
  'Kamalia', 'Gojra', 'Mansehra', 'Kabirwala', 'Okara', 'Gilgit',
  'Mirpur Khas', 'Rahim Yar Khan', 'Leiah', 'Muzaffargarh', 'Khanpur',
  'Jampur', 'Dadu', 'Khairpur', 'Pakpattan', 'Bahawalnagar',
  'Tando Adam', 'Tando Allahyar', 'Mirpur Mathelo', 'Shikarpur', 'Jacobabad',
  'Ghotki', 'Mehar', 'Tando Muhammad Khan', 'Dera Allahyar', 'Shahdadkot',
  'Matiari', 'Gambat', 'Nasirabad', 'Mehrabpur', 'Rohri', 'Pano Aqil',
  'Sakrand', 'Umerkot', 'Chhor', 'Kunri', 'Pithoro', 'Samaro',
  'Goth Garelo', 'Ranipur', 'Dokri', 'Lakhi', 'Dingro', 'Kandhkot',
  'Kashmore', 'Ubauro', 'Sadiqabad', 'Liaquatpur', 'Uch Sharif',
  'Alipur', 'Jatoi', 'Taunsa', 'Kot Addu', 'Layyah', 'Chobara',
  'Kot Sultan', 'Bhakkar', 'Darya Khan', 'Kallur Kot', 'Mankera',
  'Dullewala', 'Daud Khel', 'Pindi Gheb', 'Fateh Jang', 'Gujar Khan',
  'Kallar Syedan', 'Taxila', 'Wah Cantonment', 'Murree', 'Kahuta',
  'Kotli Sattian', 'Chakwal', 'Attock', 'Abbottabad', 'Haripur',
  'Batagram', 'Shangla', 'Swat', 'Buner', 'Malakand',
  'Dir', 'Chitral', 'Kohistan', 'Torghar', 'Bannu', 'Tank',
  'Kohat', 'Hangu', 'Karak', 'Lakki Marwat', 'Dera Ismail Khan'
].map(city => ({ value: city, label: city }));

const ShopInformationStep: React.FC<ShopInformationStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 h-10 sm:h-10"
          />
        </div>

        {/* City Selection */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            City <span className="text-destructive">*</span>
          </Label>
          <SearchableSelect
            value={data.city}
            onValueChange={(value) => updateData({ city: value })}
            placeholder="Select your city"
            options={PAKISTAN_CITIES}
          />
        </div>
      </div>

      {/* Agent ID */}
      <div className="space-y-2">
        <Label htmlFor="agentId" className="text-sm font-medium">
          Agent ID <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="agentId"
          placeholder="Enter agent ID if applicable"
          value={data.agentId || ''}
          onChange={(e) => updateData({ agentId: e.target.value })}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 h-10 sm:h-10"
        />
      </div>

      {/* Shop Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Shop Type <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={data.shopType}
          onValueChange={(value) => updateData({ shopType: value as 'Product Seller' | 'Service Provider' })}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Product Seller" id="product-seller" />
            <Label htmlFor="product-seller" className="cursor-pointer text-sm sm:text-base">
              Product Seller
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Service Provider" id="service-provider" />
            <Label htmlFor="service-provider" className="cursor-pointer text-sm sm:text-base">
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
