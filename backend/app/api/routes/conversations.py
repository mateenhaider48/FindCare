from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.db.database import get_db
from backend.app.db.models.conversations import Conversation
from backend.app.db.models.users import User
from backend.app.schemas.conversations import (
    ConversationCreate,
    ConversationResponse,
)


router = APIRouter(
    prefix="/api/conversations",
    tags=["Conversations"],
)


@router.post(
    "",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_conversation(
    conversation_data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = Conversation(
        user_id=current_user.id,
        title=conversation_data.title,
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation

@router.get(
    "",
    response_model=list[ConversationResponse],
    status_code=status.HTTP_200_OK,
)
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )

    return conversations    

@router.delete(
    "/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )

    if conversation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )

    db.delete(conversation)
    db.commit()

    return None    