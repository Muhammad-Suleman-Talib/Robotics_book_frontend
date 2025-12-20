from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from sqlmodel import Session
from backend.src.core.config import settings
from backend.src.core.database import get_session
from backend.src.models.user_model import User # Import User model
from backend.src.services.oauth_service import oauth
from backend.src.services.session_service import create_user_session, get_user_session, delete_user_session, refresh_user_session_tokens
from backend.src.core.schemas import SessionResponse, UserProfile, TokenData, UserLogin, Token
from backend.src.services.auth_utils import verify_password # Import verify_password

from typing import Optional, Tuple

router = APIRouter(prefix="/auth", tags=["Auth"])

# Dependency to get session_id from cookie
def get_session_id_from_cookie(request: Request) -> str | None:
    return request.cookies.get("session_id")

def _get_user_details_from_provider_info(provider: str, user_info: dict) -> Tuple[str, str, Optional[str]]:
    """
    Extracts user_id, email, and name from provider-specific user_info.
    """
    user_id = user_info.get('sub') # Default for OIDC (Google)
    email = user_info.get('email')
    name = user_info.get('name')

    if provider == 'github':
        user_id = str(user_info.get('id'))
        email = user_info.get('email', f"{user_info.get('login')}@github.com") # GitHub email might be null if private
        name = user_info.get('name') or user_info.get('login')
    elif provider == 'facebook':
        user_id = user_info.get('id')
        email = user_info.get('email')
        name = user_info.get('name')
    # Add other providers as needed

    if not user_id:
        raise ValueError(f"Could not extract user ID from {provider} user info: {user_info}")
    if not email:
        raise ValueError(f"Could not extract email from {provider} user info: {user_info}")

    return user_id, email, name

@router.post("/login", response_model=Token)
async def login_email_password(
    user_login: UserLogin,
    response: Response,
    db: Session = Depends(get_session)
):
    """
    Authenticate user with email and password.
    """
    user = db.query(User).filter(User.email == user_login.email).first()

    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not verified",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create a user session for email/password login
    session = create_user_session(
        db=db,
        user_id=str(user.id), # Use user ID as string
        provider="email_password", # Indicate provider type
        access_token="mock_access_token_email_password", # Mock token for now, generate real JWT later
        refresh_token="mock_refresh_token_email_password" # Mock token
    )

    response.set_cookie(
        key="session_id",
        value=session.session_id,
        httponly=True,
        secure=settings.BASE_URL.startswith("https"), # Use secure cookie if BASE_URL is HTTPS
        max_age=3600*24*7, # 7 days
        samesite="Lax" # Recommended for CSRF protection
    )
    
    # Return a dummy access token for now. In a real app, this would be a JWT.
    return Token(access_token="mock_jwt_access_token", token_type="bearer", refresh_token="mock_jwt_refresh_token")

@router.get("/{provider}")
async def login_via_provider(provider: str, request: Request):
    """
    Initiates the OAuth2 login flow for the given provider.
    """
    client = oauth.create_client(provider)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth client for provider '{provider}' not found."
        )
    
    redirect_uri = f"{settings.BASE_URL}{router.prefix}/{provider}/callback"
    return await client.authorize_redirect(request, redirect_uri)

