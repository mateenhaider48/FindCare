from fastapi import Cookie, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth
from sqlalchemy.orm import Session

from backend.app.core import firebase  # noqa: F401  (initialises the Firebase Admin app)
from backend.app.db.database import get_db
from backend.app.db.models.users import User


SESSION_COOKIE = "fc_session"

security = HTTPBearer(auto_error=False)


def _verify(
    credentials: HTTPAuthorizationCredentials | None,
    session_cookie: str | None,
) -> dict:
    """Accept either the httpOnly session cookie or a Firebase ID token."""
    if session_cookie:
        try:
            return auth.verify_session_cookie(
                session_cookie, check_revoked=True, clock_skew_seconds=60
            )
        except Exception:
            # Stale or invalid cookie: fall back to a bearer token if one was sent.
            pass

    if credentials:
        try:
            return auth.verify_id_token(
                credentials.credentials, check_revoked=True, clock_skew_seconds=60
            )
        except Exception:
            pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    fc_session: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    decoded = _verify(credentials, fc_session)

    firebase_uid = decoded.get("uid")
    email = decoded.get("email")

    if not firebase_uid or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    if user is None:
        user = User(
            firebase_uid=firebase_uid,
            email=email,
            name=decoded.get("name") or email.split("@")[0],
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    return user
