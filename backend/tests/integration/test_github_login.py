from fastapi.testclient import TestClient
from backend.src.main import app
import pytest
from unittest.mock import patch, AsyncMock

client = TestClient(app)

@patch("authlib.integrations.starlette_client.OAuth.create_client")
def test_github_login_flow(mock_create_client):
    """
    Test the GitHub OAuth2 login flow.
    This is a failing test as the OAuth setup is not fully mocked yet for user_info.
    """
    mock_github_client = AsyncMock()
    mock_create_client.return_value = mock_github_client

    # 1. Simulate initiation of GitHub login
    response = client.get("/api/auth/github")
    assert response.status_code == 302
    assert "github.com/login/oauth/authorize" in response.headers["location"]

    # Mock the authorize_access_token and userinfo calls
    mock_github_client.authorize_access_token.return_value = {
        "access_token": "mock-github-access-token",
        "expires_in": 3600,
        "token_type": "Bearer",
    }
    mock_github_client.userinfo.return_value = {
        "id": 12345, # GitHub user ID is an integer
        "login": "github_test_user",
        "email": "github_test@example.com", # Can be null if private
        "name": "GitHub Test User",
    }

    # 2. Simulate GitHub callback
    callback_response = client.get("/api/auth/github/callback", params={"code": "mock_code"})
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
    assert session_data["user"]["id"] == "12345" # Stored as string
    assert session_data["user"]["provider"] == "github"
    assert session_data["user"]["email"] == "github_test@example.com"
    assert session_data["user"]["name"] == "GitHub Test User"
