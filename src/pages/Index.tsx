import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { MockupCarousel } from "@/components/MockupCarousel";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Handle verification success messages
  useEffect(() => {
    const verified = searchParams.get('verified');
    const message = searchParams.get('message');
    
    if (verified === 'true' && message) {
      toast({ 
        title: 'Success', 
        description: decodeURIComponent(message),
        duration: 5000
      });
      
      // Clear URL parameters after showing the message
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MockupCarousel />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
