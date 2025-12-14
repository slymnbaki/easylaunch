require("dotenv").config();
const path = require("path");
const app = require("./app");
const port = process.env.PORT || 5000;
const logger = require("./logger");

logger.info("Starting backend server...");

// Serve frontend build
const frontendBuildPath = path.join(__dirname, "..", "frontend", "build");
app.use(require("express").static(frontendBuildPath));

// API olmayan route'larÄ± frontend'e yÃ¶nlendir
app.get("*", (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// Start server
const server = app.listen(port, "0.0.0.0", () => {
  logger.info(`✅ Backend server running on http://localhost:${port}`);
  console.log(`✅ Backend server running on http://localhost:${port}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception: " + err);
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection: " + reason);
  console.error("Unhandled Rejection:", reason);
});
