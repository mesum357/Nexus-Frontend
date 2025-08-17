import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Sign Up",
    description: "Create your account in minutes"
  },
  {
    number: "2", 
    title: "Explore",
    description: "Browse stores, courses, and community"
  },
  {
    number: "3",
    title: "Connect",
    description: "Start shopping, learning, and engaging"
  }
];

const ConnectingLine = ({ index }: { index: number }) => (
  <motion.svg
    initial={{ pathLength: 0 }}
    whileInView={{ pathLength: 1 }}
    transition={{ duration: 1, delay: index * 0.3 }}
    viewport={{ once: true }}
    className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full h-16 hidden md:block"
    style={{ left: '50%', width: '200px' }}
  >
    <motion.path
      d="M 0 0 Q 100 50 200 0"
      stroke="#1E40AF"
      strokeWidth="2"
      fill="none"
      strokeDasharray="5,5"
    />
  </motion.svg>
);

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent">
      <div className="container mx-auto px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-semibold text-text-blue-dark mb-4">
            How It Works
          </h2>
          <p className="text-xl text-text-blue-gray max-w-2xl mx-auto">
            Getting started with Pakistan Online is simple and straightforward
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto relative">
          {steps.map((step, index) => (
            <motion.div 
              key={step.number}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center relative"
            >
              {/* Connecting Line */}
              {index < steps.length - 1 && <ConnectingLine index={index} />}
              
              {/* Number Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                viewport={{ once: true }}
                className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-button"
              >
                {step.number}
              </motion.div>
              
              {/* Step Content */}
              <h3 className="text-2xl font-semibold text-text-blue-dark mb-3">
                {step.title}
              </h3>
              <p className="text-text-blue-gray text-lg">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
