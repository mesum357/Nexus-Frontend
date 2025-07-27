import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, MapPin, Clock, Heart, Eye, Smartphone, Car, Sofa, Briefcase, Home, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Navbar from '@/components/Navbar'

const categories = [
  { name: "Electronics", icon: Smartphone, count: "2.5K+" },
  { name: "Vehicles", icon: Car, count: "1.8K+" },
  { name: "Furniture", icon: Sofa, count: "950+" },
  { name: "Jobs", icon: Briefcase, count: "1.2K+" },
  { name: "Property", icon: Home, count: "3.1K+" }
]

const products = [
  {
    id: 1,
    title: "iPhone 14 Pro Max - Excellent Condition",
    price: "PKR 280,000",
    location: "Lahore, Punjab",
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=200&fit=crop",
    category: "Electronics",
    featured: true,
    views: 156
  },
  {
    id: 2,
    title: "Honda Civic 2020 - Low Mileage",
    price: "PKR 4,500,000",
    location: "Karachi, Sindh",
    time: "5 hours ago",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=300&h=200&fit=crop",
    category: "Vehicles",
    featured: false,
    views: 89
  },
  {
    id: 3,
    title: "3 Bedroom Apartment for Rent",
    price: "PKR 45,000/month",
    location: "Islamabad, ICT",
    time: "1 day ago",
    image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=300&h=200&fit=crop",
    category: "Property",
    featured: true,
    views: 234
  },
  {
    id: 4,
    title: "Office Chair - Ergonomic Design",
    price: "PKR 15,000",
    location: "Faisalabad, Punjab",
    time: "3 hours ago",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    category: "Furniture",
    featured: false,
    views: 67
  },
  {
    id: 5,
    title: "Software Developer Position",
    price: "PKR 80,000/month",
    location: "Lahore, Punjab",
    time: "6 hours ago",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop",
    category: "Jobs",
    featured: false,
    views: 445
  },
  {
    id: 6,
    title: "Gaming Laptop - RTX 3060",
    price: "PKR 150,000",
    location: "Multan, Punjab",
    time: "4 hours ago",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&h=200&fit=crop",
    category: "Electronics",
    featured: true,
    views: 178
  }
]

const cities = [
  "All Cities",
  "Karachi",
  "Lahore", 
  "Islamabad",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta"
]

export default function Marketplace() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section with Search */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-orange-500/10 via-background to-primary/5 py-12"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Pakistan <span className="text-orange-500">Marketplace</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Buy, sell, and find everything you need across Pakistan
              </p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="What are you looking for?"
                        className="pl-10 h-12"
                      />
                    </div>
                    
                    <Select>
                      <SelectTrigger className="w-full md:w-48 h-12">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city.toLowerCase()}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-full md:w-48 h-12">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-10k">Under PKR 10,000</SelectItem>
                        <SelectItem value="10k-50k">PKR 10,000 - 50,000</SelectItem>
                        <SelectItem value="50k-100k">PKR 50,000 - 100,000</SelectItem>
                        <SelectItem value="100k-500k">PKR 100,000 - 500,000</SelectItem>
                        <SelectItem value="above-500k">Above PKR 500,000</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button className="h-12 px-8 bg-orange-500 hover:bg-orange-600">
                        <Search className="h-5 w-5 mr-2" />
                        Search
                      </Button>
                      <Button 
                        className="h-12 px-4 bg-primary hover:bg-primary-hover"
                        onClick={() => navigate('/marketplace/create')}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Categories */}
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Browse Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <motion.div
                    key={category.name}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-500/50">
                      <CardContent className="p-6 text-center">
                        <IconComponent className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.count}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* Filters and Products */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="lg:col-span-1"
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Condition</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-muted-foreground">New</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-muted-foreground">Used</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-muted-foreground">Refurbished</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">Sort By</h4>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Most Recent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="popular">Most Popular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Latest Listings</h2>
                <p className="text-muted-foreground">{products.length} results</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {/* Product Image */}
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                        {product.featured && (
                          <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
                            Featured
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-lg font-bold text-orange-500">{product.price}</p>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{product.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{product.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{product.views}</span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
                          onClick={() => navigate(`/marketplace/product/${product.id}`)}
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Listings
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
