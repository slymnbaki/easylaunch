const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// health check used by tests
app.get("/api/health", (req, res) => {
  return res.status(200).json({ ok: true });
});

// mount other routes (ensure these files do not contain JSX)
try {
  const tokenRoutes = require("./routes/token");
  app.use("/api/tokens", tokenRoutes);
} catch (e) {
  // ignore if route not present during tests
}

// export app for tests (do NOT listen here)
module.exports = app;


