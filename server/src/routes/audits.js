import express from "express";
import { nanoid } from "nanoid";
import Audit from "../models/Audit.js";

const router = express.Router();

// POST /api/audits — save a new audit, return auditId
router.post("/", async (req, res) => {
  try {
    const { entries, teamSize, result } = req.body;

    if (!entries || !result) {
      return res.status(400).json({ error: "Missing entries or result" });
    }

    const auditId = nanoid(10);

    const audit = new Audit({
      auditId,
      entries,
      teamSize: parseInt(teamSize) || 1,
      result,
    });

    await audit.save();

    return res.status(201).json({ auditId, success: true });
  } catch (err) {
    console.error("POST /api/audits error:", err.message);
    // Still return an ID so frontend doesn't break
    return res.status(200).json({ auditId: nanoid(10), success: false });
  }
});

// GET /api/audits/:auditId/public — anonymized public version
router.get("/:auditId/public", async (req, res) => {
  try {
    const audit = await Audit.findOne({ auditId: req.params.auditId }).lean();

    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }

    // Strip any PII — only return tool/savings data
    const publicResult = {
      toolResults: audit.result?.toolResults?.map((t) => ({
        toolName: t.toolName,
        planName: t.planName,
        potentialMonthlySaving: t.potentialMonthlySaving,
        potentialAnnualSaving: t.potentialAnnualSaving,
      })) || [],
      redundancyWarnings: audit.result?.redundancyWarnings?.map((w) => ({
        tools: w.tools,
        saving: w.saving,
      })) || [],
      totalCurrentSpend: audit.result?.totalCurrentSpend,
      totalMonthlySavings: audit.result?.totalMonthlySavings,
      totalAnnualSavings: audit.result?.totalAnnualSavings,
      savingsPercent: audit.result?.savingsPercent,
      verdict: audit.result?.verdict,
    };

    return res.json({
      result: publicResult,
      toolCount: audit.entries?.length || 0,
      createdAt: audit.createdAt,
    });
  } catch (err) {
    console.error("GET /api/audits/:id/public error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
