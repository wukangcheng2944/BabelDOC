from __future__ import annotations

import asyncio
import shutil
import traceback
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from models.schemas import TaskStatusResponse, TranslateConfig, TranslateResultResponse
from storage.manager import get_glossary_path, get_result_dir, get_upload_path


@dataclass
class TranslationTask:
    """Represents a running translation task."""

    task_id: str
    status: str = "pending"
    progress: float = 0.0
    stage: str = ""
    stage_progress: float = 0.0
    stage_current: int = 0
    stage_total: int = 0
    part_index: int = 1
    total_parts: int = 1
    error: str | None = None
    result: TranslateResultResponse | None = None
    cancel_event: asyncio.Event = field(default_factory=asyncio.Event)
    websocket_connections: list[Any] = field(default_factory=list)


# In-memory task registry
_tasks: dict[str, TranslationTask] = {}


def create_task() -> TranslationTask:
    """Create a new translation task."""
    task_id = uuid.uuid4().hex[:12]
    task = TranslationTask(task_id=task_id)
    _tasks[task_id] = task
    return task


def get_task(task_id: str) -> TranslationTask | None:
    """Get a task by ID."""
    return _tasks.get(task_id)


def get_task_status(task_id: str) -> TaskStatusResponse | None:
    """Get task status as response model."""
    task = _tasks.get(task_id)
    if not task:
        return None
    return TaskStatusResponse(
        status=task.status,
        progress=task.progress,
        stage=task.stage,
        stage_progress=task.stage_progress,
        stage_current=task.stage_current,
        stage_total=task.stage_total,
        part_index=task.part_index,
        total_parts=task.total_parts,
        error=task.error,
        result=task.result,
    )


async def broadcast_progress(task: TranslationTask, data: dict):
    """Broadcast progress to all WebSocket connections."""
    dead = []
    for ws in task.websocket_connections:
        try:
            await ws.send_json(data)
        except Exception:
            dead.append(ws)
    for ws in dead:
        task.websocket_connections.remove(ws)


