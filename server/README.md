# SpendScan Backend

Express + MongoDB backend for SpendScan AI.

## Structure

```
backend/
├── src/
│   ├── server.js            # Entry point
│   ├── db.js                # MongoDB connection
│   ├── models/
│   │   ├── Audit.js         # Audit schema
│   │   └── Lead.js          # Lead capture schema
│   ├── routes/
│   │   ├── audits.js        # POST /api/audits, GET /api/audits/:id/public
│   │   ├── leads.js         # POST /api/leads
│   │   └── summary.js       # POST /api/summary (Gemini)
│   └── middleware/
│       └── rateLimiter.js   # Per-route rate limits
├── package.json
└── .env.example
```

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGODB_URI and GEMINI_API_KEY
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Google Gemini API key (get free at ai.google.dev) |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. http://localhost:5173) |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/audits` | Save audit result, returns `{ auditId }` |
| GET | `/api/audits/:id/public` | Get anonymized public audit |
| POST | `/api/summary` | Generate Gemini AI summary |
| POST | `/api/leads` | Capture email lead |

## Deploy to Render (Free)

1. Push backend folder to GitHub (or same repo)
2. Create new **Web Service** on [render.com](https://render.com)
3. Set root directory to `backend/`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables in Render dashboard
7. Copy the Render URL → set as `VITE_API_URL` in Vercel frontend env vars
