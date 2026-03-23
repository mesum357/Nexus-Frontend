import { Mail, MapPin, Phone, Store, GraduationCap, Users, ShoppingBag, Heart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import AboutPopup from "./ui/AboutPopup";
import TermsPopup from "./ui/TermsPopup";

export function Footer() {
  const [showAbout, setShowAbout] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const services = [
    { label: "Online Store", href: "/store", icon: Store },
    { label: "Create Shop", href: "/create-shop", icon: ShoppingBag },
    { label: "Education", href: "/education", icon: GraduationCap },
    { label: "Community Feed", href: "/feed", icon: Users },
    { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { label: "Healthcare", href: "/hospitals", icon: Heart },
  ];

  const company = [
    { label: "About Us", action: () => setShowAbout(true) },
    { label: "Terms of Service", action: () => setShowTerms(true) },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Contact Us", href: "#contact" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-b from-slate-900 to-black text-white overflow-hidden"
    >
      {/* Decorative top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* ─── Top Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-5">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                E - Dunia
              </h3>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6 text-[15px]">
              Connecting communities, empowering businesses, and creating opportunities across
              E&nbsp;-&nbsp;Dunia through innovative digital solutions.
            </p>

            {/* Contact details */}
            <div className="space-y-3">
              <a href="mailto:infoedunia@gmail.com" className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition-colors group">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 group-hover:bg-blue-500/15 transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <span className="text-sm">infoedunia@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5">
                  <MapPin className="w-4 h-4" />
                </span>
                <span className="text-sm">Manchester Tower, 2nd Floor, Lahore</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-4 lg:pl-8">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">
              Our Services
            </h4>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {services.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center gap-2 text-[14px] text-slate-300 hover:text-white transition-colors group py-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company / Legal Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">
              Company
            </h4>
            <nav className="space-y-2.5">
              {company.map((item) =>
                item.action ? (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="flex items-center gap-2 text-[14px] text-slate-300 hover:text-white transition-colors group py-1 w-full text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href!}
                    className="flex items-center gap-2 text-[14px] text-slate-300 hover:text-white transition-colors group py-1"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                    {item.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Registered With Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">
              Registered With
            </h4>
            <div className="flex flex-col gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white/[0.07] p-3 rounded-xl backdrop-blur-sm border border-white/[0.06] flex items-center justify-center"
              >
                <img
                  src="/fbr.png"
                  alt="FBR Logo"
                  className="h-14 w-auto object-contain"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white/[0.07] p-3 rounded-xl backdrop-blur-sm border border-white/[0.06] flex items-center justify-center"
              >
                <img
                  src="/scep.png"
                  alt="SECP Logo"
                  className="h-14 w-auto object-contain"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} E&nbsp;-&nbsp;Dunia. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Built with <span className="text-red-400">❤️</span> for E&nbsp;-&nbsp;Dunia
          </p>
        </div>
      </div>

      {/* About Popup */}
      <AboutPopup
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />

      {/* Terms Popup */}
      <TermsPopup
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
    </motion.footer>
  );
}
