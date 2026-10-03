from datetime import datetime

from pydantic import BaseModel


class ConversationCreate(BaseModel):
    title: str | None = None


class ConversationResponse(BaseModel):
    id: int
    title: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True