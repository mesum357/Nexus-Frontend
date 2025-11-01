import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Star, MapPin, Badge, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Shop } from '@/pages/Store'

interface ShopCardProps {
  shop: Shop
  index: number
}

export default function ShopCard({ shop, index }: ShopCardProps) {
  const navigate = useNavigate()
  
  // Debug image URLs
  console.log(`🖼️ ShopCard ${index + 1} - ${shop.shopName}:`, {
    logo: shop.shopLogo,
    banner: shop.shopBanner,
    ownerDp: shop.ownerDp
  });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="group relative"
    >
      <Card className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        {/* Shop Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <motion.img
            src={shop.shopBanner || shop.shopLogo}
            alt={shop.shopName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            whileHover={{ scale: 1.05 }}
          />
          
          {/* Business Type Badge */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
                shop.shopType === 'Product Seller'
                  ? 'bg-blue-500/90 text-white'
                  : 'bg-green-500/90 text-white'
              }`}
            >
              {shop.shopType}
            </motion.div>
          </div>

          {/* Rating */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-black/70 text-white px-2 py-1 rounded-full flex items-center text-xs"
            >
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              {shop.rating || 0}
            </motion.div>
          </div>
        </div>

        <CardContent className="p-4 sm:p-6">
          {/* Owner Info */}
          <div className="flex items-center mb-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3">
              <AvatarImage src={shop.ownerDp} alt={shop.ownerName} />
              <AvatarFallback>
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs sm:text-sm font-medium text-foreground">{shop.ownerName}</p>
              <p className="text-xs text-muted-foreground">Shop Owner</p>
            </div>
          </div>

          {/* Shop Name */}
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {shop.shopName}
          </h3>

          {/* Description */}
          <div 
            className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{ 
              __html: shop.shopDescription || '' 
            }}
            style={{ direction: 'ltr' }}
          />

          {/* Location & Category */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{shop.city}</span>
              </div>
              <div className="flex items-center">
                <Badge className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{shop.categories?.[0] || 'General'}</span>
              </div>
            </div>
            {shop.address && (
              <div className="flex items-start text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{shop.address}</span>
              </div>
            )}
          </div>

          {/* Visit Shop Button */}
          <Button asChild className="w-full rounded-full group/btn h-9 sm:h-10 text-sm sm:text-base">
            <Link to={`/shop/${shop._id}`}>
              <span className="group-hover/btn:scale-105 transition-transform">
                Visit Shop
              </span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
