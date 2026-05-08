# REFLECTION — SpendScan AI

---

## 1. The Hardest Bug

The hardest bug I hit was during the Gemini API integration for the AI-generated summary on the results page. The API call was failing silently — the summary would just never appear, and the loading spinner would spin indefinitely. Initially I assumed it was a CORS issue since the request was going from the client, so I moved it to the backend. That didn't fix it either.

I started logging the actual error response and found it was a `503 Service Unavailable` from Gemini — not a network or auth issue, but a quota/overload error that the API returned as a non-standard error body. My `catch` block wasn't handling it because `axios` wasn't throwing on a 503 with that particular Gemini response shape.

I added explicit status code checks and then realized the real fix was to add a proper fallback summary template. The fallback reads the audit data directly and generates a human-readable sentence — so even if Gemini is down, the user always sees something useful. This actually made the product more resilient: the AI summary is now a progressive enhancement, not a hard dependency.

The lesson was that external API failures need to be treated as the expected case, not the exception. Error handling for LLM APIs needs to account for rate limits, quota exceeded, and partial responses — not just network failures.

---

## 2. A Decision You Reversed

My original plan was to use **Resend** as the email service for sending audit confirmation emails. I integrated it, got the API key, and it worked in testing. However, when I tried deploying to a production-like environment, I ran into issues with Resend's domain verification requirements — you need a verified sending domain to email addresses outside your own, which wasn't feasible quickly for a side project without a custom domain set up.

I reversed the decision and switched to **Nodemailer with Gmail SMTP** using an App Password. This was simpler to configure, had no domain verification requirement, and worked immediately with my existing Gmail account. The trade-off is that Gmail SMTP has daily send limits (500/day), but for an early-stage tool collecting leads, that's more than sufficient.

The lesson was that "popular" or "modern" tools are not always the right choice when your deployment constraints are different from the happy path the docs assume.

---

## 3. What You'd Build in Week 2

Week 2 would be driven by one question: **do users actually trust the numbers?**

The audit engine currently uses hardcoded pricing data. The first week 2 priority would be a **pricing data update pipeline** — either scraping official pricing pages or letting users manually correct prices when our data is wrong. User trust collapses the moment they see a wrong price.

Second priority: **a proper admin dashboard** showing aggregate analytics — which tools are most commonly audited, average savings found, conversion rate from audit → email submission. This data would tell me which tools to prioritize for deeper recommendation logic.

Third: **a "compare plans" feature** where users can see a side-by-side breakdown of what they'd pay on different plan tiers before committing. This would make SpendScan useful as a pre-purchase research tool, not just a post-purchase audit.

Finally: **Slack/Teams integration** so engineering managers can run the audit inside their existing workflow without opening a browser tab. The insight from the user interviews was that tooling decisions happen in Slack, not in dashboards.

---

## 4. How You Used AI Tools

I used **Gemini** (via the Gemini API) as part of the product itself for generating audit summaries. For development, I used AI assistance for boilerplate — scaffolding the Express server structure, writing the Mongoose schema definitions, and generating the initial CSS variable system.

I did **not** trust AI with the audit engine logic (`auditEngine.js`). The recommendation rules — which plans to suggest, when to flag redundancy, how to calculate savings — needed to be precise and grounded in real pricing. An AI generating those rules would hallucinate prices or suggest downgrades that don't actually exist as plan tiers. I wrote that file manually and tested each rule case by case.

One specific time the AI was wrong: I asked for help structuring the MongoDB schema and it suggested using `ref` and `populate()` for linking leads to audits. That would have required a join-like query every time I fetched an audit with its lead. I caught this because I knew the access pattern — I always fetch the audit and lead together — so embedding the `leadEmail` directly in the Audit document was the right call. The AI was suggesting a relational pattern for what should be a document-oriented design.

---

## 5. Self-Rating

| Dimension | Rating (1–10) | Reason |
|-----------|--------------|--------|
| Discipline | 7 | Worked consistently across 5 of 7 days, took two honest days off rather than logging fake hours |
| Code quality | 7 | Componentized properly, clean separation of concerns, but audit engine could use unit tests |
| Design sense | 8 | The dark theme, accent green, and DM Mono font system came together well; landing page feels premium |
| Problem-solving | 8 | Diagnosed the Gemini API failure correctly and built a resilient fallback rather than just retrying |
| Entrepreneurial thinking | 7 | The Credex CTA integration and lead capture form show product thinking beyond just "build a tool" |
