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
    <main className="p-6 md:p-10 bg-gradient-to-br from-sky-50 via-cyan-50 to-purple-50 min-h-screen">
      {error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : !itinerary ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <EarthLoader />

          <motion.p
  className="text-slate-500"
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
          <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-6 border border-slate-100">
            <div className="text-center mb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                Your {itinerary.destination || meta.destination} Adventure
              </h1>
              <p className="text-slate-500 mt-1">
                A perfectly crafted {meta.days}-day itinerary just for you
              </p>
            </div>
            {/* Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-sm bg-sky-50 text-sky-700 border border-sky-100">
                {meta.destination || itinerary.destination}
              </span>
              {meta.days && (
                <span className="px-3 py-1 rounded-full text-sm bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {meta.days} days
                </span>
              )}
              {meta.budget && (
                <span className="px-3 py-1 rounded-full text-sm bg-amber-50 text-amber-700 border border-amber-100">
                  {meta.budget} total
                </span>
              )}
              {meta.prefs && (
                <span className="px-3 py-1 rounded-full text-sm bg-violet-50 text-violet-700 border border-violet-100">
                  {meta.prefs}
                </span>
              )}
            </div>
            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={handleShare} className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 transition">
                Share
              </button>
              <button onClick={handleDownload} className="px-4 py-2 rounded-xl bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition">
                Download
              </button>
              <Link href="/" className="px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition">
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
                className="bg-white/90 backdrop-blur rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
              >
                {/* Day header */}
                <div className="flex items-center justify-between px-5 py-4 bg-slate-50/70">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
                    {isObject && day.summary && (
                      <p className="text-sm text-slate-500">{day.summary}</p>
                    )}
                  </div>
                  {dayCost !== null && (
                    <div className="text-right text-slate-700 text-sm">
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
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                          <div className="shrink-0 mt-1 text-sky-600 text-xs font-semibold w-16">
                            {time ? time : ""}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-medium text-slate-800">{name || String(act)}</div>
                                {location && (
                                  <div className="text-sm text-slate-500">{location}</div>
                                )}
                              </div>
                              {price ? (
                                <div className="text-sm text-slate-700 font-semibold">${price}</div>
                              ) : null}
                            </div>
                            {description && (
                              <p className="text-sm text-slate-700 mt-1">{description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : isObject && day.details ? (
                    <p className="text-slate-700">{day.details}</p>
                  ) : (
                    <p className="text-slate-700">{String(day)}</p>
                  )}
                </div>

                {/* Footer note */}
                <div className="px-5 py-3 bg-slate-50/70 text-sm text-slate-500">
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
