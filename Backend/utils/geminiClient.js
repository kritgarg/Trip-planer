const axios = require("axios");

async function callGemini({ destination, days, budget, prefs }) {
  const prompt = `
  Create a detailed ${days}-day travel itinerary for ${destination}.
  Budget: ${budget || "not specified"}.
  Preferences: ${JSON.stringify(prefs)}.
  Output as a structured JSON plan with days and activities.
  `;

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
    }
  );

  // Gemini may return JSON as text (sometimes wrapped in code fences). Try to parse it.
  let text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Strip markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/i);
  if (fenceMatch) {
    text = fenceMatch[1];
  }

  try {
    const obj = JSON.parse(text);
    // Normalize to { destination, plan: [] }
    const planArray = Array.isArray(obj.plan)
      ? obj.plan
      : Array.isArray(obj.days)
      ? obj.days
      : Array.isArray(obj.itinerary)
      ? obj.itinerary
      : [];

    return {
      destination: obj.destination || destination,
      plan: planArray,
      raw: obj,
    };
  } catch (e) {
    // Fallback: split text into lines and try to group per day
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const plan = [];
    let current = [];
    for (const line of lines) {
      if (/^day\s*\d+/i.test(line)) {
        if (current.length) plan.push(current.join(" "));
        current = [line];
      } else {
        current.push(line);
      }
    }
    if (current.length) plan.push(current.join(" "));

    return {
      destination,
      plan: plan.length ? plan : [text],
      raw: text,
    };
  }
}

module.exports = { callGemini };
