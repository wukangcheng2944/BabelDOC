from __future__ import annotations

import shutil
import uuid
from pathlib import Path

STORAGE_DIR = Path(__file__).resolve().parent.parent / "file_storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
RESULT_DIR = STORAGE_DIR / "results"
GLOSSARY_DIR = STORAGE_DIR / "glossaries"


def init_storage():
    """Initialize storage directories."""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    RESULT_DIR.mkdir(parents=True, exist_ok=True)
    GLOSSARY_DIR.mkdir(parents=True, exist_ok=True)


def save_upload(filename: str, content: bytes) -> tuple[str, Path]:
    """Save an uploaded file, return (file_id, file_path)."""
    init_storage()
    file_id = uuid.uuid4().hex[:12]
    safe_name = f"{file_id}_{filename}"
    file_path = UPLOAD_DIR / safe_name
    file_path.write_bytes(content)
    return file_id, file_path


def save_glossary(filename: str, content: bytes) -> tuple[str, Path]:
    """Save a glossary file, return (file_id, file_path)."""
    init_storage()
    file_id = uuid.uuid4().hex[:12]
    safe_name = f"{file_id}_{filename}"
    file_path = GLOSSARY_DIR / safe_name
    file_path.write_bytes(content)
    return file_id, file_path


def get_upload_path(file_id: str) -> Path | None:
    """Get path for an uploaded file by ID."""
    init_storage()
    for f in UPLOAD_DIR.iterdir():
        if f.name.startswith(file_id):
            return f
    return None


def get_glossary_path(file_id: str) -> Path | None:
    """Get path for a glossary file by ID."""
    init_storage()
    for f in GLOSSARY_DIR.iterdir():
        if f.name.startswith(file_id):
            return f
    return None


def get_result_dir(task_id: str) -> Path:
    """Get result directory for a task."""
    init_storage()
    result_dir = RESULT_DIR / task_id
    result_dir.mkdir(parents=True, exist_ok=True)
    return result_dir


def cleanup_task(task_id: str):
    """Clean up files for a task."""
    result_dir = RESULT_DIR / task_id
    if result_dir.exists():
        shutil.rmtree(result_dir)
