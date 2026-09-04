from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import benchmark, conversation, facilities, triage, voice
from app.config.settings import settings

app = FastAPI(title="MediVoice Africa API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice.router)
app.include_router(conversation.router)
app.include_router(triage.router)
app.include_router(facilities.router)
app.include_router(benchmark.router)


@app.get("/")
async def health():
    return {"status": "ok", "service": "medivoice-backend"}
