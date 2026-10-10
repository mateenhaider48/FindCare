from datetime import datetime, timedelta, timezone

from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth
from jose import JWTError, jwt
from pwdlib import PasswordHash
from sqlalchemy.orm import Session
from backend.app.core import firebase
from backend.app.core.config import settings
from backend.app.db.database import get_db
from backend.app.db.models.users import User


security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )

    token = credentials.credentials

    try:
        decoded_token = auth.verify_id_token(token)

    except Exception:
        raise credentials_exception

    firebase_uid = decoded_token.get("uid")
    email = decoded_token.get("email")

    if not firebase_uid or not email:
        raise credentials_exception

    user = (
        db.query(User)
        .filter(
            User.firebase_uid == firebase_uid
        )
        .first()
    )

    if user is None:

        user = User(
            firebase_uid=firebase_uid,
            email=email,
            name=decoded_token.get("name"),
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    return user