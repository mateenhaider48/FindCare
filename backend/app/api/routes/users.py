
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from firebase_admin import auth

from backend.app.core.security import get_current_user
from backend.app.db.database import get_db
from backend.app.db.models.users import User

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)


class SessionRequest(BaseModel):
    idToken: str


@router.post("/session")
def create_session(
    body: SessionRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        decoded = auth.verify_id_token(body.idToken)
        print("Decoded Firebase token:", decoded)

        uid = decoded["uid"]
        email = decoded.get("email")

        if not email:
            raise HTTPException(
                status_code=400,
                detail="Firebase account email is missing",
            )

        # Sirf recent login accept karo
        import time

        if time.time() - decoded.get("auth_time", 0) > 300:
            raise HTTPException(
                status_code=401,
                detail="Please sign in again",
            )

        # Existing PostgreSQL user find karo
        user = (
            db.query(User)
            .filter(User.firebase_uid == uid)
            .first()
        )

        if user is None:
            user = User(
                firebase_uid=uid,
                email=email,
                name=decoded.get("name") or email.split("@")[0],
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Firebase se email/name update karna optional hai
            user.email = email
            if decoded.get("name"):
                user.name = decoded["name"]
            db.commit()
            db.refresh(user)

       
        session_cookie = auth.create_session_cookie(
            body.idToken,
            expires_in=timedelta(days=5),
        )

        response.set_cookie(
            key="fc_session",
            value=session_cookie,
            max_age=5 * 24 * 60 * 60,
            httponly=True,
            secure=False,  # Local HTTP development only
            samesite="lax",
            path="/",
        )

        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user.id,
                "firebase_uid": user.firebase_uid,
                "name": user.name,
                "email": user.email,
            },
        }

    except HTTPException:
        raise
    except Exception as exc:
        print("Session creation error:", repr(exc))
        raise HTTPException(
            status_code=401,
            detail="Authentication failed",
        )


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="fc_session",
        path="/",
        httponly=True,
        secure=False,  # Local HTTP development only
        samesite="lax",
    )

    return {
        "success": True,
        "message": "Logged out successfully",
    }


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "firebase_uid": current_user.firebase_uid,
        "name": current_user.name,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
    }
