# Build context must be BabelDOC repo root (set via docker-compose)
FROM python:3.12-slim

# System deps for BabelDOC native libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    libhyperscan5 \
    libspatialindex-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /babeldoc

# Copy BabelDOC source and install it
COPY pyproject.toml README.md ./
COPY babeldoc ./babeldoc/
RUN pip install --no-cache-dir .

# Setup backend
WORKDIR /app
COPY web/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY web/backend/ .

# Storage volume
VOLUME /app/file_storage

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
