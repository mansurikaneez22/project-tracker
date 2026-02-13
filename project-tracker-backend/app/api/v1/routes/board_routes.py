from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.database import get_db
from app.models.board import Board
from app.models.board_project_mapping import BoardProjectMapping
from app.schemas.board_schemas import BoardCreate

router = APIRouter(
    prefix="/api/v1/board",
    tags=["Board"]
)

# ---------------- CREATE BOARD ----------------
@router.post("/")
def create_board(board: BoardCreate, db: Session = Depends(get_db)):

    new_board = Board(
        board_title=board.board_title,
        sprint_start_date=board.sprint_start_date,
        sprint_end_date=board.sprint_end_date,
        board_short_description=board.board_short_description
    )

    db.add(new_board)
    db.commit()
    db.refresh(new_board)

    mapping = BoardProjectMapping(
        board_id=new_board.board_id,
        project_id=board.project_id
    )

    db.add(mapping)
    db.commit()

    return {
        "message": "Board created successfully",
        "board_id": new_board.board_id
    }
#board edit
@router.post("/{id}")
def edit_board(
    id: int,
    board: BoardCreate,
    db: Session = Depends(get_db)
):
    db_board = db.query(Board).filter(Board.board_id == id).first()

    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")

    db_board.board_title = board.board_title
    db_board.sprint_start_date = board.sprint_start_date
    db_board.sprint_end_date = board.sprint_end_date
    db_board.board_short_description = board.board_short_description

    db.commit()

    return {
        "message": "Board updated successfully",
        "board_id": id
    }
#delete board 
@router.post("/delete/{id}")
def delete_board(
    id: int,
    db: Session = Depends(get_db)
):
    board = db.query(Board).filter(Board.board_id == id).first()

    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    # delete mapping first (safe way)
    db.query(BoardProjectMapping).filter(
        BoardProjectMapping.board_id == id
    ).delete()

    db.delete(board)
    db.commit()

    return {
        "message": "Board deleted successfully",
        "board_id": id
    }

#board list 
@router.get("/list")
def list_boards(db: Session = Depends(get_db)):
    return db.query(Board).all()

#boards by project 
@router.get("/project/{project_id}")
def get_boards_by_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    boards = (
        db.query(Board)
        .join(
            BoardProjectMapping,
            Board.board_id == BoardProjectMapping.board_id
        )
        .filter(
            BoardProjectMapping.project_id == project_id
        )
        .all()
    )

    return {
        "count": len(boards),
        "boards": boards
    }

@router.put("/start/{board_id}")
def start_sprint(board_id: int, db: Session = Depends(get_db)):

    board = db.query(Board).filter(Board.board_id == board_id).first()

    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    # find project of this board
    mapping = db.query(BoardProjectMapping).filter(
        BoardProjectMapping.board_id == board_id
    ).first()

    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping not found")

    # deactivate only boards of this project
    project_boards = db.query(BoardProjectMapping).filter(
        BoardProjectMapping.project_id == mapping.project_id
    ).all()

    board_ids = [b.board_id for b in project_boards]

    db.query(Board).filter(Board.board_id.in_(board_ids)).update(
        {Board.is_active: False},
        synchronize_session=False
    )

    board.is_active = True

    db.commit()

    return {"message": "Sprint started successfully"}


# ---------------- GET ACTIVE SPRINT ----------------
@router.get("/active")
def get_active_sprint(db: Session = Depends(get_db)):

    active_board = db.query(Board).filter(Board.is_active == True).first()

    if not active_board:
        return {"message": "No active sprint"}

    return active_board



