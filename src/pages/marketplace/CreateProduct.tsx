import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, Trash2, Crop, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<any>(null);

  // Image cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageFile, setTempImageFile] = useState(null);
  const [croppingIndex, setCroppingIndex] = useState(-1); // -1 for new image, >=0 for editing existing
  const [fileQueue, setFileQueue] = useState([]); // Queue for multiple file processing

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

  const handlePaymentComplete = async (paymentData: any) => {
    // Payment is now handled directly in PaymentSection component
    // This function is called after successful payment submission
    setPaymentCompleted(true);
    console.log('Payment completed:', paymentData);
    
    toast({ 
      title: 'Payment Submitted Successfully', 
      description: 'Your payment request has been submitted to the admin panel for review. You can now proceed to review your product details.' 
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

    // Add files to queue for processing
    setFileQueue(prev => [...prev, ...files]);
    
    // Start processing the first file if no cropper is currently open
    if (!showCropper && files.length > 0) {
      processNextFile();
    }
  };

  // Process next file in queue
  const processNextFile = () => {
    setFileQueue(prev => {
      if (prev.length === 0) return prev;
      
      const nextFile = prev[0];
      const remainingFiles = prev.slice(1);
      
      // Open cropper for this file
      setTempImageFile(nextFile);
      setCroppingIndex(-1); // New image
      setShowCropper(true);
      
      return remainingFiles;
    });
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
    
    // Process next file in queue if available
    setTimeout(() => {
      if (fileQueue.length > 0) {
        processNextFile();
      }
    }, 100);
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
    
    // If we're processing a new file and user cancels, remove it from queue
    if (croppingIndex === -1 && tempImageFile) {
      setFileQueue(prev => prev.slice(1));
    }
  };

  // Clear file queue (useful for resetting)
  const clearFileQueue = () => {
    setFileQueue([]);
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

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.location || !formData.city) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields before proceeding.',
          variant: 'destructive'
        });
        return;
      }
      
      // Check if there are files still being processed
      if (fileQueue.length > 0) {
        toast({
          title: 'Images Still Processing',
          description: 'Please wait for all images to finish processing before proceeding.',
          variant: 'destructive'
        });
        return;
      }
    }
    
    if (currentStep === 2 && !paymentCompleted) {
      toast({ 
        title: 'Payment Required', 
        description: 'Please complete the payment section before proceeding.', 
        variant: 'destructive' 
      });
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: 'Terms Not Accepted',
        description: 'Please accept the terms and conditions before submitting.',
        variant: 'destructive'
      });
      return;
    }
    
    // Product is already created in handlePaymentComplete, just navigate to success
    toast({
      title: "Product Creation Complete!",
      description: "Your product has been created successfully and payment submitted. It is now pending admin approval!"
    });

    navigate('/marketplace');
  };

  const handleAcceptTerms = () => {
    setAcceptTerms(true);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">List Your Product</h3>
              <p className="text-muted-foreground">
                Fill in your product details and upload images
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Basic Information</CardTitle>
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
                        className="h-10"
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
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price Type</label>
                        <Select value={formData.priceType} onValueChange={(value) => handleSelectChange('priceType', value)}>
                          <SelectTrigger className="h-10">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Category *</label>
                        <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                          <SelectTrigger className="h-10">
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
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like-new">Like New</SelectItem>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Location *</label>
                        <Input
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Enter location (e.g., street, area)"
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">City *</label>
                        <Select value={formData.city} onValueChange={(value) => handleSelectChange('city', value)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Contact Preference</label>
                      <Select value={formData.contactPreference} onValueChange={(value) => handleSelectChange('contactPreference', value)}>
                        <SelectTrigger className="h-10">
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
                        className="h-10"
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
                        className="h-10"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Images and Tags */}
              <div className="space-y-6">
                {/* Images */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Product Images</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Upload up to 10 images of your product. First image will be the main image.
                      </p>
                      
                      {/* Image Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        {imagePreviews.length > 0 ? (
                          <div className="space-y-4">
                            {/* File Processing Status */}
                            {fileQueue.length > 0 && (
                              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-800">
                                  Processing {fileQueue.length} more image{fileQueue.length !== 1 ? 's' : ''}...
                                </p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={preview}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                                      <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleEditImage(index)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Crop className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeImage(index)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input')
                                input.type = 'file'
                                input.multiple = true
                                input.accept = 'image/*'
                                input.onchange = (e) => {
                                  const files = Array.from((e.target as HTMLInputElement).files || [])
                                  if (files.length > 0) {
                                    handleImageUpload({ target: { files } })
                                  }
                                }
                                input.click()
                              }}
                              disabled={imagePreviews.length >= 10}
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add More Images
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Upload className="h-12 w-12 mx-auto text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, JPEG up to 10MB (Select multiple files)
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input')
                                input.type = 'file'
                                input.multiple = true
                                input.accept = 'image/*'
                                input.onchange = (e) => {
                                  const files = Array.from((e.target as HTMLInputElement).files || [])
                                  if (files.length > 0) {
                                    handleImageUpload({ target: { files } })
                                  }
                                }
                                input.click()
                              }}
                            >
                              Choose Files
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Add tags to help buyers find your product (optional)
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
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
                      {tags.length < 10 && (
                        <div className="flex gap-2">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add a tag"
                            className="flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addTag}
                            disabled={!newTag.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Payment Section</h3>
              <p className="text-muted-foreground">
                Complete payment to finalize your product listing
              </p>
            </div>
            
            <PaymentSection
              entityType="marketplace"
              shopData={{
                title: formData.title,
                description: formData.description,
                price: formData.price,
                priceType: formData.priceType,
                category: formData.category,
                condition: formData.condition,
                location: formData.location,
                city: formData.city,
                imageFiles: imageFiles, // Pass File objects directly (preferred)
                imagePreviews: imagePreviews, // Fallback for data URLs
                tags: tags,
                specifications: {},
                contactPreference: formData.contactPreference,
                ownerPhone: formData.ownerPhone,
                ownerEmail: formData.ownerEmail
              }}
              onPaymentComplete={handlePaymentComplete}
              isRequired={true}
              isSubmitting={isSubmitting}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Review Your Information</h3>
              <p className="text-muted-foreground">
                Please review all the information before submitting your product
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Basic Information</h4>
                    <p className="text-muted-foreground">Product details and description</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Category & Condition</h4>
                    <p className="text-muted-foreground">{formData.category} - {formData.condition}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Location</h4>
                    <p className="text-muted-foreground">{formData.location}, {formData.city}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Images</h4>
                    <p className="text-muted-foreground">{imagePreviews.length} images uploaded</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Tags</h4>
                    <p className="text-muted-foreground">{tags.length} tags added</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Payment Status</h4>
                    <p className={`${paymentCompleted ? 'text-green-600' : 'text-red-600'} font-medium`}>
                      {paymentCompleted ? '✓ Payment Completed' : '✗ Payment Required'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className={`transition-all duration-200 ${acceptTerms ? 'border-marketplace-success/30 bg-marketplace-success/5' : ''}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                        I accept the Terms and Conditions <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By creating this product listing, you agree to our terms of service, 
                        privacy policy, and marketplace guidelines. You confirm that all information 
                        provided is accurate and that you have the right to sell this product.
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
                    
                    {acceptTerms && (
                      <div className="flex items-center gap-2 text-marketplace-success text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Terms Accepted</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

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

          {/* Step Indicator */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      currentStep > step ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'List Your Product' :
                  currentStep === 2 ? 'Payment Section' :
                  'Review & Submit'
                }
              </span>
            </div>
          </motion.div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex justify-between"
          >
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="w-24"
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-24"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!paymentCompleted || !acceptTerms}
                  className="w-32"
                >
                  {isSubmitting ? 'Creating...' : 'Create Listing'}
                </Button>
              )}
            </div>
          </motion.div>

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
