from fastapi import FastAPI
from sqlalchemy import text

from backend.app.db.database import engine
from backend.app.api.routes.users import router as auth_router
from backend.app.api.routes.conversations import router as conversation_router
from backend.app.api.routes.messages import router as messages_router

app = FastAPI()

app.include_router(auth_router) 
app.include_router(conversation_router)
app.include_router(messages_router) 