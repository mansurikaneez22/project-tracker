from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid

from app.database.database import SessionLocal
from app.models.user import User
from app.utils.email_utils import send_reset_password_email

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/invite-user")
async def invite_user(data: dict, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.email_id == data["email_id"]
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    reset_token = str(uuid.uuid4())

    user = User(
        user_name=data["user_name"],
        email_id=data["email_id"],
        job_profile=data["job_profile"],
        company_id=data["company_id"],
        department_id=data["department_id"],
        team_id=data["team_id"],
        is_active=False,
        reset_token=reset_token,
        reset_token_expiry=datetime.utcnow() + timedelta(hours=24)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    await send_reset_password_email(
        to_email=user.email_id,
        first_name=user.user_name,
        token=reset_token
    )

    return {"message": "Invite sent successfully"}

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()

    active_users = db.query(User).filter(
        User.is_active == True
    ).count()

    pending_users = db.query(User).filter(
        User.is_active == False
    ).count()

    return {
        "totalUsers": total_users,
        "activeUsers": active_users,
        "pending": pending_users
    }

@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()

    return [
        {
            "id": u.user_id,
            "name": u.user_name,
            "email": u.email_id,
            "role": u.job_profile,
            "company_id": u.company_id,
            "team_id": u.team_id,
            "is_active": u.is_active
        }
        for u in users
    ]

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted"}

@router.get("/invites")
def get_pending_invites(db: Session = Depends(get_db)):
    users = db.query(User).filter(
        User.is_active == False
    ).all()

    return [
        {
            "id": u.user_id,
            "email": u.email_id,
            "name": u.user_name
        }
        for u in users
    ]

@router.post("/resend-invite/{user_id}")
async def resend_invite(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reset_token = str(uuid.uuid4())

    user.reset_token = reset_token
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=24)

    db.commit()

    await send_reset_password_email(
        to_email=user.email_id,
        first_name=user.user_name,
        token=reset_token
    )

    return {"message": "Invite resent successfully"}