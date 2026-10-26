"""
app/main.py
---------------------------------------------------------
Beginner note: this is the file you run to start the server
(similar role to server.js, but FastAPI apps are usually run
through a separate tool called "uvicorn" rather than calling
.listen() ourselves — see the "How to run it" notes at the
bottom of this file, and in README.md).

It also sets up CORS, includes our routes, and defines a
global error handler — the same jobs app.js did in Node.js.
---------------------------------------------------------
"""

import os
import sys
from pathlib import Path

# Ensure package root is in sys.path so direct execution works seamlessly
PACKAGE_DIR = Path(__file__).resolve().parent.parent
if str(PACKAGE_DIR) not in sys.path:
    sys.path.insert(0, str(PACKAGE_DIR))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.exceptions import HTTPException as FastAPIHTTPException

from app.config import settings
from app.routers import analysis

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend", "cybershield-ai"))

app = FastAPI(title="CyberShield AI Backend")

# Allow the frontend (running on a different address) to call this API.
# Same purpose as app.use(cors(...)) in the Node.js version.
#
# For this beginner prototype we allow ALL origins ("*") so the frontend
# works whether it's opened as a file, served by this backend, or run on
# any port. If you ever deploy publicly, replace "*" with your real
# frontend address (e.g. "https://yourapp.com") — never leave "*" on a
# production server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Serve the frontend UI directly at root
@app.get("/", include_in_schema=False)
async def serve_index():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"status": "ok", "message": "CyberShield AI backend is running."}


# Simple health check — same as GET /api/health in app.js.
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "CyberShield AI backend is running."}


# All analysis endpoints live under /api/analysis/...
app.include_router(analysis.router)


# Global error handler — same job as middleware/errorHandler.js.
# This runs whenever any route raises an unexpected exception,
# so the server never crashes and always sends a clean JSON error.
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    print(f"Error: {exc}")  # logged for the developer, not shown to the user
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Something went wrong on our end. Please try again."},
    )


# HTTPExceptions we raise on purpose (like "file too large") already
# carry the right status code and message, so we just pass them through
# in the same {success, message} shape the frontend expects.
@app.exception_handler(FastAPIHTTPException)
async def http_exception_handler(request: Request, exc: FastAPIHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": exc.detail},
    )


# ---------------------------------------------------------
# How to run this file:
#   uvicorn app.main:app --reload --port 5000
# Or simply run this file directly: python app/main.py
# ---------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    import webbrowser
    import threading
    import time

    def open_browser():
        time.sleep(1.2)
        webbrowser.open("http://127.0.0.1:5000")

    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run("app.main:app", host="127.0.0.1", port=5000, reload=True)
