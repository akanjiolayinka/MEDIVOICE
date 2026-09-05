def test_empty_recording_rejected(client):
    response = client.post(
        "/api/voice/process",
        data={"session_id": "test-session"},
        files={"file": ("recording.webm", b"", "audio/webm")},
    )
    assert response.status_code == 400
    assert response.json()["error"] == "invalid_audio"


def test_invalid_content_type_rejected(client):
    response = client.post(
        "/api/voice/process",
        data={"session_id": "test-session"},
        files={"file": ("recording.txt", b"not audio", "text/plain")},
    )
    assert response.status_code == 400
    assert response.json()["error"] == "invalid_audio"


def test_real_browser_content_type_with_codec_param_accepted(client):
    """
    Regression test: real browsers' MediaRecorder sends content types like
    "audio/webm;codecs=opus", not the bare "audio/webm" our tests were
    using elsewhere. This must be accepted (base type matched, params
    ignored) — caught via a live Playwright run against the actual
    frontend, where this previously came back as a 400 invalid_audio.
    """
    response = client.post(
        "/api/voice/process",
        data={"session_id": "test-session"},
        files={"file": ("recording.webm", b"\x00\x01fake-audio-bytes", "audio/webm;codecs=opus")},
    )
    assert response.status_code == 503  # not_configured, not invalid_audio
    assert response.json()["error"] == "service_not_configured"


def test_valid_audio_but_sahara_not_configured(client):
    """
    Correct, expected outcome for this pass: no SAHARA_API_KEY is set in
    this environment, so a valid recording still can't be transcribed —
    the API must say so honestly (503 service_not_configured), not fake a
    transcript.
    """
    response = client.post(
        "/api/voice/process",
        data={"session_id": "test-session"},
        files={"file": ("recording.webm", b"\x00\x01fake-audio-bytes", "audio/webm")},
    )
    assert response.status_code == 503
    body = response.json()
    assert body["error"] == "service_not_configured"
    assert body["service"] == "sahara"
