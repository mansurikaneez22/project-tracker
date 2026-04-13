from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import uuid

from app.database.database import get_db
from app.models.user import User
from app.schemas.user_schemas import UserCreate, UserResponse
from app.utils.email_utils import send_reset_password_email

router = APIRouter(
    prefix="/api/v1/user",
    tags=["Users"]
)

# CREATE USER (ADMIN)
@router.post("/")
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(
        User.email_id == user.email_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        user_name=user.user_name,
        email_id=user.email_id,
        job_profile=user.job_profile,
        password=None,
        is_active=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate reset token
    token = str(uuid.uuid4())

    new_user.reset_token = token
    new_user.reset_token_expiry = (
        datetime.utcnow() + timedelta(minutes=15)
    )

    db.commit()

    # Send password set email
    await send_reset_password_email(
        to_email=new_user.email_id,
        first_name=new_user.user_name,
        token=token
    )

    return {
        "message": "User created & password set email sent"
    }


#GET USERS 
@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
