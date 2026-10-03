from datetime import datetime

from pydantic import BaseModel, ConfigDict

from backend.app.db.models.messages import MessageRole


class UserMessageCreate(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: MessageRole
    content: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )