"""History API router."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from models.schemas import HistoryListResponse
from storage.history import query_history, get_history_entry, delete_history_entry

router = APIRouter()


@router.get("/history", response_model=HistoryListResponse)
async def list_history(
    start_date: str | None = None,
    end_date: str | None = None,
    status: str | None = None,
    search: str | None = None,
    offset: int = 0,
    limit: int = 20,
):
    """List task history with optional filters."""
    return query_history(
        start_date=start_date,
        end_date=end_date,
        status=status,
        search=search,
        offset=offset,
        limit=limit,
    )


@router.get("/history/{task_id}")
async def get_history(task_id: str):
    """Get a single history entry."""
    entry = get_history_entry(task_id)
    if not entry:
        raise HTTPException(status_code=404, detail="History entry not found")
    return entry


@router.delete("/history/{task_id}")
async def remove_history(task_id: str):
    """Delete a history entry."""
    deleted = delete_history_entry(task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="History entry not found")
    return {"ok": True}
