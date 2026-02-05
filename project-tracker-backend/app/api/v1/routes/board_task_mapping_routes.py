from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.board_task_mapping import BoardTaskMapping
from app.models.task import Task
from app.schemas.board_task_mapping_schemas import BoardTaskMappingCreate
from sqlalchemy import text 
from app.models.user import User
from app.dependencies.auth_dependency import get_current_user

router = APIRouter(
    prefix="/api/v1/board_task_mapping",
    tags=["BoardTaskMapping"]
)

# 1️⃣ Create a board-task mapping
@router.post("/")
def create_board_task_mapping(
    mapping: BoardTaskMappingCreate,
    db: Session = Depends(get_db)
):
    # ✅ Check if this task is already assigned to the board
    existing = db.query(BoardTaskMapping).filter(
        BoardTaskMapping.board_id == mapping.board_id,
        BoardTaskMapping.task_id == mapping.task_id
    ).first()

    if existing:
        return {
            "message": "Task already assigned to this board",
            "id": existing.id
        }

    new_mapping = BoardTaskMapping(
        board_id=mapping.board_id,
        task_id=mapping.task_id
    )
    db.add(new_mapping)
    db.commit()
    db.refresh(new_mapping)
    return {
        "message": "Task assigned to board",
        "id": new_mapping.id
    }

# 2️⃣ Get all tasks for a board
@router.get("/board/{board_id}/task")
def get_tasks_by_board(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = text("""
        SELECT
            t.task_id,
            t.task_title,
            t.status,
            t.priority,
            t.start_date,
            t.due_date,
            u.user_name AS assignee_name
        FROM board_task_mapping btm
        JOIN task t ON t.task_id = btm.task_id
        LEFT JOIN `user` u ON u.user_id = t.assignee_id
        WHERE btm.board_id = :board_id
    """)

    result = db.execute(
        query,
        {"board_id": board_id}
    ).mappings().all()

    return result