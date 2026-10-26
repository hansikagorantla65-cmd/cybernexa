"""
app/config.py
---------------------------------------------------------
Beginner note: same idea as config/env.js from the Node.js
version. We read every environment variable ONCE here and
share it as a single `settings` object, instead of scattering
os.environ calls across the whole project.
---------------------------------------------------------
"""

import os
from dotenv import load_dotenv

# Loads values from your .env file into the environment.
load_dotenv()


class Settings:
    def __init__(self):
        self.port = int(os.getenv("PORT", 5000))
        self.node_env = os.getenv("NODE_ENV", "development")
        self.client_origin = os.getenv("CLIENT_ORIGIN", "http://localhost:3000")

        # File uploads
        self.max_upload_size_mb = float(os.getenv("MAX_UPLOAD_SIZE_MB", 5))
        self.upload_temp_dir = os.getenv("UPLOAD_TEMP_DIR", "uploads/tmp")

        # OCR service
        self.ocr_api_key = os.getenv("OCR_API_KEY", "")
        self.ocr_api_url = os.getenv("OCR_API_URL", "")

        # Analysis behaviour
        self.risk_score_warning_threshold = int(
            os.getenv("RISK_SCORE_WARNING_THRESHOLD", 60)
        )


# A single shared instance every other file imports.
settings = Settings()
