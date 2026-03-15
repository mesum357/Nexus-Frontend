import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Clock, Phone, Mail, Globe, MessageCircle, Share2, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Navbar from '@/components/Navbar'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { RichTextDisplay } from '@/components/ui/rich-text-display'
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import ProductCard from '@/components/store/ProductCard'
import ProductModal from '@/components/store/ProductModal'
import CheckoutModal from '@/components/store/CheckoutModal'
import OrdersDashboardModal from '@/components/store/OrdersDashboardModal'
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react'

// Mock shop data
const shopData = {
  id: 1,
  name: "Zara Fashion Hub",
  ownerName: "Ahmed Khan",
  ownerDp: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  shopImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  bannerImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop",
  businessType: "Product Seller",
  city: "Karachi",
  category: "Garments",
  rating: 4.8,
  totalReviews: 156,
  description: "Premium clothing and fashion accessories for men and women. We offer the latest trends in Pakistani and international fashion.",
  joinDate: "January 2022",
  totalProducts: 85,
  followers: 1250,
  contact: {
    phone: "+92 300 1234567",
    email: "info@zarafashionhub.com",
    website: "www.zarafashionhub.com",
    whatsapp: "+92 300 1234567"
  },
  socialMedia: {
    facebook: "zarafashionhub",
    instagram: "@zarafashionhub"
  },
  products: [
    { 
      id: 1, 
      name: "Handcrafted Blue Pottery Vase", 
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800", 
      images: [
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800"
      ],
      price: "PKR 3,500", 
      originalPrice: "PKR 4,500", 
      discount: 22, 
      isFeatured: true,
      description: "Traditional Multani blue pottery vase, handcrafted with intricate floral designs. Perfect for home decor."
    },
    { 
      id: 2, 
      name: "Embroidered Pashmina Shawl", 
      image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800", 
      images: [
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800",
        "https://images.unsplash.com/photo-1616091093714-c64882e9bd55?w=800"
      ],
      price: "PKR 12,000", 
      originalPrice: "PKR 15,000", 
      discount: 20, 
      isFeatured: true,
      description: "Authentic Kashmiri Pashmina shawl with delicate hand embroidery. Warm, soft, and elegant."
    },
    { 
      id: 3, 
      name: "Antique Brass Tea Set", 
      image: "https://images.unsplash.com/photo-1544253102-393282431668?w=800", 
      images: [
        "https://images.unsplash.com/photo-1544253102-393282431668?w=800",
        "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800"
      ],
      price: "PKR 8,500", 
      originalPrice: null, 
      discount: 0, 
      isFeatured: true,
      description: "Vintage-style brass tea set including a teapot, sugar bowl, and six cups. Adds a royal touch to your tea time."
    },
    { 
      id: 4, 
      name: "Hand-knotted Silk Carpet", 
      image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?w=800", 
      price: "PKR 45,000", 
      originalPrice: "PKR 55,000", 
      discount: 18, 
      isFeatured: false,
      description: "Exquisite hand-knotted silk carpet with traditional patterns. High-quality craftsmanship."
    }
  ],
  reviews: [
    {
      id: 1,
      customerName: "Ayesha Ahmed",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      review: "Excellent quality products and fast delivery. Highly recommended!",
      date: "2 weeks ago"
    },
    {
      id: 2,
      customerName: "Ali Hassan",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      rating: 4,
      review: "Good variety of clothes. Prices are reasonable.",
      date: "1 month ago"
    }
  ]
}

