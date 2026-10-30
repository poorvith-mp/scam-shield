# Scam Shield: Backend Connection & Architecture Guide

## 1. Overview
Scam Shield operates with a decoupled monorepo architecture:
- **`packages/api`**: FastAPI service running the multilingual heuristic and multi-provider AI pipeline.
- **`packages/web`**: Mobile-first React client built with Vite and Tailwind CSS, deployable on Cloudflare Workers.

All communication between the frontend client and the backend analysis engine occurs over standard HTTP JSON endpoints. No AI keys or provider credentials are ever exposed to the client browser.

---

## 2. API Contract

### Health Check
- **Endpoint**: `GET /api/v1/health`
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "scam-shield",
    "version": "1.0.0"
  }
  ```

### Metadata
- **Endpoint**: `GET /api/v1/meta`
- **Response**: Supported languages (`["en", "hi", "kn"]`), rate limits, and configuration parameters.

### Analyze Message / Call / Payment
- **Endpoint**: `POST /api/v1/analyze`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "message": "Raw SMS text, call notes, or payment request description",
    "language": "en",
    "source": "web",
    "metadata": {
      "has_url": false,
      "urls": [],
      "phone_numbers": []
    }
  }
  ```
- **Response Body**:
  ```json
  {
    "request_id": "c928420b-22ab-4eb0-a5eb-92c2b742ef82",
    "verdict": "danger",
    "verdict_emoji": "🔴",
    "risk_score": 85,
    "scam_type": "authority_impersonation",
    "red_flags": [
      "Threat of police arrest, court action, or customs parcel seizure (Authority Impersonation)."
    ],
    "explanation": "Critical scam tactics detected, such as credential theft or fake authority threats.",
    "safe_action": "Do NOT share OTP/PIN, transfer money, or click links. Block the sender immediately.",
    "tactics": ["authority", "loss_aversion"],
    "language_detected": "en",
    "language_response": "en",
    "display": {
      "headline": "High Risk / Potential Scam Detected",
      "body": "Critical scam tactics detected.",
      "bullets": [
        "Banks and law enforcement never ask for OTPs or demand immediate online payment.",
        "Block sender and report to 1930 (National Cyber Crime Portal)."
      ]
    }
  }
  ```

---

## 3. Local Development

### Starting the Backend
```bash
cd packages/api
uv run uvicorn app.main:app --reload --port 8000
```

### Starting the Frontend
```bash
cd packages/web
pnpm dev
```
Vite proxies `/api` calls directly to `http://127.0.0.1:8000`.

---

## 4. Production Deployment
1. Deploy `packages/api` to your Python hosting provider (e.g. Railway, Render, Fly.io, or VPS).
2. Set the `VITE_API_URL` environment variable in `packages/web/.env` or CI build pipeline to point to your deployed HTTPS API URL.
3. Deploy frontend to Cloudflare Workers:
   ```bash
   cd packages/web
   pnpm build
   npx wrangler deploy
   ```
