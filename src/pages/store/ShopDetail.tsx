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
      name: "Premium Cotton Shirt",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop",
      price: "PKR 2,500",
      originalPrice: "PKR 3,000",
      discount: 17
    },
    {
      id: 2,
      name: "Elegant Kurta Set",
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=300&fit=crop",
      price: "PKR 4,500",
      originalPrice: null,
      discount: 0
    },
    {
      id: 3,
      name: "Designer Handbag",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      price: "PKR 3,200",
      originalPrice: "PKR 4,000",
      discount: 20
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
  const { shopId } = useParams()
  const navigate = useNavigate()

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

                        <p className="text-muted-foreground mb-4">{shopData.description}</p>

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
                        <Button variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
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
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {shopData.products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                    >
                      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          {product.discount > 0 && (
                            <Badge className="absolute top-2 left-2 bg-marketplace-primary">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground mb-2">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-primary">
                              {product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>

                          <Button className="w-full">View Details</Button>
                        </CardContent>
                      </Card>
                    </motion.div>
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
    </div>
  )
}
