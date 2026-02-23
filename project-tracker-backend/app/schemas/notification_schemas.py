from pydantic import BaseModel
from datetime import datetime
from typing import Optional
class NotificationBase(BaseModel):
    user_id: int
    task_id: int
    type: str
    message: str

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    notification_id: int
    user_id: int
    task_id: Optional[int]
    type: str
    message: str
    is_read: bool
    created_at: datetime


    class Config:
        orm_mode = True
