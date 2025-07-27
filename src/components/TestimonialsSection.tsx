import { motion } from "framer-motion";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";

const testimonials = [
  {
    name: "Ahmed Hassan",
    role: "Local Business Owner",
    avatar: avatar1,
    quote: "MY Online  has transformed how I reach customers. The multi-vendor platform makes it so easy to showcase my products to the entire city."
  },
  {
    name: "Fatima Khan",
    role: "Student & Entrepreneur",
    avatar: avatar2,
    quote: "From taking online courses to selling handmade items, MY Online  is my go-to platform. It's like having the whole city in one app!"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-semibold text-text-blue-dark mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-text-blue-gray max-w-2xl mx-auto">
            Real stories from real people in our growing community
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.name}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {/* Speech Bubble Card */}
              <motion.div 
                className="bg-background rounded-2xl p-8 shadow-card relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Quote */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                  viewport={{ once: true }}
                  className="text-text-blue-gray text-lg leading-relaxed mb-6"
                >
                  "{testimonial.quote}"
                </motion.p>
                
                {/* User Info */}
                <div className="flex items-center">
                  <motion.div 
                    className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-primary/20"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-text-blue-dark">
                      {testimonial.name}
                    </h4>
                    <p className="text-text-blue-gray text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                
                {/* Speech Bubble Tail */}
                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-background transform rotate-45 border-r border-b border-border"></div>
              </motion.div>
              
              {/* Avatar Overlap Effect */}
              <motion.div 
                className="absolute -top-6 right-8 w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/20 bg-background"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
