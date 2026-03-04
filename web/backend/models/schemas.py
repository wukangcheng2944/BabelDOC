from __future__ import annotations

from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    file_id: str
    filename: str
    size: int


class TranslateRequest(BaseModel):
    file_id: str
    config: TranslateConfig
    glossary_ids: list[str] = Field(default_factory=list)


class TranslateConfig(BaseModel):
    lang_in: str = "en"
    lang_out: str = "zh"
    pages: str = ""

    # Translation Service
    openai_model: str = "gpt-4o-mini"
    openai_base_url: str = "https://api.openai.com/v1"
    openai_api_key: str = ""
    custom_system_prompt: str = ""
    enable_json_mode_if_requested: bool = False
    send_dashscope_header: bool = False
    no_send_temperature: bool = False
    openai_reasoning: str = ""

    # Term Extraction
    auto_extract_glossary: bool = True
    save_auto_extracted_glossary: bool = True
    use_independent_term_model: bool = False
    openai_term_extraction_model: str = ""
    openai_term_extraction_base_url: str = ""
    openai_term_extraction_api_key: str = ""
    openai_term_extraction_reasoning: str = ""

    # Output
    output_mode: str = "dual_and_mono"
    watermark_output_mode: str = "watermarked"
    use_alternating_pages_dual: bool = False
    dual_translate_first: bool = False
    only_include_translated_page: bool = False
    primary_font_family: str | None = None

    # PDF Processing
    skip_clean: bool = False
    disable_rich_text_translate: bool = False
    enhance_compatibility: bool = False
    merge_alternating_line_numbers: bool = True
    split_short_lines: bool = False
    short_line_split_factor: float = 0.8
    min_text_length: int = 5
    skip_form_render: bool = False
    skip_curve_render: bool = False
    enable_graphic_element_process: bool = True
    formular_font_pattern: str = ""
    formular_char_pattern: str = ""
    add_formula_placehold_hint: bool = False
    disable_same_text_fallback: bool = False
    remove_non_formula_lines: bool = False
    non_formula_line_iou_threshold: float = 0.9
    figure_table_protection_threshold: float = 0.9
    skip_formula_offset_calculation: bool = False

    # OCR
    ocr_workaround: bool = False
    auto_enable_ocr_workaround: bool = False
    skip_scanned_detection: bool = False

    # Performance
    qps: int = 4
    pool_max_workers: int | None = None
    term_pool_max_workers: int | None = None
    max_pages_per_part: int | None = None
    report_interval: float = 0.1

    # Advanced
    debug: bool = False
    skip_translation: bool = False
    only_parse_generate_pdf: bool = False
    ignore_cache: bool = False
    translate_table_text: bool = False
    show_char_box: bool = False


class TranslateResponse(BaseModel):
    task_id: str


class TaskStatusResponse(BaseModel):
    status: str
    progress: float = 0.0
    stage: str = ""
    stage_progress: float = 0.0
    stage_current: int = 0
    stage_total: int = 0
    part_index: int = 1
    total_parts: int = 1
    error: str | None = None
    result: TranslateResultResponse | None = None


class TranslateResultResponse(BaseModel):
    dual_pdf: str | None = None
    mono_pdf: str | None = None
    glossary: str | None = None
    total_seconds: float = 0.0
