import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Crop } from 'lucide-react';
import { ShopData } from '@/types/shop';
import { ImageCropper } from '@/components/ui/image-cropper';

interface ShopMediaStepProps {
  data: ShopData;
  updateData: (updates: Partial<ShopData>) => void;
}

const ShopMediaStep: React.FC<ShopMediaStepProps> = ({ data, updateData }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const ownerProfileInputRef = useRef<HTMLInputElement>(null);

  // Image cropper states
  const [showLogoCropper, setShowLogoCropper] = useState(false);
  const [showBannerCropper, setShowBannerCropper] = useState(false);
  const [showOwnerProfileCropper, setShowOwnerProfileCropper] = useState(false);
  const [tempLogoFile, setTempLogoFile] = useState<File | null>(null);
  const [tempBannerFile, setTempBannerFile] = useState<File | null>(null);
  const [tempOwnerProfileFile, setTempOwnerProfileFile] = useState<File | null>(null);

  const handleFileUpload = (
    file: File,
    type: 'logo' | 'banner' | 'ownerProfile'
  ) => {
    if (file && file.type.startsWith('image/')) {
      console.log('handleFileUpload:', type, file.name, file.size);
      if (type === 'logo') {
        setTempLogoFile(file);
        setShowLogoCropper(true);
      } else if (type === 'banner') {
        setTempBannerFile(file);
        setShowBannerCropper(true);
      } else {
        setTempOwnerProfileFile(file);
        setShowOwnerProfileCropper(true);
      }
    } else {
      console.error('Invalid file type or null file:', file);
    }
  };

  // Handle cropped logo
  const handleLogoCropComplete = async (croppedFile: File) => {
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('image', croppedFile);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();

        
        updateData({
          shopLogo: croppedFile,
          logoPreview: result.imageUrl // Use Cloudinary URL instead of data URL
        });
      } else {
        console.error('Failed to upload logo to Cloudinary');
        // Fallback to data URL if upload fails
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          updateData({
            shopLogo: croppedFile,
            logoPreview: result
          });
        };
        reader.readAsDataURL(croppedFile);
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      // Fallback to data URL if upload fails
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateData({
          shopLogo: croppedFile,
          logoPreview: result
        });
      };
      reader.readAsDataURL(croppedFile);
    }
    
    setTempLogoFile(null);
    setShowLogoCropper(false);
  };

  // Handle cropped banner
  const handleBannerCropComplete = async (croppedFile: File) => {
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('image', croppedFile);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();

        
        updateData({
          shopBanner: croppedFile,
          bannerPreview: result.imageUrl // Use Cloudinary URL instead of data URL
        });
      } else {
        console.error('Failed to upload banner to Cloudinary');
        // Fallback to data URL if upload fails
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          updateData({
            shopBanner: croppedFile,
            bannerPreview: result
          });
        };
        reader.readAsDataURL(croppedFile);
      }
    } catch (error) {
      console.error('Error uploading banner:', error);
      // Fallback to data URL if upload fails
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateData({
          shopBanner: croppedFile,
          bannerPreview: result
        });
      };
      reader.readAsDataURL(croppedFile);
    }
    
    setTempBannerFile(null);
    setShowBannerCropper(false);
  };

  // Handle cropped owner profile
  const handleOwnerProfileCropComplete = async (croppedFile: File) => {
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('image', croppedFile);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();

        
        updateData({
          ownerProfilePhoto: croppedFile,
          ownerProfilePreview: result.imageUrl // Use Cloudinary URL instead of data URL
        });
      } else {
        console.error('Failed to upload owner profile to Cloudinary');
        // Fallback to data URL if upload fails
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          updateData({
            ownerProfilePhoto: croppedFile,
            ownerProfilePreview: result
          });
        };
        reader.readAsDataURL(croppedFile);
      }
    } catch (error) {
      console.error('Error uploading owner profile:', error);
      // Fallback to data URL if upload fails
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateData({
          ownerProfilePhoto: croppedFile,
          ownerProfilePreview: result
        });
      };
      reader.readAsDataURL(croppedFile);
    }
    
    setTempOwnerProfileFile(null);
    setShowOwnerProfileCropper(false);
  };

  // Handle editing existing images
  const handleEditLogo = () => {
    if (data.shopLogo && data.shopLogo instanceof File) {
      console.log('handleEditLogo:', data.shopLogo.name, data.shopLogo.size);
      setTempLogoFile(data.shopLogo);
      setShowLogoCropper(true);
    } else {
      console.error('No valid logo file to edit');
    }
  };

  const handleEditBanner = () => {
    if (data.shopBanner && data.shopBanner instanceof File) {
      console.log('handleEditBanner:', data.shopBanner.name, data.shopBanner.size);
      setTempBannerFile(data.shopBanner);
      setShowBannerCropper(true);
    } else {
      console.error('No valid banner file to edit');
    }
  };

  const handleEditOwnerProfile = () => {
    if (data.ownerProfilePhoto && data.ownerProfilePhoto instanceof File) {
      console.log('handleEditOwnerProfile:', data.ownerProfilePhoto.name, data.ownerProfilePhoto.size);
      setTempOwnerProfileFile(data.ownerProfilePhoto);
      setShowOwnerProfileCropper(true);
    } else {
      console.error('No valid owner profile file to edit');
    }
  };

  // Close cropper without applying
  const handleCloseLogoCropper = () => {
    setShowLogoCropper(false);
    setTempLogoFile(null);
  };

  const handleCloseBannerCropper = () => {
    setShowBannerCropper(false);
    setTempBannerFile(null);
  };

  const handleCloseOwnerProfileCropper = () => {
    setShowOwnerProfileCropper(false);
    setTempOwnerProfileFile(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: 'logo' | 'banner' | 'ownerProfile'
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

  const removeImage = (type: 'logo' | 'banner' | 'ownerProfile') => {
    if (type === 'logo') {
      updateData({
        shopLogo: null,
        logoPreview: ''
      });
      if (logoInputRef.current) logoInputRef.current.value = '';
    } else if (type === 'banner') {
      updateData({
        shopBanner: null,
        bannerPreview: ''
      });
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    } else {
      updateData({
        ownerProfilePhoto: null,
        ownerProfilePreview: ''
      });
      if (ownerProfileInputRef.current) ownerProfileInputRef.current.value = '';
    }
  };

  const ImageUploadCard = ({
    title,
    description,
    type,
    preview,
    aspectRatio,
    inputRef,
    required = true
  }: {
    title: string;
    description: string;
    type: 'logo' | 'banner' | 'ownerProfile';
    preview: string;
    aspectRatio: string;
    inputRef: React.RefObject<HTMLInputElement>;
    required?: boolean;
  }) => {
    const handleEdit = () => {
      if (type === 'logo') {
        handleEditLogo();
      } else if (type === 'banner') {
        handleEditBanner();
      } else {
        handleEditOwnerProfile();
      }
    };

    return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-3 md:space-y-4">
          <div>
            <Label className="text-sm font-medium">
              {title} {required && <span className="text-destructive">*</span>}
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
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-white/90 hover:bg-white"
                  >
                    <Crop className="w-4 h-4" />
                    Adjust & Crop
                  </Button>
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
              <div className="flex flex-col items-center justify-center p-4 md:p-8 text-center h-full">
                <div className="p-3 md:p-4 bg-muted/50 rounded-full mb-3 md:mb-4">
                  <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-2">
                  Drop your {title.toLowerCase()} here
                </p>
                <p className="text-xs text-muted-foreground mb-3 md:mb-4">
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
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="text-center">
        <p className="text-muted-foreground">
          Upload your shop logo and banner to make your storefront more appealing to customers.
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Shop Banner - Full width on mobile */}
        <ImageUploadCard
          title="Shop Banner"
          description="Banner image for your shop header (recommended: 1200x400px)"
          type="banner"
          preview={data.bannerPreview}
          aspectRatio="aspect-[2/1] md:aspect-[3/1]"
          inputRef={bannerInputRef}
        />

        {/* Logo and Profile Photo in grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Shop Logo */}
          <ImageUploadCard
            title="Shop Logo"
            description="Square logo that represents your brand (recommended: 400x400px)"
            type="logo"
            preview={data.logoPreview}
            aspectRatio="aspect-square"
            inputRef={logoInputRef}
          />

          {/* Owner Profile Photo */}
          <ImageUploadCard
            title="Owner Profile Photo"
            description="Your profile photo that will appear on the shop page (recommended: 400x400px)"
            type="ownerProfile"
            preview={data.ownerProfilePreview}
            aspectRatio="aspect-square"
            inputRef={ownerProfileInputRef}
            required={false}
          />
        </div>
      </div>

      {/* Preview Section */}
      {(data.logoPreview || data.bannerPreview || data.ownerProfilePreview) && (
        <Card className="bg-muted/30">
          <CardContent className="p-4 md:p-6">
            <Label className="text-sm font-medium mb-3 md:mb-4 block">Preview</Label>
            <div className="space-y-3 md:space-y-4">
                             {data.bannerPreview && (
                 <div className="relative w-full h-24 md:h-32 bg-gray-100 rounded-lg overflow-hidden">
                   <img
                     src={data.bannerPreview}
                     alt="Banner preview"
                     className="w-full h-full object-cover"
                   />
                  {data.logoPreview && (
                    <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-white">
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
                <div className="flex items-center justify-center p-4 md:p-8 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={data.logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {data.ownerProfilePreview && (
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden shadow-md flex-shrink-0">
                    <img
                      src={data.ownerProfilePreview}
                      alt="Owner profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Owner Profile Photo</p>
                    <p className="text-xs text-muted-foreground">Will appear on your shop page</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Cropper Components */}
      {showLogoCropper && tempLogoFile && (
        <ImageCropper
          isOpen={showLogoCropper}
          onClose={handleCloseLogoCropper}
          imageFile={tempLogoFile}
          imageSrc={undefined}
          onCropComplete={handleLogoCropComplete}
          aspectRatio={1}
          title="Crop Logo"
        />
      )}
      
      {showBannerCropper && tempBannerFile && (
        <ImageCropper
          isOpen={showBannerCropper}
          onClose={handleCloseBannerCropper}
          imageFile={tempBannerFile}
          imageSrc={undefined}
          onCropComplete={handleBannerCropComplete}
          aspectRatio={3}
          title="Crop Banner"
        />
      )}
      
      {showOwnerProfileCropper && tempOwnerProfileFile && (
        <ImageCropper
          isOpen={showOwnerProfileCropper}
          onClose={handleCloseOwnerProfileCropper}
          imageFile={tempOwnerProfileFile}
          imageSrc={undefined}
          onCropComplete={handleOwnerProfileCropComplete}
          aspectRatio={1}
          title="Crop Profile Photo"
        />
      )}
    </div>
  );
};

export default ShopMediaStep;
