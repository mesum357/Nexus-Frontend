import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import heroStore from "@/assets/hero-slide-store.png";
import heroEducation from "@/assets/hero-slide-education.png";
import heroSocial from "@/assets/hero-slide-social.png";
import heroMarketplace from "@/assets/hero-slide-marketplace.png";
import heroHealthcare from "@/assets/hero-slide-healthcare.png";

const slides = [
  {
    image: heroStore,
    title: "Multi‑Vendor Store",
    subtitle: "Shop from local vendors",
    description: "Discover a wide range of products from trusted local vendors across your city. Browse, compare, and shop with confidence.",
    link: "/store",
    accent: "from-emerald-500/80 to-teal-600/80",
  },
  {
    image: heroEducation,
    title: "Education Hub",
    subtitle: "Online courses & classes",
    description: "Access quality education from the best institutes. Enroll in courses, attend live classes, and grow your skills.",
    link: "/education",
    accent: "from-blue-500/80 to-indigo-600/80",
  },
  {
    image: heroSocial,
    title: "Social Feed",
    subtitle: "City posts & events",
    description: "Stay connected with your community. Share updates, discover events, and engage with people around you.",
    link: "/feed",
    accent: "from-purple-500/80 to-pink-600/80",
  },
  {
    image: heroMarketplace,
    title: "Marketplace",
    subtitle: "Buy & sell items",
    description: "Your digital marketplace for buying and selling. List your items or find great deals from sellers nearby.",
    link: "/marketplace",
    accent: "from-orange-500/80 to-red-600/80",
  },
  {
    image: heroHealthcare,
    title: "Healthcare",
    subtitle: "Find hospitals & doctors",
    description: "Search for hospitals, clinics, and doctors near you. Book appointments and access healthcare services easily.",
    link: "/hospitals",
    accent: "from-cyan-500/80 to-blue-600/80",
  },
];

const AUTOPLAY_INTERVAL = 5000;

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.08,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
    }),
  };

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Slide Image */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.42, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-8 lg:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="max-w-2xl"
            >
              {/* Accent Badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r ${slide.accent} backdrop-blur-sm mb-6`}
                >
                  {slide.subtitle}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight tracking-tight"
              >
                {slide.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-xl"
              >
                {slide.description}
              </motion.p>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(slide.link)}
                className={`px-8 py-3.5 rounded-full text-white font-semibold bg-gradient-to-r ${slide.accent} hover:shadow-lg hover:shadow-white/10 transition-shadow duration-300 text-base`}
              >
                Explore Now
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((s, i) => (
          <button
            key={s.title}
            onClick={() => goTo(i)}
            aria-label={`Go to slide: ${s.title}`}
            className="group relative flex items-center justify-center"
          >
            <span
              className={`block rounded-full transition-all duration-500 ${
                i === current
                  ? "w-10 h-3 bg-white"
                  : "w-3 h-3 bg-white/40 hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/10">
        <motion.div
          key={current}
          className={`h-full bg-gradient-to-r ${slide.accent}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
        />
      </div>
    </section>
  );
}
