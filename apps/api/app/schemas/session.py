from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime

class SessionBase(BaseModel):
    title: str
    initial_idea: str

class SessionCreate(SessionBase):
    pass

class SessionUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    current_requirements: Optional[Dict] = None

class SessionInDBBase(SessionBase):
    id: str
    user_id: int
    status: str
    current_requirements: Dict
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Session(SessionInDBBase):
    pass

class MessageBase(BaseModel):
    role: str
    content: str
    metadata: Optional[Dict] = {}

class MessageCreate(BaseModel):
    content: str

class MessageInDBBase(MessageBase):
    id: int
    session_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class Message(MessageInDBBase):
    pass

class SessionWithMessages(Session):
    messages: List[Message] = [] 