async def run_translation(
    task: TranslationTask,
    file_id: str,
    config: TranslateConfig,
    glossary_ids: list[str],
):
    """Run the translation using BabelDOC's async_translate."""
    try:
        task.status = "translating"

        # Import BabelDOC components
        from babeldoc.docvision.doclayout import DocLayoutModel
        from babeldoc.format.pdf.high_level import async_translate
        from babeldoc.format.pdf.translation_config import (
            TranslationConfig,
            WatermarkOutputMode,
        )
        from babeldoc.glossary import Glossary
        from babeldoc.translator.translator import OpenAITranslator

        # Get uploaded file
        input_path = get_upload_path(file_id)
        if not input_path:
            raise FileNotFoundError(f"Uploaded file not found: {file_id}")

        # Setup output directory
        result_dir = get_result_dir(task.task_id)

        # Create translator
        translator_kwargs: dict[str, Any] = {}
        if config.openai_reasoning:
            translator_kwargs["reasoning"] = config.openai_reasoning

        translator = OpenAITranslator(
            lang_in=config.lang_in,
            lang_out=config.lang_out,
            model=config.openai_model,
            base_url=config.openai_base_url or None,
            api_key=config.openai_api_key,
            ignore_cache=config.ignore_cache,
            enable_json_mode_if_requested=config.enable_json_mode_if_requested,
            send_dashscope_header=config.send_dashscope_header,
            send_temperature=not config.no_send_temperature,
            **translator_kwargs,
        )

        # Create term extraction translator if configured
        term_extraction_translator = translator
        if config.use_independent_term_model and (
            config.openai_term_extraction_model
            or config.openai_term_extraction_base_url
            or config.openai_term_extraction_api_key
        ):
            term_kwargs: dict[str, Any] = {}
            if config.openai_term_extraction_reasoning:
                term_kwargs["reasoning"] = config.openai_term_extraction_reasoning

            term_extraction_translator = OpenAITranslator(
                lang_in=config.lang_in,
                lang_out=config.lang_out,
                model=config.openai_term_extraction_model or config.openai_model,
                base_url=config.openai_term_extraction_base_url or config.openai_base_url or None,
                api_key=config.openai_term_extraction_api_key or config.openai_api_key,
                ignore_cache=config.ignore_cache,
                enable_json_mode_if_requested=config.enable_json_mode_if_requested,
                send_dashscope_header=config.send_dashscope_header,
                send_temperature=not config.no_send_temperature,
                **term_kwargs,
            )

        # Load glossaries
        glossaries = []
        for gid in glossary_ids:
            gpath = get_glossary_path(gid)
            if gpath:
                glossary = Glossary.from_csv(str(gpath), config.lang_out)
                glossaries.append(glossary)

        # Parse watermark mode
        watermark_map = {
            "watermarked": WatermarkOutputMode.Watermarked,
            "no_watermark": WatermarkOutputMode.NoWatermark,
            "both": WatermarkOutputMode.Both,
        }
        watermark_mode = watermark_map.get(
            config.watermark_output_mode, WatermarkOutputMode.Watermarked
        )

        # Determine output flags
        no_dual = config.output_mode == "mono_only"
        no_mono = config.output_mode == "dual_only"

        # Create doc layout model
        doc_layout_model = DocLayoutModel.load_available()

        # Split strategy
        split_strategy = None
        if config.max_pages_per_part:
            from babeldoc.format.pdf.split_manager import PageCountStrategy
            split_strategy = PageCountStrategy(max_pages_per_part=config.max_pages_per_part)

        # Build TranslationConfig
        translation_config = TranslationConfig(
            translator=translator,
            term_extraction_translator=term_extraction_translator,
            input_file=str(input_path),
            lang_in=config.lang_in,
            lang_out=config.lang_out,
            doc_layout_model=doc_layout_model,
            pages=config.pages or None,
            output_dir=str(result_dir),
            debug=config.debug,
            no_dual=no_dual,
            no_mono=no_mono,
            qps=config.qps,
            pool_max_workers=config.pool_max_workers,
            term_pool_max_workers=config.term_pool_max_workers,
            min_text_length=config.min_text_length,
            formular_font_pattern=config.formular_font_pattern or None,
            formular_char_pattern=config.formular_char_pattern or None,
            split_short_lines=config.split_short_lines,
            short_line_split_factor=config.short_line_split_factor,
            custom_system_prompt=config.custom_system_prompt or None,
            disable_same_text_fallback=config.disable_same_text_fallback,
            skip_clean=config.skip_clean,
            disable_rich_text_translate=config.disable_rich_text_translate,
            enhance_compatibility=config.enhance_compatibility,
            use_alternating_pages_dual=config.use_alternating_pages_dual,
            dual_translate_first=config.dual_translate_first,
            merge_alternating_line_numbers=config.merge_alternating_line_numbers,
            watermark_output_mode=watermark_mode,
            skip_scanned_detection=config.skip_scanned_detection,
            ocr_workaround=config.ocr_workaround,
            auto_enable_ocr_workaround=config.auto_enable_ocr_workaround,
            add_formula_placehold_hint=config.add_formula_placehold_hint,
            auto_extract_glossary=config.auto_extract_glossary,
            save_auto_extracted_glossary=config.save_auto_extracted_glossary,
            glossaries=glossaries if glossaries else None,
            primary_font_family=config.primary_font_family,
            only_include_translated_page=config.only_include_translated_page,
            report_interval=config.report_interval,
            split_strategy=split_strategy,
            skip_translation=config.skip_translation,
            skip_form_render=config.skip_form_render,
            skip_curve_render=config.skip_curve_render,
            only_parse_generate_pdf=config.only_parse_generate_pdf,
            remove_non_formula_lines=config.remove_non_formula_lines,
            non_formula_line_iou_threshold=config.non_formula_line_iou_threshold,
            figure_table_protection_threshold=config.figure_table_protection_threshold,
            skip_formula_offset_calculation=config.skip_formula_offset_calculation,
            enable_graphic_element_process=config.enable_graphic_element_process,
            show_char_box=config.show_char_box,
        )

        # Run async translation
        async for event in async_translate(translation_config):
            if task.cancel_event.is_set():
                break

            event_type = event.get("type", "")

            if event_type in ("progress_start", "progress_update", "progress_end"):
                task.stage = event.get("stage", "")
                task.stage_progress = event.get("stage_progress", 0.0)
                task.stage_current = event.get("stage_current", 0)
                task.stage_total = event.get("stage_total", 0)
                task.progress = event.get("overall_progress", task.progress)
                task.part_index = event.get("part_index", 1)
                task.total_parts = event.get("total_parts", 1)

                await broadcast_progress(task, {
                    "type": "progress",
                    "stage": task.stage,
                    "progress": task.progress / 100.0,
                    "stageProgress": task.stage_progress / 100.0,
                    "stageCurrent": task.stage_current,
                    "stageTotal": task.stage_total,
                    "partIndex": task.part_index,
                    "totalParts": task.total_parts,
                })

            elif event_type == "finish":
                translate_result = event.get("translate_result")
                result = TranslateResultResponse(
                    total_seconds=translate_result.total_seconds if translate_result else 0.0,
                )

                # Copy result files to result_dir and set URLs
                if translate_result:
                    if translate_result.dual_pdf_path:
                        dst = result_dir / translate_result.dual_pdf_path.name
                        if translate_result.dual_pdf_path != dst:
                            shutil.copy2(translate_result.dual_pdf_path, dst)
                        result.dual_pdf = f"/api/download/{task.task_id}/dual"

                    if translate_result.mono_pdf_path:
                        dst = result_dir / translate_result.mono_pdf_path.name
                        if translate_result.mono_pdf_path != dst:
                            shutil.copy2(translate_result.mono_pdf_path, dst)
                        result.mono_pdf = f"/api/download/{task.task_id}/mono"

                    if translate_result.auto_extracted_glossary_path:
                        dst = result_dir / translate_result.auto_extracted_glossary_path.name
                        if translate_result.auto_extracted_glossary_path != dst:
                            shutil.copy2(translate_result.auto_extracted_glossary_path, dst)
                        result.glossary = f"/api/download/{task.task_id}/glossary"

                task.result = result
                task.status = "completed"
                task.progress = 100.0

                await broadcast_progress(task, {
                    "type": "finish",
                    "result": result.model_dump(),
                })

            elif event_type == "error":
                task.error = event.get("error", "Unknown error")
                task.status = "failed"

                await broadcast_progress(task, {
                    "type": "error",
                    "message": task.error,
                })

        if task.cancel_event.is_set():
            task.status = "cancelled"
            await broadcast_progress(task, {
                "type": "error",
                "message": "Translation cancelled by user",
            })

    except Exception as e:
        task.error = f"{type(e).__name__}: {str(e)}\n{traceback.format_exc()}"
        task.status = "failed"
        await broadcast_progress(task, {
            "type": "error",
            "message": str(e),
        })
