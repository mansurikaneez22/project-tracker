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
