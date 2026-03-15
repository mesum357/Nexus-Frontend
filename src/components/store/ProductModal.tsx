import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingCart, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Minus, 
  Plus,
  Share2,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ProductModalProps {
  product: {
    id: string | number;
    name: string;
    description: string;
    price: string | number;
    originalPrice?: string | number | null;
    discount?: number;
    image: string;
    images?: string[];
    inStock?: boolean;
  };
  shopId: string;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: () => void;
}

export default function ProductModal({ product, shopId, isOpen, onClose, onBuyNow }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');
  const { addToCart } = useCart();
  const { toast } = useToast();

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setQuantity(1);
      setActiveTab('description');
    }
  }, [isOpen]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id.toString(),
      name: product.name,
      price: typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^\d.]/g, '')) 
        : product.price,
      quantity: quantity,
      image: product.image,
      shopId: shopId
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full h-full md:h-[95vh] md:w-[95vw] md:max-w-[1400px] bg-background md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button - Always visible on top */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-6 right-6 z-50 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/80 transition-all border border-white/10 h-10 w-10 md:h-12 md:w-12"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </Button>

          {/* Left Side: Image Gallery (Stick to left on Desktop) */}
          <div className="relative w-full md:w-[55%] h-[40vh] md:h-full bg-zinc-900/40 flex flex-col">
            {/* Main Image View */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden p-8">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotateY: -10 }}
                  transition={{ duration: 0.4 }}
                  src={allImages[currentImageIndex]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                />
              </AnimatePresence>
              
              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevImage}
                    className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white border-none h-12 w-12"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white border-none h-12 w-12"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnails Strip */}
            {allImages.length > 1 && (
              <div className="h-24 md:h-32 bg-black/20 backdrop-blur-sm border-t border-white/5 flex items-center justify-center gap-4 px-6 overflow-x-auto">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden transition-all duration-300 transform ${
                      idx === currentImageIndex 
                        ? 'ring-2 ring-primary scale-110' 
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`view-${idx}`} />
                  </button>
                ))}
              </div>
            )}
            
            {/* Discount Badge */}
            {product.discount ? (
              <Badge className="absolute top-10 left-10 bg-red-600 text-white border-none py-2 px-6 text-lg font-bold rounded-xl shadow-2xl">
                {product.discount}% OFF
              </Badge>
            ) : null}

            {/* Out of Stock Badge */}
            {product.inStock === false && (
              <Badge className="absolute top-10 right-10 bg-zinc-900/90 text-white border-white/20 py-2 px-6 text-lg font-bold rounded-xl shadow-2xl backdrop-blur-md">
                OUT OF STOCK
              </Badge>
            )}
          </div>

          {/* Right Side: Product Details & Actions */}
          <div className="w-full md:w-[45%] h-full flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-6 md:p-10 space-y-8">
                {/* Info Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-3 py-1">
                      New Collection
                    </Badge>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-[1.1] tracking-tight">
                    {product.name}
                  </h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">(124 Global Ratings)</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-secondary/30 border border-border/40">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest line-through mb-1 opacity-50">
                      {product.originalPrice ? (typeof product.originalPrice === 'number' ? `PKR ${product.originalPrice.toLocaleString()}` : product.originalPrice) : ''}
                    </span>
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      {typeof product.price === 'number' ? `PKR ${product.price.toLocaleString()}` : product.price}
                    </span>
                  </div>
                  {product.discount && (
                    <div className="flex-1 flex justify-end">
                      <Badge className="bg-green-500/10 text-green-600 border-none px-4 py-2 font-bold rounded-lg">
                        SAVE {((product.price as number) * (product.discount / 100)).toLocaleString()} PKR
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Tabs for Info */}
                <div className="space-y-6">
                  <div className="flex gap-8 border-b">
                    {(['description', 'details', 'shipping'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                          activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="text-base text-muted-foreground leading-relaxed">
                    {activeTab === 'description' && (
                       <p className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                         {product.description}
                       </p>
                    )}
                    {activeTab === 'details' && (
                       <div className="grid grid-cols-2 gap-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase text-foreground">Material</p>
                            <p className="text-sm">Premium Quality Fabric</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase text-foreground">Weight</p>
                            <p className="text-sm">0.5 kg</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase text-foreground">Origin</p>
                            <p className="text-sm">Pakistan</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase text-foreground">Stock</p>
                            <p className="text-sm text-green-600 font-bold">In Stock</p>
                         </div>
                       </div>
                    )}
                    {activeTab === 'shipping' && (
                       <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <p className="text-sm flex items-center gap-3">
                           <Truck className="h-5 w-5 text-primary" /> Delivery in 3-5 business days across Pakistan.
                         </p>
                       </div>
                    )}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 border-y py-8">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                       <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Verified Quality</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                       <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Fast Express</span>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Bottom Actions Bar */}
            <div className="p-6 md:p-8 bg-background border-t">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between md:justify-start gap-4 p-2 bg-secondary/50 rounded-2xl border">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-xl hover:bg-background"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-xl hover:bg-background"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 flex gap-3">
                  {product.inStock !== false ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="flex-1 h-12 rounded-2xl border-2 hover:bg-primary/5 hover:border-primary/40 text-base font-bold group transition-all"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        Cart
                      </Button>
                      <Button 
                        className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold shadow-xl shadow-primary/20 group transition-all px-4"
                        onClick={onBuyNow}
                      >
                        <CreditCard className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        Buy Now
                      </Button>
                    </>
                  ) : (
                    <Button 
                      disabled
                      className="flex-1 h-12 rounded-2xl bg-zinc-100 text-zinc-400 border-zinc-200 text-base font-bold cursor-not-allowed"
                    >
                      Currently Out of Stock
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
