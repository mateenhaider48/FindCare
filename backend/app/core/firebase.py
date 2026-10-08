import firebase_admin
from firebase_admin import credentials

from app.core.config import settings


cred = credentials.Certificate(
    settings.GOOGLE_APPLICATION_CREDENTIALS
)

firebase_admin.initialize_app(cred)

print("Firebase Admin initialized successfully!")