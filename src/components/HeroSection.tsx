import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import heroStore from "@/assets/hero-slide-store.png";
import heroEducation from "@/assets/hero-slide-education.png";
import heroSocial from "@/assets/hero-slide-social.png";
import heroMarketplace from "@/assets/hero-slide-marketplace.png";
import heroHealthcare from "@/assets/hero-slide-healthcare.png";

/** Served from `public/downloads/EDUNIA_APP.apk` (Vite copies `public/` to dist root). */
const APK_CACHE_BUST = (import.meta.env.VITE_APK_CACHE_BUST as string | undefined)?.trim();
const ANDROID_DOWNLOAD_URL =
  "/downloads/EDUNIA_APP.apk" +
  (APK_CACHE_BUST ? `?v=${encodeURIComponent(APK_CACHE_BUST)}` : "?v=v75-final");

const STORE_CARD_CLASS =
  "group relative flex min-h-[4.5rem] w-full items-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md transition-colors hover:bg-white/15 sm:px-5";

/** Logs what the server actually returns for the APK URL (helps catch HTML/SW/cache/CDN issues). */
function logAndroidApkDownloadDiagnostics(apkPath: string) {
  if (typeof window === "undefined") return;

  const absolute = new URL(apkPath, window.location.origin).href;

  const report = (via: string, r: Response) => {
    const len = r.headers.get("content-length");
    const cr = r.headers.get("content-range");
    const ct = r.headers.get("content-type");
    const bytes = len ? Number(len) : NaN;
    const diag = {
      via,
      requested: absolute,
      finalUrl: r.url,
      status: r.status,
      ok: r.ok,
      contentType: ct,
      contentLength: len,
      contentRange: cr,
      sizeMB: Number.isFinite(bytes) ? (bytes / (1024 * 1024)).toFixed(2) : "unknown",
    };
    console.info("[Edunia APK]", diag);

    if (r.ok && Number.isFinite(bytes) && bytes < 500_000) {
      console.warn(
        "[Edunia APK] Declared size is under ~500KB — often HTML, an error page, or a bad cached response. Expect tens of MB for EDUNIA_APP.apk.",
        diag,
      );
    }
    if (ct?.toLowerCase().includes("text/html")) {
      console.warn("[Edunia APK] content-type looks like HTML (SPA fallback or 404 page).", diag);
    }
  };

  void fetch(absolute, { method: "HEAD", cache: "no-store", credentials: "same-origin" })
    .then((r) => {
      if (r.status === 405) {
        return fetch(absolute, {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
          headers: { Range: "bytes=0-0" },
        }).then((r2) => {
          report("GET bytes=0-0 (HEAD not allowed)", r2);
        });
      }
      report("HEAD", r);
    })
    .catch((e) => {
      console.error("[Edunia APK] Probe failed (open Network tab → EDUNIA_APP.apk)", e);
    });

  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.getRegistration().then((reg) => {
      console.info("[Edunia APK] serviceWorker", {
        hasController: Boolean(navigator.serviceWorker.controller),
        scope: reg?.scope ?? null,
        activeScript: navigator.serviceWorker.controller?.scriptURL ?? null,
      });
    });
  }
}

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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(slide.link)}
                    className={`px-8 py-3.5 rounded-full text-white font-semibold bg-gradient-to-r ${slide.accent} hover:shadow-lg hover:shadow-white/10 transition-shadow duration-300 text-base`}
                  >
                    Explore Now
                  </motion.button>

                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <span className="hidden sm:inline">or</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                      Download the app
                    </span>
                  </div>
                </div>

                <div className="relative w-full max-w-xl">
                    <div className="pointer-events-none absolute -inset-6 rounded-[28px] bg-gradient-to-r from-white/12 via-white/6 to-transparent blur-2xl sm:-inset-8" />
                    <div
                      className={`pointer-events-none absolute -inset-8 rounded-[32px] bg-gradient-to-r ${slide.accent} blur-3xl opacity-25 sm:-inset-10`}
                    />

                    <div className="relative grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
                      <motion.a
                        href={ANDROID_DOWNLOAD_URL}
                        download="EDUNIA_APP.apk"
                        aria-label="Download Android app (APK)"
                        className={STORE_CARD_CLASS}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => logAndroidApkDownloadDiagnostics(ANDROID_DOWNLOAD_URL)}
                      >
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${slide.accent}`}
                            style={{ opacity: 0 }}
                          />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
                          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
                          <div className="relative flex w-full min-w-0 items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-black/30 border border-white/10">
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M4.8 3.4c-.6.3-.8.8-.8 1.5v14.2c0 .7.2 1.2.8 1.5l9-9.1-9-8.1Z"
                                  fill="currentColor"
                                  className="text-white/90"
                                />
                                <path
                                  d="M14.6 12 20 6.9c.6.4 1 .9 1 1.4 0 .5-.4 1-1 1.4L14.6 12Z"
                                  fill="currentColor"
                                  className="text-white/65"
                                />
                                <path
                                  d="M14.6 12 20 17.1c.6-.4 1-.9 1-1.4 0-.5-.4-1-1-1.4L14.6 12Z"
                                  fill="currentColor"
                                  className="text-white/65"
                                />
                                <path
                                  d="M4.8 20.6c.4.2.9.2 1.6-.2l10.6-6.2L13.8 12l-8.9 8.6Z"
                                  fill="currentColor"
                                  className="text-white/80"
                                />
                                <path
                                  d="M6.4 3.6c-.7-.4-1.2-.4-1.6-.2l9 8.5 3.2-2.2L6.4 3.6Z"
                                  fill="currentColor"
                                  className="text-white/80"
                                />
                              </svg>
                            </span>
                            <div className="leading-tight">
                              <div className="text-[11px] text-white/70">Get it on</div>
                              <div className="text-base font-semibold text-white">Google Play</div>
                            </div>
                          </div>
                      </motion.a>

                      <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="min-w-0">
                        <Link
                          to="/iphone-app"
                          aria-label="Install on iPhone — instructions"
                          className={STORE_CARD_CLASS}
                        >
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${slide.accent}`}
                            style={{ opacity: 0 }}
                          />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
                          <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-indigo-400/10 blur-2xl" />
                          <div className="relative flex w-full min-w-0 items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-black/30 border border-white/10">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M16.2 2.5c-.9.6-1.5 1.6-1.4 2.7 1.1.1 2.1-.6 2.7-1.2.6-.7 1.1-1.7 1-2.8-1 .1-2 .6-2.3 1.3Z"
                                  fill="currentColor"
                                  className="text-white/85"
                                />
                                <path
                                  d="M20.7 17.2c-.5 1.2-1.1 2.3-1.9 3.3-.9 1.1-1.7 1.9-3 1.9-1.2 0-1.6-.7-3.1-.7-1.5 0-2 .7-3.2.7-1.2 0-2-.7-3.1-2-2-2.5-3.5-7.1-1.5-10.2 1-1.5 2.7-2.5 4.6-2.5 1.2 0 2.3.8 3.1.8.8 0 2.2-.9 3.7-.8.6 0 2.3.2 3.4 1.8-.1.1-2 .9-2 3.2 0 2.7 2.4 3.6 2.5 3.7Z"
                                  fill="currentColor"
                                  className="text-white/90"
                                />
                              </svg>
                            </span>
                            <div className="leading-tight">
                              <div className="text-[11px] text-white/70">Get it on</div>
                              <div className="text-base font-semibold text-white">iPhone</div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </div>

                    {/* Caption — spaced below cards so it does not collide with the row */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 text-xs text-white/60">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 bg-gradient-to-r ${slide.accent} text-white/90`}>
                      Available now
                    </span>
                    <span>Fast install</span>
                    <span className="text-white/35">•</span>
                    <span>Secure payments</span>
                    <span className="text-white/35">•</span>
                    <span>Local services</span>
                  </div>
                </div>
              </motion.div>
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
