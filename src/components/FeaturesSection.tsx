import storeIcon from "@/assets/icon-store.jpg";
import educationIcon from "@/assets/icon-education.jpg";
import socialIcon from "@/assets/icon-social.jpg";
import marketplaceIcon from "@/assets/icon-marketplace.jpg";
import { motion } from "framer-motion";

const features = [
  {
    icon: storeIcon,
    title: "Multi‑Vendor Store",
    description: "Shop from local vendors"
  },
  {
    icon: educationIcon,
    title: "Education Hub",
    description: "Online courses & classes"
  },
  {
    icon: socialIcon,
    title: "Social Feed",
    description: "City posts & events"
  },
  {
    icon: marketplaceIcon,
    title: "Marketplace",
    description: "Buy & sell items (OLX‑style)"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {/* Icon Container */}
              <motion.div 
                className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-card"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src={feature.icon} 
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Feature Card */}
              <motion.div 
                className="bg-background rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-text-blue-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-blue-gray">
                  {feature.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
