import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Star, MapPin, Badge, User, Eye, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Shop } from '@/pages/Store'
import { useState } from 'react'

interface ShopCardProps {
  shop: Shop
  index: number
}

export default function ShopCard({ shop, index }: ShopCardProps) {
  const navigate = useNavigate()
  const [showPreview, setShowPreview] = useState(false)
  
  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowPreview(true)
  }
  
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
            src={shop.shopImage}
            alt={shop.name}
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
                shop.businessType === 'Product Seller'
                  ? 'bg-blue-500/90 text-white'
                  : 'bg-green-500/90 text-white'
              }`}
            >
              {shop.businessType}
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
              {shop.rating}
            </motion.div>
          </div>

          {/* Preview Button */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={handlePreviewClick}
              className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.button>
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
            {shop.name}
          </h3>

          {/* Description */}
          <div 
            className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{ 
              __html: shop.description || '' 
            }}
            style={{ direction: 'ltr' }}
          />

          {/* Location & Category */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">{shop.city}</span>
            </div>
            <div className="flex items-center">
              <Badge className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">{shop.category}</span>
            </div>
          </div>

          {/* Visit Shop Button */}
          <Button asChild className="w-full rounded-full group/btn h-9 sm:h-10 text-sm sm:text-base">
            <Link to={`/shop/${shop.id}`}>
              <span className="group-hover/btn:scale-105 transition-transform">
                Visit Shop
              </span>
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      {/* Product Preview Popup */}
      {showPreview && (
        <ProductPreviewPopup
          shop={shop}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </motion.div>
  )
}

// Product Preview Popup Component
interface ProductPreviewPopupProps {
  shop: Shop
  isOpen: boolean
  onClose: () => void
}

function ProductPreviewPopup({ shop, isOpen, onClose }: ProductPreviewPopupProps) {
  if (!isOpen) return null

  const galleryImages = shop.products?.flatMap(product => product.images || []) || []

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-card text-card-foreground rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Shop Info */}
          <div className="space-y-4">
            {/* Shop Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 flex-shrink-0">
                <AvatarImage src={shop.shopLogo || shop.shopImage} alt={shop.name} />
                <AvatarFallback className="text-2xl font-bold">
                  {shop.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-2xl mb-2">{shop.name}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    shop.businessType === 'Product Seller'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {shop.businessType}
                  </div>
                  {shop.rating && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{shop.rating}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{shop.city}</span>
                </div>
              </div>
            </div>

            {/* Shop Description */}
            {shop.description && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {shop.description}
                </p>
              </div>
            )}

            {/* Owner Info */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={shop.ownerDp} alt={shop.ownerName} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{shop.ownerName}</p>
                <p className="text-sm text-muted-foreground">Shop Owner</p>
              </div>
            </div>
          </div>

          {/* Right Column - Products & Gallery */}
          <div className="space-y-4">
            {/* Products Count */}
            {shop.products && shop.products.length > 0 && (
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-lg mb-1">
                  {shop.products.length} Product{shop.products.length !== 1 ? 's' : ''} Available
                </h3>
                <p className="text-sm text-muted-foreground">
                  Browse our collection of quality products
                </p>
              </div>
            )}

            {/* Gallery Images */}
            {galleryImages.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Product Gallery</h3>
                <div className="grid grid-cols-2 gap-3">
                  {galleryImages.slice(0, 6).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                  ))}
                  {galleryImages.length > 6 && (
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        +{galleryImages.length - 6} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Visit Shop Button */}
            <Button asChild className="w-full" size="lg">
              <Link to={`/shop/${shop.id}`} onClick={onClose}>
                Visit Shop
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
