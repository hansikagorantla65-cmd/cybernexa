# CyberShield AI — Start Here (Beginner's Guide)

Welcome! This guide assumes you are new to web development. Read it once and
keep it around — it explains what each part of the project does and how to run it.

---

## 1. What this project is

CyberShield AI helps people recognize online scams. It has three parts:

| Part | Where it lives | What it does |
|---|---|---|
| **The main app** | `frontend/cybershield-ai/index.html` | The whole product in ONE file. Scans pasted messages/links for scam patterns, reads text from uploaded screenshots (in your browser), and now includes the **CyberShield Assistant chatbot** (bottom-right chat button). |
| **The backend** | `backend/cybershield-fastapi/` | An optional Python server. It has the same two "upload a screenshot" endpoints as a demo API. The main app does NOT need it — the app works fully on its own. |
| **Old unused files** | `frontend/cybershield-ai/script.js` and `style.css` | Leftover code from an earlier version. `index.html` does not load them. Kept for reference only — you can delete them once you're comfortable. |

---

## 2. How to run it (the easy way)

**Just double-click `frontend/cybershield-ai/index.html`** — it opens in your
browser and everything works: the scanner, the screenshot reader (needs
internet once to load a library), and the chatbot (works 100% offline).

That's it. There is no step 2 for the main app.

### Running the optional backend

Only do this if you want to demo the API or use the interactive docs
(`http://127.0.0.1:5000/docs`):

1. Open a terminal in `backend/cybershield-fastapi/`
2. `python -m venv venv`
3. Windows: `venv\Scripts\activate` — Mac/Linux: `source venv/bin/activate`
4. `pip install -r requirements.txt`
5. `uvicorn app.main:app --reload --port 5000`
6. Open `http://127.0.0.1:5000` — the backend serves the frontend itself.

Or just double-click `run_backend.bat` on Windows.

---

## 3. What was wrong before (and is now fixed)

1. **The frontend and backend were disconnected.** The app page never called
   the backend — the two halves didn't know the other existed. The app is now
   self-contained (which is the right design for your demo), and the backend
   works as a standalone optional API.
2. **Duplicate files.** `cybershield-new html.html` was an exact copy of
   `index.html` — deleted to avoid editing the wrong file.
3. **CORS misconfiguration.** The backend only accepted requests from
   `localhost:3000`, which nothing actually used. Now it accepts all origins
   (fine for a prototype — tighten it before any real deployment).
4. **A Windows `venv` was zipped into the project** — that's why the old zip
   was 10 MB. Virtual environments must never be shared; the new zip excludes
   it, and your `.gitignore` already lists it.
5. **No chatbot.** Added — see below.

---

## 4. The chatbot (CyberShield Assistant)

A floating chat button (bottom-right of the page) opens the assistant. It
understands plain-language descriptions of real scam situations and replies
with practical advice:

- OTP fraud (including a follow-up: *"Did you share it?"* → different advice
  for yes/no)
- Money lost to a scam → emergency steps: **call 1930**, contact the bank,
  report at **cybercrime.gov.in**
- UPI/QR code scams, KYC scams, prize/lottery scams, phishing links,
  fake bank calls, work-from-home task scams, investment/crypto ("double your
  money") scams, sextortion/blackmail, parcel/customs scams
- Free-trial traps, unknown bank charges
- How to report cybercrime in India, general safety tips

**How it works:** it is a *rule-based* assistant (sometimes called
"retrieval-based"). There is no server and no API key — the knowledge lives in
a JavaScript list called `CHAT_INTENTS` near the bottom of `index.html`. When
you send a message, it scores every topic against your words and the best
match answers. This is the same family of technique that powers many real
customer-service bots, and it's perfect for a demo because it never goes down,
costs nothing, and works offline.

### Teaching the bot a new topic

1. Open `index.html` and find the `CHAT_INTENTS` list (search for it).
2. Copy any existing intent block — it looks like:

```js
{
  id: "my_new_topic",
  priority: 5,
  keywords: ["some phrase", "another phrase"],
  reply:
`Your advice here, across multiple lines.`
},
```

3. Change the `id`, the `keywords` (phrases people might type), and the `reply`.
4. Save the file, refresh the browser, and test it in the chat.

**Tips:** put the exact phrases real users would type into `keywords`;
longer, specific phrases match better than single common words. Give
emergency topics (like "I lost money") a higher `priority` number.

---

## 5. Honest note on the word "AI"

The scam scanner uses pattern rules written by humans; the chatbot matches
keywords to curated answers; the backend OCR returns sample data. For a
hackathon/demo this is normal and fine. If you later want a true
large-language-model chatbot, the natural upgrade is: add a `/api/chat`
endpoint to the FastAPI backend that forwards messages to an LLM API
(e.g. Google Gemini has a free tier), store the key in the `.env` file, and
make the frontend widget call it — with the rule-based brain kept as an
offline fallback.
