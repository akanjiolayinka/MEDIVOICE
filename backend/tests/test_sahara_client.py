import pytest

from app.config.settings import Settings
from app.services.sahara.client import SaharaClient, SaharaNotConfiguredError


@pytest.mark.asyncio
async def test_raises_when_key_missing():
    client = SaharaClient(config=Settings(sahara_api_key=None, sahara_api_url=None))
    with pytest.raises(SaharaNotConfiguredError):
        await client.transcribe(b"some-audio-bytes")


@pytest.mark.asyncio
async def test_calls_placeholder_endpoint_when_configured(monkeypatch):
    calls = {}

    class FakeResponse:
        def raise_for_status(self):
            return None

        def json(self):
            return {"transcript": "hello", "languages": ["en"], "confidence": 0.9}

    class FakeAsyncClient:
        def __init__(self, *args, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *exc):
            return False

        async def post(self, url, headers=None, files=None):
            calls["url"] = url
            calls["headers"] = headers
            return FakeResponse()

    monkeypatch.setattr(
        "app.services.sahara.client.httpx.AsyncClient", FakeAsyncClient
    )

    client = SaharaClient(
        config=Settings(sahara_api_key="test-key", sahara_api_url="https://example.test")
    )
    result = await client.transcribe(b"some-audio-bytes")

    assert result.transcript == "hello"
    assert result.languages == ["en"]
    assert "test-key" in calls["headers"]["Authorization"]
    assert calls["url"].startswith("https://example.test")
