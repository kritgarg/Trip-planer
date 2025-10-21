"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import EarthLoader from "@/components/EarthLoader";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function Result() {
  const searchParams = useSearchParams();
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  // For header chips
  const meta = useMemo(() => {
    const destination = searchParams.get("destination") || "";
    const days = searchParams.get("days") || "";
    const budget = searchParams.get("budget") || "";
    const prefs = searchParams.get("prefs") || "";
    return { destination, days, budget, prefs };
  }, [searchParams]);

  useEffect(() => {
    const { destination, days, budget, prefs } = meta;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    fetch(`${baseUrl}/api/plan/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, days, budget, prefs }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Request failed");
        }
        return res.json();
      })
      .then((data) => setItinerary(data))
      .catch((e) => setError(e.message || "Something went wrong"));
  }, []);

  const handleShare = () => {
    if (!itinerary) return;
    const shareData = {
      title: `Your ${itinerary.destination} Adventure`,
      text: `Check out my ${meta.days}-day trip to ${itinerary.destination}!`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (!itinerary) return;
    const blob = new Blob([JSON.stringify({ meta, itinerary }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${itinerary.destination || "trip"}-itinerary.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDayCost = (day) => {
    if (!day || !Array.isArray(day.activities)) return null;
    const total = day.activities.reduce((sum, act) => {
      const price = act && typeof act === "object" ? act.price : null;
      const num = typeof price === "number" ? price : parseFloat(price);
      return isNaN(num) ? sum : sum + num;
    }, 0);
    return total > 0 ? total : null;
  };

  return (
    <main className="p-6 md:p-10 bg-[#121212] min-h-screen font-mono">
      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : !itinerary ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <EarthLoader />

          <motion.p
            className="text-[#00FFFF]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading your trip...
          </motion.p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* Header Card */}
          <div className="bg-[#1A1A1A] shadow-lg rounded-2xl p-6 border border-[#00FFFF]/20">
            <div className="text-center mb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#00FFFF]">
                Your {itinerary.destination || meta.destination} Adventure
              </h1>
              <p className="text-[#E0E0E0] mt-1">
                A perfectly crafted {meta.days}-day itinerary just for you
              </p>
            </div>
            {/* Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {/* Note: Using custom colors for unique contrast in chips */}
              <span className="px-3 py-1 rounded-full text-sm bg-cyan-900/50 text-cyan-300 border border-cyan-700">
                {meta.destination || itinerary.destination}
              </span>
              {meta.days && (
                <span className="px-3 py-1 rounded-full text-sm bg-green-900/50 text-green-300 border border-green-700">
                  {meta.days} days
                </span>
              )}
              {meta.budget && (
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-900/50 text-yellow-300 border border-yellow-700">
                  {meta.budget} total
                </span>
              )}
              {meta.prefs && (
                <span className="px-3 py-1 rounded-full text-sm bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-700">
                  {meta.prefs}
                </span>
              )}
            </div>
            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={handleShare} className="px-4 py-2 rounded-xl bg-[#00FFFF] text-[#121212] font-bold hover:bg-cyan-300 transition">
                Share
              </button>
              <button onClick={handleDownload} className="px-4 py-2 rounded-xl bg-[#1A1A1A] text-[#00FFFF] border border-[#00FFFF] hover:bg-[#333333] transition">
                Download
              </button>
              <Link href="/" className="px-4 py-2 rounded-xl bg-[#E0E0E0] text-[#121212] font-bold hover:bg-white transition">
                Plan Another Trip
              </Link>
            </div>
          </div>

          {/* Day Sections */}
          {itinerary.plan?.map((day, idx) => {
            const isObject = day && typeof day === "object" && !Array.isArray(day);
            const title = isObject
              ? `Day ${day.day_number ?? idx + 1}${day.theme ? ` – ${day.theme}` : ""}`
              : `Day ${idx + 1}`;
            const dayCost = isObject ? getDayCost(day) : null;
            return (
              <motion.section
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.1 }}
                className="bg-[#1A1A1A] rounded-2xl border border-[#00FFFF]/20 overflow-hidden shadow-lg"
              >
                {/* Day header */}
                <div className="flex items-center justify-between px-5 py-4 bg-[#282828] border-b border-[#00FFFF]/10">
                  <div>
                    <h3 className="font-semibold text-lg text-[#00FFFF]">{title}</h3>
                    {isObject && day.summary && (
                      <p className="text-sm text-[#E0E0E0]">{day.summary}</p>
                    )}
                  </div>
                  {dayCost !== null && (
                    <div className="text-right text-green-400 text-sm">
                      <span className="font-semibold">${dayCost.toFixed(0)}</span>
                    </div>
                  )}
                </div>

                {/* Activities list */}
                <div className="px-5 py-4 space-y-3">
                  {isObject && Array.isArray(day.activities) ? (
                    day.activities.map((act, i) => {
                      const isActObj = act && typeof act === "object";
                      const time = isActObj ? act.time : null;
                      const name = isActObj ? (act.name || act.title || act.activity) : null;
                      const location = isActObj ? act.location : null;
                      const description = isActObj ? act.description : null;
                      const price = isActObj ? act.price : null;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-[#00FFFF]/10 bg-[#282828]">
                          <div className="shrink-0 mt-1 text-cyan-400 text-xs font-semibold w-16">
                            {time ? time : ""}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-medium text-white">{name || String(act)}</div>
                                {location && (
                                  <div className="text-sm text-[#E0E0E0]">{location}</div>
                                )}
                              </div>
                              {price ? (
                                <div className="text-sm text-green-400 font-semibold">${price}</div>
                              ) : null}
                            </div>
                            {description && (
                              <p className="text-sm text-[#E0E0E0] mt-1">{description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : isObject && day.details ? (
                    <p className="text-[#E0E0E0]">{day.details}</p>
                  ) : (
                    <p className="text-[#E0E0E0]">{String(day)}</p>
                  )}
                </div>

                {/* Footer note */}
                <div className="px-5 py-3 bg-[#282828] text-sm text-[#E0E0E0]/80">
                  Tip: Bring a camera — perfect for photos!
                </div>
              </motion.section>
            );
          })}
        </motion.div>
      )}
    </main>
  );
}