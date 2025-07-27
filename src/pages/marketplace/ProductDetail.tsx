import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, MapPin, Clock, Eye, Star, ShieldCheck, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Navbar from '@/components/Navbar'

// Mock product data
const productData = {
  id: 1,
  title: "iPhone 14 Pro Max - Excellent Condition",
  price: "PKR 280,000",
  originalPrice: "PKR 320,000",
  discount: "12% OFF",
  location: "Lahore, Punjab",
  time: "2 hours ago",
  images: [
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=400&fit=crop"
  ],
  category: "Electronics",
  condition: "Used",
  description: "Selling my iPhone 14 Pro Max in excellent condition. Only 6 months old, all accessories included. Phone is in pristine condition with no scratches or damage. Battery health is 98%. Original box and charger included.",
  features: [
    "256GB Storage",
    "Pro Camera System",
    "All accessories included", 
    "6 months warranty remaining",
    "Face ID working perfectly"
  ],
  seller: {
    name: "Ahmad Hassan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    totalSales: 45,
    joinDate: "Member since 2020",
    verified: true
  },
  views: 234,
  favorites: 18,
  safety: [
    "Meet in public places",
    "Check item before payment",
    "Avoid advance payments"
  ]
}

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

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
                      src={productData.images[selectedImage]}
                      alt={productData.title}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    {productData.discount && (
                      <Badge className="absolute top-4 left-4 bg-marketplace-primary hover:bg-marketplace-primary">
                        {productData.discount}
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
                  <div className="flex gap-2 overflow-x-auto">
                    {productData.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-marketplace-primary' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
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
                    <Badge variant="outline">{productData.category}</Badge>
                    <Badge variant="outline">{productData.condition}</Badge>
                  </div>
                  
                  <h1 className="text-2xl font-bold text-foreground mb-4">
                    {productData.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-marketplace-primary">
                      {productData.price}
                    </span>
                    {productData.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {productData.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{productData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{productData.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{productData.views} views</span>
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
                      <AvatarImage src={productData.seller.avatar} />
                      <AvatarFallback>{productData.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{productData.seller.name}</h4>
                        {productData.seller.verified && (
                          <ShieldCheck className="h-4 w-4 text-marketplace-success" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{productData.seller.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{productData.seller.totalSales} sales</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{productData.seller.joinDate}</p>
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
                    {productData.safety.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-marketplace-warning mt-2 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
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
                
                <p className="text-muted-foreground mb-6">{productData.description}</p>

                <Separator className="my-6" />

                <h4 className="font-medium text-foreground mb-3">Key Features:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {productData.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-marketplace-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
