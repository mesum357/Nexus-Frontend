import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SimpleTextEditor } from '@/components/ui/simple-text-editor';
import Navbar from '@/components/Navbar';
import { API_BASE_URL } from '@/lib/config';

const cities = [
  "Karachi", "Lahore", "Islamabad", "Faisalabad", "Multan",
  "Peshawar", "Quetta", "Rawalpindi", "Gujranwala", "Sialkot"
];

const categories = [
  "Food & Beverages", "Fashion & Clothing", "Electronics", "Home & Garden",
  "Beauty & Personal Care", "Sports & Outdoors", "Books & Media", "Automotive",
  "Health & Wellness", "Education & Training", "Professional Services", "Entertainment"
];

export default function EditShop() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shop, setShop] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    shopName: '',
    city: '',
    shopType: '',
    shopDescription: '',
    categories: [] as string[],
    whatsappNumber: '',
    facebookUrl: '',
    instagramHandle: '',
    websiteUrl: ''
  });

  // File states
  const [shopLogo, setShopLogo] = useState<File | null>(null);
  const [shopBanner, setShopBanner] = useState<File | null>(null);
  const [ownerProfilePhoto, setOwnerProfilePhoto] = useState<File | null>(null);
  
  // Preview states
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [profilePreview, setProfilePreview] = useState<string>('');

  // Fetch shop data
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch shop');
        }
        
        const data = await response.json();
        setShop(data.shop);
        
        // Set form data
        setFormData({
          shopName: data.shop.shopName || '',
          city: data.shop.city || '',
          shopType: data.shop.shopType || '',
          shopDescription: data.shop.shopDescription || '',
          categories: data.shop.categories || [],
          whatsappNumber: data.shop.whatsappNumber || '',
          facebookUrl: data.shop.facebookUrl || '',
          instagramHandle: data.shop.instagramHandle || '',
          websiteUrl: data.shop.websiteUrl || ''
        });

        // Set preview images
        if (data.shop.shopLogo) {
          setLogoPreview(`${API_BASE_URL}${data.shop.shopLogo}`);
        }
        if (data.shop.shopBanner) {
          setBannerPreview(`${API_BASE_URL}${data.shop.shopBanner}`);
        }
        if (data.shop.ownerProfilePhoto) {
          setProfilePreview(`${API_BASE_URL}${data.shop.ownerProfilePhoto}`);
        }
        
      } catch (error) {
        console.error('Error fetching shop:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shop data',
          variant: 'destructive'
        });
        navigate('/store');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShop();
  }, [shopId, navigate, toast]);

  const handleFileChange = (file: File | null, setFile: (file: File | null) => void, setPreview: (preview: string) => void) => {
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'categories') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Add files
      if (shopLogo) formDataToSend.append('shopLogo', shopLogo);
      if (shopBanner) formDataToSend.append('shopBanner', shopBanner);
      if (ownerProfilePhoto) formDataToSend.append('ownerProfilePhoto', ownerProfilePhoto);

      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update shop');
      }

      toast({
        title: 'Success',
        description: 'Shop updated successfully'
      });

      navigate(`/shop/${shopId}`);
    } catch (error: any) {
      console.error('Error updating shop:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update shop',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" onClick={() => navigate(`/shop/${shopId}`)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
            <h1 className="text-3xl font-bold">Edit Shop</h1>
            <p className="text-muted-foreground mt-2">
              Update your shop information and settings
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="shopName">Shop Name *</Label>
                      <Input
                        id="shopName"
                        value={formData.shopName}
                        onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select value={formData.city} onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="shopType">Shop Type *</Label>
                      <Select value={formData.shopType} onValueChange={(value) => setFormData(prev => ({ ...prev, shopType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shop type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Product Seller">Product Seller</SelectItem>
                          <SelectItem value="Service Provider">Service Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Categories</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant={formData.categories.includes(category) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleCategoryToggle(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                      <Input
                        id="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        placeholder="+92 300 1234567"
                      />
                    </div>

                    <div>
                      <Label htmlFor="facebookUrl">Facebook URL</Label>
                      <Input
                        id="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, facebookUrl: e.target.value }))}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>

                    <div>
                      <Label htmlFor="instagramHandle">Instagram Handle</Label>
                      <Input
                        id="instagramHandle"
                        value={formData.instagramHandle}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagramHandle: e.target.value }))}
                        placeholder="@yourhandle"
                      />
                    </div>

                    <div>
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                        placeholder="https://yoursite.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Shop Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Shop Description</CardTitle>
                </CardHeader>
                <CardContent>
                                     <SimpleTextEditor
                     value={formData.shopDescription}
                     onChange={(value) => setFormData(prev => ({ ...prev, shopDescription: value }))}
                     placeholder="Describe your shop, what you sell/offer, and what makes you unique..."
                     rows={6}
                     maxLength={1000}
                   />
                </CardContent>
              </Card>
            </motion.div>

            {/* Media Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Shop Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Shop Logo */}
                    <div>
                      <Label>Shop Logo</Label>
                      <div className="mt-2">
                        <div className="relative w-32 h-32 border-2 border-dashed border-border rounded-lg overflow-hidden">
                          {(logoPreview || shop?.shopLogo) && (
                            <img
                              src={logoPreview || `${API_BASE_URL}${shop.shopLogo}`}
                              alt="Shop logo"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e.target.files?.[0] || null, setShopLogo, setLogoPreview)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shop Banner */}
                    <div>
                      <Label>Shop Banner</Label>
                      <div className="mt-2">
                        <div className="relative w-full h-32 border-2 border-dashed border-border rounded-lg overflow-hidden">
                          {(bannerPreview || shop?.shopBanner) && (
                            <img
                              src={bannerPreview || `${API_BASE_URL}${shop.shopBanner}`}
                              alt="Shop banner"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e.target.files?.[0] || null, setShopBanner, setBannerPreview)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Owner Profile Photo */}
                    <div>
                      <Label>Owner Profile Photo</Label>
                      <div className="mt-2">
                        <div className="relative w-32 h-32 border-2 border-dashed border-border rounded-lg overflow-hidden">
                          {(profilePreview || shop?.ownerProfilePhoto) && (
                            <img
                              src={profilePreview || `${API_BASE_URL}${shop.ownerProfilePhoto}`}
                              alt="Owner profile"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e.target.files?.[0] || null, setOwnerProfilePhoto, setProfilePreview)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex gap-4"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Shop'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/shop/${shopId}`)}
              >
                Cancel
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
