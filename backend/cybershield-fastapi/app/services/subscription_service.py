"""
app/services/subscription_service.py
---------------------------------------------------------
Same role as subscription.service.js. Returns realistic sample
data matching the frontend's SUBSCRIPTION_SAMPLES, so the whole
app works end-to-end before real analysis logic is built.
---------------------------------------------------------
"""

import random
from app.config import settings

SAMPLE_RESULTS = [
    {
        "trial_duration": "7-day free trial",
        "initial_price": "\u20b90 today",
        "renewal_price": "\u20b9999 / month",
        "renewal_frequency": "Monthly",
        "auto_renewal": True,
        "risk_score": 82,
    },
    {
        "trial_duration": "14-day free trial",
        "initial_price": "\u20b90 today",
        "renewal_price": "\u20b92,499 / year",
        "renewal_frequency": "Yearly",
        "auto_renewal": True,
        "risk_score": 74,
    },
]


async def analyze_subscription(ocr_result: dict) -> dict:
    sample = random.choice(SAMPLE_RESULTS)
    has_warning = sample["risk_score"] >= settings.risk_score_warning_threshold

    return {
        "trial_duration": sample["trial_duration"],
        "initial_price": sample["initial_price"],
        "renewal_price": sample["renewal_price"],
        "renewal_frequency": sample["renewal_frequency"],
        "auto_renewal": sample["auto_renewal"],
        "risk_score": sample["risk_score"],
        "has_warning": has_warning,
        "warning_message": (
            "This trial auto-renews into a paid plan. If you don't cancel "
            "before the trial ends, you'll automatically be charged again "
            "on the same cycle."
        )
        if has_warning
        else None,
        "is_mock": True,
    }
