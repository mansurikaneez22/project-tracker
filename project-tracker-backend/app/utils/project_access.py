from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.models.user import User

def validate_project_access(db: Session, project_id: int, user: User):

    # PM → always allowed (assuming PM already scoped correctly)
    if user.job_profile == "PROJECT MANAGER":
        return

    # Contributor → must be project member
    check = db.execute(
        text("""
            SELECT 1 FROM project_member
            WHERE project_id = :project_id
            AND user_id = :user_id
        """),
        {
            "project_id": project_id,
            "user_id": user.user_id
        }
    ).fetchone()

    if not check:
        raise HTTPException(status_code=403, detail="Not assigned to this project")