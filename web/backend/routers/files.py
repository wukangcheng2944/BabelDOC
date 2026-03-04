from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse

from models.schemas import UploadResponse
from storage.manager import get_result_dir, save_glossary, save_upload

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile,
    type: str = Query(default="pdf"),
):
    """Upload a PDF or glossary file."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    if type == "glossary":
        file_id, file_path = save_glossary(file.filename, content)
    else:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        file_id, file_path = save_upload(file.filename, content)

    return UploadResponse(
        file_id=file_id,
        filename=file.filename,
        size=len(content),
    )


@router.get("/download/{task_id}/{file_type}")
async def download_result(task_id: str, file_type: str):
    """Download translation result file."""
    result_dir = get_result_dir(task_id)

    type_map = {
        "dual": "_dual.pdf",
        "mono": "_mono.pdf",
        "glossary": "_glossary.csv",
    }

    suffix = type_map.get(file_type)
    if not suffix:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {file_type}")

    # Find matching file
    for f in result_dir.iterdir():
        if f.name.endswith(suffix) or (file_type == "dual" and "dual" in f.name.lower()):
            return FileResponse(
                path=f,
                filename=f.name,
                media_type="application/pdf" if file_type != "glossary" else "text/csv",
            )

    # Also check for files without the exact suffix pattern
    for f in result_dir.iterdir():
        if file_type == "dual" and f.suffix == ".pdf" and "dual" in f.stem.lower():
            return FileResponse(path=f, filename=f.name, media_type="application/pdf")
        elif file_type == "mono" and f.suffix == ".pdf" and "mono" in f.stem.lower():
            return FileResponse(path=f, filename=f.name, media_type="application/pdf")
        elif file_type == "glossary" and f.suffix == ".csv":
            return FileResponse(path=f, filename=f.name, media_type="text/csv")

    raise HTTPException(status_code=404, detail="Result file not found")
