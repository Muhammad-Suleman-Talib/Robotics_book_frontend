from sqlmodel import SQLModel, Field
from typing import Optional
import datetime
from pydantic import EmailStr

class UserSession(SQLModel, table=True):
    """
    Represents a user's authenticated session in the database.
    """
    session_id: str = Field(primary_key=True)
    user_id: str = Field(index=True)
    provider: str
    
    access_token: str
    refresh_token: Optional[str] = None
    
    email: Optional[EmailStr] = None # Added email to session
    name: Optional[str] = None # Added name to session

    expires_at: datetime.datetime
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
