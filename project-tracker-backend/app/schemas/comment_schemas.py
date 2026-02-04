from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    task_id: int
    user_id: int
    content: str

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    content: str

class CommentResponse(CommentBase):
    comment_id: int
    created_at: datetime
    updated_at: datetime | None

    class Config:
        orm_mode = True   
