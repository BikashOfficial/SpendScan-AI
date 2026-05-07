# Metrics — SpendScan AI

## North Star Metric

**Qualified leads per week** — defined as audit completions where total identified savings ≥ $200/month AND the user left their email.

**Why this, not total audits:** Total audits is a vanity metric. The tool's purpose is lead gen for Credex credits. A user who finds $50 in savings is not a qualified Credex prospect. A user finding $500+/month is. The North Star must reflect business value, not just traffic.

**Why not "consultations booked":** Too far down the funnel to be actionable in week 1. We can't improve a metric we see only 12 times per 1,000 audits. Qualified leads gives us enough signal to optimize at the audit/email-capture layer.

---

## 3 Input Metrics

### 1. Audit Completion Rate
*Formula: audits completed / audit form opens*
*Target: ≥ 75%*

Dropping below 60% means the form is too long or confusing. We'd simplify — reduce required fields, make plans auto-populate from tool selection.

### 2. Email Capture Rate (post-audit)
*Formula: emails submitted / audits completed*
*Target: ≥ 25%*

If this drops, the results page isn't showing compelling enough value, or the email prompt is too early/too salesy. Fix: A/B test "get your report" vs "notify me of changes" framing.

### 3. High-Savings Rate
*Formula: audits showing ≥ $200/mo savings / total audits*
*Target: ≥ 35%*

If this is too low, we're attracting the wrong users (already-optimized spenders, students, hobbyists). Fix: tighten landing page copy to attract teams with 3+ paid AI tools.

---

## What We'd Instrument First

1. **Funnel tracking** (Plausible or PostHog): `/` → `/audit` → form submission → `/results` → email modal → email submitted. Every drop-off point needs a number.
2. **Audit result distribution**: histogram of `totalMonthlySavings`. Are most audits showing $0–$50 (tool is poorly calibrated or wrong audience) or $200+ (right users)?
3. **Tool popularity**: which tools appear most in audits. Guides which pricing data to update first and which tool comparisons to feature on the landing page.

---

## Pivot Trigger

If after 500 audit completions:
- Email capture rate < 15%, OR
- Qualified lead rate < 5% (fewer than 25 qualified leads from 500 audits)

→ **Pivot signal**: The audit results aren't compelling enough to capture intent. Either the savings math is too conservative, or we're attracting the wrong audience. Action: Review top 50 audits manually, recalibrate audit engine, tighten landing page targeting.

**DAU is not a metric for this tool.** Most users audit once, maybe again when they change their stack. It's a quarterly-use tool at most. Returning users signal referral behavior, not retention — track "referred by shared link" instead.
