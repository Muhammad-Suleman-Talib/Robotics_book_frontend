# FastAPI Authentication Service

This directory contains the FastAPI backend service responsible for handling user authentication. It supports traditional email/password registration with email verification, social logins (Google, GitHub, Facebook) via OAuth2/OpenID Connect, and password reset functionality. It also manages user sessions.

## Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a Python virtual environment (if you haven't already):**
    ```bash
    python -m venv .venv
    ```

3.  **Activate the virtual environment:**
    *   **Windows:**
        ```bash
        .venv\Scripts\activate
        ```
    *   **macOS/Linux:**
        ```bash
        source .venv/bin/activate
        ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Environment Variables

Copy the `.env.example` file to `.env` and fill in the required values. **Do not commit `.env` to version control.**

```bash
cp .env.example .env
```

Edit the `.env` file with your specific configurations:

-   `BASE_URL`: The base URL where your backend service will be accessible (e.g., `http://localhost:8000`). This is used for constructing verification and reset links.
-   `FRONTEND_URL`: The base URL of your Docusaurus frontend (e.g., `http://localhost:3000`).
-   `DATABASE_URL`: Connection string for your PostgreSQL/NeonDB instance (e.g., `postgresql://user:password@host:port/dbname`).
-   `SESSION_SECRET`: A long, random string used to sign session cookies. Generate one using `openssl rand -hex 32`.

### Email Service Configuration

These are required for sending email verification and password reset links.

-   `SMTP_SERVER`: Your SMTP server host (e.g., `smtp.gmail.com`).
-   `SMTP_PORT`: Your SMTP server port (e.g., `587` for TLS).
-   `SMTP_USERNAME`: Username for your SMTP server.
-   `SMTP_PASSWORD`: Password for your SMTP server.
-   `SENDER_EMAIL`: The email address from which verification/reset emails will be sent.

### Identity Provider Configuration

These are required for enabling social logins.

-   `GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
-   `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret.
-   `GOOGLE_METADATA_URL`: Google's OpenID Connect discovery URL (usually `https://accounts.google.com/.well-known/openid-configuration`).

-   `GITHUB_CLIENT_ID`: Your GitHub OAuth client ID.
-   `GITHUB_CLIENT_SECRET`: Your GitHub OAuth client secret.
    *   *Note*: GitHub's metadata URL is often not a standard OIDC discovery URL. Authlib will use direct OAuth2 endpoints configured in `oauth_service.py`.

-   `FACEBOOK_CLIENT_ID`: Your Facebook OAuth client ID.
-   `FACEBOOK_CLIENT_SECRET`: Your Facebook OAuth client secret.
    *   *Note*: Facebook's metadata URL is often not a standard OIDC discovery URL. Authlib will use direct OAuth2 endpoints configured in `oauth_service.py`.

## Running the Service

1.  **Ensure your virtual environment is active.**
2.  **Run the FastAPI application using Uvicorn:**
    ```bash
    uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
    ```
    This will start the server on `http://localhost:8000`. The `--reload` flag is useful for development as it automatically restarts the server on code changes.

## Authentication Endpoints

### Email/Password Authentication (via `/api/register` and `/api/auth`)

-   **`POST /api/register`**: Register a new user with email and password. Sends a verification email.
-   **`GET /api/verify-email/{token}`**: Verifies a user's email address using the token sent to their email.
-   **`POST /api/auth/login`**: Authenticate a user with email and password. Returns an access token on success.
-   **`POST /api/auth/forgot-password`**: Initiates password reset for a given email. Sends a password reset link.
-   **`POST /api/auth/reset-password`**: Resets user's password using a valid reset token and new password.

### Social Logins (via `/api/auth/{provider}`)

-   **`GET /api/auth/{provider}`**: Initiates the OAuth2 login flow for the specified provider (e.g., `google`, `github`, `facebook`).
-   **`GET /api/auth/{provider}/callback`**: Handles the callback from the OAuth2 provider after authorization, creating/linking user sessions.

### General Authentication Endpoints (via `/api/auth`)

-   **`POST /api/auth/logout`**: Logs out the current user, deleting their session.
-   **`GET /api/auth/session`**: Retrieves the current session status and user information.
-   **`POST /api/auth/refresh`**: Refreshes the access token using a stored refresh token.

## Testing

To run the backend tests:
```bash
pytest backend/tests/integration/test_login_flow.py
pytest backend/tests/integration/test_logout.py
pytest backend/tests/integration/test_refresh.py
pytest backend/tests/integration/test_registration_flow.py
pytest backend/tests/integration/test_login_email_password.py
pytest backend/tests/integration/test_google_login.py
pytest backend/tests/integration/test_github_login.py
pytest backend/tests/integration/test_facebook_login.py
# More tests for password reset flow will be added
```
To run all tests:
```bash
pytest
```
