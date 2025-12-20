from pydantic import BaseModel, EmailStr
from typing import Optional

class UserProfile(BaseModel):
    """
    Schema for user profile information sent to the client.
    This is not a database model.
    """
    id: str
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    provider: str

class UserCreate(BaseModel):
    """
    Schema for creating a new user with email and password.
    """
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    """
    Schema for user login with email and password.
    """
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    """
    Schema for requesting a password reset.
    """
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    """
    Schema for resetting a password with a token and new password.
    """
    token: str
    new_password: str

class Token(BaseModel):
    """
    Schema for authentication tokens.
    """
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None # Added refresh_token for future use

class TokenData(BaseModel):
    """
    Schema for token data, useful for token-based responses.
    """
    access_token: str
    token_type: str = "bearer"

class SessionResponse(BaseModel):
    """
    Defines the shape of the response for the /api/auth/session endpoint.
    """
    is_authenticated: bool
    user: Optional[UserProfile] = None
