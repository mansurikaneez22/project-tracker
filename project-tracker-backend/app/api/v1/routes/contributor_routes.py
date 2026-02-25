from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.task import Task

router = APIRouter(
    prefix="/api/v1/contributor",
    tags=["Contributor"]
)

@router.get("/{user_id}/projects")
def get_contributor_projects(user_id: int, db: Session = Depends(get_db)):

    projects = (
        db.query(Project)
        .join(ProjectMember, Project.project_id == ProjectMember.project_id)
        .filter(ProjectMember.user_id == user_id)
        .all()
    )

    return projects


@router.get("/{user_id}/tasks")
def get_contributor_tasks(user_id: int, db: Session = Depends(get_db)):

    tasks = db.query(Task).filter(Task.assignee_id == user_id).all()
    return tasks