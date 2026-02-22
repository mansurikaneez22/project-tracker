from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.database.database import get_db
from app.models.activity import Activity
from app.models.user import User
from app.models.project import Project
from app.schemas.activity_schemas import ActivityResponse
from app.dependencies.auth_dependency import get_current_user

router = APIRouter(
    prefix="/api/v1/activity",
    tags=["Activity"]
)


# ================================
# 1️⃣ Project Specific Activity
# ================================
@router.get("/project/{project_id}", response_model=List[ActivityResponse])
def get_project_activity(
    project_id: int,
    db: Session = Depends(get_db)
):
    results = (
        db.query(
            Activity.id,
            Activity.project_id,
            Activity.user_id,
            Activity.action_type,
            Activity.message,
            Activity.created_at,
            User.username.label("user_name")
        )
        .join(User, Activity.user_id == User.user_id)
        .filter(Activity.project_id == project_id)
        .order_by(Activity.created_at.desc())
        .limit(20)
        .all()
    )

    return results


# ================================
# 2️⃣ PM Combined Activity (NEW)
# ================================
@router.get("/pm", response_model=List[ActivityResponse])
def get_pm_combined_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.job_profile != "PROJECT MANAGER":
        raise HTTPException(status_code=403, detail="Access denied")

    pm_id = current_user.user_id

    results = (
        db.query(
            Activity.id,
            Activity.project_id,
            Activity.user_id,
            Activity.action_type,
            Activity.message,
            Activity.created_at,
            User.user_name.label("user_name")
        )
        .join(User, Activity.user_id == User.user_id)
        .join(Project, Activity.project_id == Project.project_id)
        .filter(Project.project_manager == pm_id)  # ✅ corrected column
        .order_by(Activity.created_at.desc())
        .limit(20)
        .all()
    )

    return results