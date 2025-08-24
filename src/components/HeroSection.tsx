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
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                className="text-lg font-semibold px-8 py-4 h-14 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25"
              >
                Get Started
              </Button>
            </motion.div>
            
            {/* YouTube Video Section */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="relative group cursor-pointer"
                             onClick={() => window.open('https://www.youtube.com/watch?v=honOJloqesA', '_blank')}
            >
              <div className="relative w-80 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-primary/25 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group-hover:scale-105">
                                 <iframe
                   src="https://www.youtube.com/embed/honOJloqesA?autoplay=1&mute=1&loop=1&playlist=honOJloqesA&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0"
                   title="Pakistan Online Introduction"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                    <i className="fas fa-play text-primary text-xl ml-1"></i>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2 font-medium">
                Watch Our Story
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
