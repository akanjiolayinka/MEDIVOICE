# STUB — YarnGPT integration (text -> speech synthesis) is Phase 7 of the
# master build plan. Nothing calls into this package yet.
#
# When built, this must follow the same pattern as
# app/services/sahara/client.py: a YarnGPTClient reading YARNGPT_API_KEY,
# raising a clear "not configured" error instead of fabricating audio when
# the key is missing.
