@echo off
title CyberShield AI Server
echo ====================================================
echo Starting CyberShield AI Application
echo ====================================================

cd /d "%~dp0backend\cybershield-fastapi"

if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
)

if not exist "venv" (
    echo Creating Python virtual environment (venv)...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Checking and installing requirements...
pip install -r requirements.txt

echo.
echo ====================================================
echo CyberShield AI is running!
echo Application Web UI: http://127.0.0.1:5000
echo Health Check:       http://127.0.0.1:5000/api/health
echo Interactive Docs:   http://127.0.0.1:5000/docs
echo Press Ctrl+C to shut down the server.
echo ====================================================
echo.

uvicorn app.main:app --reload --port 5000
pause
