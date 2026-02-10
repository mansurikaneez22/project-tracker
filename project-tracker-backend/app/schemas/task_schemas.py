from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from typing import Literal

class TaskCreate(BaseModel):
    task_title: str
    task_description: Optional[str] = None

    assignee_id: Optional[int] = None
    reporter_id: Optional[int] = None

    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None

    priority: Optional[str] = None        # Low | Medium | High
    estimation_points: Optional[int] = None

    status: Optional[str] = "TODO"
    dependency: Optional[int] = None

    project_id: int
    
    board_id: int 
#updateTask schema
class TaskUpdate(BaseModel):
    task_title: Optional[str] = None
    task_description: Optional[str] = None

    assignee_id: Optional[int] = None
    reporter_id: Optional[int] = None

    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None

    priority: Optional[str] = None        # Low | Medium | High
    estimation_points: Optional[int] = None

    status: Optional[str] = None
    dependency: Optional[int] = None

class TaskStatusUpdate(BaseModel):
    status: Literal["TODO", "IN_PROGRESS", "DONE"]
