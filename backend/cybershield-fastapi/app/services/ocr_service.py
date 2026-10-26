"""
app/services/ocr_service.py
---------------------------------------------------------
Beginner note: same role as ocr.service.js in the Node.js
version. This function pretends to "read" an uploaded image.
Every other file calls it the same way a real OCR engine
would be called, so when you're ready to add real OCR later
(e.g. Tesseract or a cloud API using settings.ocr_api_key),
you only need to change the CODE INSIDE this file.
---------------------------------------------------------
"""

import asyncio


async def extract_text_from_image(file_path: str) -> dict:
    # Simulates the delay a real OCR call would take.
    await asyncio.sleep(0.5)

    return {
        "raw_text": "[MOCK OCR OUTPUT] Sample text extracted from uploaded screenshot.",
        "is_mock": True,
    }
