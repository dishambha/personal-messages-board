from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MessageCreate(BaseModel):
    name: Optional[str] = None
    message: str
    emotion: Optional[str] = None
    is_anonymous: bool = False


class MessageResponse(BaseModel):
    id: int
    name: str
    message: str
    emotion: Optional[str]
    is_anonymous: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True