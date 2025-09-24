const express = require("express");
const cors = require("cors");
require('dotenv').config();
const planRoutes = require('./routes/planRoutes');
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use('/api/plan', planRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});