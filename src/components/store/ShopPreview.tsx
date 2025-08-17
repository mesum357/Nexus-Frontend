import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, Badge, User, Phone, Mail, Globe } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Shop } from '@/pages/Store'

interface ShopPreviewProps {
  shop: Shop
  isVisible: boolean
  position: { x: number; y: number }
}

export default function ShopPreview({ shop, isVisible, position }: ShopPreviewProps) {
  // Get gallery images from shop products
  const galleryImages = shop.products?.flatMap(product => product.images || []) || []
  
  // Don't show preview if no meaningful content
  if (!shop.description && galleryImages.length === 0 && (!shop.categories || shop.categories.length === 0)) {
    return null
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-50 pointer-events-none"
          style={{
            left: Math.min(position.x + 20, window.innerWidth - 340), // Prevent overflow on right
            top: Math.max(position.y - 20, 20), // Prevent overflow on top
          }}
        >
          {/* Preview Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-80 max-w-sm">
            {/* Shop Header */}
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-16 w-16 flex-shrink-0">
                <AvatarImage src={shop.shopLogo || shop.shopImage} alt={shop.name} />
                <AvatarFallback className="text-lg font-bold">
                  {shop.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 line-clamp-2">
                  {shop.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    shop.businessType === 'Product Seller'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {shop.businessType}
                  </div>
                  {shop.rating && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs font-medium">{shop.rating}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="line-clamp-1">{shop.city}</span>
                </div>
              </div>
            </div>

            {/* Shop Description */}
            {shop.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {shop.description}
                </p>
              </div>
            )}

            {/* Gallery Images */}
            {galleryImages.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Gallery ({galleryImages.length})
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {galleryImages.slice(0, 6).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                  ))}
                  {galleryImages.length > 6 && (
                    <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{galleryImages.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={shop.ownerDp} alt={shop.ownerName} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {shop.ownerName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Shop Owner
                </p>
              </div>
            </div>

            {/* Categories */}
            {shop.categories && shop.categories.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {shop.categories.slice(0, 3).map((category, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                  {shop.categories.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{shop.categories.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products Count */}
            {shop.products && shop.products.length > 0 && (
              <div className="mt-3 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {shop.products.length} product{shop.products.length !== 1 ? 's' : ''} available
                </span>
              </div>
            )}
          </div>

          {/* Arrow Pointer */}
          <div className="absolute left-0 top-6 w-0 h-0 border-r-8 border-r-white dark:border-r-gray-900 border-t-8 border-t-transparent border-b-8 border-b-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
