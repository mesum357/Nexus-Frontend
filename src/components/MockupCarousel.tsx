import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import mobileImage from "@/assets/mockup-mobile.jpg";
import laptopImage from "@/assets/mockup-laptop.jpg";

const mockups = [
  {
    image: mobileImage,
          alt: "Pakistan Online Mobile App",
    type: "mobile"
  },
  {
    image: laptopImage,
          alt: "Pakistan Online Web Platform",
    type: "laptop"
  }
];

export function MockupCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockups.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-semibold text-text-blue-dark mb-4">
            Experience Pakistan Online 
          </h2>
          <p className="text-xl text-text-blue-gray max-w-2xl mx-auto">
            Available on all your devices with a seamless experience
          </p>
        </motion.div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-8">
            {mockups.map((mockup, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`transition-all duration-700 ${
                  index === currentIndex 
                    ? 'opacity-100 scale-100 z-20' 
                    : 'opacity-60 scale-90 z-10'
                }`}
              >
                <div className="relative">
                  {/* Blue-tinted frame effect */}
                  <motion.div 
                    className="absolute inset-0 bg-primary/10 rounded-3xl transform rotate-1"
                    animate={{ rotate: index === currentIndex ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div 
                    className="relative bg-background rounded-3xl shadow-card overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={mockup.image}
                      alt={mockup.alt}
                      className={`w-full h-auto ${
                        mockup.type === 'mobile' ? 'max-w-xs' : 'max-w-2xl'
                      }`}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {mockups.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
