import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, MapPin, Clock, Eye, Star, ShieldCheck, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Navbar from '@/components/Navbar'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import { getProfileImageUrl } from '@/lib/utils'


export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

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
                  <div className="relative mb-4">
                    <img
                      src={product.images && product.images.length > 0 ? `${API_BASE_URL}${product.images[selectedImage]}` : 'https://via.placeholder.com/600x400?text=No+Image'}
                      alt={product.title}
                      className="w-full h-96 object-cover rounded-lg"
                    />
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
                  {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImage === index ? 'border-orange-500' : 'border-transparent'
                        }`}
                      >
                        <img
                            src={`${API_BASE_URL}${image}`}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  )}
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
                    <Button variant="outline" className="w-full">
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
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
                
                <p className="text-muted-foreground mb-6">{product.description}</p>

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
    </div>
  )
}
