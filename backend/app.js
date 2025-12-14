require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const app = express();
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0' });



// Global rate limit (örnek: 100 istek/15dk)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Çok fazla istek, lütfen daha sonra tekrar deneyin." }
});
app.use(globalLimiter);

// Auth ve kritik endpointler için daha sıkı limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Çok fazla deneme, lütfen daha sonra tekrar deneyin." }
});
app.use("/api/auth", authLimiter);
app.use("/api/register", authLimiter);
app.use("/api/login", authLimiter);
const authRouter = require("./routes/auth");
const feedbackRouter = require("./routes/feedback");
const apikeyRouter = require("./routes/apikey");
const swaggerRouter = require("./swagger");
const securityRouter = require("./routes/security");
const kycRouter = require("./routes/kyc");


// Middleware
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
// app.use(csrf({ cookie: true })); // CSRF sadece kritik route'larda kullanılacak

app.use("/api/auth", authRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/apikey", apikeyRouter);
app.use("/api/docs", swaggerRouter);
app.use("/api/security", securityRouter);
app.use("/api/kyc", kycRouter);

// ✅ Rate Limiter 
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 10, // Her IP'den max 10 request
  message: { 
    success: false, 
    message: '⏱️ Çok fazla istek! Lütfen 1 dakika bekleyin.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// MongoDB Bağlantısı
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/easylaunch";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB bağlandı"))
  .catch(err => console.log("⚠️ MongoDB bağlantı hatası:", err.message));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, mongodb: mongoose.connection.readyState === 1 });
});


const authRoutes = require("./routes/auth");
const tokenRoutes = require("./routes/token");
const paymentRoutes = require("./routes/payment"); 
tokenRoutes.post("/save-token", limiter);
tokenRoutes.post("/create-token", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/payments", paymentRoutes); 
app.use("/api/admin", require("./routes/admin"));
app.use("/api/user", require("./routes/user"));        
app.use("/api/users", require("./routes/user"));       
app.use("/api/launchpad", require("./routes/launchpad")); 

const aiRouter = require("./routes/ai");
app.use("/api/ai", aiRouter);


const aiAuditRouter = require("./routes/aiAudit");
app.use("/api/ai-audit", aiAuditRouter);

// Swap route

const nftRouter = require("./routes/nft");
app.use("/api/nft", nftRouter);

const swapRouter = require("./routes/swap");
app.use("/api/swap", swapRouter);

module.exports = app;