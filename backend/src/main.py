import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from contextlib import asynccontextmanager

from .core.database import create_db_and_tables
from .services.oauth_service import register_oauth_providers
from .core.config import settings
from .routers import auth # Import the auth router
from .routers import registration # Import the new registration router

# Configure logger for the main application
logging.basicConfig(level=logging.INFO) # Basic config, can be enhanced
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Context manager to run startup and shutdown events.
    """
    logger.info("Application starting up...")
    create_db_and_tables()
    logger.info("Database tables created (if they didn't exist).")
    
    # Register OAuth providers during startup
    register_oauth_providers(app) # Pass the app instance
    logger.info("OAuth providers registered.")

    yield
    logger.info("Application shutting down...")

app = FastAPI(
    lifespan=lifespan,
    title="Authentication Service",
    description="FastAPI service for OAuth2/OIDC authentication and session management."
)

# Include the auth router
app.include_router(auth.router, prefix="/api")
# Include the registration router
app.include_router(registration.router, prefix="/api")

@app.get("/")
def read_root():
    return {"Hello": "World"}

# --- Centralized Error Handling ---
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handles FastAPI's HTTPException and returns a standardized JSON response.
    """
    logger.warning(f"HTTP Exception: {exc.status_code} - {exc.detail} for URL: {request.url}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Handles all other unexpected exceptions and returns a 500 Internal Server Error.
    """
    logger.exception(f"Unhandled Exception for URL: {request.url}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Internal server error"},
    )