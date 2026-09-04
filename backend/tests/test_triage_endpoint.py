def test_triage_endpoint_emergency(client):
    response = client.post(
        "/api/triage/assess",
        json={
            "symptoms": ["chest pain"],
            "relevant_context": "severe chest pain and passed out",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["urgency"] == "emergency"
    assert body["recommend_emergency_care"] is True


def test_triage_endpoint_routine(client):
    response = client.post("/api/triage/assess", json={})
    assert response.status_code == 200
    assert response.json()["urgency"] == "routine"
