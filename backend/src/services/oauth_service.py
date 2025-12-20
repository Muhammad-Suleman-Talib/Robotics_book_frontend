from authlib.integrations.starlette_client import OAuth
from ..core.config import settings

oauth = OAuth()

# This function will be called during application startup to register providers
def register_oauth_providers(app):
    """
    Registers OAuth providers with Authlib.
    """
    oauth.init_app(app, cache=None) # Cache can be configured later if needed

    # Register Google provider (example)
    oauth.register(
        name='google',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url=settings.GOOGLE_METADATA_URL,
        client_kwargs={'scope': 'openid email profile'},
    )
    
    # Register GitHub provider
    if settings.GITHUB_CLIENT_ID and settings.GITHUB_CLIENT_SECRET:
        oauth.register(
            name='github',
            client_id=settings.GITHUB_CLIENT_ID,
            client_secret=settings.GITHUB_CLIENT_SECRET,
            authorize_url='https://github.com/login/oauth/authorize',
            access_token_url='https://github.com/login/oauth/access_token',
            api_base_url='https://api.github.com/',
            client_kwargs={'scope': 'user:email'},
        )

    # Register Facebook provider
    if settings.FACEBOOK_CLIENT_ID and settings.FACEBOOK_CLIENT_SECRET:
        oauth.register(
            name='facebook',
            client_id=settings.FACEBOOK_CLIENT_ID,
            client_secret=settings.FACEBOOK_CLIENT_SECRET,
            authorize_url='https://www.facebook.com/v12.0/dialog/oauth', # Example version
            access_token_url='https://graph.facebook.com/v12.0/oauth/access_token', # Example version
            api_base_url='https://graph.facebook.com/v12.0/', # Example version
            client_kwargs={'scope': 'email public_profile'},
        )
