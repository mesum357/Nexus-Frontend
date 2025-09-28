import { motion, AnimatePresence } from 'framer-motion'
import { X, Store, GraduationCap, Users, Heart, ShoppingCart, Target, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface AboutPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutPopup({ isOpen, onClose }: AboutPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-center text-primary mb-2">
            About E Duniya
          </DialogTitle>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed">
          {/* Introduction */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-900 dark:text-blue-100 text-center">
              E Duniya is your city's all-in-one digital hub — connecting people, businesses, and communities on a single platform.
            </p>
          </div>

          {/* What You Can Do */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground text-center mb-4">
              Here, you can:
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shopping */}
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Store className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Shop from Local Vendors</h4>
                  <p className="text-sm text-muted-foreground">
                    Access our multi-vendor store to discover and purchase from local businesses in your area.
                  </p>
                </div>
              </div>

              {/* Learning */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Learn with Online Courses</h4>
                  <p className="text-sm text-muted-foreground">
                    Explore educational content and connect with education hubs for continuous learning.
                  </p>
                </div>
              </div>

              {/* Community */}
              <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Connect with Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Engage with your local community through posts, events, and social interactions.
                  </p>
                </div>
              </div>

              {/* Healthcare */}
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Access Healthcare Services</h4>
                  <p className="text-sm text-muted-foreground">
                    Find hospitals, clinics, and essential healthcare services in your vicinity.
                  </p>
                </div>
              </div>

              {/* Marketplace */}
              <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800 md:col-span-2">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Buy & Sell Easily</h4>
                  <p className="text-sm text-muted-foreground">
                    Our marketplace makes it simple to buy and sell products with local buyers and sellers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Statement */}
          <section className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg border border-primary/20">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  Our mission is simple: empower local businesses, support learners, and bring communities closer through technology.
                </p>
              </div>
            </div>
          </section>

          {/* Vision */}
          <section className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-600/10 to-primary/10 rounded-lg border border-blue-600/20">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Our Vision</h3>
                <p className="text-muted-foreground">
                  With E Duniya, everything your city offers is just a click away.
                </p>
              </div>
            </div>
          </section>

          {/* Key Benefits */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground text-center">
              Why Choose E Duniya?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Local Focus</h4>
                <p className="text-xs text-muted-foreground">
                  Connect with businesses and services in your own city
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Community Driven</h4>
                <p className="text-xs text-muted-foreground">
                  Built for and by the local community
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-foreground mb-2">All-in-One</h4>
                <p className="text-xs text-muted-foreground">
                  Everything you need in one platform
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-border">
          <Button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
