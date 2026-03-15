import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import type { Shop as ShopType } from './Store'

import { motion } from 'framer-motion'
import { ArrowLeft, Star, MapPin, Badge, Phone, Mail, Facebook, Instagram, MessageCircle, Plus, Trash2, Package, ImageIcon, Edit, Settings, Share2, Wrench, Eye, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge as UIBadge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Info } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/use-cart';
import ProductCard from '@/components/store/ProductCard';
import ProductModal from '@/components/store/ProductModal';
import CheckoutModal from '@/components/store/CheckoutModal';
import OrdersDashboardModal from '@/components/store/OrdersDashboardModal';

import { API_BASE_URL } from '@/lib/config'
type ShopWithGallery = ShopType & {
  gallery: string[];
  phone?: string;
  shopDescription?: string;
  description?: string;
  address?: string;
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
  isFeatured?: boolean;
  inStock?: boolean;
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
  const { slug } = useParams();
  const shopId = slug?.includes('+') ? slug.split('+')[1] : slug;
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopWithGallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: '',
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
  const [sharing, setSharing] = useState(false);
  const [showProductPreview, setShowProductPreview] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<any>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrdersDashboardOpen, setIsOrdersDashboardOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const generateQR = async () => {
      try {
        const shopUrl = `${window.location.origin}/shop/${slug}`
        const url = await QRCode.toDataURL(shopUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        })
        setQrCodeUrl(url)
      } catch (err) {
        console.error('Error generating QR code:', err)
      }
    }
    if (shopId) generateQR()
  }, [shopId])

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

            categories: data.shop.categories || [],
            totalReviews: data.shop.totalReviews || 0,
            ownerName: data.shop.ownerName || 'Shop Owner',
            ownerDp: data.shop.ownerDp || '',
            shopDescription: data.shop.shopDescription || data.shop.description,
            businessType: data.shop.shopType || data.shop.businessType,
            city: data.shop.city,
            address: data.shop.address || '',
            phone: data.shop.phone || data.shop.whatsappNumber || '',
            email: data.shop.email || '',
            socialLinks: {
              facebook: data.shop.facebookUrl || '',
              instagram: data.shop.instagramHandle || '',
              whatsapp: data.shop.whatsappNumber || ''
            },
            websiteUrl: data.shop.websiteUrl || '',
            products: data.shop.products || [],
            gallery: data.shop.gallery || [],
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

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      productForm.imagePreviews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
          console.log('📸 Shop - Cleaned up object URL on unmount:', preview);
        }
      });
    };
  }, [productForm.imagePreviews]);

  const handleShare = async () => {
    setSharing(true);
    
    try {
      const shopUrl = `${window.location.origin}/shop/${shopId}`;
      const shareData: ShareData = {
        title: shop?.name || 'Nexus Shop',
        text: `Check out ${shop?.name || 'this shop'} on Nexus!`,
        url: shopUrl,
      };

      // Check if Web Share API supports files
      if (navigator.share && navigator.canShare && qrCodeUrl) {
        try {
          const response = await fetch(qrCodeUrl);
          const blob = await response.blob();
          const file = new File([blob], 'shop-qr.png', { type: 'image/png' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              ...shareData,
              files: [file]
            });
            return;
          }
        } catch (fileError) {
          console.error('Error sharing file:', fileError);
        }
      }

      // Fallback to sharing only text/url
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shopUrl);
        toast({
          title: "Link copied!",
          description: "Shop link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      if ((error as any).name !== 'AbortError') {
        console.error('Failed to share:', error);
        toast({
          title: "Error",
          description: "Failed to share shop. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSharing(false);
    }
  };

  const handleProductImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles: File[] = Array.from(files);
    const newPreviews: string[] = [];
    
    console.log('📸 Shop - Starting instant preview for', newFiles.length, 'files');
    
    // Create instant previews using URL.createObjectURL (like ShopMediaStep)
    newFiles.forEach((file, i) => {
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push(previewUrl);
        console.log(`📸 Shop - File ${i + 1} instant preview created:`, file.name);
      }
    });
    
    console.log('📸 Shop - All instant previews created. newPreviews:', newPreviews.length);
    
    // Update the form with files and instant previews
    setProductForm(prev => {
      const updatedForm = {
        ...prev,
        images: [...prev.images, ...newFiles],
        imagePreviews: [...prev.imagePreviews, ...newPreviews]
      };
      console.log('📸 Shop - Updated form with instant previews:', updatedForm.imagePreviews.length, 'total images');
      return updatedForm;
    });
  };

  const removeProductImage = (index: number) => {
    setProductForm(prev => {
      // Clean up object URL to prevent memory leaks
      const previewToRemove = prev.imagePreviews[index];
      if (previewToRemove && previewToRemove.startsWith('blob:')) {
        URL.revokeObjectURL(previewToRemove);
        console.log('📸 Shop - Cleaned up object URL:', previewToRemove);
      }
      
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
      };
    });
  };

  const validateProductForm = () => {
    const errors: {[key:string]:string} = {};
    if (!productForm.name.trim()) errors.name = 'Product name is required.';
    if (!productForm.description.trim()) errors.description = 'Description is required.';
    if (!productForm.price || isNaN(Number(productForm.price)) || Number(productForm.price) <= 0) errors.price = 'Valid price is required.';
    if (productForm.discountPercentage && (isNaN(Number(productForm.discountPercentage)) || Number(productForm.discountPercentage) < 0)) errors.discountPercentage = 'Discount must be a positive number.';
    
    // Check if we have either images (Files) or imagePreviews (Cloudinary URLs)
    if (productForm.images.length === 0 && productForm.imagePreviews.length === 0) {
      errors.images = 'At least one product image is required.';
    }
    
    return errors;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateProductForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsSubmitting(true);
    
    console.log('📦 Shop - Adding product with form data:', productForm);
    console.log('📦 Shop - Product images:', productForm.images);
    console.log('📦 Shop - Product imagePreviews:', productForm.imagePreviews);
    
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('discountPercentage', productForm.discountPercentage);
      formData.append('category', productForm.category || '');
      
      // Send the first image if available (either File or Cloudinary URL)
      if (productForm.images[0]) {
        formData.append('productImage', productForm.images[0]);
        console.log('📦 Shop - Sending image file:', productForm.images[0]);
      } else if (productForm.imagePreviews[0]) {
        // If no File but we have Cloudinary URL, we need to handle this differently
        console.log('📦 Shop - No image file but have Cloudinary URL:', productForm.imagePreviews[0]);
        // For now, we'll still send the File if available, otherwise the backend will handle missing images
      }
      
      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}/add-product`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Ensure cookies/session are sent
      });
      const result = await response.json();
      if (response.ok) {
        console.log('📦 Shop - Product added successfully:', result);
        setShop(result.shop);
        setShowAddProduct(false);
        
        // Clean up object URLs before resetting form
        productForm.imagePreviews.forEach(preview => {
          if (preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
            console.log('📸 Shop - Cleaned up object URL after submit:', preview);
          }
        });
        
        setProductForm({ name: '', description: '', price: '', discountPercentage: '', images: [], imagePreviews: [] });
        toast({ title: 'Product Added', description: 'Your product was added successfully!', variant: 'default' });
      } else {
        console.error('📦 Shop - Failed to add product:', result);
        toast({ title: 'Error', description: result.error || 'Failed to add product', variant: 'destructive' });
      }
    } catch (err) {
      console.error('📦 Shop - Error adding product:', err);
      toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle canceling/closing add product form
  const handleCancelAddProduct = () => {
    // Clean up object URLs when canceling
    productForm.imagePreviews.forEach(preview => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
        console.log('📸 Shop - Cleaned up object URL on cancel add:', preview);
      }
    });
    
    // Reset form and close
    setProductForm({ name: '', description: '', price: '', discountPercentage: '', images: [], imagePreviews: [] });
    setFormErrors({});
    setShowAddProduct(false);
  };

  // Function to handle canceling/closing edit product form
  const handleCancelEditProduct = () => {
    // Clean up object URLs when canceling
    productForm.imagePreviews.forEach(preview => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
        console.log('📸 Shop - Cleaned up object URL on cancel edit:', preview);
      }
    });
    
    // Reset form and close
    setProductForm({ name: '', description: '', price: '', discountPercentage: '', images: [], imagePreviews: [] });
    setFormErrors({});
    setEditProductIndex(null);
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
      description: product.description || '',
      price: String(product.price),
      discountPercentage: String(product.discountPercentage || ''),
      images: [],
      imagePreviews: product.image ? [product.image] : (product.images || []),
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
    
    console.log('📦 Shop - Updating product at index:', editProductIndex);
    console.log('📦 Shop - Update form data:', productForm);
    console.log('📦 Shop - Product images:', productForm.images);
    console.log('📦 Shop - Product imagePreviews:', productForm.imagePreviews);
    
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('discountPercentage', productForm.discountPercentage);
      
      // Send the first image if available
      if (productForm.images[0]) {
        formData.append('productImage', productForm.images[0]);
        console.log('📦 Shop - Sending updated image file:', productForm.images[0]);
      } else {
        console.log('📦 Shop - No new image uploaded for update');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}/update-product/${editProductIndex}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include', // Ensure cookies/session are sent
      });
      const result = await response.json();
      if (response.ok) {
        console.log('📦 Shop - Product updated successfully:', result);
        setShop(result.shop);
        setEditProductIndex(null);
        
        // Clean up object URLs before resetting form
        productForm.imagePreviews.forEach(preview => {
          if (preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
            console.log('📸 Shop - Cleaned up object URL after update:', preview);
          }
        });
        
        setProductForm({ name: '', description: '', price: '', discountPercentage: '', images: [], imagePreviews: [] });
        toast({ title: 'Product Updated', description: 'Your product was updated successfully!', variant: 'default' });
      } else {
        console.error('📦 Shop - Failed to update product:', result);
        toast({ title: 'Error', description: result.error || 'Failed to update product', variant: 'destructive' });
      }
    } catch (err) {
      console.error('📦 Shop - Error updating product:', err);
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

  const toggleFeaturedProduct = async (productIndex: number) => {
    if (!shop || !shop.products) return;
    
    const updatedProducts = [...shop.products];
    const product = updatedProducts[productIndex];
    product.isFeatured = !product.isFeatured;

    try {
      const formData = new FormData();
      formData.append('isFeatured', String(product.isFeatured));
      
      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}/update-product/${productIndex}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      if (response.ok) {
        setShop(result.shop);
        toast({ 
          title: product.isFeatured ? 'Product Featured' : 'Product Unfeatured', 
          description: `"${product.name}" has been ${product.isFeatured ? 'added to' : 'removed from'} featured products.`,
        });
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to update product', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive' });
    }
  };

  const toggleStockProduct = async (productIndex: number) => {
    if (!shop || !shop.products) return;
    
    const updatedProducts = [...shop.products];
    const product = updatedProducts[productIndex];
    const newStockStatus = product.inStock === false; // If explicitly false, set to true. If undefined/true, set to false.

    try {
      const formData = new FormData();
      formData.append('inStock', String(newStockStatus));
      
      const response = await fetch(`${API_BASE_URL}/api/shop/${shopId}/update-product/${productIndex}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      if (response.ok) {
        setShop(result.shop);
        toast({ 
          title: newStockStatus ? 'Product In Stock' : 'Product Out of Stock', 
          description: `"${product.name}" has been marked as ${newStockStatus ? 'in stock' : 'out of stock'}.`,
        });
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to update product', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive' });
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

  const handleProductPreview = (product: any) => {
    setPreviewProduct(product);
    setShowProductPreview(true);
  };

  const closeProductPreview = () => {
    setShowProductPreview(false);
    setPreviewProduct(null);
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
            className="relative h-64 rounded-2xl overflow-hidden mb-8 bg-black/20"
          >
            {shop.shopBanner || shop.shopLogo ? (
              <img
                src={shop.shopBanner || shop.shopLogo}
                alt={shop.shopName}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No shop image available</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-8 text-white w-full">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-2">{shop.shopName}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      {/* Mobile: Icon only */}
                      <div className="sm:hidden">
                        {shop.shopType === 'Product Seller' ? (
                          <div className="bg-blue-500 text-white rounded-full p-1.5 w-8 h-8 flex items-center justify-center">
                            <Package className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="bg-green-500 text-white rounded-full p-1.5 w-8 h-8 flex items-center justify-center">
                            <Wrench className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      {/* Desktop: Full badge */}
                      <div className="hidden sm:block">
                        <UIBadge 
                          variant={shop.shopType === 'Product Seller' ? 'default' : 'secondary'}
                          className="text-sm px-3 py-1"
                        >
                          {shop.shopType}
                        </UIBadge>
                      </div>
                      {/* Rating removed by user request */}
                    </div>
                  </div>
                  
                  {/* Shop Owner Actions */}
                  {currentUser && String(shop.owner) === String(currentUser._id) && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto min-w-0">
                      {/* Mobile: Small icon buttons */}
                      <div className="flex gap-2 sm:hidden">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/shop/${shopId}/edit`)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="bg-red-600/80 border-red-600/20 text-white hover:bg-red-600 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* Desktop: Full buttons */}
                      <div className="hidden sm:flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsOrdersDashboardOpen(true)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Your Orders
                        </Button>
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

              {/* Featured Products Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Featured Products</CardTitle>
                    {currentUser && String(shop.owner) === String(currentUser._id) && (
                      <UIBadge variant="secondary" className="font-normal">
                        Owner View: Toggle stars to feature products
                      </UIBadge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentUser && String(shop.owner) === String(currentUser._id) ? (
                      // Owner View: Show all products with feature toggle
                      shop.products && shop.products.length > 0 ? (
                        shop.products.map((product, index) => (
                          <div key={index} className={`relative rounded-xl border p-4 transition-all ${product.isFeatured ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20' : 'bg-card'}`}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-muted-foreground/50" />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFeaturedProduct(index)}
                                  className={`h-8 w-8 rounded-full p-0 ${product.isFeatured ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                  <Star className={`h-5 w-5 ${product.isFeatured ? 'fill-current' : ''}`} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditProduct(index)}
                                  className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteProductIndex(index)}
                                  className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <h4 className="font-semibold text-sm line-clamp-1 mb-1">{product.name}</h4>
                            <p className="text-xs text-primary font-bold">PKR {product.price}</p>
                            {product.isFeatured && (
                              <div className="absolute -top-2 -right-2">
                                <UIBadge className="bg-yellow-500 hover:bg-yellow-600 border-none text-[10px] h-5 px-1.5">Featured</UIBadge>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                          <Package className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                          <p>No products added yet.</p>
                          <p className="text-sm">Featured products will appear here.</p>
                        </div>
                      )
                    ) : (
                      // Public View: Show only featured products
                      shop.products && shop.products.filter(p => p.isFeatured).length > 0 ? (
                        shop.products.filter(p => p.isFeatured).map((product, index) => (
                          <ProductCard
                            key={index}
                            product={{
                              ...product,
                              id: index,
                              images: product.images || (product.image ? [product.image] : [])
                            } as any}
                            shopId={shopId || ''}
                            onViewDetails={() => handleProductPreview(product)}
                            onAddToCart={() => {
                              addToCart({
                                productId: index.toString(),
                                name: product.name,
                                price: product.price,
                                quantity: 1,
                                image: product.image || '',
                                shopId: shopId || ''
                              });
                            }}
                            onBuyNow={() => {
                              setPreviewProduct(product);
                              setIsCheckoutModalOpen(true);
                            }}
                          />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12 bg-muted/30 rounded-2xl border-2 border-dashed">
                          <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                          <p className="text-lg font-medium text-muted-foreground">No featured products yet</p>
                          <p className="text-sm text-muted-foreground/60">Check back later for special items from this shop!</p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Product Listing Section */}
              {shop.products && shop.products.length > 0 && (
                <Card className="mb-8 mt-8">
                  <CardHeader>
                    <CardTitle>All Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {(shop.products as ProductType[]).map((product, idx) => (
                        <ProductCard
                          key={idx}
                          product={{
                            ...product,
                            id: idx,
                            images: product.images || (product.image ? [product.image] : [])
                          } as any}
                          shopId={shopId || ''}
                          onViewDetails={() => handleProductPreview(product)}
                          onAddToCart={() => {
                            addToCart({
                              productId: idx.toString(),
                              name: product.name,
                              price: product.price,
                              quantity: 1,
                              image: product.image || '',
                              shopId: shopId || ''
                            });
                          }}
                          onBuyNow={() => {
                            setPreviewProduct(product);
                            setIsCheckoutModalOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
 
              {/* Product Management Section for Owner */}
              {currentUser && shop && String(shop.owner) === String(currentUser._id) && (
                <Card className="border-primary/20 shadow-sm overflow-hidden bg-primary/5 mb-8">
                  <CardHeader className="bg-primary/10 border-b border-primary/10 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Package className="w-5 h-5" />
                        Product Management
                      </CardTitle>
                      <UIBadge className="bg-primary text-white hover:bg-primary/90">
                        {shop.products?.length || 0} Total Products
                      </UIBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-primary/10">
                      {shop.products && shop.products.length > 0 ? (
                        shop.products.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white/50 hover:bg-white transition-colors">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0 border">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-muted-foreground/30" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm text-foreground truncate">{product.name}</h4>
                                <p className="text-xs text-primary font-bold">PKR {product.price}</p>
                                <div className="flex items-center gap-2 mt-1">
                                   {product.inStock !== false ? (
                                     <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 uppercase">In Stock</span>
                                   ) : (
                                     <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 uppercase">Out of Stock</span>
                                   )}
                                   {product.isFeatured && (
                                     <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-200 uppercase">Featured</span>
                                   )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant={product.inStock !== false ? "outline" : "default"}
                                size="sm"
                                onClick={() => toggleStockProduct(index)}
                                className={`h-8 px-3 text-[11px] font-bold ${product.inStock !== false ? 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                              >
                                {product.inStock !== false ? 'Mark Out of Stock' : 'Mark In Stock'}
                              </Button>
                              <div className="flex items-center gap-1 ml-2 border-l border-primary/10 pl-3">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleFeaturedProduct(index)}
                                  className={`h-8 w-8 ${product.isFeatured ? 'text-yellow-500' : 'text-muted-foreground'}`}
                                >
                                  <Star className={`h-4 w-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditProduct(index)}
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteProductIndex(index)}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center text-muted-foreground">
                          <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p className="font-medium">No products found</p>
                          <p className="text-sm">Start by adding your first product to the shop.</p>
                        </div>
                      )}
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
                      {shop.address && (
                        <div className="flex items-start mt-2">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground mt-0.5" />
                          <span className="text-sm text-muted-foreground">{shop.address}</span>
                        </div>
                      )}
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
                  {shop.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{shop.address}</p>
                        <p className="text-sm text-muted-foreground mt-1">{shop.city}</p>
                      </div>
                    </div>
                  )}
                  {!shop.address && shop.city && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{shop.city}</span>
                    </div>
                  )}
                  {shop.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{shop.phone}</span>
                    </div>
                  )}
                  {shop.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{shop.email}</span>
                    </div>
                  )}
                  
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
                      {sharing ? 'Sharing...' : 'Share Shop'}
                    </Button>
                    
                    {qrCodeUrl && (
                      <div className="mt-4 flex flex-col items-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm border mb-2">
                          <img 
                            src={qrCodeUrl} 
                            alt="Shop QR Code" 
                            className="w-32 h-32" 
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Scan to Share
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="mb-8 mt-8">
            {currentUser && shop && String(currentUser._id) === String(shop.owner) && (
              <Button onClick={() => {
                if (showAddProduct) {
                  handleCancelAddProduct();
                } else {
                  setShowAddProduct(true);
                }
              }}>
                <Plus className="w-4 h-4 mr-2" />
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
                    <label className="block mb-1 font-medium">Description <span className="text-red-500">*</span></label>
                    <Textarea value={productForm.description} onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} required rows={3} />
                    {formErrors.description && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.description}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-1 font-medium">Product Images <span className="text-red-500">*</span></label>
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
                          <p className="text-xs text-muted-foreground">Add images</p>
                        </div>
                        <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files && e.target.files.length > 0) { handleProductImageUpload(e.target.files); e.target.value = ''; } }} />
                      </div>
                    </div>
                    {formErrors.images && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.images}</div>}
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
                    <label className="block mb-1 font-medium">Description <span className="text-red-500">*</span></label>
                    <Textarea value={productForm.description} onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} required rows={3} />
                    {formErrors.description && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.description}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-1 font-medium">Product Images</label>
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
                          <p className="text-xs text-muted-foreground">Add images</p>
                        </div>
                        <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files && e.target.files.length > 0) { handleProductImageUpload(e.target.files); e.target.value = ''; } }} />
                      </div>
                    </div>
                    {formErrors.images && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />{formErrors.images}</div>}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                      {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />} {isSubmitting ? 'Updating...' : 'Update Product'}
                    </Button>
                    <Button type="button" variant="outline" className="ml-2" onClick={handleCancelEditProduct}>
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

      {/* Premium Product Modal */}
      {previewProduct && (
        <ProductModal
          product={{
            ...previewProduct,
            id: previewProduct.id || shop?.products?.indexOf(previewProduct) || 0,
            images: previewProduct.images || (previewProduct.image ? [previewProduct.image] : [])
          } as any}
          shopId={shopId || ''}
          isOpen={showProductPreview}
          onClose={closeProductPreview}
          onBuyNow={() => {
            setShowProductPreview(false);
            setIsCheckoutModalOpen(true);
          }}
        />
      )}

      {/* Checkout Modal */}
      {previewProduct && (
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          product={{
            ...previewProduct,
            id: previewProduct.id || shop?.products?.indexOf(previewProduct) || 0,
            images: previewProduct.images || (previewProduct.image ? [previewProduct.image] : [])
          } as any}
          shopId={shopId || ''}
        />
      )}

      {/* Orders Dashboard Modal */}
      <OrdersDashboardModal
        isOpen={isOrdersDashboardOpen}
        onClose={() => setIsOrdersDashboardOpen(false)}
        shopId={shopId || ''}
      />
    </div>
  )
}

function Input(props: any) {
  return <input {...props} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ''}`} />;
}

function Textarea(props: any) {
  return <textarea {...props} className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ''}`} />;
}
