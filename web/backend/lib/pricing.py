# Model pricing table: cost per million tokens (USD)
# Format: { model_prefix: { "input": cost, "output": cost } }
MODEL_PRICING: dict[str, dict[str, float]] = {
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "gpt-4o-mini": {"input": 0.15, "output": 0.60},
    "gpt-4-turbo": {"input": 10.00, "output": 30.00},
    "gpt-4": {"input": 30.00, "output": 60.00},
    "gpt-3.5-turbo": {"input": 0.50, "output": 1.50},
    "deepseek-chat": {"input": 0.14, "output": 0.28},
    "deepseek-reasoner": {"input": 0.55, "output": 2.19},
    "claude-3-5-sonnet": {"input": 3.00, "output": 15.00},
    "claude-3-5-haiku": {"input": 0.80, "output": 4.00},
    "claude-3-opus": {"input": 15.00, "output": 75.00},
    "gemini-1.5-pro": {"input": 1.25, "output": 5.00},
    "gemini-1.5-flash": {"input": 0.075, "output": 0.30},
    "gemini-2.0-flash": {"input": 0.10, "output": 0.40},
    "qwen-turbo": {"input": 0.30, "output": 0.60},
    "qwen-plus": {"input": 0.80, "output": 2.00},
    "qwen-max": {"input": 2.40, "output": 9.60},
    "glm-4-flash": {"input": 0.10, "output": 0.10},
    "glm-4": {"input": 1.00, "output": 1.00},
}


def get_model_pricing(model: str) -> dict[str, float] | None:
    """Find pricing for a model by prefix match."""
    model_lower = model.lower()
    # Try exact match first, then prefix match
    for key, pricing in MODEL_PRICING.items():
        if model_lower == key or model_lower.startswith(key):
            return pricing
    return None


def estimate_cost(model: str, estimated_tokens: int) -> float | None:
    """Estimate cost in USD given model and token count.

    Uses a rough 1:1 input/output split assumption for simplicity.
    """
    pricing = get_model_pricing(model)
    if pricing is None:
        return None

    # Assume roughly equal input/output tokens for estimation
    input_tokens = estimated_tokens * 0.6
    output_tokens = estimated_tokens * 0.4

    cost = (input_tokens * pricing["input"] + output_tokens * pricing["output"]) / 1_000_000
    return round(cost, 6)
