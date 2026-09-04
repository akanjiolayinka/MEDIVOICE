from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.post("/api/triage/assess")
async def assess():
    """
    STUB — the deterministic safety/triage engine is Phase 6 of the master
    build plan. See backend/app/services/triage/.
    """
    return JSONResponse(
        status_code=501,
        content={
            "error": "not_implemented",
            "message": "The safety/triage engine isn't implemented yet (Phase 6).",
        },
    )
