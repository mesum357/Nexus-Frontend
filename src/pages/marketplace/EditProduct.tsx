import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ImageCropper } from '@/components/ui/image-cropper';
import Navbar from '@/components/Navbar';
import { API_BASE_URL } from '@/lib/config';

const categories = [
  'Electronics',
  'Vehicles',
  'Furniture',
  'Jobs',
  'Property',
  'Fashion',
  'Books',
  'Sports',
  'Home & Garden',
  'Services',
  'Other'
];

const cities = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Faisalabad',
  'Rawalpindi',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Bahawalpur',
  'Sargodha',
  'Other'
];

export default function EditProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Image cropping states
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [cropFile, setCropFile] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceType: 'fixed',
    category: '',
    condition: 'used',
    location: '',
    city: '',
    contactPreference: 'both',
    ownerPhone: '',
    ownerEmail: ''
  });

  useEffect(() => {
    // Check if user is authenticated
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setCurrentUser(data.user);
        setFormData(prev => ({
          ...prev,
          ownerEmail: data.user.email || '',
          ownerPhone: data.user.phone || ''
        }));
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/marketplace/${productId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive"
          });
          navigate('/marketplace');
          return;
        }
        if (response.status === 403) {
          toast({
            title: "Error",
            description: "You don't have permission to edit this product",
            variant: "destructive"
          });
          navigate('/marketplace');
          return;
        }
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      const productData = data.product;

      // Check if current user is the owner
      if (currentUser && productData.owner && 
          currentUser._id !== productData.owner._id && 
          currentUser._id !== productData.owner) {
        toast({
          title: "Error",
          description: "You don't have permission to edit this product",
          variant: "destructive"
        });
        navigate('/marketplace');
        return;
      }

      setProduct(productData);
      setExistingImages(productData.images || []);
      setTags(productData.tags || []);

      // Pre-fill form data
      setFormData({
        title: productData.title || '',
        description: productData.description || '',
        price: productData.price?.toString() || '',
        priceType: productData.priceType || 'fixed',
        category: productData.category || '',
        condition: productData.condition || 'used',
        location: productData.location || '',
        city: productData.city || '',
        contactPreference: productData.contactPreference || 'both',
        ownerPhone: productData.ownerPhone || currentUser?.phone || '',
        ownerEmail: productData.ownerEmail || currentUser?.email || ''
      });

    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive"
      });
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setCropFile(file);
        setCropIndex(imageFiles.length);
        setShowImageCropper(true);
      } else {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive"
        });
      }
    }
  };

  const handleCropComplete = (croppedFile) => {
    const newImageFiles = [...imageFiles];
    const newImagePreviews = [...imagePreviews];
    
    newImageFiles.push(croppedFile);
    newImagePreviews.push(URL.createObjectURL(croppedFile));
    
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
    setShowImageCropper(false);
    setCropFile(null);
    setCropIndex(null);
  };

  const handleCloseCropper = () => {
    setShowImageCropper(false);
    setCropFile(null);
    setCropIndex(null);
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please log in to edit a product",
        variant: "destructive"
      });
      return;
    }

    // Validation
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.location || !formData.city) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      const submitData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Add new images
      imageFiles.forEach(file => {
        submitData.append('images', file);
      });

      // Add existing images that weren't removed
      submitData.append('existingImages', JSON.stringify(existingImages));

      // Add tags
      if (tags.length > 0) {
        submitData.append('tags', JSON.stringify(tags));
      }

      const response = await fetch(`${API_BASE_URL}/api/marketplace/${productId}`, {
        method: 'PUT',
        credentials: 'include',
        body: submitData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      toast({
        title: "Success",
        description: "Product updated successfully!"
      });

      navigate('/marketplace');
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto p-4">
            <div className="text-center">Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto p-4">
            <div className="text-center">Product not found or access denied</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-4xl mx-auto p-4">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/marketplace')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
            <p className="text-muted-foreground mt-2">
              Update your product listing
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title *</label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter product title"
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description *</label>
                      <RichTextEditor
                        value={formData.description}
                        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                        placeholder="Describe your product in detail"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Price (PKR) *</label>
                        <Input
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price Type</label>
                        <Select value={formData.priceType} onValueChange={(value) => handleSelectChange('priceType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Price</SelectItem>
                            <SelectItem value="negotiable">Negotiable</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category & Condition */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category & Condition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Category *</label>
                      <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Condition</label>
                      <Select value={formData.condition} onValueChange={(value) => handleSelectChange('condition', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="refurbished">Refurbished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Detailed Location *</label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., DHA Phase 5, Lahore"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">City *</label>
                      <Select value={formData.city} onValueChange={(value) => handleSelectChange('city', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Current Images</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {existingImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={`${API_BASE_URL}${image}`}
                                alt={`Existing ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeImage(index, true)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload New Images */}
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload additional images (Max 10 total)
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button variant="outline" asChild>
                          <span>Choose Images</span>
                        </Button>
                      </label>
                    </div>

                    {/* New Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">New Images</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`New ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Contact Preference</label>
                      <Select value={formData.contactPreference} onValueChange={(value) => handleSelectChange('contactPreference', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone Only</SelectItem>
                          <SelectItem value="email">Email Only</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        name="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        name="ownerEmail"
                        type="email"
                        value={formData.ownerEmail}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex justify-end gap-4"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/marketplace')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {saving ? 'Updating...' : 'Update Product'}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showImageCropper && cropFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Product Image</h3>
              <Button variant="ghost" onClick={handleCloseCropper}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ImageCropper
              file={cropFile}
              onCropComplete={handleCropComplete}
              aspectRatio={4/3}
              onCancel={handleCloseCropper}
            />
          </div>
        </div>
      )}
    </div>
  );
} 