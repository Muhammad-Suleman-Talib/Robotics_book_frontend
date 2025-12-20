---
description: "Task list for feature implementation"
---

# Tasks: Authentication System

**Input**: Design documents from `/specs/005-auth-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per the project constitution, a test-first approach is mandatory. Each implementation task is preceded by a failing test.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `book-site/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the new FastAPI backend and frontend integration points.

- [X] T001 Initialize Python project in `backend/`, creating a `requirements.txt` file.
- [X] T002 Add `fastapi`, `uvicorn`, `authlib`, `sqlmodel`, `psycopg2-binary`, `pytest`, `flake8`, and `black` to `backend/requirements.txt`.
- [X] T003 [P] Configure linting and formatting for the backend by creating configuration files (e.g., `.flake8`, `pyproject.toml`) in `backend/`.
- [X] T004 [P] Create a `.env.example` file in `backend/` to document the required `DATABASE_URL` and other secrets.
- [X] T005 [P] Create a basic API client service in `book-site/src/services/apiClient.ts` to handle requests to the backend.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Implement core settings management for the FastAPI app (reading from `.env`) in `backend/src/core/config.py`.
- [X] T007 Implement the PostgreSQL/SQLModel database connection engine in `backend/src/core/database.py`.
- [X] T008 Define the SQLModel table for `UserSession` in a new file `backend/src/models/session_model.py`.
- [X] T009 Create the main FastAPI application entry point in `backend/src/main.py`, including a startup event to run the `create_db_and_tables` function.
- [X] T010 Define shared Pydantic schemas (e.g., for User Profile) that are not DB models in `backend/src/core/schemas.py`.
- [X] T011 [P] Create the main `AuthComponent` shell in `book-site/src/components/AuthComponent.tsx`.
- [X] T012 [P] Create an `AuthProvider` context in `book-site/src/theme/Root.tsx` to wrap the Docusaurus site and provide auth state to all components.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - User Login (Priority: P1) 🎯 MVP

**Goal**: Allow users to log in securely via an external identity provider.
**Independent Test**: A user can click a login button, complete the provider's auth flow, be redirected back, and see a logged-in state on the frontend.

### Tasks for User Story 1

- [X] T013 [US1] Write a failing integration test for the full login flow (redirect and callback) in `backend/tests/integration/test_login_flow.py`.
- [X] T014 [US1] Implement the OAuth2 client service using Authlib for handling provider interactions in `backend/src/services/oauth_service.py`.
- [X] T015 [US1] Implement the session service for creating/retrieving user sessions from PostgreSQL in `backend/src/services/session_service.py`.
- [X] T016 [US1] Create the authentication router in `backend/src/routers/auth.py` with the `/{provider}` (login) and `/{provider}/callback` endpoints.
- [X] T017 [US1] [P] Write a failing component test for the `AuthComponent`'s login button in `book-site/src/components/__tests__/AuthComponent.test.tsx`.
- [X] T018 [US1] [P] Implement the login button UI in `book-site/src/components/AuthComponent.tsx`, linking to the backend's `GET /api/auth/{provider}` endpoint.
- [X] T019 [US1] Implement the logic in the `AuthProvider` (`book-site/src/theme/Root.tsx`) to fetch the current session status from `GET /api/auth/session` on initial load.

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - User Logout (Priority: P1)

**Goal**: Allow logged-in users to terminate their session securely.
**Independent Test**: A logged-in user can click a logout button, have their session destroyed on the backend, and see a logged-out state on the frontend.

### Tasks for User Story 2

- [X] T020 [US2] Write a failing integration test for the logout endpoint in `backend/tests/integration/test_logout.py`.
- [X] T021 [US2] Implement the `POST /logout` endpoint in `backend/src/routers/auth.py` that deletes the user's session from the database.
- [X] T022 [US2] [P] Write a failing component test in `book-site/src/components/__tests__/AuthComponent.test.tsx` for the logout functionality.
- [X] T023 [US2] [P] Add a "Logout" button to `book-site/src/components/AuthComponent.tsx` that is only visible to authenticated users and calls the logout endpoint.

**Checkpoint**: User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Token Refresh (Priority: P2)

**Goal**: Automatically refresh user sessions using a refresh token to provide a seamless, long-lived session.
**Independent Test**: An active session nearing expiration is automatically extended by the client without requiring user interaction.

### Tasks for User Story 3

- [X] T024 [US3] Write a failing integration test for the token refresh flow in `backend/tests/integration/test_refresh.py`.
- [X] T025 [US3] Implement the `POST /refresh` endpoint in `backend/src/routers/auth.py` that validates a refresh token and issues a new access token.
- [X] T026 [US3] [P] Add logic to the frontend API client (`book-site/src/services/apiClient.ts`) to automatically call the `/refresh` endpoint when an API call fails with a 401 Unauthorized error.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and prepare the feature for production.

- [X] T027 [P] Add structured logging to all backend endpoints in `backend/src/routers/auth.py`.
- [X] T028 [P] Implement centralized, robust error handling middleware in `backend/src/main.py`.
- [X] T029 [P] Create a `README.md` for the `backend/` directory explaining setup, environment variables, and how to run the service.
- [X] T030 [P] Write or update documentation for the authentication flow and the new API endpoints.

