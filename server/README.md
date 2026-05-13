# SpendScan AI — Backend

> Express + MongoDB + Gemini API backend for SpendScan AI.  
> Handles audit persistence, AI summary generation, lead capture, and email delivery.

---

## Project Structure

```
server/
├── src/
│   ├── server.js              # Entry point — Express app + route wiring
│   ├── db.js                  # MongoDB connection (connectDb)
│   ├── models/
│   │   ├── Audit.js           # Audit schema (entries, results, lead flag)
│   │   └── Lead.js            # Lead capture schema (email, company, role)
│   ├── routes/
│   │   ├── audits.js          # POST /api/audits · GET /api/audits/:id/public
│   │   ├── leads.js           # POST /api/leads
│   │   └── summary.js         # POST /api/summary (Gemini AI paragraph)
│   ├── middleware/
│   │   └── rateLimiter.js     # Per-route rate limits (api / lead / summary)
│   └── services/
│       └── emailService.js    # Nodemailer HTML email via Gmail SMTP
├── package.json
└── .env
```

---

## Local Setup

```bash
# From the repo root
cd server
npm install

# Create your .env (see variables below)
cp .env.example .env   # or create manually

# Start dev server with hot-reload
npm run dev

# Start production server
npm start
```

> **Requires Node.js 18+** (uses ES Modules `"type": "module"` and top-level `await`)

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=3001
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
GEMINI_API_KEY=your_gemini_api_key

# Email (Gmail SMTP)
FROM_EMAIL=SpendScan AI <you@gmail.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your_app_password        # Gmail App Password (not your Gmail password)

# Frontend URL for CORS + shareable links
FRONTEND_URL=http://localhost:5173
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `3001`) |
| `MONGODB_URI` | **Yes** | MongoDB Atlas `mongodb+srv://` connection string |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key — get free at [ai.google.dev](https://ai.google.dev) |
| `FROM_EMAIL` | No | Display name + address for outbound emails |
| `SMTP_HOST` | No | SMTP host (default: `smtp.gmail.com`) |
| `SMTP_PORT` | No | SMTP port (default: `587`) |
| `SMTP_USER` | No | Gmail address for sending emails |
| `SMTP_PASS` | No | Gmail [App Password](https://myaccount.google.com/apppasswords) (2FA must be on) |
| `FRONTEND_URL` | No | Frontend origin for CORS (default: `http://localhost:5173`) |

> **Note:** Email variables are optional — if `SMTP_USER`/`SMTP_PASS` are missing, the server logs a warning and skips email silently. All other features still work.

---

## API Endpoints

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Returns `{ status: "ok", timestamp }` |

### Audits

| Method | Path | Rate Limit | Description |
|---|---|---|---|
| `POST` | `/api/audits` | 100 req/15min | Save audit result. Returns `{ auditId }` |
| `GET` | `/api/audits/:id/public` | 100 req/15min | Returns anonymized audit (no PII) |

**POST `/api/audits` body:**
```json
{
  "entries": [{ "toolId": "cursor", "planId": "pro", "seats": 3, "monthlySpend": 60, "useCase": "coding" }],
  "teamSize": 3,
  "result": { "totalMonthlySavings": 40, "verdict": "low-savings", "..." }
}
```

### AI Summary

| Method | Path | Rate Limit | Description |
|---|---|---|---|
| `POST` | `/api/summary` | 20 req/hour | Generates a Gemini AI paragraph from audit data |

### Leads

| Method | Path | Rate Limit | Description |
|---|---|---|---|
| `POST` | `/api/leads` | 5 req/hour | Captures email lead + triggers audit email |

**POST `/api/leads` body:**
```json
{
  "email": "user@company.com",
  "company": "Acme Inc",
  "role": "CTO / VP Engineering",
  "auditId": "abc123",
  "totalMonthlySavings": 120,
  "verdict": "high-savings"
}
```

---

## Deploying to Render (Free Tier)

1. Push the monorepo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** to `server`
5. **Build command:** `npm install`
6. **Start command:** `npm start`
7. Add all environment variables in the Render dashboard
8. Copy the Render URL (e.g. `https://spendscan-api.onrender.com`)
9. Set `VITE_API_URL=https://spendscan-api.onrender.com` in your Vercel frontend environment variables

> **Render free tier note:** The server spins down after 15 minutes of inactivity. First request after sleep takes ~30s. Upgrade to Starter ($7/mo) to keep it always-on.

---

## Rate Limits

| Limiter | Applied To | Limit |
|---|---|---|
| `apiLimiter` | `/api/audits` | 100 requests per 15 minutes per IP |
| `summaryLimiter` | `/api/summary` | 20 requests per hour per IP |
| `leadLimiter` | `/api/leads` | 5 requests per hour per IP |

Rate limit headers are returned on every response. Exceeding limits returns `429 Too Many Requests`.
