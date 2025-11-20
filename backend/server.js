require("dotenv").config();
const path = require("path");
const app = require("./app");
const port = process.env.PORT || 5000;
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// early log
console.log("DEBUG: starting backend/server.js, pid=", process.pid, "cwd=", process.cwd());

// process-level handlers
process.on("uncaughtException", (err) => {
  console.error("FATAL uncaughtException:", err && (err.stack || err));
  // leave process alive briefly so logs can be read
  setTimeout(() => process.exit(1), 1000);
});
process.on("unhandledRejection", (reason, p) => {
  console.error("FATAL unhandledRejection at:", p, "reason:", reason);
  setTimeout(() => process.exit(1), 1000);
});
process.on("exit", (code) => {
  console.log("DEBUG: process.exit event, code=", code);
});

// Trust proxy (set to "true" in env when behind nginx/load-balancer)
if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

// Security headers
app.use(helmet());

// Basic rate limiter: configurable via RATE_LIMIT env (requests per minute)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: Number(process.env.RATE_LIMIT || 60),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS: support comma-separated ALLOWED_ORIGINS in env, fallback to localhost:3000
const rawAllowed = process.env.ALLOWED_ORIGINS || "http://localhost:3000";
const allowedOrigins = rawAllowed.split(",").map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: function (incomingOrigin, callback) {
    if (!incomingOrigin) return callback(null, true);
    if (allowedOrigins.indexOf(incomingOrigin) !== -1) return callback(null, true);
    return callback(new Error("CORS policy: origin not allowed"));
  },
  credentials: true
}));

// Optional: simple health-check route (useful for load balancers)
app.get("/healthz", (req, res) => res.json({ ok: true, timestamp: Date.now() }));

// Serve frontend build when in production
if (process.env.NODE_ENV === "production") {
  app.use(require("express").static(path.join(__dirname, "..", "frontend", "build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"))
  );
}

// start server and print server.address
const server = app.listen(port, "0.0.0.0", () => {
  try {
    const addr = server.address();
    console.log("Server listening on", port, "address:", addr);
  } catch (err) {
    console.error("ERROR in listen callback:", err && err.stack);
  }
});

server.on("error", (err) => {
  console.error("Server 'error' event:", err && err.stack);
});
server.on("close", () => {
  console.log("Server 'close' event fired");
});
// Graceful shutdown handlers
function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Graceful shutdown starting...`);
  // if you have DB clients (mongoose), close them here, e.g. mongoose.connection.close()
  server.close(() => {
    console.log("HTTP server closed. Exiting process.");
    process.exit(0);
  });
  // force exit if not closed in time
  setTimeout(() => {
    console.error("Could not close in time, forcing exit.");
    process.exit(1);
  }, 10000);
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Improved handlers for visibility (log but don't force immediate exit)
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err && (err.stack || err));
  // keep process for debugging or restart via process manager
});
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
});