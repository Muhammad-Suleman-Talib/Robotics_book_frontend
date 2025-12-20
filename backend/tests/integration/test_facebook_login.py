from fastapi.testclient import TestClient
from backend.src.main import app
import pytest
from unittest.mock import patch, AsyncMock

client = TestClient(app)

@patch("authlib.integrations.starlette_client.OAuth.create_client")
def test_facebook_login_flow(mock_create_client):
    """
    Test the Facebook OAuth2 login flow.
    This is a failing test as the OAuth setup is not fully mocked yet for user_info.
    """
    mock_facebook_client = AsyncMock()
    mock_create_client.return_value = mock_facebook_client

    # 1. Simulate initiation of Facebook login
    response = client.get("/api/auth/facebook")
    assert response.status_code == 302
    assert "www.facebook.com/v12.0/dialog/oauth" in response.headers["location"]

    # Mock the authorize_access_token and userinfo calls
    mock_facebook_client.authorize_access_token.return_value = {
        "access_token": "mock-facebook-access-token",
        "expires_in": 3600,
        "token_type": "Bearer",
    }
    mock_facebook_client.userinfo.return_value = {
        "id": "mock_facebook_user_id",
        "email": "facebook_test@example.com",
        "name": "Facebook Test User",
    }

    # 2. Simulate Facebook callback
    callback_response = client.get("/api/auth/facebook/callback", params={"code": "mock_code"})
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
    assert session_data["user"]["id"] == "mock_facebook_user_id"
    assert session_data["user"]["provider"] == "facebook"
    assert session_data["user"]["email"] == "facebook_test@example.com"
    assert session_data["user"]["name"] == "Facebook Test User"