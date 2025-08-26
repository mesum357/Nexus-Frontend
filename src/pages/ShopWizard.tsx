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
import PaymentSection from '@/components/PaymentSection'
const STEPS = [
  'Shop Information',
  'Business Categories',
  'Shop Media',
  'Social & Contact',
  'Product Listing',
  'Payment Section',
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
    ownerProfilePhoto: null,
    logoPreview: '',
    bannerPreview: '',
    ownerProfilePreview: '',
    facebookUrl: '',
    instagramHandle: '',
    whatsappNumber: '',
    websiteUrl: '',
    products: [],
    acceptTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [createdShop, setCreatedShop] = useState<any>(null);

  const { toast } = useToast();

  const updateShopData = (updates: Partial<ShopData>) => {
    setShopData(prev => {
      const newData = { ...prev, ...updates };
      return newData;
    });
  };

  const handlePaymentComplete = async (paymentData: any) => {
    // Payment is now handled directly in PaymentSection component
    // This function is called after successful payment submission
    setPaymentCompleted(true);
    
    toast({ 
      title: 'Payment Submitted Successfully', 
      description: 'Your payment request has been submitted to the admin panel for review. You can now proceed to review your shop details.' 
    });
  }

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
        return paymentCompleted; // Payment must be completed
      case 6:
        return true; // Review step doesn't need validation
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

    // Shop is already created in handlePaymentComplete, just navigate to success
    toast({
      title: "Shop Creation Complete!",
      description: "Your shop has been created successfully and payment submitted. It is now pending admin approval.",
    });
    navigate('/store');
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
        return (
          <PaymentSection 
            entityType="shop"
            onPaymentComplete={handlePaymentComplete}
            isRequired={true}
            isSubmitting={isSubmitting}
            shopData={shopData}
          />
        );
      case 6:
        return <ReviewSubmitStep data={shopData} updateData={updateShopData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/store')}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create Your Shop</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Set up your digital marketplace presence</p>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              {STEPS.map((step, index) => (
                <div key={index} className="flex items-center flex-1 w-full sm:w-auto">
                  <div className={`
                    w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium
                    ${index <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {index + 1}
                  </div>
                  <div className="ml-2 sm:ml-3 flex-1">
                    <p className={`text-xs sm:text-sm font-medium ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 sm:mx-4 hidden sm:block ${
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
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">{STEPS[currentStep]}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {renderStepContent()}
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8"
          >
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Previous
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-2"
                disabled={isSubmitting}
              >
                Complete Setup
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-full sm:w-auto order-1 sm:order-2">
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
