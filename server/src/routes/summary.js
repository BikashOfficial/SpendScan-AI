import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// POST /api/summary — generate AI summary via Gemini
router.post("/", async (req, res) => {
  try {
    const { auditResult } = req.body;

    if (!auditResult) {
      return res.status(400).json({ error: "Missing auditResult" });
    }

    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    // If no API key, return template fallback immediately
    if (!GEMINI_KEY) {
      return res.json({ summary: generateFallbackSummary(auditResult), source: "fallback" });
    }

    const {
      totalCurrentSpend,
      totalMonthlySavings,
      totalAnnualSavings,
      verdict,
      toolResults = [],
      redundancyWarnings = [],
    } = auditResult;

    // Build top savings list for prompt
    const topSavings = toolResults
      .filter((r) => r.potentialMonthlySaving > 0)
      .sort((a, b) => b.potentialMonthlySaving - a.potentialMonthlySaving)
      .slice(0, 3)
      .map((r) => `${r.toolName} (save $${r.potentialMonthlySaving.toFixed(0)}/mo)`)
      .join(", ");

    const redundancyList =
      redundancyWarnings.length > 0
        ? redundancyWarnings.map((w) => w.tools.join(" + ")).join(", ")
        : "none";

    const prompt = `You are a financial advisor specializing in AI tool optimization for startups.

Write a 90-110 word personalized audit summary paragraph for a team with these results:
- Current AI spend: $${totalCurrentSpend}/month
- Identified savings: $${totalMonthlySavings}/month ($${totalAnnualSavings}/year)
- Savings verdict: ${verdict}
- Top saving opportunities: ${topSavings || "none identified"}
- Redundant tools detected: ${redundancyList}

Tone: direct, financial advisor style. Not salesy. Be honest if spend is already optimized.
If savings > 0, mention the biggest opportunity specifically with dollar amounts.
Do not use markdown, bullet points, or headers. Plain paragraph only.`;

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    return res.json({ summary, source: "gemini" });
  } catch (err) {
    console.error("POST /api/summary error:", err.message);
    // Always return a fallback — never fail the user
    return res.json({
      summary: generateFallbackSummary(req.body.auditResult),
      source: "fallback",
    });
  }
});

function generateFallbackSummary(auditResult) {
  if (!auditResult) return "Your audit is ready. Review the breakdown below for details.";

  const { totalCurrentSpend = 0, totalMonthlySavings = 0, totalAnnualSavings = 0, toolResults = [] } = auditResult;

  if (totalMonthlySavings <= 0) {
    return `Your AI tool spend of $${totalCurrentSpend}/month looks well-optimized for your current team and use cases. You're on the right plans with no major cost-reduction opportunities at this time. We'll notify you when better pricing or plan options become available for your specific stack.`;
  }

  const topTool = toolResults.find((r) => r.potentialMonthlySaving > 0)?.toolName || "your current tools";

  return `Your audit reveals $${totalMonthlySavings.toFixed(0)}/month in potential savings from a current spend of $${totalCurrentSpend}/month — that's $${totalAnnualSavings.toFixed(0)} annually. The biggest single opportunity is optimizing ${topTool}. By aligning plans to actual team size and eliminating redundant subscriptions, you can reduce costs meaningfully without any loss in capability. Review the per-tool breakdown below for specific, actionable next steps.`;
}

export default router;
