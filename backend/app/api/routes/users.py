from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.db.database import get_db
from backend.app.db.models.users import User


router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)


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