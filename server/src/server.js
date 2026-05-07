import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import { connectDb } from "./db.js";
import { apiLimiter, leadLimiter, summaryLimiter } from "./middleware/rateLimiter.js";
import auditRoutes from "./routes/audits.js";
import leadRoutes from "./routes/leads.js";
import summaryRoutes from "./routes/summary.js";

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────
app.use(cors());

app.use(express.json({ limit: "2mb" }));

// ── Connect DB ──────────────────────────────────────────────────
await connectDb();

// ── Routes ──────────────────────────────────────────────────────

// Health check (no rate limit)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    db: "connected",
    timestamp: new Date().toISOString(),
  });
});

// Audits
app.use("/api/audits", apiLimiter, auditRoutes);

// AI Summary
app.use("/api/summary", summaryLimiter, summaryRoutes);

// Lead capture
app.use("/api/leads", leadLimiter, leadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 SpendScan backend running on http://localhost:${PORT}`);
  console.log(`   CORS allowed for: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
});
