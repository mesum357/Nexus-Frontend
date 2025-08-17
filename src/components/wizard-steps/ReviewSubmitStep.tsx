import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  MapPin, 
  FileText, 
  Tag, 
  Image as ImageIcon, 
  Phone, 
  Package,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { ShopData } from '@/types/shop';
import TermsAndPolicies from '@/components/ui/TermsAndPolicies';

interface ReviewSubmitStepProps {
  data: ShopData;
  updateData: (updates: Partial<ShopData>) => void;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ data, updateData }) => {
  const [showTerms, setShowTerms] = useState(false);

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  const handleAcceptTerms = () => {
    updateData({ acceptTerms: true });
  };

  const totalProducts = data.products.length;
  const totalValue = data.products.reduce((sum, product) => {
    const finalPrice = product.discountPercentage > 0 
      ? calculateDiscountedPrice(product.price, product.discountPercentage)
      : product.price;
    return sum + finalPrice;
  }, 0);

  const InfoCard = ({ 
    title, 
    icon: Icon, 
    children, 
    isComplete 
  }: { 
    title: string; 
    icon: any; 
    children: React.ReactNode; 
    isComplete: boolean;
  }) => (
    <Card className={`transition-all duration-200 ${isComplete ? 'border-marketplace-success/30 bg-marketplace-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5" />
          {title}
          {isComplete ? (
            <CheckCircle2 className="w-4 h-4 text-marketplace-success ml-auto" />
          ) : (
            <AlertCircle className="w-4 h-4 text-destructive ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Review Your Shop Details</h3>
        <p className="text-muted-foreground">
          Please review all the information below before creating your shop.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Information */}
        <InfoCard 
          title="Shop Information" 
          icon={Store} 
          isComplete={!!(data.shopName && data.city && data.shopType && data.shopDescription)}
        >
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">Shop Name</Label>
              <p className="font-medium">{data.shopName || 'Not provided'}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">City</Label>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {data.city || 'Not selected'}
                </p>
              </div>
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Type</Label>
                <p className="font-medium">{data.shopType || 'Not selected'}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Description</Label>
              <div 
                className="text-sm text-muted-foreground line-clamp-3"
                dangerouslySetInnerHTML={{ 
                  __html: data.shopDescription || 'No description provided' 
                }}
                style={{ direction: 'ltr' }}
              />
            </div>
          </div>
        </InfoCard>

        {/* Business Categories */}
        <InfoCard 
          title="Business Categories" 
          icon={Tag} 
          isComplete={data.categories.length > 0}
        >
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Selected Categories</Label>
            {data.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="capitalize">
                    {category}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No categories selected</p>
            )}
          </div>
        </InfoCard>

        {/* Shop Media */}
        <InfoCard 
          title="Shop Media" 
          icon={ImageIcon} 
          isComplete={!!(data.shopLogo && data.shopBanner)}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Logo</Label>
                {data.logoPreview ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border">
                    <img 
                      src={data.logoPreview} 
                      alt="Logo preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-dashed flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Banner</Label>
                {data.bannerPreview ? (
                  <div className="w-full h-16 rounded-lg overflow-hidden border">
                    <img 
                      src={data.bannerPreview} 
                      alt="Banner preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-16 rounded-lg border border-dashed flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Contact Information */}
        <InfoCard 
          title="Contact Information" 
          icon={Phone} 
          isComplete={!!data.whatsappNumber}
        >
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">WhatsApp Business</Label>
              <p className="font-medium">{data.whatsappNumber || 'Not provided'}</p>
            </div>
            {(data.facebookUrl || data.instagramHandle || data.websiteUrl) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Social Media & Website</Label>
                  {data.facebookUrl && (
                    <p className="text-sm">Facebook: {data.facebookUrl}</p>
                  )}
                  {data.instagramHandle && (
                    <p className="text-sm">Instagram: {data.instagramHandle}</p>
                  )}
                  {data.websiteUrl && (
                    <p className="text-sm">Website: {data.websiteUrl}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </InfoCard>
      </div>

      {/* Products Summary */}
      <InfoCard 
        title="Products" 
        icon={Package} 
        isComplete={data.products.length > 0}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-primary">{totalProducts}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-marketplace-success">
                PKR {totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-marketplace-accent">
                {new Set(data.products.map(p => p.category)).size}
              </p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>

          {data.products.length > 0 ? (
            <div className="max-h-40 overflow-y-auto space-y-2">
              {data.products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
                >
                  <div className="w-10 h-10 rounded bg-muted flex-shrink-0">
                    {product.imagePreview ? (
                      <img 
                        src={product.imagePreview} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      PKR {product.discountPercentage > 0 
                        ? calculateDiscountedPrice(product.price, product.discountPercentage).toLocaleString()
                        : product.price.toLocaleString()
                      }
                    </p>
                    {product.discountPercentage > 0 && (
                      <p className="text-xs text-muted-foreground line-through">
                        PKR {product.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No products added yet
            </p>
          )}
        </div>
      </InfoCard>

      {/* Terms and Conditions */}
      <Card className={`transition-all duration-200 ${data.acceptTerms ? 'border-marketplace-success/30 bg-marketplace-success/5' : ''}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={data.acceptTerms}
                onCheckedChange={(checked) => updateData({ acceptTerms: !!checked })}
                className="mt-0.5"
              />
              <div className="space-y-2">
                <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                  I accept the Terms and Conditions <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  By creating this shop, you agree to our marketplace terms of service, 
                  privacy policy, and seller guidelines. You confirm that all information 
                  provided is accurate and that you have the right to sell the listed products.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowTerms(true)}
                className="flex items-center gap-2 text-xs"
              >
                <ExternalLink className="h-3 w-3" />
                Read Full Terms & Policies
              </Button>
              
              {data.acceptTerms && (
                <div className="flex items-center gap-2 text-marketplace-success text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Terms Accepted</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Policies Popup */}
      <TermsAndPolicies
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
        title="Shop Creation Terms"
      />
    </div>
  );
};

export default ReviewSubmitStep;
