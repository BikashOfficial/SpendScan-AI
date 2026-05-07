import express from "express";
import Lead from "../models/Lead.js";
import Audit from "../models/Audit.js";
import { sendAuditEmail } from "../services/emailService.js";

const router = express.Router();

// POST /api/leads — capture email after audit
router.post("/", async (req, res) => {
  try {
    const {
      email, company, role,
      auditId, totalMonthlySavings,
      verdict, honeypot
    } = req.body;

    // Honeypot — bots fill hidden fields, humans don't
    if (honeypot && honeypot.trim() !== "") {
      return res.json({ success: true }); // silent fail for bots
    }

    // Basic email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!auditId) {
      return res.status(400).json({ error: "Missing auditId" });
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    // Save lead (upsert — handle duplicate submissions gracefully)
    await Lead.findOneAndUpdate(
      { email: email.toLowerCase().trim(), auditId },
      {
        email: email.toLowerCase().trim(),
        company: company?.trim() || "",
        role: role || "",
        auditId,
        totalMonthlySavings: parseFloat(totalMonthlySavings) || 0,
        verdict: verdict || "",
        ip,
      },
      { upsert: true, new: true }
    );

    // Mark audit as lead captured
    const audit = await Audit.findOneAndUpdate(
      { auditId },
      { leadCaptured: true, leadEmail: email.toLowerCase().trim() },
      { new: true }
    );

    // Send confirmation email (non-blocking — don't fail if email fails)
    sendAuditEmail({
      to: email,
      totalMonthlySavings: parseFloat(totalMonthlySavings) || 0,
      totalAnnualSavings: (parseFloat(totalMonthlySavings) || 0) * 12,
      verdict: verdict || "optimal",
      auditId,
      toolResults: audit?.result?.toolResults || [],
    }).then(result => console.log("Email result:", result))
  .catch(err => console.error("Email error:", err.message));

    return res.json({ success: true });
  } catch (err) {
    console.error("POST /api/leads error:", err.message);
    return res.json({ success: false });
  }
});

export default router;
