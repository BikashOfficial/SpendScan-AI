# Prompts — SpendScan AI

## AI Summary Prompt (Gemini 1.5 Flash)

Used in: `server/index.js` → `/api/summary` endpoint

```
You are a financial advisor specializing in AI tool optimization for startups.

Write a 90-110 word personalized audit summary paragraph for a team with these results:
- Current AI spend: $[totalCurrentSpend]/month
- Identified savings: $[totalMonthlySavings]/month ($[totalAnnualSavings]/year)
- Savings verdict: [verdict]
- Top saving opportunities: [topSavings]
- Redundant tools detected: [redundancyWarnings]

Tone: direct, financial advisor style. Not salesy. Be honest if spend is optimized. 
If savings > 0, mention the biggest opportunity specifically.
Do not use markdown, bullet points, or headers. Plain paragraph only.
```

### Why this prompt works

**Role framing:** "Financial advisor" sets the right tone — authoritative, numbers-focused, not marketing-speak. Early iterations used "helpful assistant" and produced generic, fluffy summaries that felt AI-generated.

**Hard word count:** 90–110 words forces density. Without it, the model rambled to 200+ words. The tight constraint also forces it to pick the most important insight rather than listing everything.

**"Be honest if spend is optimized":** Critical. Without this, the model manufactured vague "you could optimize..." suggestions even for already-optimal spend. This instruction makes the output trustworthy.

**"Plain paragraph only":** Early tests returned markdown with headers and bullet points, which broke the UI card rendering.

### What didn't work

1. **Asking for "actionable recommendations"** — Produced bullet point lists, not a summary paragraph
2. **Not specifying tone** — Got generic AI-assistant voice ("Great news! Your audit shows...")
3. **Injecting all tool details** — 500+ token prompts slowed response, cost more, and the model got distracted by detail rather than giving a high-level summary
4. **Asking to "be encouraging"** — Produced false positivity on bad spend situations

### Fallback behavior

If Gemini API is unavailable (network error, quota exceeded, invalid key), the server returns a template-generated summary using the same data points. The frontend shows this transparently — no error message, just the summary. The fallback template is in `server/index.js` → `generateFallbackSummary()`.
