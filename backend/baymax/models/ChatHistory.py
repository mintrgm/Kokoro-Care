from pydantic import BaseModel
from typing import List
from datetime import datetime

class ChatMessage(BaseModel):
    sender: str  # 'user' or 'bot'
    message: str
    timestamp: datetime

class ChatHistory(BaseModel):
    id: str
    user_id: str
    chat: List[ChatMessage]
    created_at: datetime
