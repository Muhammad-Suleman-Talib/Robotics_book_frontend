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
        "email": "login_test@example.com",
        "password": "SecurePassword123"
    }

@patch("backend.src.services.email_service.EmailService.send_verification_email")
def test_email_password_login_flow(mock_send_email, test_user_data):
    """
    Test the full email/password login flow: registration, unverified login,
    email verification, and verified login.
    This is a failing test as the login endpoint is not yet implemented.
    """
    # 1. Register a new user
    register_response = client.post("/api/register", json=test_user_data)
    assert register_response.status_code == 201, f"Reg failed: {register_response.json()}"
    mock_send_email.assert_called_once()
    
    # Extract verification token from the mock call arguments (assuming it's the second arg)
    # In a real scenario, this would be retrieved from the mock's call_args
    # For this failing test, we'll assume a token was generated and passed
    verification_token = mock_send_email.call_args[0][1]

    # 2. Attempt to login with unverified email (should fail)
    login_response_unverified = client.post("/api/login", json=test_user_data)
    assert login_response_unverified.status_code == 401, f"Expected 401 for unverified, got {login_response_unverified.status_code} - {login_response_unverified.json()}"
    assert "Email not verified" in login_response_unverified.json().get("detail")

    # 3. Verify the user's email
    verify_response = client.get(f"/api/verify-email/{verification_token}")
    assert verify_response.status_code == 200, f"Verify failed: {verify_response.json()}"
    assert "Email verified successfully" in verify_response.json().get("message")

    # 4. Attempt to login with verified email (should succeed)
    login_response_verified = client.post("/api/login", json=test_user_data)
    assert login_response_verified.status_code == 200, f"Expected 200 for verified login, got {login_response_verified.status_code} - {login_response_verified.json()}"
    assert "access_token" in login_response_verified.json()
    assert "token_type" in login_response_verified.json()

    # 5. Attempt to login with incorrect password (should fail)
    incorrect_password_data = test_user_data.copy()
    incorrect_password_data["password"] = "WrongPassword123"
    login_response_incorrect_pw = client.post("/api/login", json=incorrect_password_data)
    assert login_response_incorrect_pw.status_code == 401, f"Expected 401 for incorrect password, got {login_response_incorrect_pw.status_code} - {login_response_incorrect_pw.json()}"
    assert "Incorrect email or password" in login_response_incorrect_pw.json().get("detail")

    # 6. Attempt to login with non-existent email (should fail)
    non_existent_user_data = {
        "email": "nonexistent@example.com",
        "password": "AnyPassword123"
    }
    login_response_non_existent = client.post("/api/login", json=non_existent_user_data)
    assert login_response_non_existent.status_code == 401, f"Expected 401 for non-existent user, got {login_response_non_existent.status_code} - {login_response_non_existent.json()}"
    assert "Incorrect email or password" in login_response_non_existent.json().get("detail")
