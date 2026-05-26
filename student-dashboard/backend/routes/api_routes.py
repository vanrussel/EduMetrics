"""
API routes module for the EduMetrics Gemini AI service.

Exposes three POST endpoints that delegate to the Gemini service layer:
  - /insight     — generate dataset insights, trends, and recommendations
  - /ask         — answer a natural-language question about the dataset
  - /categorize  — classify a single student record and produce tags

All service functions are synchronous, so route handlers use plain `def`
throughout to avoid wrapping blocking calls in an async context.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any

from services.gemini_service import (
    generate_insight,
    ask_dataset_question,
    categorize_record,
)

router = APIRouter()


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class InsightRequest(BaseModel):
    """Payload for the /insight endpoint."""
    data: Any  # Dataset summary or additional context passed to the AI prompt


class AskRequest(BaseModel):
    """Payload for the /ask endpoint."""
    question: str  # Natural-language question about the student dataset
    data: Any       # Supporting context forwarded alongside the question


class CategorizeRequest(BaseModel):
    """Payload for the /categorize endpoint."""
    record: Any  # A single student record (dict or string) to be categorized


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/insight")
def insight(payload: InsightRequest):
    """
    Generate AI-powered insights for the student performance dataset.

    Delegates to `generate_insight`, which builds a prompt from the
    provided context and returns Gemini's analysis of key trends and
    recommendations.

    Args:
        payload (InsightRequest): Contains `data` — additional context
                                  to enrich the AI prompt.

    Returns:
        dict: {"insight": <str>} — the generated analysis.

    Raises:
        HTTPException 500: If the Gemini service call fails.
    """
    try:
        result = generate_insight(payload.data)
        return {"insight": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask")
def ask(payload: AskRequest):
    """
    Answer a natural-language question about the student performance dataset.

    Delegates to `ask_dataset_question`, which constructs a Billy AI
    prompt and returns a concise, data-grounded answer from Gemini.

    Args:
        payload (AskRequest): Contains `question` (the user's query) and
                              `data` (supporting context).

    Returns:
        dict: {"answer": <str>} — Gemini's response to the question.

    Raises:
        HTTPException 500: If the Gemini service call fails.
    """
    try:
        result = ask_dataset_question(payload.question, payload.data)
        return {"answer": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/categorize")
def categorize(payload: CategorizeRequest):
    """
    Categorize a student record and generate descriptive tags.

    Delegates to `categorize_record`, which sends the record to Gemini
    and returns a JSON object containing a category label and tag list.

    Args:
        payload (CategorizeRequest): Contains `record` — the student
                                     record to classify.

    Returns:
        dict: {"result": <str>} — JSON string with "category" and "tags".

    Raises:
        HTTPException 500: If the Gemini service call fails.
    """
    try:
        result = categorize_record(payload.record)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))