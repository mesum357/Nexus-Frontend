import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, MapPin, Clock, Eye, Star, ShieldCheck, MessageCircle, Phone, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Navbar from '@/components/Navbar'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import { getProfileImageUrl } from '@/lib/utils'
import { RichTextDisplay } from '@/components/ui/rich-text-display'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'


export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryExisting, setGalleryExisting] = useState<string[]>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [gallerySaving, setGallerySaving] = useState(false)

  // Fetch product data
  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/marketplace/${productId}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive"
          })
          navigate('/marketplace')
          return
        }
        throw new Error('Failed to fetch product')
      }

      const data = await response.json()
      setProduct(data.product)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive"
      })
      navigate('/marketplace')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Fetch current user for ownership checks
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setCurrentUser(data.user)
        }
      } catch {}
    }
    fetchMe()
  }, [])

  // Format price for display
  const formatPrice = (price) => {
    if (price === 0) return 'Free'
    return `PKR ${price.toLocaleString()}`
  }

  // Get time ago from date
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return '1 day ago'
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const handleShare = async () => {
    setSharing(true)
    
    try {
      const productUrl = `${window.location.origin}/marketplace/product/${productId}`
      await navigator.clipboard.writeText(productUrl)
      
      toast({
        title: "Link copied!",
        description: "Product link has been copied to your clipboard.",
      })
    } catch (error) {
      console.error('Failed to copy link:', error)
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSharing(false)
    }
  }

  const isOwner = () => {
    if (!currentUser || !product) return false
    const ownerId = typeof product.owner === 'string' ? product.owner : product.owner?._id
    return String(ownerId) === String(currentUser._id)
  }

  const handleDelete = async () => {
    if (!product?._id) return
    const confirmed = window.confirm('Are you sure you want to delete this product? This action cannot be undone.')
    if (!confirmed) return
    try {
      setDeleting(true)
      const res = await fetch(`${API_BASE_URL}/api/marketplace/${product._id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to delete product')
      toast({ title: 'Deleted', description: 'Product deleted successfully' })
      navigate('/marketplace')
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete product', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  const openGallery = () => {
    setGalleryExisting(product?.images || [])
    setGalleryFiles([])
    setGalleryPreviews([])
    setGalleryOpen(true)
  }

  const onSelectGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[]
    if (!files.length) return
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setGalleryFiles(prev => [...prev, ...files])
    setGalleryPreviews(prev => [...prev, ...newPreviews])
    // reset input value to allow re-selecting same file
    e.currentTarget.value = ''
  }

  const removeExistingImage = (index: number) => {
    setGalleryExisting(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index))
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const saveGallery = async () => {
    if (!product?._id) return
    try {
      setGallerySaving(true)
      const form = new FormData()
      form.append('existingImages', JSON.stringify(galleryExisting))
      galleryFiles.forEach(file => form.append('images', file))
      const res = await fetch(`${API_BASE_URL}/api/marketplace/${product._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: form
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update gallery')
      setProduct(data.product)
      toast({ title: 'Gallery updated', description: 'Your product images have been updated.' })
      setGalleryOpen(false)
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update gallery', variant: 'destructive' })
    } finally {
      setGallerySaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Loading product...</div>
          </div>
        </div>
        
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Product not found</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/marketplace')}
              className="gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Images */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardContent className="p-6">
                  {/* Main Image */}
                  {(() => {
                    // Filter valid Cloudinary images (exclude placeholders)
                    const validImages = product.images && Array.isArray(product.images) 
                      ? product.images.filter(img => 
                          img && 
                          typeof img === 'string' && 
                          img.trim() !== '' &&
                          (img.startsWith('http://') || img.startsWith('https://')) &&
                          img.includes('res.cloudinary.com') &&
                          !img.includes('picsum.photos') &&
                          !img.includes('via.placeholder'))
                      : [];
                    
                    // Ensure selectedImage is within bounds
                    const currentImageIndex = Math.min(selectedImage, validImages.length - 1);
                    
                    return (
                      <>
                        <div className="relative mb-4">
                          {validImages.length > 0 && validImages[currentImageIndex] ? (
                            <img
                              src={validImages[currentImageIndex]}
                              alt={product.title}
                              className="w-full h-96 object-cover rounded-lg"
                              onError={(e) => {
                                // Hide broken images and show empty state
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent && !parent.querySelector('.empty-state')) {
                                  const emptyDiv = document.createElement('div');
                                  emptyDiv.className = 'w-full h-96 bg-muted flex items-center justify-center empty-state rounded-lg';
                                  emptyDiv.innerHTML = '<div class="text-center text-muted-foreground"><p>No Image</p></div>';
                                  parent.appendChild(emptyDiv);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-96 bg-muted flex items-center justify-center rounded-lg">
                              <div className="text-center text-muted-foreground">
                                <p>No Image</p>
                              </div>
                            </div>
                          )}
                          {product.featured && (
                            <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600">
                              Featured
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsFavorited(!isFavorited)}
                            className={`absolute top-4 right-4 h-10 w-10 ${
                              isFavorited ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/80 hover:bg-white'
                            }`}
                          >
                            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                          </Button>
                        </div>

                        {/* Image Thumbnails */}
                        {validImages.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto">
                            {validImages.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                  currentImageIndex === index ? 'border-orange-500' : 'border-transparent'
                                }`}
                              >
                                <img
                                  src={image}
                                  alt={`View ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>

            {/* Product Info & Actions */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-6"
            >
              {/* Price & Title */}
              <Card>
                <CardContent className="p-6">
                  {isOwner() && (
                    <div className="flex items-center justify-end gap-2 mb-4">
                      <Button
                        variant="outline"
                        onClick={openGallery}
                      >
                        Manage Gallery
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/marketplace/edit/${product._id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> {deleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{product.category}</Badge>
                    <Badge variant="outline">{product.condition}</Badge>
                  </div>
                  
                  <h1 className="text-2xl font-bold text-foreground mb-4">
                    {product.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-orange-500">
                      {formatPrice(product.price)}
                    </span>
                    {product.priceType === 'negotiable' && (
                      <Badge variant="outline" className="text-sm">Negotiable</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{product.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeAgo(product.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{product.views} views</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-marketplace-primary hover:bg-marketplace-primary/90 text-white">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Chat with Seller
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="h-5 w-5 mr-2" />
                      Call Seller
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleShare}
                      disabled={sharing}
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      {sharing ? 'Copying...' : 'Share'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Seller Information</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getProfileImageUrl(product.owner?.profileImage)} />
                      <AvatarFallback>{product.ownerName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{product.ownerName}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>4.5</span>
                        </div>
                        <span>•</span>
                        <span>Member since {new Date(product.owner?.createdAt || product.createdAt).getFullYear()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{product.ownerEmail}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View Seller Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Card className="border-marketplace-warning/20 bg-marketplace-warning/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-marketplace-warning" />
                    Safety Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      Meet in public places
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      Check item before payment
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      Avoid advance payments
                      </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Product Gallery */}
          {(() => {
            // Filter valid Cloudinary images for gallery
            const validImages = product.images && Array.isArray(product.images) 
              ? product.images.filter(img => 
                  img && 
                  typeof img === 'string' && 
                  img.trim() !== '' &&
                  (img.startsWith('http://') || img.startsWith('https://')) &&
                  img.includes('res.cloudinary.com') &&
                  !img.includes('picsum.photos') &&
                  !img.includes('via.placeholder'))
              : [];
            
            return validImages.length > 0 ? (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-8"
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {validImages.map((img, idx) => (
                        <button
                          key={`gallery-${idx}`}
                          type="button"
                          onClick={() => setSelectedImage(idx)}
                          className="relative group rounded-lg overflow-hidden border hover:shadow transition"
                          title="View this image"
                        >
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-36 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : null;
          })()}

          {/* Product Details */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Product Details</h3>
                
                <RichTextDisplay content={String(product.description || '')} className="text-muted-foreground mb-6" />

                {product.tags && product.tags.length > 0 && (
                  <>
                <Separator className="my-6" />
                    <h4 className="font-medium text-foreground mb-3">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}

                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h4 className="font-medium text-foreground mb-3">Specifications:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm font-medium text-foreground">{key}:</span>
                          <span className="text-sm text-muted-foreground">{value}</span>
                        </div>
                  ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Gallery</DialogTitle>
            <DialogDescription>Add or remove images for your product.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Current Images</h4>
              {galleryExisting.length === 0 ? (
                <p className="text-sm text-muted-foreground">No images yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {galleryExisting.map((img, idx) => (
                    <div key={`${img}-${idx}`} className="relative">
                      <img src={img} alt={`Existing ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 px-2"
                        onClick={() => removeExistingImage(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Add New Images</h4>
              <input type="file" accept="image/*" multiple onChange={onSelectGalleryFiles} />
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {galleryPreviews.map((src, idx) => (
                    <div key={`new-${idx}`} className="relative">
                      <img src={src} alt={`New ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 px-2"
                        onClick={() => removeNewImage(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setGalleryOpen(false)}>Cancel</Button>
              <Button onClick={saveGallery} disabled={gallerySaving}>{gallerySaving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
