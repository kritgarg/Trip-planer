import React from 'react';
import { Plane, Zap, DollarSign, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// Animation variants for the cards
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 10 } 
  },
};

const AboutUsSection = () => {
  return (
    <section className="py-20 px-6 md:px-10 bg-gradient-to-br from-sky-50 via-cyan-50 to-violet-50">
      <div className="max-w-6xl mx-auto text-center space-y-12">
        
        {/* Main Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-5xl font-extrabold text-slate-800 flex items-center justify-center gap-4">
            <Zap className="w-8 h-8 text-sky-500" />
            The Future of Travel Planning
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our AI Trip Planner discovers your perfect adventure by crafting intelligent itineraries tailored to *your* unique constraints, not generic guides.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1: Destination */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur shadow-md p-6 space-y-3 transition duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <MapPin className="w-8 h-8 mx-auto text-sky-500" />
            <h3 className="text-xl font-semibold text-slate-800">Destination Focused</h3>
            <p className="text-sm text-slate-600">
              Tell us your dream location, and our AI instantly analyzes local points of interest, hidden gems, and optimal routes specific to that city or region.
            </p>
          </motion.div>

          {/* Feature 2: Budget */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur shadow-md p-6 space-y-3 transition duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <DollarSign className="w-8 h-8 mx-auto text-sky-500" />
            <h3 className="text-xl font-semibold text-slate-800">Budget Optimized</h3>
            <p className="text-sm text-slate-600">
              We respect your wallet. The itinerary is dynamically adjusted to fit your specified budget, recommending affordable activities and maximizing value.
            </p>
          </motion.div>

          {/* Feature 3: Timeline */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur shadow-md p-6 space-y-3 transition duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <Calendar className="w-8 h-8 mx-auto text-sky-500" />
            <h3 className="text-xl font-semibold text-slate-800">Custom Timeline</h3>
            <p className="text-sm text-slate-600">
              Whether it’s a quick weekend getaway or a month-long journey, the AI precisely maps out your days to ensure a balanced, enjoyable, and realistic pace.
            </p>
          </motion.div>
        </div>
        
        {/* Call to Action Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a
            href="/" // Link back to the main trip planner form
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white bg-sky-500 font-semibold transition duration-300 hover:bg-sky-600 text-lg shadow-md hover:shadow-lg"
          >
            <Plane className="w-5 h-5" />
            Start Planning Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUsSection;