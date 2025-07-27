import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { ShopData } from '@/types/shop'
import Navbar from '@/components/Navbar'

// Step Components
import ShopInformationStep from '@/components/wizard-steps/ShopInformationStep'
import BusinessCategoriesStep from '@/components/wizard-steps/BusinessCategoriesStep'
import ShopMediaStep from '@/components/wizard-steps/ShopMediaStep'
import SocialContactStep from '@/components/wizard-steps/SocialContactStep'
import ProductListingStep from '@/components/wizard-steps/ProductListingStep'
import ReviewSubmitStep from '@/components/wizard-steps/ReviewSubmitStep'

import { API_BASE_URL } from '@/lib/config'
const STEPS = [
  'Shop Information',
  'Business Categories',
  'Shop Media',
  'Social & Contact',
  'Product Listing',
  'Review & Submit'
];

const ShopWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [shopData, setShopData] = useState<ShopData>({
    shopName: '',
    city: '',
    shopType: '',
    shopDescription: '',
    categories: [],
    shopLogo: null,
    shopBanner: null,
    logoPreview: '',
    bannerPreview: '',
    facebookUrl: '',
    instagramHandle: '',
    whatsappNumber: '',
    websiteUrl: '',
    products: [],
    acceptTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const updateShopData = (updates: Partial<ShopData>) => {
    setShopData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(shopData.shopName && shopData.city && shopData.shopType && shopData.shopDescription);
      case 1:
        return shopData.categories.length > 0;
      case 2:
        return !!(shopData.shopLogo && shopData.shopBanner);
      case 3:
        return !!(shopData.whatsappNumber);
      case 4:
        return shopData.products.length > 0;
      case 5:
        return shopData.acceptTerms;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast({
        title: "Validation Error",
        description: "Please accept the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append('shopName', shopData.shopName);
      formData.append('city', shopData.city);
      formData.append('shopType', shopData.shopType);
      formData.append('shopDescription', shopData.shopDescription);
      formData.append('categories', JSON.stringify(shopData.categories));
      formData.append('websiteUrl', shopData.websiteUrl);
      formData.append('facebookUrl', shopData.facebookUrl);
      formData.append('instagramHandle', shopData.instagramHandle);
      formData.append('whatsappNumber', shopData.whatsappNumber);
      if (shopData.shopLogo) formData.append('shopLogo', shopData.shopLogo);
      if (shopData.shopBanner) formData.append('shopBanner', shopData.shopBanner);
      if (shopData.products.length > 0) {
        formData.append('products', JSON.stringify(shopData.products.map(product => ({
          ...product,
          images: undefined, // Don't send File objects in JSON
          imagePreviews: undefined // Don't send previews in JSON
        }))));
        shopData.products.forEach((product, productIdx) => {
          if (product.images && product.images.length > 0) {
            product.images.forEach((imageFile, imageIdx) => {
              // Name: product-<productIdx>-<imageIdx>
              formData.append('productImages', imageFile, `product-${productIdx}-${imageIdx}-${imageFile.name}`);
            });
          }
        });
      }
      // Send to backend
      const response = await fetch(`${API_BASE_URL}/api/shop-wizard/create`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Shop Created Successfully!",
          description: "Your marketplace shop has been created and is now live.",
        });
        navigate('/store');
      } else {
        toast({
          title: "Error",
          description: result.error || 'Failed to create shop',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: 'Could not connect to server. Please check if the backend is running on port 3000.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ShopInformationStep data={shopData} updateData={updateShopData} />;
      case 1:
        return <BusinessCategoriesStep data={shopData} updateData={updateShopData} />;
      case 2:
        return <ShopMediaStep data={shopData} updateData={updateShopData} />;
      case 3:
        return <SocialContactStep data={shopData} updateData={updateShopData} />;
      case 4:
        return <ProductListingStep data={shopData} updateData={updateShopData} />;
      case 5:
        return <ReviewSubmitStep data={shopData} updateData={updateShopData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/store')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Your Shop</h1>
              <p className="text-muted-foreground">Set up your digital marketplace presence</p>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${index <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {index + 1}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-4 ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{STEPS[currentStep]}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderStepContent()}
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-between mt-8"
          >
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Shop...' : 'Create Shop'}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShopWizard;
