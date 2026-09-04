from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/api/facilities/search")
async def search_facilities():
    """
    STUB — real facility search (via a maps/places provider) is Phase 9 of
    the master build plan. See backend/app/services/facilities/. Never
    fabricate clinics/addresses/phone numbers here — when this is built for
    real, an unconfigured facility API must say so clearly (same
    "service_not_configured" pattern as Sahara), not invent results.
    """
    return JSONResponse(
        status_code=501,
        content={
            "error": "not_implemented",
            "message": "Facility search isn't implemented yet (Phase 9).",
        },
    )
