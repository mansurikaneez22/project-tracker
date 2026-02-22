from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date

from app.database.database import get_db
from app.models.task import Task
from app.models.board_task_mapping import BoardTaskMapping
from app.schemas.task_schemas import TaskCreate, TaskUpdate, TaskStatusUpdate
from app.models.board import Board
from app.crud.activity_crud import create_activity
from app.dependencies.auth_dependency import get_current_user

router = APIRouter(
    prefix="/api/v1/task",
    tags=["Task"]
)

#create_task
@router.post("/")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
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

    return {
        "message": "Task created successfully",
        "task_id": new_task.task_id
    }
#get_all_tasks
@router.get("/list")
def get_all_tasks(
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).all()
    return tasks


#edit_task
@router.post("/{task_id}")
def edit_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
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

    return {
        "message": "Task updated successfully",
        "task_id": task.task_id
    }

#delete_task
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.task_id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Store before delete
    project_id = task.project_id
    title = task.task_title

    db.delete(task)
    db.commit()

    create_activity(
        db=db,
        project_id=project_id,
        user_id=current_user.user_id,
        action_type="TASK_DELETED",
        message=f"Task '{title}' deleted"
    )

    return {
        "message": "Task deleted successfully",
        "task_id": task_id
    }

@router.patch("/{task_id}/status")
def update_task_status(
    task_id: int,
    payload: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
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
        action_type="TASK_STATUS_CHANGED",
        message=f"Task '{task.task_title}' moved to {task.status}"
    )

    return {
        "message": "Task status updated successfully",
        "task_id": task.task_id,
        "status": task.status
    }

@router.put("/{task_id}/assign-sprint")
def assign_task_to_sprint(
    task_id: int,
    sprint_id: int,
    db: Session = Depends(get_db),
):
    # Check task exists
    task = db.execute(
        text("SELECT task_id FROM task WHERE task_id = :task_id"),
        {"task_id": task_id},
    ).fetchone()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update sprint_id
    db.execute(
        text("""
            UPDATE task
            SET sprint_id = :sprint_id
            WHERE task_id = :task_id
        """),
        {
            "task_id": task_id,
            "sprint_id": sprint_id,
        },
    )

    db.commit()

    return {"message": "Task assigned to sprint successfully"}

from app.dependencies.auth_dependency import get_current_user  # your JWT dependency

@router.get("/my-tasks")
def get_my_tasks(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).filter(
        Task.assignee_id == current_user.user_id
    ).all()

    return tasks

@router.get("/my-summary")
def get_my_task_summary(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).filter(
        Task.assignee_id == current_user.user_id
    ).all()

    total = len(tasks)
    pending = len([t for t in tasks if t.status == "TODO"])
    in_progress = len([t for t in tasks if t.status == "IN PROGRESS"])
    completed = len([t for t in tasks if t.status == "DONE"])
    overdue = len([
    t for t in tasks
    if t.due_date and t.due_date < date.today() and t.status != "DONE"
])


    return {
        "total_tasks": total,
        "pending": pending,
        "in_progress": in_progress,
        "completed": completed,
        "overdue": overdue
    }


# get_single_task
@router.get("/{task_id}")
def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.task_id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task