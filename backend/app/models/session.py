from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class SessionState:
    """
    Minimal in-memory conversation session (master build prompt §10). No
    persistence yet — Phase 5+ can move this to Postgres once conversation
    memory / the agent actually needs to read past turns. `turns` stays
    empty until Phase 4/5 exist; this only exists so a session_id has
    somewhere real to attach to.
    """

    session_id: str
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    turns: list[str] = field(default_factory=list)


# Process-local store. Fine for a single dev/demo instance; not suitable
# for multiple workers or a real deployment (that's Phase 5+'s job).
SESSIONS: dict[str, SessionState] = {}


def get_or_create_session(session_id: str) -> SessionState:
    if session_id not in SESSIONS:
        SESSIONS[session_id] = SessionState(session_id=session_id)
    return SESSIONS[session_id]
