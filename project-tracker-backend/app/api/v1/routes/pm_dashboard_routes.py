from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/pm",
    tags=["PM Dashboard"]
)

# ---------------- Dashboard Summary ----------------
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/pm",
    tags=["PM Dashboard"]
)

@router.get("/dashboard/summary")
def pm_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.job_profile != "PROJECT MANAGER":
        raise HTTPException(status_code=403, detail="Access denied")

    summary = db.execute(text("""
        SELECT
            (SELECT COUNT(*) FROM project WHERE project_manager = :pm_id) AS total_projects,
            (SELECT COUNT(*) FROM board WHERE sprint_end_date >= CURDATE()) AS active_boards,
            (SELECT COUNT(*) FROM task WHERE status != 'DONE') AS open_tasks,
            (SELECT COUNT(*) FROM task WHERE due_date < CURDATE() AND status != 'DONE') AS overdue_tasks,
            (SELECT SUM(CASE WHEN status='NOT_STARTED' THEN 1 ELSE 0 END)
             FROM task WHERE project_id IN (SELECT project_id FROM project WHERE project_manager = :pm_id)) AS not_started,
            (SELECT SUM(CASE WHEN status='IN_PROGRESS' THEN 1 ELSE 0 END)
             FROM task WHERE project_id IN (SELECT project_id FROM project WHERE project_manager = :pm_id)) AS in_progress,
            (SELECT SUM(CASE WHEN status='COMPLETED' THEN 1 ELSE 0 END)
             FROM task WHERE project_id IN (SELECT project_id FROM project WHERE project_manager = :pm_id)) AS completed
    """), {"pm_id": current_user.user_id}).mappings().first()

    # Prepare response in frontend-friendly format
    return {
        "projects": summary.total_projects or 0,
        "teams": 0,  # Replace with real team count if available
        "tasks": summary.open_tasks or 0,
        "pending_tasks": summary.overdue_tasks or 0,
        "task_status": {
            "NOT_STARTED": summary.not_started or 0,
            "IN_PROGRESS": summary.in_progress or 0,
            "COMPLETED": summary.completed or 0
        },
        "project_progress": []  # Fill this if you want a chart of projects
    }


# ---------------- Projects Overview ----------------
@router.get("/projects/overview")
def project_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = db.execute(text("""
        SELECT
            SUM(CASE WHEN status = 'NOT_STARTED' THEN 1 ELSE 0 END) AS not_started,
            SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress,
            SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed
        FROM project
        WHERE project_manager = :pm_id
    """), {"pm_id": current_user.user_id}).mappings().first()

    return data

# ---------------- Team Workload ----------------
@router.get("/team/workload")
def team_workload(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = db.execute(text("""
        SELECT
            u.user_name,
            COUNT(t.task_id) AS task_count
        FROM task t
        JOIN user u ON u.user_id = t.assignee_id
        WHERE t.status != 'DONE'
        GROUP BY u.user_name
    """)).mappings().all()

    return result

# ---------------- Active Boards / Sprints ----------------
@router.get("/boards/active")
def active_sprints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = db.execute(text("""
        SELECT
            b.board_id,
            b.board_title,
            p.project_title AS project_name,
            ROUND(
                (SUM(CASE WHEN t.status='DONE' THEN 1 ELSE 0 END) / NULLIF(COUNT(t.task_id),0)) * 100
            ) AS progress,
            DATEDIFF(b.sprint_end_date, CURDATE()) AS days_left
        FROM board b
        JOIN project p ON p.project_id = b.project_id
        LEFT JOIN task t ON t.project_id = p.project_id
        WHERE b.sprint_end_date >= CURDATE()
        GROUP BY b.board_id, b.board_title, p.project_title, b.sprint_end_date
    """)).mappings().all()

    return result
