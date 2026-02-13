from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.database import get_db
from app.models.task import Task
from app.models.board_task_mapping import BoardTaskMapping
from app.schemas.task_schemas import TaskCreate, TaskUpdate, TaskStatusUpdate
from app.models.board import Board

router = APIRouter(
    prefix="/api/v1/task",
    tags=["Task"]
)

#create_task
@router.post("/")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
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

    board = db.query(Board).filter(
        Board.board_id == task.board_id
    ).first()

    if not board:
        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    db.add(
        BoardTaskMapping(
            board_id=task.board_id,
            task_id=new_task.task_id
        )
    )

    db.commit()

    return {
        "message": "Task created successfully",
        "task_id": new_task.task_id,
        "board_id": task.board_id
    }
#get_all_tasks
@router.get("/list")
def get_all_tasks(
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).all()
    return tasks

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

#edit_task
@router.post("/{task_id}")
def edit_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.task_id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task_data.dict(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return {
        "message": "Task updated successfully",
        "task_id": task.task_id
    }

#delete_task
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.task_id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully",
        "task_id": task_id
    }

@router.patch("/{task_id}/status")
def update_task_status(
    task_id: int,
    payload: TaskStatusUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.task_id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = payload.status
    db.commit()
    db.refresh(task)

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