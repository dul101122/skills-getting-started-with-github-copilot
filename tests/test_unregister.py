from src import app as app_module


def test_unregister_removes_participant_from_activity(client):
    response = client.delete(
        "/activities/Chess%20Club/participants",
        params={"email": "michael@mergington.edu"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "message": "Removed michael@mergington.edu from Chess Club"
    }
    assert "michael@mergington.edu" not in app_module.activities["Chess Club"]["participants"]


def test_unregister_rejects_missing_participant(client):
    response = client.delete(
        "/activities/Chess%20Club/participants",
        params={"email": "not.registered@mergington.edu"},
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Student is not signed up for this activity"}


def test_unregister_rejects_unknown_activity(client):
    response = client.delete(
        "/activities/Unknown%20Club/participants",
        params={"email": "michael@mergington.edu"},
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Activity not found"}