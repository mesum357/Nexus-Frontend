import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, MapPin, Clock, Heart, Eye, Smartphone, Car, Sofa, Briefcase, Home, ChevronRight, Plus, Trash2, MoreHorizontal, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import marketImage from '@/assets/market.avif'



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
]

const categoryIcons = {
  'Electronics': Smartphone,
  'Vehicles': Car,
  'Furniture': Sofa,
  'Jobs': Briefcase,
  'Property': Home,
  'Fashion': Home,
  'Books': Home,
  'Sports': Home,
  'Home & Garden': Home,
  'Services': Home,
  'Other': Home
}



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
  const { toast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('')
  const [condition, setCondition] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [categoryStats, setCategoryStats] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.log('Fetching products from:', `${API_BASE_URL}/api/marketplace`)
      
      const params = new URLSearchParams()
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedCity !== 'All Cities') params.append('city', selectedCity)
      if (condition) params.append('condition', condition)
      if (sortBy) params.append('sortBy', sortBy)
      if (priceRange && priceRange !== 'all-prices') {
        const [min, max] = priceRange.split('-')
        if (min) params.append('priceMin', min)
        if (max && max !== '999999999') params.append('priceMax', max)
      }

      const response = await fetch(`${API_BASE_URL}/api/marketplace?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log('Response status:', response.status)
      
      if (response.status === 401) {
        console.warn('Unauthorized access - proceeding without authentication')
        // Continue anyway for public marketplace data
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (response.ok || response.status === 401) {
        // Even with 401, we might get public data
        const apiProducts = data.products || []
        setProducts(apiProducts)
        console.log('Products set from API:', apiProducts.length)
      } else {
        console.error('Failed to fetch products:', data.error)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch category statistics
  const fetchCategoryStats = async () => {
    try {
      console.log('Fetching category stats from:', `${API_BASE_URL}/api/marketplace/categories/stats`)
      const response = await fetch(`${API_BASE_URL}/api/marketplace/categories/stats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log('Category stats response status:', response.status)
      
      if (response.status === 401) {
        console.warn('Unauthorized access for category stats - using empty data')
        setCategoryStats([])
        return
      }
      
      const data = await response.json()
      console.log('Category stats data:', data)
      
      if (response.ok) {
        setCategoryStats(data.categories || [])
        console.log('Category stats set:', data.categories?.length || 0)
      } else {
        setCategoryStats([])
      }
    } catch (error) {
      console.error('Error fetching category stats:', error)
      setCategoryStats([])
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategoryStats()
    fetchCurrentUser()
  }, [])

  // Separate useEffect for filters to avoid infinite loops
  useEffect(() => {
    fetchProducts()
  }, [searchTerm, selectedCategory, selectedCity, condition, sortBy, priceRange])

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

  // Get category count
  const getCategoryCount = (categoryName) => {
    const stat = categoryStats.find(s => s._id === categoryName)
    return stat ? `${stat.count}+` : '0+'
  }

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      setDeleting(true)
      const response = await fetch(`${API_BASE_URL}/api/marketplace/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully"
        })
        // Remove product from state
        setProducts(prev => prev.filter(p => p._id !== productId))
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive"
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  // Check if user is owner of product
  const isProductOwner = (product) => {
    if (!currentUser || !product.owner) return false
    return currentUser._id === product.owner._id || currentUser._id === product.owner
  }
  
  console.log('Marketplace component rendering, loading:', loading, 'products:', products.length)
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 sm:pt-20">
        {/* Hero Section with Search */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative py-8 sm:py-12"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(${marketImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-background/80" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Pakistan <span className="text-orange-500">Marketplace</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
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
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    {/* Search Input - Full width */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="What are you looking for?"
                        className="pl-10 h-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    {/* Filters Row - Stack on mobile */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="w-full sm:w-48 h-12">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="w-full sm:w-48 h-12">
                          <SelectValue placeholder="Price Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-prices">All Prices</SelectItem>
                          <SelectItem value="0-10000">Under PKR 10,000</SelectItem>
                          <SelectItem value="10000-50000">PKR 10,000 - 50,000</SelectItem>
                          <SelectItem value="50000-100000">PKR 50,000 - 100,000</SelectItem>
                          <SelectItem value="100000-500000">PKR 100,000 - 500,000</SelectItem>
                          <SelectItem value="500000-999999999">Above PKR 500,000</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex gap-2">
                        <Button className="h-12 px-6 sm:px-8 bg-orange-500 hover:bg-orange-600 flex-1 sm:flex-none">
                          <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                          <span className="hidden sm:inline">Search</span>
                        </Button>
                        <Button 
                          className="h-12 px-4 bg-primary hover:bg-primary-hover"
                          onClick={() => navigate('/marketplace/create')}
                        >
                          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Categories */}
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Browse Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((category, index) => {
                const IconComponent = categoryIcons[category] || Home
                return (
                  <motion.div
                    key={category}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-500/50"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <CardContent className="p-4 sm:p-6 text-center">
                        <IconComponent className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500 mx-auto mb-2 sm:mb-3" />
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">{category}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{getCategoryCount(category)}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* Filters and Products */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="lg:col-span-1 order-2 lg:order-1"
            >
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Condition</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="condition"
                            checked={condition === 'new'}
                            onChange={() => setCondition('new')}
                            className="rounded" 
                          />
                          <span className="text-xs sm:text-sm text-muted-foreground">New</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="condition"
                            checked={condition === 'used'}
                            onChange={() => setCondition('used')}
                            className="rounded" 
                          />
                          <span className="text-xs sm:text-sm text-muted-foreground">Used</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="condition"
                            checked={condition === 'refurbished'}
                            onChange={() => setCondition('refurbished')}
                            className="rounded" 
                          />
                          <span className="text-xs sm:text-sm text-muted-foreground">Refurbished</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="condition"
                            checked={condition === ''}
                            onChange={() => setCondition('')}
                            className="rounded" 
                          />
                          <span className="text-xs sm:text-sm text-muted-foreground">All</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Sort By</h4>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-9 sm:h-10">
                          <SelectValue placeholder="Most Recent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="createdAt">Most Recent</SelectItem>
                          <SelectItem value="price">Price: Low to High</SelectItem>
                          <SelectItem value="-price">Price: High to Low</SelectItem>
                          <SelectItem value="views">Most Popular</SelectItem>
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
              className="lg:col-span-3 order-1 lg:order-2"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Latest Listings</h2>
                <p className="text-muted-foreground text-sm sm:text-base">{products.length} results</p>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id || index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {/* Product Image */}
                      <div className="relative">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={product.title}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                        {product.featured && (
                          <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-xs">
                            Featured
                          </Badge>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                            className="h-7 w-7 sm:h-8 sm:w-8 bg-white/80 hover:bg-white"
                        >
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                          {isProductOwner(product) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 sm:h-8 sm:w-8 bg-white/80 hover:bg-white"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/marketplace/edit/${product._id}`)
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Product
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setProductToDelete(product)
                                    setDeleteDialogOpen(true)
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Product
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-3 sm:p-4">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm sm:text-base">
                          {product.title}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-base sm:text-lg font-bold text-orange-500">{formatPrice(product.price)}</p>
                          <Badge variant="outline" className="text-xs">{product.category}</Badge>
                        </div>

                        <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{product.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{getTimeAgo(product.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{product.views}</span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="w-full mt-3 sm:mt-4 bg-orange-500 hover:bg-orange-600 text-sm sm:text-base h-9 sm:h-10"
                          onClick={() => navigate(`/marketplace/product/${product._id}`)}
                        >
                          View Details
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              )}

              {/* Load More */}
              <div className="text-center mt-6 sm:mt-8">
                <Button variant="outline" size="lg" className="h-10 sm:h-11">
                  Load More Listings
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setProductToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteProduct(productToDelete?._id)}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
