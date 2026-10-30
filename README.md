# Scam Shield

> Instant scam detection and risk analysis for suspicious messages, phone calls, and payment requests.

Scam Shield helps students, first-time earners, and family members pause before reacting to deceptive communications. Users paste or describe a suspicious SMS, select phone call warning signs, or check a UPI payment request. The engine returns an understandable risk score (0–100), verdict, identified red flags, plain explanation, and a safe recommended next step.

---

## Key Features

- **Multi-Modal Detection**:
  - **SMS & Messaging**: Detects digital arrest threats, fake job offers, lottery rewards, bank/KYC deadlines, and suspicious URLs.
  - **Phone Calls**: Interactive checkboxes for law enforcement threats, OTP demands, and panic tactics without breaking the backend schema.
  - **Payment Requests**: Catches UPI PIN collect scams, QR code reversal tricks, and advance fee schemes.
- **Defensive Security Distinction**: Accurately distinguishes between malicious OTP solicitation ("Send your OTP") and legitimate bank advisories ("Never share your OTP with anyone").
- **Multilingual Support**: Fully localized in **English**, **Hindi (हिंदी)**, and **Kannada (ಕನ್ನಡ)** across interface elements, verdicts, and actionable advice.
- **Privacy-Safe Architecture**: Zero raw user messages are stored. The audit log only persists SHA-256 prefixes, message lengths, and verdict metrics.
- **Design System & Taste**: Built following the 60-30-10 color psychology (Dark Forest `#0a0f0d` ground, Emerald accents, Rose/Amber functional risk indicators). Clean typography, full keyboard navigation, and zero UI chrome emojis.

---

## Monorepo Architecture

```
scam-shield/
├── packages/
│   ├── api/                     # FastAPI backend engine
│   │   ├── app/
│   │   │   ├── api/v1.py        # /health, /meta, /analyze endpoints
│   │   │   ├── engine/          # Heuristic rules, AI adapters, localizer
│   │   │   ├── rate_limiter.py  # In-memory sliding-window limiter
│   │   │   ├── schemas.py       # Pydantic v2 validation models
│   │   │   └── main.py          # FastAPI application & error handlers
│   │   ├── tests/               # pytest API contract & scenario test suite
│   │   └── pyproject.toml
│   └── web/                     # React + Vite frontend client
│       ├── src/
│       │   ├── components/      # Header, InputTabs, RiskMeter, ResultCard
│       │   ├── i18n/            # Multilingual dictionaries (en, hi, kn)
│       │   └── services/        # HTTP client with timeout & error mapping
│       ├── worker.js            # Cloudflare Workers static edge handler
│       ├── wrangler.json        # Cloudflare configuration
│       └── tailwind.config.js
├── CONNECT_BACKEND.md           # API specification & connection guide
└── README.md
```

---

## Getting Started

### 1. Backend Service (`packages/api`)

Requires Python 3.10+ and [`uv`](https://github.com/astral-sh/uv).

```bash
cd packages/api

# Run automated test suite
uv run pytest -v

# Start development server
uv run uvicorn app.main:app --reload --port 8000
```

Interactive documentation is available at `http://localhost:8000/docs` in development mode.

### 2. Frontend Client (`packages/web`)

Requires Node.js 18+ and `pnpm`.

```bash
cd packages/web

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build production bundle
pnpm build
```

---

## Disclaimer

Scam Shield provides automated heuristic risk guidance, not a legal guarantee. Always verify financial or legal matters directly with your bank, local police station, or official service provider.
