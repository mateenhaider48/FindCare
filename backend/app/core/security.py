from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth
from jose import JWTError, jwt
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.db.database import get_db
from backend.app.db.models.users import User


security = HTTPBearer()


# --------------------------------------------------
# Password hashing
# --------------------------------------------------

def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        password,
        hashed_password,
    )


# --------------------------------------------------
# Old JWT support
# --------------------------------------------------

def create_access_token(
    user_id: int,
    expires_delta: timedelta | None = None,
) -> str:

    if expires_delta is None:
        expires_delta = timedelta(
            minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        )

    expire = datetime.now(timezone.utc) + expires_delta

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

    return token


# --------------------------------------------------
# Firebase Authentication
# --------------------------------------------------

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