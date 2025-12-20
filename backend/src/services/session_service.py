import secrets
from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import Session, select
from backend.src.models.session_model import UserSession
from backend.src.core.config import settings
from pydantic import EmailStr # Import EmailStr

SESSION_EXPIRY_DAYS = 7 # Example, configure as needed in settings or env

def create_session_id() -> str:
    """Generates a secure, random session ID."""
    return secrets.token_urlsafe(32)

def create_user_session(
    db: Session,
    user_id: str,
    provider: str,
    access_token: str,
    refresh_token: Optional[str] = None,
    email: Optional[EmailStr] = None, # New parameter
    name: Optional[str] = None # New parameter
) -> UserSession:
    """
    Creates and stores a new user session in the database.
    """
    session_id = create_session_id()
    expires_at = datetime.utcnow() + timedelta(days=SESSION_EXPIRY_DAYS)

    session = UserSession(
        session_id=session_id,
        user_id=user_id,
        provider=provider,
        access_token=access_token,
        refresh_token=refresh_token,
        email=email, # Store email
        name=name,   # Store name
        expires_at=expires_at,
        created_at=datetime.utcnow()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def get_user_session(db: Session, session_id: str) -> Optional[UserSession]:
    """
    Retrieves a user session by its ID, if it's still valid and not expired.
    """
    statement = select(UserSession).where(
        UserSession.session_id == session_id,
        UserSession.expires_at > datetime.utcnow()
    )
    session = db.exec(statement).first()
    return session

def delete_user_session(db: Session, session_id: str):
    """
    Deletes a user session from the database.
    """
    session = db.get(UserSession, session_id)
    if session:
        db.delete(session)
        db.commit()

def refresh_user_session_tokens(
    db: Session,
    session_id: str,
    new_access_token: str,
    new_refresh_token: Optional[str] = None,
    email: Optional[EmailStr] = None, # New parameter for update
    name: Optional[str] = None # New parameter for update
) -> Optional[UserSession]:
    """
    Updates an existing user session with new access and refresh tokens.
    """
    session = get_user_session(db, session_id) # Re-use get_user_session to check validity
    if session:
        session.access_token = new_access_token
        session.expires_at = datetime.utcnow() + timedelta(days=SESSION_EXPIRY_DAYS) # Reset expiry
        if new_refresh_token:
            session.refresh_token = new_refresh_token
        if email: # Update email if provided
            session.email = email
        if name: # Update name if provided
            session.name = name
        db.add(session)
        db.commit()
        db.refresh(session)
    return session