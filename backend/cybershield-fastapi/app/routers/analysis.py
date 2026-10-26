"""
app/routers/analysis.py
---------------------------------------------------------
Beginner note: in the Node.js version we had separate
routes/analysis.routes.js and controllers/analysis.controller.js
files. In FastAPI, the convention is to combine "which URL"
and "what happens" into one function using a decorator
(the @router.post(...) line right above each function) — so
this one file does the job both of those files did before.

File upload validation (size/type) that used to live in
middleware/upload.js is handled here through a small helper
function, `validate_upload`, called at the top of each route.
---------------------------------------------------------
"""

import os
import time
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import settings
from app.services import ocr_service, subscription_service, transaction_service

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg", "image/jpg"}


async def validate_and_save_upload(file: UploadFile) -> str:
    """
    Same job as middleware/upload.js:
    1. Reject wrong file types
    2. Reject files that are too large
    3. Save the file temporarily and return its path
    """
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Only PNG or JPG screenshots are allowed.")

    os.makedirs(settings.upload_temp_dir, exist_ok=True)
    unique_name = f"{int(time.time() * 1000)}-{file.filename}"
    save_path = os.path.join(settings.upload_temp_dir, unique_name)

    max_bytes = settings.max_upload_size_mb * 1024 * 1024

    with open(save_path, "wb") as out_file:
        size = 0
        # Read the file in small chunks instead of all at once,
        # so we can stop early if it's too big.
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > max_bytes:
                out_file.close()
                os.remove(save_path)
                raise HTTPException(
                    status_code=400,
                    detail="The uploaded file is too large. Please upload a smaller screenshot.",
                )
            out_file.write(chunk)

    return save_path


@router.post("/subscription")
async def check_subscription(screenshot: UploadFile = File(...)):
    file_path = await validate_and_save_upload(screenshot)

    try:
        # Step 1: "read" the image (mock OCR for now)
        ocr_result = await ocr_service.extract_text_from_image(file_path)

        # Step 2: turn that text into structured subscription details
        analysis = await subscription_service.analyze_subscription(ocr_result)

        return {"success": True, "data": analysis}
    finally:
        # Step 3: clean up — we don't need to keep the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)


@router.post("/transaction")
async def check_transaction(screenshot: UploadFile = File(...)):
    file_path = await validate_and_save_upload(screenshot)

    try:
        ocr_result = await ocr_service.extract_text_from_image(file_path)
        analysis = await transaction_service.analyze_transaction(ocr_result)

        return {"success": True, "data": analysis}
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
