import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateQuantity, totalAmount, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    // For now we don't have a global checkout, but we could navigate to a summary or just toast
    // The user usually buys per product in this app as per the current flow
    navigate('/store'); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[140]"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l shadow-2xl z-[150] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Your Cart</h2>
                  <p className="text-sm text-muted-foreground">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-xl font-bold">Your cart is empty</p>
                    <p className="text-sm mt-1">Looks like you haven't added anything yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-6 rounded-xl font-bold"
                      onClick={onClose}
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.shopId}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="p-4 rounded-2xl border border-border/50 bg-white/50 space-y-3"
                    >
                      <div className="flex gap-4">
                        <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden border shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-muted-foreground/20" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="font-bold text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-primary font-bold mt-1">PKR {item.price.toLocaleString()}</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-secondary/30 rounded-lg border px-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-muted/20 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">PKR {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-primary">
                    <span>Total Amount</span>
                    <span className="text-lg">PKR {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl font-bold h-12"
                    onClick={clearCart}
                  >
                    Clear All
                  </Button>
                  <Button 
                    className="flex-[2] rounded-xl font-bold h-12 gap-2 shadow-lg shadow-primary/20"
                    onClick={() => {
                        onClose();
                        navigate('/store'); // Or to a specific checkout page if implemented
                    }}
                  >
                    Proceed to Store <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {cart.length === 0 && (
                <div className="p-6 border-t bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground">Add items to proceed with checkout</p>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
