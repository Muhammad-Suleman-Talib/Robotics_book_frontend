# Authentication System Documentation

This document describes the authentication system implemented for the Docusaurus site, covering the overall flow, backend API endpoints, and frontend integration.

## Overall Authentication Flow

1.  **User Initiates Login**: From the Docusaurus frontend (e.g., via the `AuthComponent`), the user clicks a "Login" button (e.g., "Login with Google").
2.  **Redirect to Backend**: The frontend redirects the user's browser to the backend FastAPI service's login endpoint (e.g., `GET /api/auth/google`).
3.  **Backend Initiates OAuth Flow**: The FastAPI backend, using Authlib, redirects the user's browser to the chosen Identity Provider's (IdP) authorization page (e.g., Google).
4.  **User Authorizes Application**: The user logs in to the IdP and grants permission to the Docusaurus application.
5.  **IdP Redirects to Backend Callback**: The IdP redirects the user's browser back to the FastAPI backend's callback endpoint (e.g., `GET /api/auth/google/callback`) with an authorization code.
6.  **Backend Exchanges Code for Tokens**: The FastAPI backend exchanges the authorization code for access and refresh tokens with the IdP. It also fetches user profile information.
7.  **Backend Creates Session**: A server-side user session is created in the PostgreSQL database (NeonDB), storing the user ID, provider, and encrypted tokens. A unique `session_id` is generated.
8.  **Backend Sets Session Cookie**: The backend sets an `httponly`, `secure` cookie (`session_id`) in the user's browser with the `session_id`.
9.  **Backend Redirects to Frontend**: The backend redirects the user's browser back to the Docusaurus frontend (e.g., the homepage).
10. **Frontend Recognizes Session**: The frontend `AuthProvider` (wrapping the Docusaurus app) detects the `session_id` cookie, makes an API call to `GET /api/auth/session` to verify the session status, and updates its internal authentication state.

## Backend API Endpoints

The authentication service exposes the following RESTful API endpoints. <!-- OpenAPI specification not available yet. -->

*   **`GET /api/auth/{provider}`**: Initiates the login flow for a specified OAuth/OIDC provider.
*   **`GET /api/auth/{provider}/callback`**: Handles the callback from the OAuth/OIDC provider after user authorization.
*   **`POST /api/auth/logout`**: Terminates the current user's session and deletes the session cookie.
*   **`GET /api/auth/session`**: Retrieves the current authentication status and basic user profile information.
*   **`POST /api/auth/refresh`**: Attempts to refresh an expired access token using the stored refresh token.

## Frontend Integration

The Docusaurus frontend integrates with the authentication system primarily through:

-   **`AuthProvider` Context**: Located in `book-site/src/theme/Root.tsx`, this context wraps the entire application, manages the authentication state (logged in/out, user info), and handles session checks on page load.
-   **`AuthComponent`**: Located in `book-site/src/components/AuthComponent.tsx`, this is a reusable React component that provides the user interface for authentication (e.g., Login button, Logout button, Welcome message). It consumes the `AuthProvider` context.
-   **`apiClient` Service**: Located in `book-site/src/services/apiClient.ts`, this service handles all API calls to the backend. It includes logic to automatically refresh access tokens when a 401 Unauthorized error is received.
