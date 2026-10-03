from backend.app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from fastapi import APIRouter, Depends, HTTPException,Response, status
from backend.app.db.models.users import User

router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)

@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
)
def get_user(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
    }