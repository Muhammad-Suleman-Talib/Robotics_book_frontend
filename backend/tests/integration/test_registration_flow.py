from fastapi.testclient import TestClient
from backend.src.main import app
from backend.src.core.config import settings
import pytest
from unittest.mock import patch

# Initialize the TestClient
client = TestClient(app)

@pytest.fixture(name="test_user_data")
def test_user_data_fixture():
    """Fixture for test user registration data."""
    return {
        "email": "test@example.com",
        "password": "SecurePassword123"
    }

@patch("backend.src.services.email_service.EmailService.send_verification_email")
def test_register_user_and_verify(mock_send_email, test_user_data):
    """
    Test user registration, email verification, and subsequent login.
    This is a failing test as the registration endpoint is not yet implemented.
    """
    # 1. Test successful registration (expects 201 Created)
    response = client.post("/api/auth/register", json=test_user_data)
    assert response.status_code == 201, f"Expected 201 Created, got {response.status_code} - {response.json()}"
    assert "User registered successfully. Please check your email for verification." in response.json().get("message")
    mock_send_email.assert_called_once()

    # Extract verification token (mocked for now, will be real later)
    # For a real test, you'd parse the token from the email content sent by the mock
    # For this failing test, we'll assume a token structure
    verification_token = "mock_verification_token"

    # 2. Test login before verification (expects 401 Unauthorized or similar)
    login_response_unverified = client.post("/api/auth/login", json=test_user_data)
    assert login_response_unverified.status_code == 401, f"Expected 401 Unauthorized, got {login_response_unverified.status_code} - {login_response_unverified.json()}"
    assert "Email not verified" in login_response_unverified.json().get("detail")

    # 3. Test email verification (expects 200 OK)
    verify_response = client.get(f"/api/auth/verify-email/{verification_token}")
    assert verify_response.status_code == 200, f"Expected 200 OK, got {verify_response.status_code} - {verify_response.json()}"
    assert "Email verified successfully" in verify_response.json().get("message")

    # 4. Test login after verification (expects 200 OK and token)
    login_response_verified = client.post("/api/auth/login", json=test_user_data)
    assert login_response_verified.status_code == 200, f"Expected 200 OK, got {login_response_verified.status_code} - {login_response_verified.json()}"
    assert "access_token" in login_response_verified.json()
    assert "token_type" in login_response_verified.json()
