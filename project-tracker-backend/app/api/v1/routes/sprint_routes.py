from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database.database import get_db   # ✅ USE SHARED DEPENDENCY
from app.models.sprint import Sprint
from app.models.task import Task
from app.schemas.sprint_schemas import SprintCreate, SprintResponse
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.utils.project_access import validate_project_access

router = APIRouter(
    prefix="/api/v1/project/{project_id}/sprints",
    tags=["Sprints"]
)



@router.post("/", response_model=SprintResponse)
def create_sprint(
    project_id: int,
    sprint: SprintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 🔐 Only Project Manager allowed
    if current_user.job_profile != "PROJECT MANAGER":
        raise HTTPException(status_code=403, detail="Access denied")

    # 📅 Date validation
    if sprint.start_date >= sprint.end_date:
        raise HTTPException(
            status_code=400,
            detail="End date must be after start date"
        )

    # 🚫 Prevent overlapping with ACTIVE or PLANNED sprints
    overlapping = db.query(Sprint).filter(
        Sprint.project_id == project_id,
        Sprint.status != "COMPLETED",
        Sprint.start_date <= sprint.end_date,
        Sprint.end_date >= sprint.start_date
    ).first()

    if overlapping:
        raise HTTPException(
            status_code=400,
            detail="Sprint dates overlap with existing sprint"
        )

    new_sprint = Sprint(
        sprint_name=sprint.sprint_name,
        project_id=project_id,
        start_date=sprint.start_date,
        end_date=sprint.end_date,
        status="PLANNED"
    )

    db.add(new_sprint)
    db.commit()
    db.refresh(new_sprint)

    return new_sprint



# ================= GET ALL SPRINTS =================
@router.get("/", response_model=list[SprintResponse])
def get_sprints(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    validate_project_access(db, project_id, current_user)

    return db.query(Sprint).filter(
        Sprint.project_id == project_id
    ).all()


# ================= START SPRINT =================
@router.put("/{sprint_id}/start")
def start_sprint(
    project_id: int,
    sprint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.job_profile != "PROJECT MANAGER":
        raise HTTPException(status_code=403, detail="Access denied")

    sprint = db.query(Sprint).filter(
        Sprint.sprint_id == sprint_id,
        Sprint.project_id == project_id
    ).first()

    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")

    if sprint.status == "COMPLETED":
        raise HTTPException(
            status_code=400,
            detail="Completed sprint cannot be started"
        )

    # 🚫 Only one ACTIVE sprint allowed
    active_sprint = db.query(Sprint).filter(
        Sprint.project_id == project_id,
        Sprint.status == "ACTIVE"
    ).first()

    if active_sprint:
        raise HTTPException(
            status_code=400,
            detail="Another sprint is already active"
        )

    sprint.status = "ACTIVE"
    db.commit()

    return {"message": "Sprint started successfully"}



# ================= COMPLETE SPRINT =================
@router.put("/{sprint_id}/complete")
def complete_sprint(
    project_id: int,
    sprint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.job_profile != "PROJECT MANAGER":
        raise HTTPException(status_code=403, detail="Access denied")

    sprint = db.query(Sprint).filter(
        Sprint.sprint_id == sprint_id,
        Sprint.project_id == project_id
    ).first()

    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")

    if sprint.status != "ACTIVE":
        raise HTTPException(
            status_code=400,
            detail="Only ACTIVE sprint can be completed"
        )

    sprint.status = "COMPLETED"

    # 🔄 Move unfinished tasks to backlog
    unfinished_tasks = db.query(Task).filter(
        Task.project_id == project_id,
        Task.sprint_id == sprint_id,
        Task.status != "DONE"
    ).all()

    for task in unfinished_tasks:
        task.sprint_id = None

    db.commit()

    return {"message": "Sprint completed successfully"}



# ================= GET TASKS OF A SPRINT =================
@router.get("/{sprint_id}/tasks")
def get_sprint_tasks(
    project_id: int,
    sprint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    validate_project_access(db, project_id, current_user)

    sprint = db.query(Sprint).filter(
        Sprint.sprint_id == sprint_id,
        Sprint.project_id == project_id
    ).first()

    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")

    tasks = db.query(Task).filter(
        Task.project_id == project_id,
        Task.sprint_id == sprint_id
    ).all()

    return tasks