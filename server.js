require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// serve API routes (uygula kendi route dosyalarını)
app.get("/api/ping", (req, res) => res.json({ ok: true }));

// serve frontend build in production
const path = require("path");
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Backend listening on", port));