@router.get("/{provider}/callback")
async def auth_callback(
    provider: str,
    request: Request,
    code: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_session)
):
    """
    Handles the callback from the OAuth2 provider after successful authorization.
    """
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth provider returned an error: {error}"
        )
    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authorization code not provided."
        )

    client = oauth.create_client(provider)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth client for provider '{provider}' not found."
        )

    try:
        # Fetch access token
        token = await client.authorize_access_token(request)
        
        # Fetch user info
        user_info = await client.userinfo(token=token)
        
        # Extract user details using helper function
        user_id, email, name = _get_user_details_from_provider_info(provider, user_info)

        # Logic to either find existing user, link social account, or create new user
        # 1. Try to find a User by email (if social provider gives email)
        user = db.query(User).filter(User.email == email).first()

        if not user:
            # 2. If no user found by email, create a new User
            # For social logins, set hashed_password to an empty string and is_verified to True
            user = User(email=email, hashed_password="", is_verified=True)
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # 3. Check if social account is already linked to this user
        social_account = db.query(SocialAccount).filter(
            SocialAccount.user_id == user.id,
            SocialAccount.provider == provider,
            SocialAccount.provider_user_id == user_id
        ).first()

        if not social_account:
            # 4. If not linked, link social account to the user
            social_account = SocialAccount(
                user_id=user.id,
                provider=provider,
                provider_user_id=user_id,
                email=email,
                name=name
            )
            db.add(social_account)
            db.commit()
            db.refresh(social_account)

        # Create session in DB
        session = create_user_session(
            db=db,
            user_id=str(user.id), # Use internal user ID
            provider=provider,
            access_token=token['access_token'],
            refresh_token=token.get('refresh_token'),
            email=email, # Pass email to session
            name=name # Pass name to session
        )

        
        # Set session cookie and redirect to frontend
        response = RedirectResponse(url=settings.FRONTEND_URL, status_code=status.HTTP_302_FOUND)
        response.set_cookie(
            key="session_id",
            value=session.session_id,
            httponly=True,
            secure=settings.BASE_URL.startswith("https"), # Use secure cookie if BASE_URL is HTTPS
            max_age=3600*24*7, # 7 days
            samesite="Lax" # Recommended for CSRF protection
        )
        return response

    except Exception as e:
        print(f"OAuth callback error: {e}") # Log error for debugging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process OAuth callback: {e}"
        )

@router.post("/logout", response_model=SessionResponse)
async def logout(
    response: Response,
    session_id: str | None = Depends(get_session_id_from_cookie),
    db: Session = Depends(get_session)
):
    """
    Logs out the current user by deleting their session.
    """
    if not session_id:
        return SessionResponse(is_authenticated=False, user=None) # Already logged out or never logged in

    delete_user_session(db, session_id)
    response.delete_cookie(key="session_id")
    return SessionResponse(is_authenticated=False, user=None)

@router.get("/session", response_model=SessionResponse)
async def get_session_status(
    session_id: str | None = Depends(get_session_id_from_cookie),
    db: Session = Depends(get_session)
):
    """
    Returns the current session status and user information if authenticated.
    """
    if not session_id:
        return SessionResponse(is_authenticated=False, user=None)

    session = get_user_session(db, session_id)
    if not session:
        return SessionResponse(is_authenticated=False, user=None)
    
    user_email = None
    user_name = None
    if session.provider == "email_password":
        # For email/password users, fetch their email from the User table
        user = db.query(User).filter(User.id == int(session.user_id)).first()
        if user:
            user_email = user.email
            user_name = user.email.split('@')[0] # Simple name from email for now
    else:
        # For OAuth providers, use the email stored in the session, or try to get it from provider info
        user_email = session.email # Assuming email is now stored in session
        user_name = session.name # Assuming name is now stored in session or derive from email
    
    user_profile = UserProfile(
        id=session.user_id,
        provider=session.provider,
        email=user_email or "unknown@example.com", # Use extracted email or placeholder
        name=user_name # Use extracted name or None
    )
    return SessionResponse(is_authenticated=True, user=user_profile)

@router.post("/refresh", response_model=TokenData)
async def refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_session),
    session_id: str = Depends(get_session_id_from_cookie)
):
    """
    Refreshes the access token using the stored refresh token.
    """
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session not found. Please log in."
        )
    
    session = get_user_session(db, session_id)
    if not session or not session.refresh_token:
        # If session doesn't exist or no refresh token, prompt re-login
        delete_user_session(db, session_id) # Clean up invalid session if any
        response.delete_cookie(key="session_id")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session or missing refresh token. Please log in."
        )

    try:
        client = oauth.create_client(session.provider)
        if not client:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"OAuth client for provider '{session.provider}' not found."
            )
        
        # Refresh the token using Authlib
        new_token = await client.refresh_token(
            token={'refresh_token': session.refresh_token},
            request=request
        )
        
        # Update session in DB
        updated_session = refresh_user_session_tokens(
            db=db,
            session_id=session.session_id,
            new_access_token=new_token['access_token'],
            new_refresh_token=new_token.get('refresh_token'),
            email=session.email, # Pass email from old session
            name=session.name # Pass name from old session
        )

        if not updated_session:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update session after refresh.")

        return TokenData(access_token=updated_session.access_token)

    except Exception as e:
        print(f"Token refresh error: {e}")
        # In case of refresh failure, force re-login
        delete_user_session(db, session_id)
        response.delete_cookie(key="session_id")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Failed to refresh token. Please log in again. Error: {e}"
        )