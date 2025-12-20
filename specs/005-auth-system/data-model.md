# Data Model: Authentication System

This document defines the key data entities required for the authentication system, as derived from the feature specification.

## Entity: UserSession

Represents a user's authenticated session on the server-side. These sessions will be stored in Redis.

**Fields**:

| Field Name | Data Type | Description | Constraints |
|---|---|---|---|
| `sessionId` | String | Unique identifier for the session (primary key in Redis). | Required, Unique |
| `userId` | String | Identifier for the user, obtained from the identity provider. | Required |
| `provider` | String | The name of the identity provider used for this session (e.g., "google"). | Required |
| `accessToken` | String | The encrypted OAuth2 access token. | Required |
| `refreshToken`| String | The encrypted OAuth2 refresh token. | Optional |
| `expiresAt` | DateTime | Timestamp when the access token expires. | Required |
| `createdAt` | DateTime | Timestamp when the session was created. | Required |

**State Transitions**:

-   `CREATION`: A new session is created upon successful user login and token exchange.
-   `ACTIVE`: The session is valid and in use.
-   `REFRESHED`: The `accessToken` and `expiresAt` fields are updated upon a successful token refresh.
-   `EXPIRED/DESTROYED`: The session is removed from Redis upon user logout or if the refresh token becomes invalid.

## Entity: AuthProviderConfiguration

Stores the configuration for each external identity provider. This data will be loaded from environment variables or a secure configuration file, not stored in a user-facing database.

**Fields**:

| Field Name | Data Type | Description |
|---|---|---|
| `providerId` | String | A unique identifier for the provider (e.g., "google", "github"). |
| `clientId` | String | The OAuth2 Client ID provided by the IdP. |
| `clientSecret`| String | The OAuth2 Client Secret provided by the IdP. |
| `authorizationUrl` | String | The URL for the provider's authorization endpoint. |
| `tokenUrl` | String | The URL for the provider's token endpoint. |
| `userInfoUrl`| String | The URL for the provider's user info endpoint. |
| `redirectUri`| String | The callback URL for our application. |
| `scopes` | Array of Strings | The list of scopes to request from the provider. |
