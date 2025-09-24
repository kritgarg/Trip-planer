"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import EarthLoader from "@/components/EarthLoader";

export default function TripForm({ compact = false }) {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [prefs, setPrefs] = useState("sightseeing");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    router.push(
      `/result?destination=${destination}&days=${days}&budget=${budget}&prefs=${prefs}`
    );
  };

  const FormTag = motion.form;
  return (
    <div className={compact ? "relative" : "relative"}>
    <FormTag
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={
        compact
          ? "space-y-4"
          : "bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4"
      }
    >
      {!compact && (
        <h2 className="text-2xl font-bold text-center text-blue-700">Plan Your Dream Trip</h2>
      )}

      <input
        type="text"
        placeholder="Destination (e.g., Delhi, Paris)"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-black"
        disabled={loading}
        required
      />

      <input
        type="number"
        placeholder="Number of Days"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-black"
        disabled={loading}
        required
      />

      <input
        type="number"
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-black"
        disabled={loading}
        required
      />

      <select
        value={prefs}
        onChange={(e) => setPrefs(e.target.value)}
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-black"
        disabled={loading}
      >
        <option value="sightseeing">Sightseeing</option>
        <option value="adventure">Adventure</option>
        <option value="culture">Culture</option>
        <option value="relaxation">Relaxation</option>
        <option value="food">Food & Dining</option>
      </select>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Preparing..." : "Plan My Trip"}
      </motion.button>
    </FormTag>

    {loading && (
      <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
        <EarthLoader label="Connecting..." />
      </div>
    )}
    </div>
  );
}
