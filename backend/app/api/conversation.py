from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.post("/api/conversation/message")
async def post_message():
    """
    STUB — the AI conversation agent (medical extraction, follow-up
    questions, conversation memory) is Phase 4/5 of the master build plan.
    See backend/app/services/agent/.
    """
    return JSONResponse(
        status_code=501,
        content={
            "error": "not_implemented",
            "message": "The conversation agent isn't implemented yet (Phase 4).",
        },
    )
