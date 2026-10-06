from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import datetime
from backend.app.core.security import get_current_user
from backend.app.db.database import get_db
from backend.app.db.models.conversations import Conversation
from backend.app.db.models.messages import Message, MessageRole
from backend.app.db.models.users import User
from backend.app.schemas.messages import UserMessageCreate, MessageResponse

from langchain_core.messages import HumanMessage, AIMessage

from agents.app.graph.builder import app

router = APIRouter(
    prefix="/api/conversations",
    tags=["Messages"],
)

@router.post(
    "/{conversation_id}/messages",
    status_code=status.HTTP_201_CREATED,
)
def create_user_message(
    conversation_id: int,
    message_data: UserMessageCreate,
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

    # Save user message
    user_message = Message(
        conversation_id=conversation.id,
        role=MessageRole.USER,
        content=message_data.content,
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    # Load previous conversation messages
    db_messages = (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation.id
        )
        .order_by(Message.created_at.asc())
        .all()
    )

    # Convert DB messages to LangChain messages
    langchain_messages = []

    for message in db_messages:
        if message.role == MessageRole.USER:
            langchain_messages.append(
                HumanMessage(content=message.content)
            )

        elif message.role == MessageRole.AGENT:
            langchain_messages.append(
                AIMessage(content=message.content)
            )

    # Create state for FindCare graph
    state = {
        "messages": langchain_messages,
        "symptoms": [],
        "new_symptoms": [],
        "duration": None,
        "severity": None,
        "associated_symptoms": [],
        "red_flags": [],
        "is_emergency": False,
        "specialty": None,
        "active_agent": None,
        "final_response": None,
    }

    # Call FindCare agent
    result = app.invoke(state)

    agent_response = result.get("final_response")

    if not agent_response:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Agent did not return a response",
        )

    # Save agent response
    agent_message = Message(
        conversation_id=conversation.id,
        role=MessageRole.AGENT,
        content=agent_response,
    )

    db.add(agent_message)

    conversation.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(agent_message)

    return {
        "user_message": user_message,
        "agent_message": agent_message,
    }
@router.get(
    "/{conversation_id}/messages",
    response_model=list[MessageResponse],
    status_code=status.HTTP_200_OK,
)
def get_conversation_messages(
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

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.asc())
        .all()
    )

    return messages    