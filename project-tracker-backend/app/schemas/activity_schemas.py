from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Base schema (common fields)
class ActivityBase(BaseModel):
    action_type: str
    message: str


# Response schema (what frontend receives)
class ActivityResponse(ActivityBase):
    id: int
    project_id: int
    user_id: int
    created_at: datetime
    user_name: Optional[str] = None

    class Config:
        from_attributes = True   # Pydantic v2
       
       