export default function ShopDetail() {
  const { slug } = useParams()
  const shopId = slug?.includes('+') ? slug.split('+')[1] : slug;
  const navigate = useNavigate()
  const { toast } = useToast()
  const [sharing, setSharing] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isOrdersDashboardOpen, setIsOrdersDashboardOpen] = useState(false)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 4000 })])

  useEffect(() => {
    const generateQR = async () => {
      try {
        const shopUrl = `${window.location.origin}/store/shop/${slug}`
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
    generateQR()
  }, [shopId])

  const handleShare = async () => {
    setSharing(true)
    
    try {
      const shopUrl = `${window.location.origin}/store/shop/${slug}`
      const shareData: ShareData = {
        title: shopData.name,
        text: `Check out ${shopData.name} on Nexus!`,
        url: shopUrl,
      }

      // Check if Web Share API supports files
      if (navigator.share && navigator.canShare && qrCodeUrl) {
        try {
          const response = await fetch(qrCodeUrl)
          const blob = await response.blob()
          const file = new File([blob], 'shop-qr.png', { type: 'image/png' })
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              ...shareData,
              files: [file]
            })
            return
          }
        } catch (fileError) {
          console.error('Error sharing file:', fileError)
        }
      }

      // Fallback to sharing only text/url
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shopUrl)
        toast({
          title: "Link copied!",
          description: "Shop link has been copied to your clipboard.",
        })
      }
    } catch (error) {
      if ((error as any).name !== 'AbortError') {
        console.error('Failed to share:', error)
        toast({
          title: "Error",
          description: "Failed to share shop. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setSharing(false)
    }
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
              onClick={() => navigate('/store')}
              className="gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
          </motion.div>
        </div>

        {/* Shop Banner */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-64 md:h-80"
        >
          <img
            src={shopData.bannerImage}
            alt="Shop Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Shop Header */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative -mt-20"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Shop Logo */}
                  <div className="relative">
                    <img
                      src={shopData.shopImage}
                      alt={shopData.name}
                      className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-lg"
                    />
                  </div>

                  {/* Shop Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                          {shopData.name}
                        </h1>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{shopData.rating}</span>
                            <span className="text-muted-foreground">({shopData.totalReviews} reviews)</span>
                          </div>
                          <Badge variant="outline">{shopData.businessType}</Badge>
                          <Badge variant="outline">{shopData.category}</Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{shopData.city}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Member since {shopData.joinDate}</span>
                          </div>
                        </div>

                        <RichTextDisplay content={shopData.description} className="text-muted-foreground mb-4" />

                        {/* Stats */}
                        <div className="flex gap-6">
                          <div className="text-center">
                            <p className="text-xl font-bold text-foreground">{shopData.totalProducts}</p>
                            <p className="text-sm text-muted-foreground">Products</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-foreground">{shopData.followers}</p>
                            <p className="text-sm text-muted-foreground">Followers</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-foreground">{shopData.rating}</p>
                            <p className="text-sm text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Button className="bg-primary hover:bg-primary-hover">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline">
                          <Heart className="h-4 w-4 mr-2" />
                          Follow
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleShare}
                          disabled={sharing}
                          className="relative group"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          {sharing ? 'Sharing...' : 'Share'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* QR Code Section */}
                  {qrCodeUrl && (
                    <div className="hidden lg:flex flex-col items-center justify-center pl-6 border-l">
                      <div className="bg-white p-2 rounded-lg shadow-sm mb-2 border">
                        <img 
                          src={qrCodeUrl} 
                          alt="Shop QR Code" 
                          className="w-24 h-24"
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

          {/* Content Tabs */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="py-8"
          >
            {/* Featured Products Section */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold flex items-center gap-3">
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                  Featured Collection
                </h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-12 w-12 border-2"
                    onClick={() => emblaApi?.scrollPrev()}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-12 w-12 border-2"
                    onClick={() => emblaApi?.scrollNext()}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6 py-4">
                  {shopData.products.filter(p => p.isFeatured).map((product) => (
                    <div key={`featured-${product.id}`} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                      <ProductCard 
                        product={{...product, description: product.description || "No description available"}} 
                        shopId={shopId || ''}
                        onViewDetails={(p) => {
                          setSelectedProduct(p);
                          setIsProductModalOpen(true);
                        }}
                        onBuyNow={(p) => {
                          setSelectedProduct(p);
                          setIsCheckoutModalOpen(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {shopData.products.map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={{...product, description: product.description || "No description available"}} 
                      shopId={shopId || ''}
                      onViewDetails={(p) => {
                        setSelectedProduct(p);
                        setIsProductModalOpen(true);
                      }}
                      onBuyNow={(p) => {
                        setSelectedProduct(p);
                        setIsCheckoutModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="about" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Owner Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Shop Owner</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={shopData.ownerDp} />
                          <AvatarFallback>{shopData.ownerName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{shopData.ownerName}</h3>
                          <p className="text-muted-foreground">Shop Owner</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Passionate about providing quality fashion products to customers across Pakistan.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{shopData.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{shopData.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <span>{shopData.contact.website}</span>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Social Media</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Facebook: {shopData.socialMedia.facebook}</p>
                          <p className="text-sm text-muted-foreground">Instagram: {shopData.socialMedia.instagram}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {shopData.reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={review.avatar} />
                              <AvatarFallback>{review.customerName[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-foreground">{review.customerName}</h4>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>

                              <p className="text-muted-foreground">{review.review}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {selectedProduct && (
        <>
          <ProductModal
            product={selectedProduct}
            shopId={shopId || ''}
            isOpen={isProductModalOpen}
            onClose={() => setIsProductModalOpen(false)}
            onBuyNow={() => {
              setIsProductModalOpen(false);
              setIsCheckoutModalOpen(true);
            }}
          />
          <CheckoutModal
            product={selectedProduct}
            shopId={shopId || ''}
            isOpen={isCheckoutModalOpen}
            onClose={() => setIsCheckoutModalOpen(false)}
            onSuccess={() => {}}
          />
        </>
      )}

      <OrdersDashboardModal 
        shopId={shopId || ''} 
        isOpen={isOrdersDashboardOpen} 
        onClose={() => setIsOrdersDashboardOpen(false)} 
      />
    </div>
  )
}
