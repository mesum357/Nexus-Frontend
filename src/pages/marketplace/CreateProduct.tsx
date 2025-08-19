import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, Trash2, Crop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { API_BASE_URL } from '@/lib/config';
import { ImageCropper } from '@/components/ui/image-cropper';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import PaymentSection from '@/components/PaymentSection';

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

export default function CreateProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Image cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageFile, setTempImageFile] = useState(null);
  const [croppingIndex, setCroppingIndex] = useState(-1); // -1 for new image, >=0 for editing existing

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
    ownerEmail: '',
    agentId: ''
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentComplete = (paymentData: any) => {
    setPaymentCompleted(true);
    console.log('Payment completed:', paymentData);
    toast({ 
      title: 'Payment Submitted', 
      description: 'Payment request submitted successfully. You can now create your listing.' 
    });
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (imageFiles.length + files.length > 10) {
      toast({
        title: "Error",
        description: "Maximum 10 images allowed",
        variant: "destructive"
      });
      return;
    }

    // Open cropper for the first file
    if (files.length > 0) {
      setTempImageFile(files[0]);
      setCroppingIndex(-1); // New image
      setShowCropper(true);
    }
  };

  // Handle cropped image
  const handleCropComplete = (croppedFile) => {
    if (croppingIndex === -1) {
      // Adding new image
      const newFiles = [...imageFiles, croppedFile];
      setImageFiles(newFiles);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(croppedFile);
    } else {
      // Editing existing image
      const newFiles = [...imageFiles];
      newFiles[croppingIndex] = croppedFile;
      setImageFiles(newFiles);

      // Update preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPreviews = [...imagePreviews];
        newPreviews[croppingIndex] = e.target.result;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(croppedFile);
    }

    setTempImageFile(null);
    setCroppingIndex(-1);
    setShowCropper(false);
  };

  // Handle editing existing image
  const handleEditImage = (index) => {
    if (imageFiles[index]) {
      setTempImageFile(imageFiles[index]);
      setCroppingIndex(index);
      setShowCropper(true);
    }
  };

  // Close cropper without applying
  const handleCloseCropper = () => {
    setShowCropper(false);
    setTempImageFile(null);
    setCroppingIndex(-1);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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
        description: "Please log in to create a product",
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

    if (imageFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Add images
      imageFiles.forEach(file => {
        submitData.append('images', file);
      });

      // Add tags
      if (tags.length > 0) {
        submitData.append('tags', JSON.stringify(tags));
      }

      const response = await fetch(`${API_BASE_URL}/api/marketplace`, {
        method: 'POST',
        credentials: 'include',
        body: submitData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      toast({
        title: "Success",
        description: "Product created successfully and is pending admin approval!"
      });

      navigate('/marketplace');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto p-4">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/marketplace')}
              className="mb-4 w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">List Your Product</h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Create a new listing to sell your item across Pakistan
              </p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Basic Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
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
                        className="h-10 sm:h-10"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description *</label>
                      <RichTextEditor
                        value={formData.description}
                        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                        placeholder="Describe your product in detail"
                        rows={4}
                        maxLength={1000}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Agent ID <span className="text-muted-foreground">(Optional)</span></label>
                      <Input
                        name="agentId"
                        value={formData.agentId || ''}
                        onChange={handleInputChange}
                        placeholder="Enter agent ID if applicable"
                        className="h-10 sm:h-10"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Price (PKR) *</label>
                        <Input
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          className="h-10 sm:h-10"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price Type</label>
                        <Select value={formData.priceType} onValueChange={(value) => handleSelectChange('priceType', value)}>
                          <SelectTrigger className="h-10 sm:h-10">
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
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl">Category & Condition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Category *</label>
                      <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                        <SelectTrigger className="h-10 sm:h-10">
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
                        <SelectTrigger className="h-10 sm:h-10">
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
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl">Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Detailed Location *</label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., DHA Phase 5, Lahore"
                        className="h-10 sm:h-10"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">City *</label>
                      <Select value={formData.city} onValueChange={(value) => handleSelectChange('city', value)}>
                        <SelectTrigger className="h-10 sm:h-10">
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
                className="space-y-4 sm:space-y-6"
              >
                {/* Images */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl">Product Images *</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6 text-center">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                        Upload up to 10 images (Max 10MB each)
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
                        <Button variant="outline" asChild className="h-9 sm:h-10">
                          <span>Choose Images</span>
                        </Button>
                      </label>
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 sm:h-24 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1 rounded-lg">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 bg-white/90 hover:bg-white"
                                onClick={() => handleEditImage(index)}
                              >
                                <Crop className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl">Tags (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="h-9 sm:h-10"
                      />
                      <Button type="button" variant="outline" onClick={addTag} className="h-9 sm:h-10">
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
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Contact Preference</label>
                      <Select value={formData.contactPreference} onValueChange={(value) => handleSelectChange('contactPreference', value)}>
                        <SelectTrigger className="h-10 sm:h-10">
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
                        className="h-10 sm:h-10"
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
                        className="h-10 sm:h-10"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Payment Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 sm:mt-8"
            >
              <PaymentSection 
                entityType="marketplace"
                onPaymentComplete={handlePaymentComplete}
                isRequired={true}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 sm:mt-8 flex justify-end"
            >
              <Button
                type="submit"
                size="lg"
                disabled={loading || !paymentCompleted}
                className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto h-11 sm:h-12"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </Button>
            </motion.div>
          </form>

          {/* Image Cropper Component */}
          <ImageCropper
            isOpen={showCropper}
            onClose={handleCloseCropper}
            imageFile={tempImageFile}
            imageSrc={tempImageFile ? undefined : (croppingIndex >= 0 ? imagePreviews[croppingIndex] : undefined)}
            onCropComplete={handleCropComplete}
            aspectRatio={1}
            title="Crop Product Image"
          />
        </div>
      </div>
    </div>
  );
}
