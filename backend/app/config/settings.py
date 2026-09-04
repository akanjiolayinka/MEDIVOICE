from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    App configuration. Every external-service credential defaults to None
    so the app boots without any of them configured — services that need a
    missing credential must raise a clear "not configured" error rather
    than pretend to work (see services/sahara/client.py).
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Sahara CodeSwitch API (speech + code-switching layer, Phase 3).
    sahara_api_key: str | None = None
    sahara_api_url: str | None = None

    # Not used until later phases — declared here so .env.example documents
    # the full set of variables the finished product will need.
    yarngpt_api_key: str | None = None  # Phase 7
    llm_api_key: str | None = None  # Phase 4
    facility_api_key: str | None = None  # Phase 9
    database_url: str | None = None  # Phase 5+ persistence

    cors_allow_origins: list[str] = ["http://localhost:3000"]


settings = Settings()
