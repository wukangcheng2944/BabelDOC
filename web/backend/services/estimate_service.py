"""Estimate token usage for a PDF file."""
from __future__ import annotations

from pathlib import Path

from lib.pricing import estimate_cost


def estimate_pdf_tokens(
    file_path: str | Path,
    model: str,
    pages: str = "",
) -> dict:
    """Scan a PDF and estimate token usage.

    Returns dict with: page_count, character_count, estimated_tokens, model, estimated_cost_usd
    """
    import fitz  # PyMuPDF

    doc = fitz.open(str(file_path))
    total_pages = doc.page_count

    # Determine which pages to process
    if pages:
        page_indices = _parse_pages(pages, total_pages)
    else:
        page_indices = list(range(total_pages))

    total_chars = 0
    for idx in page_indices:
        if 0 <= idx < total_pages:
            page = doc[idx]
            text = page.get_text("text")
            total_chars += len(text)

    doc.close()

    # Rough token estimation: ~1 token per 4 chars for English, ~1.5 tokens per char for CJK
    # Use a middle ground: ~0.5 tokens per character (mixed content)
    estimated_tokens = int(total_chars * 0.5)

    # Estimate cost
    cost = estimate_cost(model, estimated_tokens)

    return {
        "page_count": len(page_indices),
        "character_count": total_chars,
        "estimated_tokens": estimated_tokens,
        "model": model,
        "estimated_cost_usd": cost,
    }


def _parse_pages(pages_str: str, total_pages: int) -> list[int]:
    """Parse page range string like '1,2,3-5' into 0-based indices."""
    result = []
    parts = pages_str.replace(" ", "").split(",")
    for part in parts:
        if "-" in part:
            try:
                start_s, end_s = part.split("-", 1)
                start = int(start_s) - 1
                end = int(end_s) - 1
                result.extend(range(max(start, 0), min(end + 1, total_pages)))
            except ValueError:
                continue
        else:
            try:
                idx = int(part) - 1
                if 0 <= idx < total_pages:
                    result.append(idx)
            except ValueError:
                continue
    return result
