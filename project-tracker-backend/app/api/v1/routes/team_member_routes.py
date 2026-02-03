from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.database import SessionLocal
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/department/{dept_id}/team/{team_id}",
    tags=["Team Members"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET TEAM MEMBERS
@router.get("/members")
def get_team_members(
    dept_id: int,
    team_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
):
    
    valid = db.execute(text("""
        SELECT 1 FROM team
        WHERE team_id = :team_id
          AND department_id = :dept_id
    """), {
        "team_id": team_id,
        "dept_id": dept_id
    }).first()

    if not valid:
        raise HTTPException(404, "Team not found in this department")

    members = db.execute(text("""
        SELECT 
            u.user_id,
            u.user_name,
            u.email_id
        FROM team_member tm
        JOIN user u ON tm.user_id = u.user_id
        WHERE tm.team_id = :team_id
    """), {"team_id": team_id}).mappings().all()

    return members
@router.post("/members/{user_id}")
def add_user_to_team(
    dept_id: int,
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
):
    # ✅ validate team belongs to department
    valid = db.execute(text("""
        SELECT 1 FROM team
        WHERE team_id = :team_id
          AND department_id = :dept_id
    """), {
        "team_id": team_id,
        "dept_id": dept_id
    }).first()

    if not valid:
        raise HTTPException(404, "Team not in this department")

    # check user already exists
    exists = db.execute(text("""
        SELECT 1 FROM team_member
        WHERE team_id = :team_id AND user_id = :user_id
    """), {
        "team_id": team_id,
        "user_id": user_id
    }).first()

    if exists:
        raise HTTPException(400, "User already in team")

    db.execute(text("""
        INSERT INTO team_member (team_id, user_id)
        VALUES (:team_id, :user_id)
    """), {
        "team_id": team_id,
        "user_id": user_id
    })

    db.commit()
    return {"message": "User added to team"}
