import json

import httpx

from app.config.settings import Settings, settings


class AgentNotConfiguredError(Exception):
    """Raised when LLM_API_KEY isn't set — mirrors SaharaNotConfiguredError."""


class LLMClient:
    """
    Thin wrapper around whichever LLM powers the conversation agent. No
    provider has been specified beyond the generic "LLM_API_KEY" named in
    the master build prompt, so this is a clearly-marked PLACEHOLDER
    request shape (a single JSON-mode chat completion call) — it must be
    adapted to the real provider's API once one is chosen. Until
    LLM_API_KEY is set, this always raises AgentNotConfiguredError instead
    of fabricating a structured-extraction result.
    """

    def __init__(self, config: Settings = settings):
        self._api_key = config.llm_api_key
        self._api_url = config.llm_api_url

    async def extract_structured(self, *, system_prompt: str, user_prompt: str) -> dict:
        if not self._api_key:
            raise AgentNotConfiguredError(
                "LLM_API_KEY is not set — the conversation agent is unavailable "
                "until it is configured."
            )

        # TODO(Phase 4 follow-up): confirm the real LLM provider/endpoint.
        # Placeholder shape: a JSON-mode chat completion returning a single
        # JSON object as its text content.
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self._api_url}/v1/chat/completions",
                headers={"Authorization": f"Bearer {self._api_key}"},
                json={
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "response_format": {"type": "json_object"},
                },
            )
            response.raise_for_status()
            data = response.json()

        content = data["choices"][0]["message"]["content"]
        return json.loads(content)


llm_client = LLMClient()
