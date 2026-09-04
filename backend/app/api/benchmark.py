from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/api/benchmark/results")
async def get_results():
    """
    STUB — the benchmark harness (WER, symptom-extraction F1, intent
    accuracy, latency, comparing Sahara against other speech models) is
    Phase 12 of the master build plan. See backend/app/services/benchmark/
    and the benchmark/ dataset scaffold at the repo root. Never invent
    numbers here — respond with "awaiting benchmark run" until a real
    evaluation has been executed.
    """
    return JSONResponse(
        status_code=501,
        content={
            "error": "not_implemented",
            "message": "Benchmarking isn't implemented yet (Phase 12). Awaiting benchmark run.",
        },
    )
