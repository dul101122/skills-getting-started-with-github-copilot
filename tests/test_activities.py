def test_get_activities_returns_expected_activity_data(client):
    response = client.get("/activities")

    assert response.status_code == 200

    activities = response.json()

    assert "Chess Club" in activities
    assert activities["Chess Club"]["description"] == "Learn strategies and compete in chess tournaments"
    assert activities["Chess Club"]["max_participants"] == 12
    assert activities["Chess Club"]["participants"] == [
        "michael@mergington.edu",
        "daniel@mergington.edu",
    ]