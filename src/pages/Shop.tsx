import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import type { Shop as ShopType } from './Store'
import heroStoreImage from '@/assets/hero-store.jpg'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, MapPin, Badge, Phone, Mail, Facebook, Instagram, MessageCircle, Plus, Trash2, Package, ImageIcon, Edit, Settings, Share2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge as UIBadge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Info } from 'lucide-react'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { API_BASE_URL } from '@/lib/config'
type ShopWithGallery = ShopType & {
  gallery: string[];
  phone?: string;
  shopDescription?: string;
  description?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  products?: ProductType[];
  owner?: string; // Add owner field for shop ownership
};

type ProductType = {
  name: string;
  images?: string[];
  image?: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  category?: string;
};

const PRODUCT_CATEGORIES = [
  'Garments', 'Electronics', 'Food', 'Beauty', 'Health',
  'Automotive', 'Home & Garden', 'Sports', 'Books', 'Toys',
  'Jewelry', 'Bags', 'Shoes', 'Accessories'
];

// Add a minimal User type for currentUser
interface CurrentUser {
  _id: string;
  email?: string;
  username?: string;
  profileImage?: string;
}

export default function Shop() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopWithGallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: '',
    category: '',
    images: [] as File[],
    imagePreviews: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState<{[key:string]:string}>({});
  const [dragActive, setDragActive] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [editProductIndex, setEditProductIndex] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingShop, setIsDeletingShop] = useState(false);
  const [deleteProductIndex, setDeleteProductIndex] = useState<number | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [deletingGalleryImage, setDeletingGalleryImage] = useState<number | null>(null);
  const [sharing, setSharing] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!shopId) return;
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/shop/${shopId}`)
      .then(res => res.json())
      .then(data => {
        if (data.shop) {
          setShop({
            ...data.shop,
            id: data.shop._id,
            name: data.shop.shopName,
            shopImage: data.shop.shopBanner
              ? data.shop.shopBanner.startsWith('/uploads/')
                ? `${API_BASE_URL}${data.shop.shopBanner}`
                : `${API_BASE_URL}/uploads/${data.shop.shopBanner}`
              : data.shop.shopLogo
                ? data.shop.shopLogo.startsWith('/uploads/')
                  ? `${API_BASE_URL}${data.shop.shopLogo}`
                  : `${API_BASE_URL}/uploads/${data.shop.shopLogo}`
                : heroStoreImage,
            categories: data.shop.categories || [],
            rating: data.shop.rating || 4.5,
            totalReviews: data.shop.totalReviews || 0,
            ownerName: data.shop.ownerName || 'Shop Owner',
            ownerDp: data.shop.ownerDp 
              ? (data.shop.ownerDp.startsWith('/uploads/')
                  ? `${API_BASE_URL}${data.shop.ownerDp}`
                  : `${API_BASE_URL}/uploads/${data.shop.ownerDp}`)
              : '',
            shopDescription: data.shop.shopDescription || data.shop.description,
            businessType: data.shop.shopType || data.shop.businessType,
            city: data.shop.city,
            phone: data.shop.phone || data.shop.whatsappNumber || '',
            email: data.shop.email || '',
            socialLinks: {
              facebook: data.shop.facebookUrl || '',
              instagram: data.shop.instagramHandle || '',
              whatsapp: data.shop.whatsappNumber || ''
            },
            websiteUrl: data.shop.websiteUrl || '',
            products: data.shop.products || [],
            gallery: (data.shop.gallery || []).map((img: string) =>
              img.startsWith('/uploads/')
                ? `${API_BASE_URL}${img}`
                : `${API_BASE_URL}/uploads/${img}`
            ),
            owner: data.shop.owner // Ensure owner is set
          });
        } else {
          setShop(null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setShop(null);
        setIsLoading(false);
      });
  }, [shopId]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setCurrentUser(data.user || null))
      .catch(() => setCurrentUser(null));
  }, []);

  const handleShare = async () => {
    setSharing(true);
    
    try {
      const shopUrl = `${window.location.origin}/shop/${shopId}`;
      await navigator.clipboard.writeText(shopUrl);
      
      toast({
        title: "Link copied!",
        description: "Shop link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSharing(false);
    }
  };

  const handleProductImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles: File[] = Array.from(files);
    const newPreviews: string[] = [];
    let loaded = 0;
    newFiles.forEach((file, idx) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newPreviews[idx] = result;
          loaded++;
          if (loaded === newFiles.length) {
            setProductForm(prev => ({
              ...prev,
              images: [...prev.images, ...newFiles],
              imagePreviews: [...prev.imagePreviews, ...newPreviews]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeProductImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const validateProductForm = () => {
    const errors: {[key:string]:string} = {};
    if (!productForm.name.trim()) errors.name = 'Product name is required.';
    if (!productForm.description.trim()) errors.description = 'Description is required.';
    if (!productForm.price || isNaN(Number(productForm.price)) || Number(productForm.price) <= 0) errors.price = 'Valid price is required.';
    if (productForm.discountPercentage && (isNaN(Number(productForm.discountPercentage)) || Number(productForm.discountPercentage) < 0)) errors.discountPercentage = 'Discount must be a positive number.';
    if (!productForm.category.trim()) errors.category = 'Category is required.';
    if (productForm.images.length === 0) errors.images = 'At least one product image is required.';
    return errors;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateProductForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('discountPercentage', productForm.discountPercentage);
      formData.append('category', productForm.category);
      if (productForm.images[0]) {
        formData.append('productImage', productForm.images[0]);
      }
      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}/add-product`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Ensure cookies/session are sent
      });
      const result = await response.json();
      if (response.ok) {
        setShop(result.shop);
        setShowAddProduct(false);
        setProductForm({ name: '', description: '', price: '', discountPercentage: '', category: '', images: [], imagePreviews: [] });
        toast({ title: 'Product Added', description: 'Your product was added successfully!', variant: 'default' });
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to add product', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag-and-drop handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProductImageUpload(e.dataTransfer.files);
    }
  };

  // Prefill form for editing
  const handleEditProduct = (idx: number) => {
    if (!shop || !shop.products) return;
    const product = shop.products[idx];
    setProductForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      discountPercentage: String(product.discountPercentage || ''),
      category: product.category || '',
      images: [],
      imagePreviews: product.image ? [product.image.startsWith('/uploads/') ? `${API_BASE_URL}${product.image}` : `${API_BASE_URL}/uploads/${product.image}`] : [],
    });
    setEditProductIndex(idx);
    setShowAddProduct(false);
  };

  // Update product handler
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateProductForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0 || editProductIndex === null) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('discountPercentage', productForm.discountPercentage);
      formData.append('category', productForm.category);
      if (productForm.images[0]) {
        formData.append('productImage', productForm.images[0]);
      }
      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}/update-product/${editProductIndex}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include', // Ensure cookies/session are sent
      });
      const result = await response.json();
      if (response.ok) {
        setShop(result.shop);
        setEditProductIndex(null);
        setProductForm({ name: '', description: '', price: '', discountPercentage: '', category: '', images: [], imagePreviews: [] });
        toast({ title: 'Product Updated', description: 'Your product was updated successfully!', variant: 'default' });
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to update product', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (productIndex: number) => {
    setIsDeletingProduct(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}/delete-product/${productIndex}`, {
        method: 'DELETE',
        credentials: 'include', // Ensure cookies/session are sent
      });
      const result = await response.json();
      if (response.ok) {
        setShop(result.shop);
        setDeleteProductIndex(null);
        toast({ title: 'Product Deleted', description: 'Your product was deleted successfully!', variant: 'default' });
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to delete product', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive' });
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Gallery upload functions
  const handleGalleryUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles: File[] = Array.from(files);
    const newPreviews: string[] = [];
    let loaded = 0;
    newFiles.forEach((file, idx) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newPreviews[idx] = result;
          loaded++;
          if (loaded === newFiles.length) {
            setGalleryFiles(prev => [...prev, ...newFiles]);
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleGalleryDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleGalleryDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleGalleryUpload(e.dataTransfer.files);
    }
  };

  const handleUploadGallery = async () => {
    if (galleryFiles.length === 0) {
      toast({ title: 'No images selected', description: 'Please select at least one image to upload', variant: 'destructive' });
      return;
    }

    setIsUploadingGallery(true);
    try {
      const formData = new FormData();
      galleryFiles.forEach((file, index) => {
        formData.append('galleryImages', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}/gallery`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();
      if (response.ok) {
        toast({ title: 'Gallery updated', description: 'Images uploaded successfully' });
        setShowGalleryUpload(false);
        setGalleryFiles([]);
        setGalleryPreviews([]);
        // Refresh shop data to show new gallery images
        window.location.reload();
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to upload images', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive' });
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleDeleteGalleryImage = async (imageIndex: number) => {
    if (!shop?.gallery) return;
    
    setDeletingGalleryImage(imageIndex);
    try {
      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}/gallery/${imageIndex}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();
      if (response.ok) {
        toast({ title: 'Image deleted', description: 'Gallery image removed successfully' });
        // Refresh shop data to show updated gallery
        window.location.reload();
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to delete image', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive' });
    } finally {
      setDeletingGalleryImage(null);
    }
  };

  const handleDeleteShop = async () => {
    if (!shopId) return;
    
    setIsDeletingShop(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        toast({ title: 'Success', description: 'Shop deleted successfully' });
        navigate('/store');
      } else {
        const result = await response.json();
        toast({ title: 'Error', description: result.error || 'Failed to delete shop', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive' });
    } finally {
      setIsDeletingShop(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded-2xl mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-64 bg-muted rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Shop Not Found</h1>
            <p className="text-muted-foreground mb-8">The shop you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/store">Back to Store</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Button variant="ghost" asChild>
              <Link to="/store">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Link>
            </Button>
          </motion.div>

          {/* Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-64 rounded-2xl overflow-hidden mb-8"
          >
            <img
              src={shop.shopBanner
                ? shop.shopBanner.startsWith('/uploads/')
                  ? `${API_BASE_URL}${shop.shopBanner}`
                  : `${API_BASE_URL}/uploads/${shop.shopBanner}`
                : shop.shopLogo
                  ? shop.shopLogo.startsWith('/uploads/')
                    ? `${API_BASE_URL}${shop.shopLogo}`
                    : `${API_BASE_URL}/uploads/${shop.shopLogo}`
                  : heroStoreImage}
              alt={shop.shopName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-8 text-white w-full">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{shop.shopName}</h1>
                    <div className="flex items-center gap-4">
                      <UIBadge variant={shop.shopType === 'Product Seller' ? 'default' : 'secondary'}>
                        {shop.shopType}
                      </UIBadge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{shop.rating}</span>
                        <span className="text-white/80 ml-1">({shop.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shop Owner Actions */}
                  {currentUser && String(shop.owner) === String(currentUser._id) && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/shop/${shopId}/edit`)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Shop
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600/80 border-red-600/20 text-white hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Shop
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Shop</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: shop.shopDescription || shop.description || '' 
                    }}
                    style={{ 
                      direction: 'ltr',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word'
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(shop.categories || []).map((category: string) => (
                      <UIBadge key={category} variant="outline">
                        {category}
                      </UIBadge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gallery */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Gallery</CardTitle>
                    {currentUser && String(shop.owner) === String(currentUser._id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowGalleryUpload(!showGalleryUpload)}
                      >
                        {showGalleryUpload ? 'Cancel' : 'Add Images'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Gallery Upload Section for Shop Owner */}
                  {showGalleryUpload && currentUser && String(shop.owner) === String(currentUser._id) && (
                    <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-3">Upload Gallery Images</h4>
                      
                      {/* Drag & Drop Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          dragActive ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        onDragEnter={handleGalleryDrag}
                        onDragLeave={handleGalleryDrag}
                        onDragOver={handleGalleryDrag}
                        onDrop={handleGalleryDrop}
                      >
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop images here, or click to select
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => galleryInputRef.current?.click()}
                        >
                          Choose Images
                        </Button>
                        <input
                          ref={galleryInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleGalleryUpload(e.target.files)}
                        />
                      </div>

                      {/* Preview Uploaded Images */}
                      {galleryPreviews.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Preview ({galleryPreviews.length} images)</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {galleryPreviews.map((preview, index) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => removeGalleryImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button
                              onClick={handleUploadGallery}
                              disabled={isUploadingGallery}
                              className="flex-1"
                            >
                              {isUploadingGallery ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                'Upload Images'
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowGalleryUpload(false);
                                setGalleryFiles([]);
                                setGalleryPreviews([]);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Gallery Display */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {shop.gallery && shop.gallery.length > 0 ? shop.gallery.map((image: string, index: number) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-square rounded-lg overflow-hidden group"
                      >
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Delete button for shop owner */}
                        {currentUser && String(shop.owner) === String(currentUser._id) && (
                          <button
                            onClick={() => handleDeleteGalleryImage(index)}
                            disabled={deletingGalleryImage === index}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            {deletingGalleryImage === index ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </motion.div>
                    )) : (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        {currentUser && String(shop.owner) === String(currentUser._id) ? (
                          <div>
                            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                            <p>No images in gallery yet.</p>
                            <p className="text-sm">Click "Add Images" to upload photos to your gallery.</p>
                          </div>
                        ) : (
                          <div>
                            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                            <p>No images available.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* Product Listing Section */}
              {shop.products && shop.products.length > 0 && (
                <Card className="mb-8 mt-8">
                  <CardHeader>
                    <CardTitle>Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {(shop.products as ProductType[]).map((product, idx) => {
                        // Use the product.image if available, otherwise use a fallback image
                        const imageUrl = product.image
                          ? (product.image.startsWith('/uploads/')
                              ? `${API_BASE_URL}${product.image}`
                              : `${API_BASE_URL}/uploads/${product.image}`)
                          : heroStoreImage;
                        return (
                          <div key={idx} className="rounded-xl border bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                            <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                              {product.discountPercentage && product.discountPercentage > 0 && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                  -{product.discountPercentage}%
                                </span>
                              )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                              <h4 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h4>
                              <div className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.category}</div>
                              <div className="text-sm mb-3 line-clamp-2">{product.description}</div>
                              <div className="flex items-center gap-2 mt-auto">
                                <span className="font-bold text-primary text-lg">PKR {product.price}</span>
                                {product.discountPercentage && product.discountPercentage > 0 && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    PKR {(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}
                                  </span>
                                )}
                              </div>
                              {/* Removed additional images preview since only one image is supported */}
                            </div>
                            {currentUser && shop && String(currentUser._id) === String(shop.owner) && (
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline" onClick={() => handleEditProduct(idx)}>
                                Edit
                              </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => setDeleteProductIndex(idx)}
                                  disabled={isDeletingProduct}
                                >
                                  {isDeletingProduct && deleteProductIndex === idx ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Shop Owner */}
              <Card>
                <CardHeader>
                  <CardTitle>Shop Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={shop.ownerDp} alt={shop.ownerName} />
                      <AvatarFallback>{shop.ownerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{shop.ownerName}</h3>
                      <p className="text-sm text-muted-foreground">Business Owner</p>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{shop.city}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{shop.phone || ''}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{shop.email || ''}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Connect on Social Media</h4>
                    <div className="flex space-x-2">
                      {shop.socialLinks && shop.socialLinks.facebook && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={shop.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {shop.socialLinks && shop.socialLinks.instagram && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={shop.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {shop.socialLinks && shop.socialLinks.whatsapp && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={`https://wa.me/${shop.socialLinks.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleShare}
                      disabled={sharing}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      {sharing ? 'Copying...' : 'Share Shop'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <div className="mb-8">
            {currentUser && shop && String(currentUser._id) === String(shop.owner) && (
            <Button onClick={() => setShowAddProduct((v) => !v)}>
              {showAddProduct ? 'Cancel' : 'Add Product'}
            </Button>
            )}
          </div>
          {showAddProduct && currentUser && shop && String(currentUser._id) === String(shop.owner) && (
            <Card className="mb-8 max-w-2xl mx-auto border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Add New Product
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block mb-1 font-medium">Product Name <span className="text-red-500">*</span></label>
                      <Input value={productForm.name} onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))} required />
                      {formErrors.name && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.name}</div>}
                    </div>
                    <div className="space-y-2">
                      <label className="block mb-1 font-medium">Category <span className="text-red-500">*</span></label>
                      <Select value={productForm.category} onValueChange={value => setProductForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.category && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.category}</div>}
                    </div>
                    <div className="space-y-2">
                      <label className="block mb-1 font-medium">Price (PKR) <span className="text-red-500">*</span></label>
                      <Input type="number" min="1" value={productForm.price} onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))} required />
                      {formErrors.price && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.price}</div>}
                    </div>
                    <div className="space-y-2">
                      <label className="block mb-1 font-medium">Discount (%)</label>
                      <Input type="number" min="0" value={productForm.discountPercentage} onChange={e => setProductForm(prev => ({ ...prev, discountPercentage: e.target.value }))} />
                      {formErrors.discountPercentage && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.discountPercentage}</div>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-1 font-medium">Product Image <span className="text-red-500">*</span></label>
                    <div className="flex gap-4 items-start flex-wrap">
                      {productForm.imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group w-24 h-24 flex flex-col items-center justify-center">
                          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg mb-1" />
                          <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100" onClick={e => { e.stopPropagation(); removeProductImage(idx); }}><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors relative" onClick={() => imageInputRef.current?.click()}>
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">Click to upload</p>
                        </div>
                        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files && e.target.files[0]) { handleProductImageUpload(e.target.files); e.target.value = ''; } }} />
                      </div>
                    </div>
                    {formErrors.images && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.images}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-1 font-medium">Description <span className="text-red-500">*</span></label>
                    <Textarea value={productForm.description} onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} required rows={3} />
                    {formErrors.description && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.description}</div>}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                      {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />} {isSubmitting ? 'Adding...' : 'Add Product'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          {editProductIndex !== null && currentUser && shop && String(currentUser._id) === String(shop.owner) && (
            <Card className="mb-8 max-w-2xl mx-auto border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Edit Product
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleUpdateProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block mb-1 font-medium">Product Name <span className="text-red-500">*</span></label>
                      <Input value={productForm.name} onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))} required />
                      {formErrors.name && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.name}</div>}
                    </div>
                    <div className="space-y-2">
                      <label className="block mb-1 font-medium">Category <span className="text-red-500">*</span></label>
                      <Select value={productForm.category} onValueChange={value => setProductForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.category && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.category}</div>}
                    </div>
                    <div className="space-y-2">
                      <label className="block mb-1 font-medium">Price (PKR) <span className="text-red-500">*</span></label>
                      <Input type="number" min="1" value={productForm.price} onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))} required />
                      {formErrors.price && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.price}</div>}
                    </div>
                    <div className="space-y-2">
                      <label className="block mb-1 font-medium">Discount (%)</label>
                      <Input type="number" min="0" value={productForm.discountPercentage} onChange={e => setProductForm(prev => ({ ...prev, discountPercentage: e.target.value }))} />
                      {formErrors.discountPercentage && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.discountPercentage}</div>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-1 font-medium">Product Image</label>
                    <div className="flex gap-4 items-start flex-wrap">
                      {productForm.imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group w-24 h-24 flex flex-col items-center justify-center">
                          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg mb-1" />
                          <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100" onClick={e => { e.stopPropagation(); removeProductImage(idx); }}><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors relative" onClick={() => imageInputRef.current?.click()}>
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">Click to upload</p>
                        </div>
                        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files && e.target.files[0]) { handleProductImageUpload(e.target.files); e.target.value = ''; } }} />
                      </div>
                    </div>
                    {formErrors.images && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.images}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-1 font-medium">Description <span className="text-red-500">*</span></label>
                    <Textarea value={productForm.description} onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} required rows={3} />
                    {formErrors.description && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.description}</div>}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                      {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />} {isSubmitting ? 'Updating...' : 'Update Product'}
                    </Button>
                    <Button type="button" variant="outline" className="ml-2" onClick={() => { setEditProductIndex(null); setProductForm({ name: '', description: '', price: '', discountPercentage: '', category: '', images: [], imagePreviews: [] }); }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Delete Product Confirmation Dialog */}
          {deleteProductIndex !== null && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Delete Product</h3>
                <p className="text-muted-foreground mb-6">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteProductIndex(null)}
                    disabled={isDeletingProduct}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteProduct(deleteProductIndex)}
                    disabled={isDeletingProduct}
                  >
                    {isDeletingProduct ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Product'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Shop Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Delete Shop</h3>
                <p className="text-muted-foreground mb-6">
                  Are you sure you want to delete this shop? This action cannot be undone and will permanently remove all shop data, products, and images.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeletingShop}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteShop}
                    disabled={isDeletingShop}
                  >
                    {isDeletingShop ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Shop'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
