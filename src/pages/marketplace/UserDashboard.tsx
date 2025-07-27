import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, Eye, MessageCircle, Star, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Navbar from '@/components/Navbar'

// Mock data
const userProducts = [
  {
    id: 1,
    title: "iPhone 14 Pro Max - Excellent Condition",
    price: "PKR 280,000",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=200&fit=crop",
    category: "Electronics",
    status: "active",
    views: 234,
    favorites: 18,
    inquiries: 5,
    datePosted: "2 days ago"
  },
  {
    id: 2,
    title: "Gaming Laptop - RTX 3060",
    price: "PKR 150,000",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&h=200&fit=crop",
    category: "Electronics",
    status: "sold",
    views: 156,
    favorites: 12,
    inquiries: 8,
    datePosted: "1 week ago"
  },
  {
    id: 3,
    title: "Office Chair - Ergonomic Design",
    price: "PKR 15,000",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    category: "Furniture",
    status: "active",
    views: 89,
    favorites: 6,
    inquiries: 3,
    datePosted: "3 days ago"
  }
]

const inquiries = [
  {
    id: 1,
    productTitle: "iPhone 14 Pro Max",
    buyerName: "Ali Hassan",
    buyerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    message: "Is this still available? Can we negotiate the price?",
    time: "2 hours ago",
    status: "unread"
  },
  {
    id: 2,
    productTitle: "Gaming Laptop",
    buyerName: "Sara Ahmed",
    buyerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    message: "Can I see more pictures of the laptop?",
    time: "1 day ago",
    status: "read"
  },
  {
    id: 3,
    productTitle: "Office Chair",
    buyerName: "Muhammad Khan",
    buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    message: "What's the condition of the chair?",
    time: "2 days ago",
    status: "replied"
  }
]

const analytics = {
  totalViews: 479,
  totalInquiries: 16,
  activeListing: 2,
  soldItems: 1
}

export default function UserDashboard() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState("products")

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-marketplace-success text-white'
      case 'sold': return 'bg-marketplace-primary text-white'
      case 'expired': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getInquiryStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-marketplace-primary text-white'
      case 'read': return 'bg-gray-500 text-white'
      case 'replied': return 'bg-marketplace-success text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Header */}
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

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-muted-foreground">Manage your marketplace listings and inquiries</p>
            </div>
            <Button 
              className="bg-marketplace-primary hover:bg-marketplace-primary/90"
              onClick={() => navigate('/marketplace/create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Analytics Cards */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-marketplace-accent mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">{analytics.totalViews}</h3>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-marketplace-success mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">{analytics.totalInquiries}</h3>
                <p className="text-sm text-muted-foreground">Inquiries</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 text-marketplace-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">{analytics.activeListing}</h3>
                <p className="text-sm text-muted-foreground">Active Listings</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-marketplace-warning mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">{analytics.soldItems}</h3>
                <p className="text-sm text-muted-foreground">Items Sold</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="products">My Products</TabsTrigger>
                <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProducts.map((product, index) => (
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
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <Badge className={`absolute top-2 right-2 ${getStatusColor(product.status)}`}>
                            {product.status.toUpperCase()}
                          </Badge>
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                            {product.title}
                          </h3>
                          
                          <p className="text-lg font-bold text-marketplace-primary mb-3">
                            {product.price}
                          </p>

                          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                            <Badge variant="outline">{product.category}</Badge>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{product.datePosted}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-center">
                            <div>
                              <p className="font-medium text-foreground">{product.views}</p>
                              <p className="text-muted-foreground">Views</p>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{product.favorites}</p>
                              <p className="text-muted-foreground">Favorites</p>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{product.inquiries}</p>
                              <p className="text-muted-foreground">Inquiries</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="inquiries" className="mt-6">
                <div className="space-y-4">
                  {inquiries.map((inquiry, index) => (
                    <motion.div
                      key={inquiry.id}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={inquiry.buyerAvatar} />
                              <AvatarFallback>{inquiry.buyerName[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-foreground">{inquiry.buyerName}</h4>
                                  <p className="text-sm text-muted-foreground">Inquiry about: {inquiry.productTitle}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getInquiryStatusColor(inquiry.status)}>
                                    {inquiry.status}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">{inquiry.time}</span>
                                </div>
                              </div>

                              <p className="text-muted-foreground mb-4">{inquiry.message}</p>

                              <div className="flex gap-2">
                                <Button size="sm" className="bg-marketplace-primary hover:bg-marketplace-primary/90">
                                  Reply
                                </Button>
                                <Button variant="outline" size="sm">
                                  View Product
                                </Button>
                              </div>
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
