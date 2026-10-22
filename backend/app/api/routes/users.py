import time
from datetime import timedelta

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from firebase_admin import auth
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import SESSION_COOKIE, get_current_user
from backend.app.db.database import get_db
from backend.app.db.models.users import User

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)

SESSION_MAX_AGE = timedelta(days=5)
# Firebase only allows minting a session cookie from a recent sign-in.
RECENT_SIGN_IN_SECONDS = 5 * 60


class SessionRequest(BaseModel):
    idToken: str


def _user_payload(user: User) -> dict:
    return {
        "id": user.id,
        "firebase_uid": user.firebase_uid,
        "name": user.name,
        "email": user.email,
    }


@router.post("/session")
def create_session(
    body: SessionRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        # Allow a little clock skew: dev machines are often a few seconds off,
        # which otherwise trips "Token used too early".
        decoded = auth.verify_id_token(body.idToken, clock_skew_seconds=60)
    except Exception as exc:
        print("ID token verification failed:", repr(exc))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid sign-in token. Please try again.",
        )

    uid = decoded["uid"]
    email = decoded.get("email")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your account has no email address.",
        )

    if time.time() - decoded.get("auth_time", 0) > RECENT_SIGN_IN_SECONDS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please sign in again.",
        )

    name = decoded.get("name") or email.split("@")[0]

    user = db.query(User).filter(User.firebase_uid == uid).first()
    if user is None:
        # Same email signed up earlier with another provider: link it to this uid.
        user = db.query(User).filter(User.email == email).first()

    if user is None:
        user = User(firebase_uid=uid, email=email, name=name)
        db.add(user)
    else:
        user.firebase_uid = uid
        user.email = email
        if decoded.get("name"):
            user.name = decoded["name"]

    db.commit()
    db.refresh(user)

    # Checked after refresh so the DB default (is_active=True) is populated for
    # a freshly created user.
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is disabled.",
        )

    try:
        session_cookie = auth.create_session_cookie(
            body.idToken,
            expires_in=SESSION_MAX_AGE,
        )
    except Exception as exc:
        print("Session cookie creation failed:", repr(exc))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not start your session. Please sign in again.",
        )

    response.set_cookie(
        key=SESSION_COOKIE,
        value=session_cookie,
        max_age=int(SESSION_MAX_AGE.total_seconds()),
        httponly=True,
        secure=False,  # Local HTTP development only
        samesite="lax",
        path="/",
    )

    return {"success": True, "user": _user_payload(user)}


@router.post("/logout")
def logout(
    response: Response,
    fc_session: str | None = Cookie(default=None),
):
    if fc_session:
        try:
            # Revoke so the cookie stops working everywhere, not just in this browser.
            decoded = auth.verify_session_cookie(fc_session, clock_skew_seconds=60)
            auth.revoke_refresh_tokens(decoded["sub"])
        except Exception:
            pass

    response.delete_cookie(
        key=SESSION_COOKIE,
        path="/",
        httponly=True,
        secure=False,  # Local HTTP development only
        samesite="lax",
    )

    return {"success": True}


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        **_user_payload(current_user),
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
    }
