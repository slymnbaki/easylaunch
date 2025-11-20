require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// minimal routes
app.get("/api/ping", (req, res) => res.json({ ok: true }));

// static frontend (prod)
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
app.get("*", (req, res) => {
  const index = path.join(__dirname, "..", "frontend", "build", "index.html");
  if (require("fs").existsSync(index)) {
    return res.sendFile(index);
  }
  return res.status(404).send("Frontend not built.");
});

const port = Number(process.env.PORT) || 5000;

// global handlers for visibility
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err && err.stack ? err.stack : err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

try {
  const srv = app.listen(port, "0.0.0.0", () => {
    console.log("Server listening on", port);
    try {
      console.log("Server address:", srv.address());
    } catch (e) {
      console.warn("Could not read server.address()", e);
    }
  });

  srv.on("error", (err) => {
    console.error("Server error:", err && err.stack ? err.stack : err);
  });

  // export for tests if needed
  module.exports = app;
} catch (err) {
  console.error("Fatal startup error:", err && err.stack ? err.stack : err);
}