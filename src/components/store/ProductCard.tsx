import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart, CreditCard, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
  product: {
    id: string | number;
    name: string;
    image: string;
    price: string | number;
    originalPrice?: string | number;
    discount?: number;
    inStock?: boolean;
    isFeatured?: boolean;
    description: string;
    images?: string[];
  };
  shopId: string;
  onViewDetails: (product: any) => void;
  onBuyNow: (product: any) => void;
}

export default function ProductCard({ product, shopId, onViewDetails, onBuyNow }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id.toString(),
      name: product.name,
      price: typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^\d.]/g, '')) 
        : product.price,
      quantity: 1,
      image: product.image,
      shopId: shopId
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -10 }}
      className="group"
      onClick={() => onViewDetails(product)}
    >
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl bg-background/50 backdrop-blur-md">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end">
             {/* Actions */}
             <div className="flex gap-1.5 p-3 pt-0">
                {product.inStock !== false ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-9 rounded-xl border-zinc-200 hover:bg-primary/5 hover:border-primary/40 text-[11px] font-bold group px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(e);
                      }}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1 group-hover:scale-110 transition-transform" />
                      Cart
                    </Button>
                    <Button 
                      className="flex-1 h-9 rounded-xl bg-primary text-white hover:bg-primary/90 text-[11px] font-bold shadow-lg shadow-primary/20 group px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyNow(product);
                      }}
                    >
                      <CreditCard className="h-3.5 w-3.5 mr-1 group-hover:scale-110 transition-transform" />
                      Buy Now
                    </Button>
                  </>
                ) : (
                  <Button 
                    disabled
                    className="flex-1 h-9 rounded-xl bg-zinc-100 text-zinc-400 border-zinc-200 text-[10px] font-bold cursor-not-allowed"
                  >
                    Unavailable
                  </Button>
                )}
             </div>
          </div>
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* Discount Badge */}
            {product.discount ? (
              <Badge className="bg-red-500 text-white border-none font-bold rounded-lg px-2 py-1">
                -{product.discount}%
              </Badge>
            ) : null}

            {/* Out of Stock Badge */}
            {product.inStock === false && (
              <Badge className="bg-zinc-900/90 text-white border-white/20 font-black backdrop-blur-md rounded-lg px-2 py-1">
                OUT OF STOCK
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-yellow-500 text-black border-none font-bold rounded-lg px-2 py-1">
                <Star className="h-3 w-3 fill-black mr-1" /> Featured
              </Badge>
            )}
          </div>
          
          <Button 
            size="icon" 
            variant="secondary" 
            className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="p-5">
          <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{product.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-xl font-black text-primary">
                {typeof product.price === 'number' ? `PKR ${product.price.toLocaleString()}` : product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through opacity-60">
                  {typeof product.originalPrice === 'number' ? `PKR ${product.originalPrice.toLocaleString()}` : product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
