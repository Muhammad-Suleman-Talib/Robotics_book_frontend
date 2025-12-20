from fastapi.testclient import TestClient
from backend.src.main import app

client = TestClient(app)

def test_google_login_redirect():
    """
    Test that the /api/auth/google endpoint redirects to Google's authorization page.
    This test should pass after the auth router is implemented.
    """
    response = client.get("/api/auth/google", allow_redirects=False)
    assert response.status_code == 302
    assert "accounts.google.com/o/oauth2/v2/auth" in response.headers["location"]

def test_google_login_callback_fails_without_code():
    """
    Test that the /api/auth/google/callback endpoint fails if no code is provided.
    This test should initially fail as the endpoint isn't fully implemented or expects a code.
    """
    response = client.get("/api/auth/google/callback", allow_redirects=False)
    assert response.status_code == 400 # Or 500, depending on implementation
    # assert "error" in response.json() # Uncomment once error responses are structured
