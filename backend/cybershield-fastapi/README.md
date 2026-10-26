# CyberShield AI — Backend (FastAPI version)

This is the Python/FastAPI rewrite of the backend. It behaves identically
to the Node.js version — same endpoints, same JSON shape (just written
with Python's usual `snake_case` naming instead of `camelCase`).

## Folder structure

```
cybershield-fastapi/
├── requirements.txt      <- Python dependencies (like package.json)
├── .env.example           <- copy this to .env and fill in values
├── .gitignore
└── app/
    ├── main.py             <- starts the app, sets up CORS + error handling
    ├── config.py           <- loads .env values into one place
    ├── routers/
    │   └── analysis.py     <- the 2 upload endpoints (routes + controller combined)
    └── services/
        ├── ocr_service.py
        ├── subscription_service.py
        └── transaction_service.py
```

## How to run it (step by step)

1. **Open a terminal in this folder** (the one containing `requirements.txt`).

2. **Create a virtual environment** (keeps this project's packages separate
   from anything else on your computer):
   ```
   python -m venv venv
   ```

3. **Activate it:**
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

   You'll see `(venv)` appear at the start of your terminal line — that
   means it worked.

4. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

5. **Create your `.env` file:**
   - Windows: `copy .env.example .env`
   - Mac/Linux: `cp .env.example .env`

6. **Start the server:**
   ```
   uvicorn app.main:app --reload --port 5000
   ```
   `--reload` means it restarts automatically whenever you save a file —
   handy while developing.

7. **Test it's alive** — open this in your browser:
   ```
   http://localhost:5000/api/health
   ```
   You should see: `{"status":"ok","message":"CyberShield AI backend is running."}`

## Bonus: automatic API docs

FastAPI gives you this for free — open:
```
http://localhost:5000/docs
```
This is an interactive page where you can literally upload a test
screenshot and try both endpoints directly in your browser, no
Postman/Thunder Client needed. Great for demoing to judges.

## Endpoints

| Method | URL | Body |
|---|---|---|
| GET | `/api/health` | none |
| POST | `/api/analysis/subscription` | form-data, field name `screenshot` (PNG/JPG file) |
| POST | `/api/analysis/transaction` | form-data, field name `screenshot` (PNG/JPG file) |

## Why FastAPI instead of Express?

- Still Python, matching common SIH team setups where teammates split
  frontend (JS) and backend (Python) work.
- Free interactive API docs at `/docs`, generated automatically.
- Built-in request validation — FastAPI rejects malformed requests before
  your code even runs.
