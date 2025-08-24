import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import StoreFilters from '@/components/store/StoreFilters'
import ShopGrid from '@/components/store/ShopGrid'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import heroStoreImage from '@/assets/hero-store.jpg'
import { API_BASE_URL } from '@/lib/config'
export interface Shop {
  _id: string;
  shopName: string;
  city: string;
  shopType?: 'Product Seller' | 'Service Provider';
  shopDescription?: string;
  categories?: string[];
  shopLogo?: string;
  shopBanner?: string;
  products?: Array<{
    name: string;
    images?: string[];
    description?: string;
    price: number;
    discountPercentage?: number;
    category?: string;
  }>;
  ownerName?: string;
  ownerDp?: string;
  rating?: number;
  totalReviews?: number;
}

export default function Store() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        console.log('🛍️ Fetching shops from:', `${API_BASE_URL}/api/shop/all`);
        const response = await fetch(`${API_BASE_URL}/api/shop/all`);
        const data = await response.json();
        console.log('🛍️ Shops data received:', data);
        
        if (Array.isArray(data.shops)) {
          console.log('🛍️ Number of shops:', data.shops.length);
          data.shops.forEach((shop, index) => {
            console.log(`   Shop ${index + 1}:`, {
              name: shop.shopName,
              logo: shop.shopLogo,
              banner: shop.shopBanner,
              ownerDp: shop.ownerDp,
              approvalStatus: shop.approvalStatus
            });
          });
          
          setShops(data.shops);
          setFilteredShops(data.shops);
        } else {
          console.error('❌ Shops data is not an array:', data);
        }
      } catch (error) {
        console.error('❌ Error fetching shops:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShops();
  }, []);

  const handleFilter = (filters: {
    city: string
    category: string
    search: string
  }) => {
    let filtered = shops;
    if (filters.city) {
      filtered = filtered.filter(shop => 
        shop.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.category) {
      filtered = filtered.filter(shop => 
        (shop.categories || []).some(cat => cat.toLowerCase() === filters.category.toLowerCase())
      );
    }
    if (filters.search) {
      filtered = filtered.filter(shop => 
        shop.shopName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        (shop.shopDescription || '').toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    setFilteredShops(filtered);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
            <img 
              src={heroStoreImage} 
              alt="Pakistan Online Store Marketplace" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/95" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/60" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight px-2"
            >
              Discover Local Shops & Services
            </motion.h1>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Connect with local businesses across Pakistan Online. Shop products or find services from trusted vendors in your city.
            </motion.p>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25 text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 sm:py-4 h-12 sm:h-14 w-full sm:w-auto">
                  <Link to="/create-shop">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Create Your Shop
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="rounded-full border-2 border-primary/20 hover:border-primary/40 backdrop-blur-sm text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 sm:py-4 h-12 sm:h-14 w-full sm:w-auto">
                  Browse Shops
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Filters */}
      <StoreFilters onFilter={handleFilter} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 sm:p-6 animate-pulse">
                <div className="h-32 sm:h-40 bg-muted rounded-lg mb-3 sm:mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <ShopGrid shops={filteredShops.map(shop => ({
            ...shop,
            id: shop._id,
            name: shop.shopName,
            shopImage: shop.shopBanner || shop.shopLogo || heroStoreImage,
            category: (shop.categories && shop.categories[0]) || '',
            description: shop.shopDescription || '',
            businessType: shop.shopType,
            ownerName: shop.ownerName || 'Shop Owner',
            ownerDp: shop.ownerDp || '',
            products: shop.products || [],
          }))} />
        )}
      </main>
    </div>
  )
}
