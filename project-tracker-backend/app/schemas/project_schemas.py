from pydantic import BaseModel
from typing import Optional

from datetime import datetime
#schema for project create
class ProjectCreate(BaseModel):
    team_id: int
    project_title: str
    project_description: str
    project_manager: int
    created_by: int

#schema for project update
class ProjectUpdate(BaseModel):
    project_title: Optional[str] = None
    project_description: Optional[str] = None
    project_manager: Optional[int] = None
    status: Optional[str] = None 

class ProjectResponse(BaseModel):
    project_id: int
    team_id: int
    project_title: str
    project_description: Optional[str]
    project_manager: int
    created_by: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True




