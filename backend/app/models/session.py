from dataclasses import dataclass, field
from datetime import datetime, timezone

from app.schemas.medical import MedicalState


@dataclass
class ConversationTurn:
    speaker: str  # "user" | "agent"
    text: str


@dataclass
class SessionState:
    """
    In-memory conversation session (master build prompt §10). Holds
    conversation memory (Phase 5) as of this pass: prior turns and the
    accumulated MedicalState, so the agent never re-asks something the
    user already answered. No persistence yet — Phase 5+ can move this to
    Postgres once it's actually needed beyond a single dev/demo process.
    """

    session_id: str
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    turns: list[ConversationTurn] = field(default_factory=list)
    medical_state: MedicalState = field(default_factory=MedicalState)


# Process-local store. Fine for a single dev/demo instance; not suitable
# for multiple workers or a real deployment (that's Phase 5+'s job).
SESSIONS: dict[str, SessionState] = {}


def get_or_create_session(session_id: str) -> SessionState:
    if session_id not in SESSIONS:
        SESSIONS[session_id] = SessionState(session_id=session_id)
    return SESSIONS[session_id]
