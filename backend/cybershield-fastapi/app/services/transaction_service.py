"""
app/services/transaction_service.py
---------------------------------------------------------
Same role as transaction.service.js.
---------------------------------------------------------
"""

import random

SAMPLE_RESULTS = [
    {
        "amount": "\u20b9499.00",
        "merchant": "Netflix India",
        "transaction_type": "Debit \u2014 card payment",
        "recurring_indication": "Likely recurring subscription",
        "risk_score": 88,
    },
    {
        "amount": "\u20b9149.00",
        "merchant": "Spotify AB",
        "transaction_type": "Debit \u2014 UPI autopay",
        "recurring_indication": "Likely recurring subscription",
        "risk_score": 91,
    },
    {
        "amount": "\u20b91,250.00",
        "merchant": "Local Store Pvt Ltd",
        "transaction_type": "Debit \u2014 card payment",
        "recurring_indication": "No recurring pattern detected",
        "risk_score": 12,
    },
]

# Fixed safety text — never claim to know the exact cause of a charge,
# never offer to block an account. Stays the same regardless of sample.
VERIFICATION_STEPS = [
    "Open your bank / UPI app and check the full transaction history for this entry.",
    "Look for the merchant's name in your list of active subscriptions or app store purchases.",
    "Check your email or SMS for a receipt or renewal notice from the merchant.",
    "If it's unrecognised, contact your bank's official support line \u2014 never share "
    "your PIN, OTP or CVV with anyone who contacts you first.",
]


async def analyze_transaction(ocr_result: dict) -> dict:
    sample = random.choice(SAMPLE_RESULTS)

    return {
        "amount": sample["amount"],
        "merchant": sample["merchant"],
        "transaction_type": sample["transaction_type"],
        "recurring_indication": sample["recurring_indication"],
        "risk_score": sample["risk_score"],
        "disclaimer": (
            "A screenshot alone can't prove exactly why this was charged. "
            "It only shows what your bank or app recorded."
        ),
        "verification_steps": VERIFICATION_STEPS,
        "is_mock": True,
    }
