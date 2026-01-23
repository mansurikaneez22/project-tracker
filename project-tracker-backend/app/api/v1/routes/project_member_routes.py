from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.database import SessionLocal
from app.models.project_member import ProjectMember
from app.schemas.project_member_schema import (ProjectMemberCreate, ProjectMemberResponse)
from app.models.user import User
from app.dependencies.auth_dependency import get_current_user


router = APIRouter(
    prefix="/api/v1/project-members",
    tags=["Project Members"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def is_pm_or_tl(db: Session, project_id: int, user_id: int):
    role = db.execute(text("""
        SELECT r.role_type
        FROM project_member pm
        JOIN role r ON pm.role_id = r.id
        WHERE pm.project_id = :project_id
          AND pm.user_id = :user_id
    """), {
        "project_id": project_id,
        "user_id": user_id
    }).scalar()

    if role not in ("PM", "TL"):
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to perform this action"
        )


@router.post("/", response_model=ProjectMemberResponse)
def add_project_member(
    data: ProjectMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Permission check
    is_pm_or_tl(db, data.project_id, current_user.user_id)

    # Team validation
    team_check = db.execute(text("""
        SELECT 1
        FROM team_member
        WHERE team_id = (
            SELECT team_id FROM project WHERE project_id = :project_id
        )
        AND user_id = :user_id
    """), {
        "project_id": data.project_id,
        "user_id": data.user_id
    }).first()

    if not team_check:
        raise HTTPException(
            status_code=400,
            detail="User is not part of the team"
        )

    try:
        member = ProjectMember(**data.dict())
        db.add(member)
        db.commit()
        db.refresh(member)
        return member

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="User already added to this project"
        )

#Get all members of a project
@router.get("/project/{project_id}")
def get_project_members(project_id: int, db: Session = Depends(get_db)):

    query = text("""
        SELECT 
            u.user_id,
            u.user_name,
            u.email_id,
            r.id AS role_id,
            r.role_type
        FROM project_member pm
        JOIN user u ON pm.user_id = u.user_id
        JOIN role r ON pm.role_id = r.id
        WHERE pm.project_id = :project_id
    """)

    result = db.execute(query, {"project_id": project_id}).mappings().all()

    return result