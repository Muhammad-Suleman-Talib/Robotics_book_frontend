from fastapi.testclient import TestClient
from backend.src.main import app
from datetime import datetime, timedelta

client = TestClient(app)

def test_token_refresh_fails_without_session_id():
    """
    Test that calling the /api/auth/refresh endpoint without a session_id cookie fails.
    This test should initially pass, as the endpoint isn't fully implemented yet.
    """
    response = client.post("/api/auth/refresh")
    assert response.status_code == 401 # Expecting Unauthorized
    assert "detail" in response.json()
