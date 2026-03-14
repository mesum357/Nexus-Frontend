import { motion } from 'framer-motion'
import { Star, Package, ArrowRight, Store } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface FeaturedProduct {
  shopId: string;
  shopName: string;
  name: string;
  image?: string;
  price: number;
  category?: string;
  discountPercentage?: number;
}

interface FeaturedProductsProps {
  products: FeaturedProduct[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Star className="h-6 w-6 text-primary fill-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground text-sm">Top picks from our trusted local shops</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={`${product.shopId}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl bg-card h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 border-none shadow-lg">
                      {product.discountPercentage}% OFF
                    </Badge>
                  )}
                  
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-500/90 text-black hover:bg-yellow-500 border-none shadow-lg backdrop-blur-sm">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="mb-3">
                    <Link 
                      to={`/shop/${product.shopId}`}
                      className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1 mb-1"
                    >
                      <Store className="h-3 w-3" />
                      {product.shopName}
                    </Link>
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-foreground">PKR {product.price.toLocaleString()}</span>
                      {product.discountPercentage && product.discountPercentage > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                          PKR {Math.round(product.price / (1 - product.discountPercentage / 100)).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Button asChild size="sm" className="rounded-full px-4 shadow-sm hover:shadow-md transition-all">
                      <Link to={`/shop/${product.shopId}`}>
                        View
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
