import pytest

from app.utils.audio_validation import InvalidAudioError, validate_audio


def test_empty_bytes_rejected():
    with pytest.raises(InvalidAudioError):
        validate_audio(b"", "audio/webm")


def test_exact_accepted_type_passes():
    validate_audio(b"some-bytes", "audio/webm")


def test_accepted_type_with_codec_param_passes():
    validate_audio(b"some-bytes", "audio/webm;codecs=opus")


def test_accepted_type_with_codec_param_and_spacing_passes():
    validate_audio(b"some-bytes", "audio/ogg; codecs=opus")


def test_unsupported_type_rejected():
    with pytest.raises(InvalidAudioError):
        validate_audio(b"some-bytes", "text/plain")


def test_none_content_type_is_allowed():
    # No content-type header at all — don't reject solely on that basis.
    validate_audio(b"some-bytes", None)
