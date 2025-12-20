from fastapi.testclient import TestClient
from backend.src.main import app
import pytest
from unittest.mock import patch, AsyncMock

client = TestClient(app)

@patch("authlib.integrations.starlette_client.OAuth.create_client")
def test_google_login_flow(mock_create_client):
    """
    Test the Google OAuth2 login flow.
    This is a failing test as the OAuth setup is not fully mocked yet for user_info.
    """
    mock_google_client = AsyncMock()
    mock_create_client.return_value = mock_google_client

    # 1. Simulate initiation of Google login
    response = client.get("/api/auth/google")
    assert response.status_code == 302
    assert "accounts.google.com/o/oauth2/v2/auth" in response.headers["location"]

    # Mock the authorize_access_token and userinfo calls
    mock_google_client.authorize_access_token.return_value = {
        "access_token": "mock-google-access-token",
        "expires_in": 3600,
        "scope": "openid email profile",
        "token_type": "Bearer",
        "id_token": "mock-google-id-token",
    }
    mock_google_client.userinfo.return_value = {
        "sub": "mock_google_user_id",
        "email": "google_test@example.com",
        "name": "Google Test User",
        "picture": "https://example.com/google_picture.jpg",
    }

    # 2. Simulate Google callback
    callback_response = client.get("/api/auth/google/callback", params={"code": "mock_code"})
    assert callback_response.status_code == 302
    assert callback_response.headers["location"] == "http://localhost:3000" # Redirects to frontend
    
    # Check if session cookie is set
    assert "session_id" in callback_response.cookies

    # 3. Verify session status
    session_id = callback_response.cookies["session_id"]
    session_response = client.get("/api/auth/session", cookies={"session_id": session_id})
    
    assert session_response.status_code == 200
    session_data = session_response.json()
    assert session_data["is_authenticated"] is True
    assert session_data["user"]["id"] == "mock_google_user_id"
    assert session_data["user"]["provider"] == "google"
    assert session_data["user"]["email"] == "google_test@example.com"
    assert session_data["user"]["name"] == "Google Test User"
