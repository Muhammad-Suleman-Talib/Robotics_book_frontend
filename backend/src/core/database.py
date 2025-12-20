from sqlmodel import create_engine, Session
from .config import settings

# Add special connect_args for NeonDB serverless driver
connect_args = {}
if "neon.tech" in settings.DATABASE_URL:
    connect_args["sslmode"] = "require"

engine = create_engine(settings.DATABASE_URL, echo=True, connect_args=connect_args)

def get_session():
    """
    FastAPI dependency to get a database session.
    """
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """
    Utility function to create database tables for all SQLModel models.
    This should be called once on application startup.
    """
    # IMPORTANT: Import all your SQLModel models here before calling create_all
    # so that their metadata is registered with SQLModel.
    from ..models import session_model
    
    SQLModel.metadata.create_all(engine)
