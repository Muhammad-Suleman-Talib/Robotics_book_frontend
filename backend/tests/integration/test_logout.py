from fastapi.testclient import TestClient
from backend.src.main import app

client = TestClient(app)

def test_logout_deletes_session():
    """
    Test that calling the logout endpoint deletes the session and clears the cookie.
    This test will initially fail as the logout logic (delete_user_session) needs to be fully implemented.
    """
    # Simulate a logged-in state by setting a session cookie.
    # In a real integration test, you would perform a full login flow first.
    mock_session_id = "test_session_id_to_delete"
    
    # Make a POST request to the logout endpoint with the mock session cookie
    response = client.post("/api/auth/logout", cookies={"session_id": mock_session_id})
    
    # Expect a successful response and the logout message
    assert response.status_code == 200
    assert response.json() == {"message": "Logged out successfully."}
    
    # Assert that the session cookie is instructed to be deleted
    # The 'set-cookie' header should contain the session_id with Max-Age=0 or an expired date.
    set_cookie_header = response.headers.get("set-cookie")
    assert set_cookie_header is not None
    assert "session_id=;" in set_cookie_header
    assert "Max-Age=0" in set_cookie_header or "expires=" in set_cookie_header.lower()

def test_logout_without_session_id_returns_not_authenticated():
    """
    Test that calling the logout endpoint without a session_id cookie
    returns an unauthenticated response model.
    """
    response = client.post("/api/auth/logout")
    assert response.status_code == 200 # As per the current implementation, it returns 200 with is_authenticated: False
    assert response.json() == {"is_authenticated": False, "user": None}
