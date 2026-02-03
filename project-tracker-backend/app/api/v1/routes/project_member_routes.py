from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.database import SessionLocal
from app.models.project_member import ProjectMember
from app.schemas.project_member_schema import (
    ProjectMemberCreate,
    ProjectMemberResponse
)
from app.models.user import User
from app.dependencies.auth_dependency import get_current_user

router = APIRouter(
    prefix="/api/v1/department/{dept_id}/team/{team_id}/project/{project_id}/members",
    tags=["Project Members"]
)

# DB Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Permission Check
def is_pm_or_tl(
    db: Session,
    project_id: int,
    team_id: int,
    user_id: int
):
    role = db.execute(text("""
        SELECT r.role_type
        FROM project_member pm
        JOIN role r ON pm.role_id = r.id
        JOIN project p ON pm.project_id = p.project_id
        WHERE pm.project_id = :project_id
          AND p.team_id = :team_id
          AND pm.user_id = :user_id
    """), {
        "project_id": project_id,
        "team_id": team_id,
        "user_id": user_id
    }).scalar()

    if role not in ("PROJECT MANAGER", "TEAM LEADER"):
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to perform this action"
        )


# ADD PROJECT MEMBER

@router.post("/", response_model=ProjectMemberResponse)
def add_project_member(
    dept_id: int,
    team_id: int,
    project_id: int,
    data: ProjectMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Permission
    is_pm_or_tl(db, project_id, team_id, current_user.user_id)

    project_check = db.execute(text("""
    SELECT 1
    FROM project p
    JOIN team t ON p.team_id = t.team_id
    WHERE p.project_id = :project_id
      AND p.team_id = :team_id
      AND t.department_id = :dept_id
"""), {
    "project_id": project_id,
    "team_id": team_id,
    "dept_id": dept_id
}).first()


    if not project_check:
        raise HTTPException(
            status_code=404,
            detail="Project not found under given team/department"
        )

    #  User must be part of team
    team_check = db.execute(text("""
        SELECT 1
        FROM team_member
        WHERE team_id = :team_id
          AND user_id = :user_id
    """), {
        "team_id": team_id,
        "user_id": data.user_id
    }).first()

    if not team_check:
        raise HTTPException(
            status_code=400,
            detail="User is not part of the team"
        )

    try:
        member = ProjectMember(
            project_id=project_id,
            user_id=data.user_id,
            role_id=data.role_id
        )
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


# GET PROJECT MEMBERS

@router.get("/")
def get_project_members(
    dept_id: int,
    team_id: int,
    project_id: int,
    db: Session = Depends(get_db)
):

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
    JOIN project p ON pm.project_id = p.project_id
    JOIN team t ON p.team_id = t.team_id
    WHERE pm.project_id = :project_id
      AND p.team_id = :team_id
      AND t.department_id = :dept_id
""")

    result = db.execute(query, {
        "project_id": project_id,
        "team_id": team_id,
        "dept_id": dept_id
    }).mappings().all()

    return result
