"""JSONL-based task history persistence."""
from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

from models.schemas import TaskHistoryEntry, HistoryListResponse

HISTORY_FILE = Path(__file__).resolve().parent.parent / "file_storage" / "task_history.jsonl"


def _ensure_file():
    """Ensure the history file and parent directory exist."""
    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not HISTORY_FILE.exists():
        HISTORY_FILE.touch()


def append_history(entry: TaskHistoryEntry) -> None:
    """Append a task history entry to the JSONL file."""
    _ensure_file()
    with open(HISTORY_FILE, "a", encoding="utf-8") as f:
        f.write(entry.model_dump_json() + "\n")


def _load_all() -> list[TaskHistoryEntry]:
    """Load all history entries from the JSONL file."""
    _ensure_file()
    entries = []
    with open(HISTORY_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                entries.append(TaskHistoryEntry(**data))
            except (json.JSONDecodeError, ValueError):
                continue
    return entries


def query_history(
    start_date: str | None = None,
    end_date: str | None = None,
    status: str | None = None,
    search: str | None = None,
    offset: int = 0,
    limit: int = 20,
) -> HistoryListResponse:
    """Query history with filters, pagination."""
    entries = _load_all()

    # Sort by started_at descending (newest first)
    entries.sort(key=lambda e: e.started_at or "", reverse=True)

    # Apply filters
    if status:
        entries = [e for e in entries if e.status == status]

    if search:
        search_lower = search.lower()
        entries = [e for e in entries if search_lower in (e.filename or "").lower()]

    if start_date:
        entries = [e for e in entries if (e.started_at or "") >= start_date]

    if end_date:
        # Add a day to make end_date inclusive
        entries = [e for e in entries if (e.started_at or "")[:10] <= end_date]

    total = len(entries)
    items = entries[offset : offset + limit]

    return HistoryListResponse(
        items=items,
        total=total,
        offset=offset,
        limit=limit,
    )


def get_history_entry(task_id: str) -> TaskHistoryEntry | None:
    """Get a single history entry by task ID."""
    entries = _load_all()
    for entry in entries:
        if entry.task_id == task_id:
            return entry
    return None


def delete_history_entry(task_id: str) -> bool:
    """Delete a history entry by task ID. Returns True if deleted."""
    _ensure_file()
    entries = _load_all()
    new_entries = [e for e in entries if e.task_id != task_id]
    if len(new_entries) == len(entries):
        return False

    # Rewrite the file
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        for entry in new_entries:
            f.write(entry.model_dump_json() + "\n")
    return True
