def test_health(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_still_stubbed_routes_return_501(client):
    # /api/triage/assess and /api/conversation/message have real
    # implementations now (Phase 6, Phase 4/5/8) — see
    # test_triage_endpoint.py and test_conversation_endpoint.py.
    assert client.get("/api/facilities/search").status_code == 501
    assert client.get("/api/benchmark/results").status_code == 501