---

## Phase 7: User Story 4 - Email/Password Authentication with Verification (Priority: P1)

**Goal**: Allow users to register with email/password, verify their email, and then log in.
**Independent Test**: A user can register, receive a verification email, click the link, and then successfully log in with their credentials.

### Tasks for User Story 4

- [ ] T031 [US4] Update `backend/src/core/schemas.py` to include `UserCreate` (email, password), `UserLogin` (email, password), and `Token` schemas.
- [ ] T032 [US4] Define a new `User` SQLModel table in `backend/src/models/user_model.py` (or extend `session_model.py` if appropriate) including fields for email, hashed password, and `is_verified`.
- [ ] T033 [US4] Implement a utility function for password hashing and verification in `backend/src/services/auth_utils.py`.
- [ ] T034 [US4] Implement an email service in `backend/src/services/email_service.py` for sending verification emails. This will require environment variables for SMTP server, credentials, etc.
- [ ] T035 [US4] Write a failing integration test for user registration with email verification in `backend/tests/integration/test_registration_flow.py`.
- [ ] T036 [US4] Create a new router `backend/src/routers/registration.py` (or extend `auth.py`) with a `POST /register` endpoint to handle user registration, password hashing, and sending verification emails.
- [ ] T037 [US4] Create an endpoint `GET /verify-email/{token}` in `backend/src/routers/registration.py` to handle email verification, updating `is_verified` status.
- [ ] T038 [US4] Write a failing integration test for email/password login in `backend/tests/integration/test_login_email_password.py`.
- [ ] T039 [US4] Implement a `POST /login` endpoint in `backend/src/routers/auth.py` (or `registration.py`) to handle email/password login, verifying credentials and `is_verified` status.
- [ ] T040 [US4] [P] Create a `RegisterForm` component in `book-site/src/components/RegisterForm.tsx` that interacts with the backend registration endpoint.
- [ ] T041 [US4] [P] Create a `LoginForm` component in `book-site/src/components/LoginForm.tsx` that interacts with the backend email/password login endpoint.
- [ ] T042 [US4] [P] Update the `AuthComponent` (`book-site/src/components/AuthComponent.tsx`) to display registration and email/password login options.

---

## Phase 8: User Story 5 - Social Login Integration (Google, GitHub, Facebook) (Priority: P1)

**Goal**: Integrate specific social login providers to allow users to sign in with their existing social accounts.
**Independent Test**: A user can click a social login button (Google, GitHub, Facebook), complete the provider's auth flow, and successfully log in.

### Tasks for User Story 5

- [ ] T043 [US5] Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` to `backend/.env.example` and load them in `backend/src/core/config.py`.
- [ ] T044 [US5] Extend `backend/src/services/oauth_service.py` to configure and handle authentication flows for Google, GitHub, and Facebook using Authlib.
- [ ] T045 [US5] Modify `backend/src/routers/auth.py` to include specific endpoints for `/login/google`, `/callback/google`, `/login/github`, `/callback/github`, `/login/facebook`, `/callback/facebook`.
- [ ] T046 [US5] Write a failing integration test for Google social login flow in `backend/tests/integration/test_google_login.py`.
- [ ] T047 [US5] Write a failing integration test for GitHub social login flow in `backend/tests/integration/test_github_login.py`.
- [ ] T048 [US5] Write a failing integration test for Facebook social login flow in `backend/tests/integration/test_facebook_login.py`.
- [ ] T049 [US5] [P] Update the `AuthComponent` (`book-site/src/components/AuthComponent.tsx`) to include buttons for Google, GitHub, and Facebook login, linking to the new backend endpoints.
- [ ] T050 [US5] [P] Ensure the frontend `AuthComponent` and `AuthProvider` correctly handle and display user information obtained from social logins.

---

## Phase 9: Global Refinement & Cross-Cutting Concerns

**Purpose**: Integrate the new authentication methods seamlessly and enhance security.

- [ ] T051 [P] Update `backend/src/core/schemas.py` and `backend/src/models/user_model.py` to allow linking social accounts to email/password accounts or creating new accounts for social logins.
- [ ] T052 [P] Implement password reset functionality (forgot password, reset password via email link).
- [ ] T053 [P] Review and update all authentication-related documentation, including `backend/README.md` and any relevant Docusaurus docs.
- [ ] T054 [P] Conduct a security review of all new authentication flows, especially focusing on token handling, CSRF protection, and input validation.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** -> **Foundational (Phase 2)** -> **User Stories (Phases 3-5)** -> **Polish (Phase 6)** -> **Email/Password Auth (Phase 7)** -> **Social Login (Phase 8)** -> **Global Refinement (Phase 9)**.
- All user stories depend on the **Foundational** phase being complete.
- Phases 7, 8, and 9 can largely run in parallel where indicated `[P]`, but have logical dependencies between tasks within each phase.

## Implementation Strategy

- **MVP First**: Complete Phases 1, 2, and 3 to deliver a functional "Login" feature.
- **Incremental Delivery**: After the MVP, complete Phase 4 (Logout), then Phase 5 (Token Refresh).
- **Expand Authentication**: Implement Phase 7 (Email/Password Auth), then Phase 8 (Social Logins).
- **Final Polish**: Complete Phase 9 (Global Refinement).