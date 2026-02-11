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

    pm_id = current_user.user_id

    summary = db.execute(text("""
        SELECT
            -- Projects
            (SELECT COUNT(*)
             FROM project
             WHERE project_manager = :pm_id) AS total_projects,

            -- ✅ Teams (DISTINCT team_id)
            (SELECT COUNT(DISTINCT tm.team_id)
             FROM team_member tm
             JOIN task t ON t.assignee_id = tm.user_id
             JOIN project p ON p.project_id = t.project_id
             WHERE p.project_manager = :pm_id
            ) AS team_count,

            -- Open tasks
            (SELECT COUNT(*)
             FROM task
             WHERE status != 'DONE'
               AND project_id IN (
                 SELECT project_id FROM project WHERE project_manager = :pm_id
               )) AS open_tasks,

            -- Overdue
            (SELECT COUNT(*)
             FROM task
             WHERE due_date < CURDATE()
               AND status != 'DONE'
               AND project_id IN (
                 SELECT project_id FROM project WHERE project_manager = :pm_id
               )) AS overdue_tasks,

            -- Status split
            (SELECT COUNT(*)
             FROM task
             WHERE status = 'TODO'
               AND project_id IN (
                 SELECT project_id FROM project WHERE project_manager = :pm_id
               )) AS todo,

            (SELECT COUNT(*)
             FROM task
             WHERE status = 'IN_PROGRESS'
               AND project_id IN (
                 SELECT project_id FROM project WHERE project_manager = :pm_id
               )) AS in_progress,

            (SELECT COUNT(*)
             FROM task
             WHERE status = 'DONE'
               AND project_id IN (
                 SELECT project_id FROM project WHERE project_manager = :pm_id
               )) AS done
    """), {"pm_id": pm_id}).mappings().first()

    project_progress = db.execute(text("""
        SELECT
            p.project_id,
            p.project_title AS project_name,
            ROUND(
                (SUM(CASE WHEN t.status = 'DONE' THEN 1 ELSE 0 END)
                 / NULLIF(COUNT(t.task_id), 0)) * 100
            ) AS progress
        FROM project p
        LEFT JOIN task t ON t.project_id = p.project_id
        WHERE p.project_manager = :pm_id
        GROUP BY p.project_id, p.project_title
    """), {"pm_id": pm_id}).mappings().all()

    return {
        "projects": summary.total_projects or 0,
        "teams": summary.team_count or 0,   # ✅ FIXED
        "tasks": summary.open_tasks or 0,
        "pending_tasks": summary.overdue_tasks or 0,
        "task_status": {
            "TODO": summary.todo or 0,
            "IN_PROGRESS": summary.in_progress or 0,
            "DONE": summary.done or 0
        },
        "project_progress": project_progress
    }



# ---------------- Team Workload ----------------
@router.get("/team/workload")
def team_workload(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.job_profile != "PROJECT MANAGER":
        raise HTTPException(status_code=403, detail="Access denied")

    pm_id = current_user.user_id

    result = db.execute(text("""
        SELECT
            u.user_name AS name,
            COUNT(t.task_id) AS task_count
        FROM task t
        JOIN user u ON u.user_id = t.assignee_id
        JOIN project p ON p.project_id = t.project_id
        WHERE p.project_manager = :pm_id
          AND t.status != 'DONE'
        GROUP BY u.user_name
        ORDER BY task_count DESC
    """), {"pm_id": pm_id}).mappings().all()

    return [
    {
        "name": row["name"],
        "tasks": int(row["task_count"])   
    }
    for row in result 
]




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
