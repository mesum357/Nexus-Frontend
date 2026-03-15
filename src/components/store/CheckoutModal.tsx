import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, User, MapPin, Phone, Mail, CheckCircle2, Upload, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { API_BASE_URL } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface CheckoutModalProps {
  product: {
    id: string | number;
    name: string;
    price: string | number;
    image: string;
  };
  shopId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CheckoutModal({ product, shopId, isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    transactionId: '',
  });
  
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append('shopId', shopId);
      form.append('totalAmount', (typeof product.price === 'string' ? parseFloat(product.price.replace(/[^\d.]/g, '')) : product.price).toString());
      form.append('products', JSON.stringify([{
        productId: product.id.toString(),
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price.replace(/[^\d.]/g, '')) : product.price,
        quantity: 1,
        image: product.image
      }]));
      form.append('personalInfo', JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      }));
      form.append('address', JSON.stringify({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      }));
      form.append('transactionId', formData.transactionId);
      if (screenshot) {
        form.append('screenshot', screenshot);
      }

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        body: form,
        credentials: 'include'
      });

      if (res.ok) {
        toast({
          title: "Order Placed Successfully",
          description: "You will receive a notification after approval.",
        });
        onSuccess?.();
        onClose();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to place order');
      }
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-background rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Secure Checkout</h2>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`h-1.5 rounded-full transition-all ${step >= s ? 'w-6 bg-primary' : 'w-2 bg-muted'}`} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2 font-medium uppercase tracking-wider">Step {step} of 3</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                   <img src={product.image} className="h-20 w-20 object-cover rounded-xl" alt={product.name} />
                   <div>
                     <p className="font-bold text-lg">{product.name}</p>
                     <p className="text-primary font-black">{typeof product.price === 'number' ? `PKR ${product.price.toLocaleString()}` : product.price}</p>
                   </div>
                </div>
                
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Mesum Abbas" className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+92 300 1234567" className="rounded-xl h-12" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="massux357@gmail.com" className="rounded-xl h-12" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Delivery Address
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" name="street" value={formData.street} onChange={handleInputChange} placeholder="House 123, Street 4, Phase 5..." className="rounded-xl h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Karachi" className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Province / State</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleInputChange} placeholder="Sindh" className="rounded-xl h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip / Postal Code</Label>
                    <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="75500" className="rounded-xl h-12" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Payment Verification
                </h3>
                
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Bank Name</span>
                    <span className="font-bold">Meezan Bank</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Title</span>
                    <span className="font-bold">Nexus Tech Hub Ltd</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Number</span>
                    <span className="font-bold">0123-45678912345</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-primary">
                    <span className="text-lg font-black">Total Payable</span>
                    <span className="text-lg font-black">{typeof product.price === 'number' ? `PKR ${product.price.toLocaleString()}` : product.price}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input id="transactionId" name="transactionId" value={formData.transactionId} onChange={handleInputChange} placeholder="Ref# 1234567890" className="rounded-xl h-12" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Payment Screenshot</Label>
                    <div className="relative">
                      {!screenshotPreview ? (
                        <Label
                          htmlFor="screenshot-upload"
                          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/20 rounded-2xl bg-muted/10 hover:bg-muted/20 cursor-pointer transition-all group"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-10 w-10 text-muted-foreground mb-3 group-hover:scale-110 transition-transform" />
                            <p className="mb-2 text-sm font-semibold">Click to upload screenshot</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB)</p>
                          </div>
                          <input id="screenshot-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </Label>
                      ) : (
                        <div className="relative h-40 w-full rounded-2xl overflow-hidden border">
                          <img src={screenshotPreview} className="w-full h-full object-cover" alt="Screenshot" />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full h-8 w-8"
                            onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t bg-muted/20 flex items-center justify-between">
            <Button variant="ghost" onClick={step === 1 ? onClose : () => setStep(step - 1)} className="rounded-xl px-6 h-12 font-bold">
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} className="rounded-xl px-8 h-12 font-bold gap-2">
                Next Step <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading || !formData.transactionId || !screenshot} className="rounded-xl px-8 h-12 font-black shadow-lg shadow-primary/20 gap-2">
                {loading ? 'Processing...' : 'Complete Payment'}
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
