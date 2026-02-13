

from pydantic import BaseModel
from datetime import date
from typing import Optional

class SprintCreate(BaseModel):
    sprint_name: str
    start_date: date
    end_date: date

     
from pydantic import BaseModel
from datetime import datetime

class SprintResponse(BaseModel):
    sprint_id: int
    sprint_name: str
    project_id: int
    start_date: datetime | None
    end_date: datetime | None
    status: str
    created_at: datetime | None

    class Config:
        from_attributes = True   # IMPORTANT (if using Pydantic v2)

