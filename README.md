# FinSight AI

AI-powered personal finance platform built with `Next.js`, `FastAPI`, Python, Firebase, and an LLM-backed insights engine.

## What it includes

- Expense tracking and dashboard analytics
- Budget planning and savings insights
- AI forecasting, anomaly alerts, and chat assistance
- CSV import flow for transactions
- FastAPI backend for predictions and financial analysis

## Project structure

```text
FinSight AI/
├── client/      # Next.js frontend
├── ai-engine/   # FastAPI backend
└── screenshots/ # reference images from the source repo
```

## Local setup

### Frontend

```bash
cd client
npm install
npm run dev
```

Create `client/.env.local` from `client/.env.example` and add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Backend

```bash
cd ai-engine
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Create `ai-engine/.env` from `ai-engine/.env.example` and add:

```env
GROQ_API_KEY=
```

## Notes

- This version is rebranded as `FinSight AI` and includes light UI changes, a new logo, and safer env-based config defaults.
- The upstream README states that project is MIT licensed. If you plan to publish this version publicly, verify the upstream license file/status before release.
