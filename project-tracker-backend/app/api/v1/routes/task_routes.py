from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date
from pydantic import BaseModel

from app.database.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task_schemas import TaskCreate, TaskUpdate, TaskStatusUpdate
from app.crud.activity_crud import create_activity
from app.dependencies.auth_dependency import get_current_user
from app.services.notification_service import create_notification

router = APIRouter(
    prefix="/api/v1/task",
    tags=["Task"]
)

# ------------------ CREATE TASK ------------------
@router.post("/")
async def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_task = Task(
        task_title=task.task_title,
        task_description=task.task_description,
        assignee_id=task.assignee_id,
        reporter_id=task.reporter_id,
        start_date=task.start_date,
        due_date=task.due_date,
        priority=task.priority,
        estimation_points=task.estimation_points,
        status=task.status,
        dependency=task.dependency,
        project_id=task.project_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    create_activity(
        db=db,
        project_id=new_task.project_id,
        user_id=current_user.user_id,
        action_type="TASK CREATED",
        message=f"Task '{new_task.task_title}' created"
    )

    # ✅ Notify assignee
    if new_task.assignee_id:
        await create_notification(
            db=db,
            user_id=new_task.assignee_id,
            type="TASK_ASSIGNED",
            message=f"You have been assigned a new task: '{new_task.task_title}'",
            task_id=new_task.task_id
        )

    return {
        "message": "Task created successfully",
        "task_id": new_task.task_id
    }


# ------------------ EDIT TASK ------------------
@router.post("/{task_id}")
async def edit_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task_data.dict(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    create_activity(
        db=db,
        project_id=task.project_id,
        user_id=current_user.user_id,
        action_type="TASK UPDATED",
        message=f"Task '{task.task_title}' updated"
    )

    # ✅ Notify assignee & reporter
    for uid in set(filter(None, [task.assignee_id, task.reporter_id])):
        await create_notification(
            db=db,
            user_id=uid,
            type="TASK_UPDATED",
            message=f"Task '{task.task_title}' has been updated",
            task_id=task.task_id
        )

    return {
        "message": "Task updated successfully",
        "task_id": task.task_id
    }


# ------------------ DELETE TASK ------------------
@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    project_id = task.project_id
    title = task.task_title
    assignee_id = task.assignee_id
    reporter_id = task.reporter_id

    db.delete(task)
    db.commit()

    create_activity(
        db=db,
        project_id=project_id,
        user_id=current_user.user_id,
        action_type="TASK DELETED",
        message=f"Task '{title}' deleted"
    )

    # ✅ Notify assignee & reporter
    for uid in set(filter(None, [assignee_id, reporter_id])):
        await create_notification(
            db=db,
            user_id=uid,
            type="TASK_DELETED",
            message=f"Task '{title}' has been deleted",
            task_id=task_id
        )

    return {
        "message": "Task deleted successfully",
        "task_id": task_id
    }


# ------------------ UPDATE TASK STATUS ------------------
@router.patch("/{task_id}/status")
async def update_task_status(
    task_id: int,
    payload: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = payload.status
    db.commit()
    db.refresh(task)

    create_activity(
        db=db,
        project_id=task.project_id,
        user_id=current_user.user_id,
        action_type="TASK STATUS CHANGED",
        message=f"Task '{task.task_title}' moved to {task.status}"
    )

    # ✅ Notify reporter
    if task.reporter_id:
        await create_notification(
            db=db,
            user_id=task.reporter_id,
            type="TASK_STATUS_CHANGED",
            message=f"Task '{task.task_title}' status changed to {task.status}",
            task_id=task.task_id
        )

    return {
        "message": "Task status updated successfully",
        "task_id": task.task_id,
        "status": task.status
    }


# ------------------ GET ALL TASKS ------------------
@router.get("/list")
def get_all_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()


@router.get("/my-tasks")
def get_my_tasks(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    tasks = db.query(Task).filter(
        Task.assignee_id == current_user.user_id
    ).all()
    
    return tasks

# ------------------ GET SINGLE TASK ------------------
@router.get("/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {
        "task_id": task.task_id,
        "task_title": task.task_title,
        "task_description": task.task_description,
        "assignee_id": task.assignee_id,
        "assignee_name": task.assignee.user_name if task.assignee else None
    }


@router.put("/{task_id}")
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task_data.assignee_id is not None:
        task.assignee_id = task_data.assignee_id

    db.commit()
    db.refresh(task)

    return task

@router.put("/{task_id}/assign-sprint")
def assign_task_to_sprint(
    task_id: int,
    sprint_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.sprint_id = sprint_id
    db.commit()

    return {"message": "Task assigned successfully"}