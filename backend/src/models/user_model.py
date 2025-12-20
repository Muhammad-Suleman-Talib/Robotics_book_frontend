from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from pydantic import EmailStr
import datetime

class SocialAccount(SQLModel, table=True):
    """
    Represents a social account linked to a user.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    provider: str = Field(index=True) # e.g., "google", "github", "facebook"
    provider_user_id: str = Field(index=True) # Unique ID from the social provider
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    # Relationship to the User model
    user: "User" = Relationship(back_populates="social_accounts")

class User(SQLModel, table=True):
    """
    Represents a user in the database, including email, hashed password, and verification status.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    email: EmailStr = Field(unique=True, index=True)
    hashed_password: str
    is_verified: bool = Field(default=False)
    verification_token: Optional[str] = Field(default=None, index=True) # Added verification_token
    password_reset_token: Optional[str] = Field(default=None, index=True) # Added for password reset
    password_reset_expires_at: Optional[datetime.datetime] = Field(default=None) # Added for password reset expiry
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    # Relationships
    social_accounts: List["SocialAccount"] = Relationship(back_populates="user")

class UserRead(SQLModel):
    """
    Schema for reading user data (excluding sensitive information like hashed password).
    """
    id: int
    email: EmailStr
    is_verified: bool
    created_at: datetime.datetime