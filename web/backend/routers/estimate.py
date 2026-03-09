"""Token estimation API router."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from models.schemas import EstimateRequest, EstimateResponse
from services.estimate_service import estimate_pdf_tokens
from storage.manager import get_upload_path

router = APIRouter()


@router.post("/estimate", response_model=EstimateResponse)
async def estimate_tokens(request: EstimateRequest):
    """Estimate token usage for an uploaded PDF."""
    file_path = get_upload_path(request.file_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        result = estimate_pdf_tokens(
            file_path=file_path,
            model=request.model,
            pages=request.pages,
        )
        return EstimateResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
