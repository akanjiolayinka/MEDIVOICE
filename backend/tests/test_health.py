def test_health(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_stub_routes_return_501(client):
    assert client.post("/api/conversation/message").status_code == 501
    assert client.post("/api/triage/assess").status_code == 501
    assert client.get("/api/facilities/search").status_code == 501
    assert client.get("/api/benchmark/results").status_code == 501
