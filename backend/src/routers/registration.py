from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import Session
from backend.src.core.database import get_session
from backend.src.models.user_model import User
from backend.src.core.schemas import UserCreate, Token, ForgotPasswordRequest, ResetPasswordRequest
from backend.src.services.auth_utils import get_password_hash, verify_password
from backend.src.services.email_service import EmailService
from backend.src.core.config import settings

import uuid
import datetime

router = APIRouter()

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register_user(user_create: UserCreate, session: Session = Depends(get_session)):
    """
    Register a new user with email and password, and send a verification email.
    """
    # Check if user already exists
    existing_user = session.query(User).filter(User.email == user_create.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    hashed_password = get_password_hash(user_create.password)
    verification_token = str(uuid.uuid4()) # Generate verification token

    new_user = User(
        email=user_create.email,
        hashed_password=hashed_password,
        is_verified=False, # User is not verified upon registration
        verification_token=verification_token # Store the verification token
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    email_service = EmailService()
    try:
        await email_service.send_verification_email(new_user.email, verification_token)
    except Exception as e:
        # Log the error, but don't fail the registration if email sending fails for now
        # In a production app, you might want a retry mechanism or a way to notify admin
        print(f"Failed to send verification email to {new_user.email}: {e}")

    return {"message": "User registered successfully. Please check your email for verification."}

@router.get("/verify-email/{token}", response_model=dict, status_code=status.HTTP_200_OK)
async def verify_email(token: str, session: Session = Depends(get_session)):
    """
    Verify user's email address using the provided token.
    """
    user = session.query(User).filter(User.verification_token == token).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )

    user.is_verified = True
    user.verification_token = None # Clear the token after verification
    session.add(user)
    session.commit()
    session.refresh(user)

    # In a real app, you might redirect to a success page
    # return Response(status_code=status.HTTP_302_FOUND, headers={"Location": f"{settings.FRONTEND_URL}/email-verified"})
    return {"message": "Email verified successfully"}

@router.post("/forgot-password", response_model=dict)
async def forgot_password(
    request: ForgotPasswordRequest,
    session: Session = Depends(get_session)
):
    """
    Initiates the password reset process by sending a reset email to the user.
    """
    user = session.query(User).filter(User.email == request.email).first()

    if not user:
        # For security reasons, always return a generic success message even if user not found
        return {"message": "If an account with that email exists, a password reset link has been sent."}

    reset_token = str(uuid.uuid4())
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(hours=1) # Token valid for 1 hour

    user.password_reset_token = reset_token
    user.password_reset_expires_at = expires_at
    session.add(user)
    session.commit()
    session.refresh(user)

    email_service = EmailService()
    try:
        await email_service.send_password_reset_email(user.email, reset_token)
    except Exception as e:
        print(f"Failed to send password reset email to {user.email}: {e}")
        # Log error but still return success message to avoid user enumeration
    
    return {"message": "If an account with that email exists, a password reset link has been sent."}


@router.post("/reset-password", response_model=dict)
async def reset_password(
    request: ResetPasswordRequest,
    session: Session = Depends(get_session)
):
    """
    Resets the user's password using a valid reset token.
    """
    user = session.query(User).filter(User.password_reset_token == request.token).first()

    if not user or user.password_reset_expires_at < datetime.datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset token"
        )
    
    user.hashed_password = get_password_hash(request.new_password)
    user.password_reset_token = None
    user.password_reset_expires_at = None
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"message": "Password has been reset successfully."}