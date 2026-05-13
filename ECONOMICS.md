# Economics — SpendScan AI

---

## Unit Economics: What's a Converted Lead Worth to Credex?

Credex sells discounted AI infrastructure credits sourced from companies that overforecast usage. SpendScan AI is the top-of-funnel lead generation tool — users self-qualify by running an audit that reveals how much they're overpaying.

### LTV Model

| Customer Segment | Avg Monthly Credit Spend | Gross Margin | Lifetime | LTV |
|---|---|---|---|---|
| Small team (5–15 engineers) | $500/mo | 15% | 12 months | **$900** |
| Mid-market (15–50 engineers) | $2,000/mo | 15% | 18 months | **$5,400** |
| Enterprise (50+ engineers) | $8,000/mo | 12% | 24 months | **$23,040** |
| **Blended estimate** | — | — | — | **~$1,500** |

> **Why 15% gross margin?** Credex buys unused AI credits from over-forecasting companies at 20–30% discount and resells at 5–15% discount to buyers — capturing the spread.

---

## CAC by Acquisition Channel

| Channel | Estimated Reach | → Audit Start | → Audit Complete | → Email Lead | → Customer | Est. CAC |
|---|---|---|---|---|---|---|
| HN / Product Hunt launch | 5,000 clicks | 40% → 2,000 | 80% → 1,600 | 30% → 480 | 2% → **10** | **$0** |
| Reddit (r/SaaS, r/devtools) | 300 clicks/post | 35% → 105 | 80% → 84 | 30% → 25 | 2% → **0.5** | **$0** |
| Newsletter feature | 2,000 clicks | 30% → 600 | 80% → 480 | 30% → 144 | 2% → **3** | **$0** |
| VC portfolio outreach | 400 opens | 60% → 240 | 85% → 204 | 35% → 71 | 5% → **4** | **$0** |
| LinkedIn Paid (EM/CTO target) | — | — | — | — | — | ~$5,300 ❌ |

**Conclusion:** Paid acquisition doesn't work at current LTV levels. LinkedIn CAC of ~$5,300 vs blended LTV of ~$1,500 is deeply negative. This is an **organic, content-driven, word-of-mouth** lead-gen tool — the economics only work if distribution is free.

---

## Full Conversion Funnel (Per 1,000 Visitors)

```
1,000   Landing page visits
  400   Audit started          (40% — strong intent signal, they clicked through)
  320   Audit completed        (80% — low drop-off; form is short by design)
   96   Email captured         (30% — only high-savings users convert; low-savings skip)
   12   Credex consultation    (12.5% — filtered to "high-savings" verdict only)
    3   Credit purchase        (25% close rate from consultation)

Revenue per 1,000 visits = 3 customers × $1,500 LTV = $4,500
```

This is a strong content-tool model. SEO-driven financial calculators in adjacent spaces (payroll, marketing ROI, cloud cost) generate $2,000–$8,000 per 1,000 organic visits. SpendScan sits in that range.

---

## Path to $1M ARR in 18 Months

Working backwards from the target:

| Metric | Required |
|---|---|
| ARR target | $1,000,000 |
| Avg revenue per customer/year | $1,200 (blended) |
| Active customers needed | **~833** |
| At 25% consultation close rate | 3,333 consultations |
| At 12.5% email → consultation | 26,666 email leads |
| At 30% audit → email capture | **88,888 audit completions** |
| Over 18 months | ~4,938 audits/month by month 18 |

### Realistic Growth Trajectory

| Month | Audits/Month | Key Driver |
|---|---|---|
| 1 | 500 | HN launch, Reddit posts |
| 3 | 1,500 | Referral flywheel (shared links), newsletter features |
| 6 | 3,000 | SEO beginning to index "AI tool pricing" queries |
| 12 | 8,000 | Google ranking for tool comparison queries, VC partnerships |
| 18 | 12,000 | Established brand, backlink authority |

**Cumulative:** ~120,000 audits → ~36,000 leads → ~4,500 consultations → ~1,125 customers → **$1.35M ARR**

> **This works if:** (1) HN/Product Hunt launch generates SEO backlink anchor, (2) shareable results drive ≥0.3 referrals per completed audit, (3) Credex closes consultations at 25%+ with a strong sales motion.

---

## Pivot Triggers

| Signal | What It Means | Response |
|---|---|---|
| Consultation → close rate < 10% after 50 consultations | Audit attracts wrong users (too small, not buying credits) | Raise "high-savings" threshold from $50/mo to $200/mo to filter for larger teams |
| Email capture rate < 15% | Results page value prop is unclear | A/B test headline and email form copy |
| Audit completion rate < 60% | Form is too long or confusing | Reduce to 3 fields; make plan/seats optional |
| >40% of leads are solo devs | Market is consumers, not B2B | Add a "for teams" gate or redirect solo users to a lightweight free tier |

---

## Operational Cost to Run SpendScan

| Item | Monthly Cost |
|---|---|
| Vercel (frontend) | $0 (free tier) |
| Render (Express backend) | $0 (free tier, spins down) |
| MongoDB Atlas | $0 (M0 free tier, 512MB) |
| Gemini API (100k summaries) | ~$7.50 (0.075¢/1M tokens) |
| Gmail SMTP | $0 |
| Domain | ~$1/mo amortized |
| **Total** | **< $10/month** |

Marginal cost per audit ≈ $0.000075 (Gemini summary only). The tool is essentially free to operate at early scale.
