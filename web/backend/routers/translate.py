from __future__ import annotations

import asyncio
import json

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect

from models.schemas import TaskStatusResponse, TranslateRequest, TranslateResponse
from services.translation_service import (
    create_task,
    get_task,
    get_task_status,
    run_translation,
)

router = APIRouter()
ws_router = APIRouter()


@router.post("/translate", response_model=TranslateResponse)
async def start_translation(request: TranslateRequest):
    """Start a new translation task."""
    task = create_task()

    # Launch translation in background
    asyncio.create_task(
        run_translation(task, request.file_id, request.config, request.glossary_ids)
    )

    return TranslateResponse(task_id=task.task_id)


@router.get("/translate/{task_id}/status", response_model=TaskStatusResponse)
async def check_status(task_id: str):
    """Check translation task status."""
    status = get_task_status(task_id)
    if not status:
        raise HTTPException(status_code=404, detail="Task not found")
    return status


@ws_router.websocket("/ws/translate/{task_id}")
async def websocket_progress(websocket: WebSocket, task_id: str):
    """WebSocket endpoint for real-time translation progress."""
    await websocket.accept()

    task = get_task(task_id)
    if not task:
        await websocket.send_json({"type": "error", "message": "Task not found"})
        await websocket.close()
        return

    task.websocket_connections.append(websocket)

    try:
        # Send current status immediately
        await websocket.send_json({
            "type": "progress",
            "stage": task.stage,
            "progress": task.progress / 100.0,
            "stageProgress": task.stage_progress / 100.0,
            "stageCurrent": task.stage_current,
            "stageTotal": task.stage_total,
            "partIndex": task.part_index,
            "totalParts": task.total_parts,
        })

        # If already completed, send result
        if task.status == "completed" and task.result:
            await websocket.send_json({
                "type": "finish",
                "result": task.result.model_dump(),
            })
            return

        if task.status == "failed":
            await websocket.send_json({
                "type": "error",
                "message": task.error or "Unknown error",
            })
            return

        # Listen for client messages (e.g., cancel)
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                msg = json.loads(data)
                if msg.get("type") == "cancel":
                    task.cancel_event.set()
                    await websocket.send_json({
                        "type": "error",
                        "message": "Translation cancelled",
                    })
                    break
            except asyncio.TimeoutError:
                # Send heartbeat
                if task.status in ("completed", "failed", "cancelled"):
                    break
                try:
                    await websocket.send_json({"type": "heartbeat"})
                except Exception:
                    break

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        if websocket in task.websocket_connections:
            task.websocket_connections.remove(websocket)
