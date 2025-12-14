const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  return res.status(200).json({ ok: true });
});

try {
  const tokenRoutes = require("./routes/token");
  app.use("/api/tokens", tokenRoutes);
} catch (e) {
  console.log("Token routes not found, skipping...");
}

module.exports = app;