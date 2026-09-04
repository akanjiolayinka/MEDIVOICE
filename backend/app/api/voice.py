import uuid
from pathlib import Path

from fastapi import APIRouter, Form, UploadFile
from fastapi.responses import JSONResponse

from app.models.session import get_or_create_session
from app.schemas.errors import InvalidAudioError as InvalidAudioErrorSchema
from app.schemas.errors import ServiceNotConfiguredError
from app.schemas.voice import VoiceProcessResponse
from app.services.sahara.client import SaharaNotConfiguredError, sahara_client
from app.utils.audio_validation import InvalidAudioError, validate_audio

router = APIRouter()

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "tmp_uploads"


@router.post("/api/voice/process")
async def process_voice(file: UploadFile, session_id: str = Form(...)):
    audio_bytes = await file.read()

    try:
        validate_audio(audio_bytes, file.content_type)
    except InvalidAudioError as exc:
        return JSONResponse(
            status_code=400,
            content=InvalidAudioErrorSchema(message=str(exc)).model_dump(),
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    upload_path = UPLOAD_DIR / f"{session_id}_{uuid.uuid4().hex}.webm"
    upload_path.write_bytes(audio_bytes)

    get_or_create_session(session_id)

    try:
        result = await sahara_client.transcribe(audio_bytes)
    except SaharaNotConfiguredError as exc:
        return JSONResponse(
            status_code=503,
            content=ServiceNotConfiguredError(
                service="sahara", message=str(exc)
            ).model_dump(),
        )

    return VoiceProcessResponse(
        transcript=result.transcript,
        languages=result.languages,
        confidence=result.confidence,
    )
