import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroHomeImage from "@/assets/hero-home.jpg";

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background h-screen">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full"
        >
          <img 
            src={heroHomeImage} 
            alt="Pakistan Online Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
        </motion.div>
      </div>
      
      {/* Hero Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 container mx-auto px-8 py-24 text-center h-full flex items-center justify-center"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h1 
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-8 leading-tight"
          >
            Welcome to Pakistan Online 
          </motion.h1>
          <motion.p 
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Your city's all‑in‑one digital hub for shopping, learning, and community engagement across Pakistan Online.
          </motion.p>
          {/* Video positioned at bottom right */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="absolute bottom-8 right-8 z-20"
          >
            <div className="relative group cursor-pointer" onClick={() => window.open('https://youtu.be/TL55MvDnNWE?si=o9zpPZTyNGscdK58', '_blank')}>
              <div className="relative w-64 h-40 rounded-2xl overflow-hidden shadow-2xl shadow-primary/25 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group-hover:scale-105">
                <iframe
                  src="https://www.youtube.com/embed/TL55MvDnNWE?autoplay=1&mute=1&loop=1&playlist=TL55MvDnNWE&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0"
                  title="How to Create a Shop"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                    <i className="fas fa-play text-primary text-lg ml-1"></i>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2 font-medium">
                How to create a store
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
