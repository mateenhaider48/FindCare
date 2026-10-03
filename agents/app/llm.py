import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_groq import ChatGroq


# agents/.env ka exact path
BASE_DIR = Path(__file__).resolve().parents[1]

load_dotenv(BASE_DIR / ".env")


llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.2,
)