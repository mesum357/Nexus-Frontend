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
      className="group"
    >
      <Card className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        {/* Shop Image */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={shop.shopImage}
            alt={shop.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            whileHover={{ scale: 1.05 }}
          />
          
          {/* Business Type Badge */}
          <div className="absolute top-3 left-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                shop.businessType === 'Product Seller'
                  ? 'bg-blue-500/90 text-white'
                  : 'bg-green-500/90 text-white'
              }`}
            >
              {shop.businessType}
            </motion.div>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-black/70 text-white px-2 py-1 rounded-full flex items-center text-xs"
            >
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              {shop.rating}
            </motion.div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Owner Info */}
          <div className="flex items-center mb-3">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={shop.ownerDp} alt={shop.ownerName} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{shop.ownerName}</p>
              <p className="text-xs text-muted-foreground">Shop Owner</p>
            </div>
          </div>

          {/* Shop Name */}
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {shop.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {shop.description}
          </p>

          {/* Location & Category */}
          <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {shop.city}
            </div>
            <div className="flex items-center">
              <Badge className="h-3 w-3 mr-1" />
              {shop.category}
            </div>
          </div>

          {/* Visit Shop Button */}
          <Button asChild className="w-full rounded-full group/btn">
            <Link to={`/shop/${shop.id}`}>
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
