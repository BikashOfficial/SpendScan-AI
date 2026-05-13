# SpendScan AI

**Live URL:** https://spend-scan-ai.vercel.app/

## Project Structure

```
spendscan/
├── client/          # React + Vite frontend → deploy to Vercel
├── server/          # Express + MongoDB backend → deploy to Render
├── tests/           # Audit engine unit tests
├── .github/         # CI workflow (lint + test on every push)
└── *.md             # All required docs
```

## Quick Start

### Backend first
```bash
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI + GEMINI_API_KEY
npm run dev            # → http://localhost:3001
```

### Then frontend
```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:3001
npm run dev            # → http://localhost:5173
```

### Run Tests
```bash
# from root
npm install && npm test
```

## Deploy

| Part | Platform | Config |
|------|----------|--------|
| `client/` | Vercel | Set `VITE_API_URL` = your Render backend URL |
| `server/` | Render | Set `MONGODB_URI`, `GEMINI_API_KEY`, `FRONTEND_URL` = your Vercel URL |

## Decisions

1. **React + Vite over Next.js** — No SSR needed; Vite is faster for a pure SPA audit tool.
2. **Client-side audit engine** — Instant results, zero latency, works even if backend is down.
3. **Gemini over OpenAI** — Cheaper, generous free tier, sufficient for 100-word summaries.
4. **Zustand + localStorage** — Form state persists across reloads without backend sessions.
5. **Honest "optimal" verdict** — Never manufactures savings; false claims destroy trust.
