const { callGemini } = require('../utils/geminiClient');

async function generatePlan(req, res) {
  try {
    const { destination, days, budget, prefs } = req.body;

    // Validation
    if (!destination || !days) {
      return res.status(400).json({ error: 'destination and days are required' });
    }

    // Direct Gemini call
    const result = await callGemini({ destination, days, budget, prefs });

    // Normalize response for frontend: { destination, plan }
    return res.json({
      destination: result.destination || destination,
      plan: Array.isArray(result.plan) ? result.plan : [],
    });
  } catch (err) {
    console.error('generatePlan error:', err?.response?.data || err.message || err);
    return res.status(500).json({
      error: 'Failed to generate itinerary',
      details: err?.message || null
    });
  }
}

module.exports = { generatePlan };
