from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.database import get_db
from app.models.project import Project
from app.models.user import User
from app.models.task import Task
from app.models.department import Department
from app.models.team import Team
from app.models.project_member import ProjectMember
from app.schemas.project_schemas import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse
)
from app.dependencies.auth_dependency import get_current_user


router = APIRouter(
    prefix="/api/v1/project",
    tags=["Project"]
)

# ======================================================
# HELPER : VALIDATE DEPT + TEAM + PROJECT
# ======================================================
def validate_project_scope(
    db: Session,
    dept_id: int,
    team_id: int,
    project_id: int
):
    project = (
        db.query(Project)
        .join(Team, Project.team_id == Team.team_id)
        .join(Department, Team.department_id == Department.department_id)
        .filter(
            Department.department_id == dept_id,
            Team.team_id == team_id,
            Project.project_id == project_id
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found in this department/team"
        )

    return project


# ======================================================
# CREATE PROJECT
# ======================================================
@router.post("/", response_model=ProjectResponse)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = Project(
        team_id=data.team_id,
        project_title=data.project_title,
        project_description=data.project_description,
        project_manager=current_user.user_id,
        created_by=current_user.user_id
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    # AUTO ADD PROJECT MANAGER AS MEMBER
    pm_role_id = db.execute(
        text("SELECT id FROM role WHERE role_type = 'PROJECT MANAGER'")
    ).scalar()

    if not pm_role_id:
        raise HTTPException(status_code=500, detail="PM role not found")

    db.add(
        ProjectMember(
            project_id=project.project_id,
            user_id=current_user.user_id,
            role_id=pm_role_id
        )
    )
    db.commit()

    return project


# ======================================================
# VIEW ALL PROJECTS
# ======================================================
@router.get("/list", response_model=list[ProjectResponse])
def view_all_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Project).all()


# ======================================================
# GET PROJECT BY DEPT + TEAM + PROJECT
# ======================================================
@router.get(
    "/department/{dept_id}/team/{team_id}/project/{project_id}",
    response_model=ProjectResponse
)
def view_project_scoped(
    dept_id: int,
    team_id: int,
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = validate_project_scope(db, dept_id, team_id, project_id)
    return project


# ======================================================
# GET PROJECTS BY TEAM
# ======================================================
@router.get(
    "/department/{dept_id}/team/{team_id}/project",
    response_model=list[ProjectResponse]
)
def get_projects_by_team(
    dept_id: int,
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projects = (
        db.query(Project)
        .join(Team)
        .filter(
            Team.department_id == dept_id,
            Project.team_id == team_id
        )
        .all()
    )
    return projects


# ======================================================
# UPDATE PROJECT
# ======================================================
@router.put("/department/{dept_id}/team/{team_id}/project/{project_id}")
def update_project_scoped(
    dept_id: int,
    team_id: int,
    project_id: int,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = validate_project_scope(db, dept_id, team_id, project_id)

    # only PM can update
    if project.project_manager != current_user.user_id:
        raise HTTPException(
            status_code=403,
            detail="Only Project Manager can update project"
        )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return {"message": "Project updated successfully"}


# ======================================================
# DELETE PROJECT
# ======================================================
@router.delete("/department/{dept_id}/team/{team_id}/project/{project_id}")
def delete_project_scoped(
    dept_id: int,
    team_id: int,
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = validate_project_scope(db, dept_id, team_id, project_id)

    if project.created_by != current_user.user_id:
        raise HTTPException(
            status_code=403,
            detail="Only creator can delete project"
        )

    db.delete(project)
    db.commit()

    return {"message": "Project deleted successfully"}


# ======================================================
# GET TASKS OF PROJECT
# ======================================================
@router.get("/department/{dept_id}/team/{team_id}/project/{project_id}/task")
def get_tasks_by_project_scoped(
    dept_id: int,
    team_id: int,
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    validate_project_scope(db, dept_id, team_id, project_id)

    tasks = (
        db.query(Task)
        .filter(Task.project_id == project_id)
        .all()
    )

    return {
        "count": len(tasks),
        "tasks": tasks
    }

# ======================================================
# PROJECT TIMELINE
# ======================================================
@router.get("/department/{dept_id}/team/{team_id}/project/{project_id}/timeline")
def project_timeline_scoped(
    dept_id: int,
    team_id: int,
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    validate_project_scope(db, dept_id, team_id, project_id)

    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    return [
        {
            "task_id": t.task_id,
            "title": t.task_title,
            "start": t.start_date,
            "end": t.due_date,
            "status": t.status
        }
        for t in tasks
    ]
