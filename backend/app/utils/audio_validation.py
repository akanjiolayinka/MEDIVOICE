ACCEPTED_CONTENT_TYPES = {
    "audio/webm",
    "audio/ogg",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp4",
    "audio/m4a",
}


class InvalidAudioError(Exception):
    """Raised for empty recordings or a content-type we don't accept."""


def validate_audio(data: bytes, content_type: str | None) -> None:
    if not data:
        raise InvalidAudioError("The recording was empty.")

    if content_type and content_type not in ACCEPTED_CONTENT_TYPES:
        raise InvalidAudioError(f"Unsupported audio format: {content_type}")
