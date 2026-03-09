import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add BabelDOC to path for local development (not needed in Docker)
babeldoc_root = Path(__file__).resolve().parent.parent.parent
if str(babeldoc_root) not in sys.path:
    sys.path.insert(0, str(babeldoc_root))

from routers import translate, files, estimate, history  # noqa: E402

app = FastAPI(title="BabelDOC Web API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(files.router, prefix="/api", tags=["files"])
app.include_router(translate.router, prefix="/api", tags=["translate"])
app.include_router(estimate.router, prefix="/api", tags=["estimate"])
app.include_router(history.router, prefix="/api", tags=["history"])

# WebSocket routes must be outside /api prefix — nginx proxies /ws/ separately
app.include_router(translate.ws_router, tags=["websocket"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
