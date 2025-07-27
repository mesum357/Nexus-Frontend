import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ShopData } from '@/types/shop';

interface ShopMediaStepProps {
  data: ShopData;
  updateData: (updates: Partial<ShopData>) => void;
}

const ShopMediaStep: React.FC<ShopMediaStepProps> = ({ data, updateData }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    file: File,
    type: 'logo' | 'banner'
  ) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'logo') {
          updateData({
            shopLogo: file,
            logoPreview: result
          });
        } else {
          updateData({
            shopBanner: file,
            bannerPreview: result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: 'logo' | 'banner'
  ) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (type: 'logo' | 'banner') => {
    if (type === 'logo') {
      updateData({
        shopLogo: null,
        logoPreview: ''
      });
      if (logoInputRef.current) logoInputRef.current.value = '';
    } else {
      updateData({
        shopBanner: null,
        bannerPreview: ''
      });
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const ImageUploadCard = ({
    title,
    description,
    type,
    preview,
    aspectRatio,
    inputRef
  }: {
    title: string;
    description: string;
    type: 'logo' | 'banner';
    preview: string;
    aspectRatio: string;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              {title} <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>

          <div
            className={`relative border-2 border-dashed border-border rounded-lg transition-all duration-200 hover:border-primary/50 ${aspectRatio}`}
            onDrop={(e) => handleDrop(e, type)}
            onDragOver={handleDragOver}
          >
            {preview ? (
              <div className="relative w-full h-full group">
                <img
                  src={preview}
                  alt={`${title} preview`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(type)}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="p-4 bg-muted/50 rounded-full mb-4">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-2">
                  Drop your {title.toLowerCase()} here
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  PNG, JPG, JPEG up to 5MB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </Button>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, type);
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <p className="text-muted-foreground">
          Upload your shop logo and banner to make your storefront more appealing to customers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Logo */}
        <ImageUploadCard
          title="Shop Logo"
          description="Square logo that represents your brand (recommended: 400x400px)"
          type="logo"
          preview={data.logoPreview}
          aspectRatio="aspect-square"
          inputRef={logoInputRef}
        />

        {/* Shop Banner */}
        <ImageUploadCard
          title="Shop Banner"
          description="Banner image for your shop header (recommended: 1200x400px)"
          type="banner"
          preview={data.bannerPreview}
          aspectRatio="aspect-[3/1]"
          inputRef={bannerInputRef}
        />
      </div>

      {/* Preview Section */}
      {(data.logoPreview || data.bannerPreview) && (
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <Label className="text-sm font-medium mb-4 block">Preview</Label>
            <div className="space-y-4">
              {data.bannerPreview && (
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={data.bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  {data.logoPreview && (
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-white">
                      <img
                        src={data.logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
              
              {data.logoPreview && !data.bannerPreview && (
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={data.logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShopMediaStep;
