import firebase_admin
from firebase_admin import credentials

from backend.app.core.config import settings


# Guard against double initialisation (e.g. uvicorn --reload re-imports).
if not firebase_admin._apps:
    cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)
    firebase_admin.initialize_app(cred)
