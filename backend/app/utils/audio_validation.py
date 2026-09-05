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

    # Real browsers send parameters after the base type, e.g.
    # "audio/webm;codecs=opus" from MediaRecorder — compare on the base
    # type only, not the full header value.
    base_content_type = content_type.split(";")[0].strip() if content_type else content_type

    if base_content_type and base_content_type not in ACCEPTED_CONTENT_TYPES:
        raise InvalidAudioError(f"Unsupported audio format: {content_type}")
