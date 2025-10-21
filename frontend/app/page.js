"use client";
import TripForm from "../components/Tripform";
import { motion } from "framer-motion";
import AboutUsSection from "../components/info";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-violet-50">
      {/* Animated Background Blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-24 h-80 w-80 rounded-full bg-fuchsia-300/30 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800"
          >
            ✈️ AI Trip Planner
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-3 md:mt-4 text-slate-600 text-lg md:text-xl"
          >
            Discover your perfect adventure with AI‑powered itineraries tailored
            to your destination, budget, and timeline.
          </motion.p>

          {/* Glassy Card with Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-8 md:mt-10 w-full max-w-xl rounded-2xl border border-white/60 bg-white/80 backdrop-blur-md shadow-lg"
          >
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-xl font-bold text-slate-800 text-center">
                Plan Your Dream Trip
              </h2>
              <p className="text-sm text-slate-500 text-center mt-1">
                Tell us where you want to go — we’ll craft the perfect itinerary.
              </p>
            </div>
            <div className="px-6 pb-6">
              <TripForm compact />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "AI‑Powered Planning",
              desc: "Smart algorithms create personalized itineraries based on your preferences and budget.",
              badgeClass: "bg-sky-50 text-sky-700 border-sky-100",
            },
            {
              title: "Instant Results",
              desc: "Get detailed day‑by‑day plans in seconds, complete with sites and recommendations.",
              badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
            },
            {
              title: "Perfect Optimization",
              desc: "Every recommendation is optimized for your timeline, budget, and travel style.",
              badgeClass: "bg-amber-50 text-amber-700 border-amber-100",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(2,6,23,0.08)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur shadow-md p-5"
            >
              <div className={`inline-block px-3 py-1 rounded-full text-sm border ${f.badgeClass}`}>
                Feature
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-800">{f.title}</h3>
              <p className="mt-1 text-slate-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <AboutUsSection />
    </main>
  );
}
