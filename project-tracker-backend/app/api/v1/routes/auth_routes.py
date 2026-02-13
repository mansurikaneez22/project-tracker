# app/api/v1/routes/auth_routes.py
from fastapi import APIRouter, Depends, HTTPException, Body, UploadFile, File, Request
from sqlalchemy.orm import Session
import os
import shutil
from datetime import datetime, timedelta
from uuid import uuid4

from app.database.database import SessionLocal
from app.models.user import User
from app.dependencies.auth_dependency import get_current_user
from app.schemas.auth_schemas import UserResponse, LoginRequest, LoginResponse, ResetPasswordRequest
from app.utils.password_utils import verify_password, hash_password
from app.utils.jwt_utils import create_access_token
from app.utils.email_utils import send_reset_password_email

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Auth"]
)

# ---------------- DB Dependency ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- LOGIN ----------------
@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email_id == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.password:
        raise HTTPException(status_code=403, detail="Password not set. Please reset password")
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    access_token = create_access_token({"user_id": user.user_id, "email": user.email_id})

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.user_id,
        "user_name": user.user_name,
        "job_profile": user.job_profile
    }


# ---------------- FORGOT PASSWORD ----------------
@router.post("/forgot-password")
async def forgot_password(email: str = Body(..., embed=True), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email_id == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = str(uuid4())
    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)
    db.commit()

    await send_reset_password_email(to_email=user.email_id, first_name=user.user_name, token=token)

    return {"message": "If the account exists, a reset link has been sent"}


# ---------------- RESET PASSWORD ----------------
@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.reset_token == data.token,
        User.reset_token_expiry > datetime.utcnow()
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    user.password = hash_password(data.new_password)
    user.is_active = True
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()

    return {"message": "Password reset successful"}


from fastapi import Request

# ---------------- GET CURRENT USER ----------------
@router.get("/me", response_model=UserResponse)
def get_me(request: Request, current_user: User = Depends(get_current_user)):
    """
    Returns user info with full profile_pic URL
    """
    profile_pic_url = (
        f"{request.base_url}{current_user.profile_pic}" if current_user.profile_pic else None
    )
    return UserResponse(
        user_id=current_user.user_id,
        user_name=current_user.user_name,
        email=current_user.email_id,
        job_profile=current_user.job_profile,
        profile_pic=profile_pic_url
    )


# ---------------- UPLOAD PROFILE PICTURE ----------------
@router.post("/upload-profile-pic")
def upload_profile_pic(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save profile picture to uploads/profile_pics, store relative path in DB,
    and return full URL for frontend
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Ensure folder exists
    upload_folder = "uploads/profile_pics"
    os.makedirs(upload_folder, exist_ok=True)

    # Save file
    filename = f"{uuid4().hex}_{file.filename}"
    file_path = os.path.join(upload_folder, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save relative path in DB
    relative_path = f"uploads/profile_pics/{filename}"
    db.query(User).filter(User.user_id == current_user.user_id).update({
        "profile_pic": relative_path
    })
    db.commit()

    # Build full URL for frontend
    full_url = f"{request.base_url}{relative_path}"

    return {"message": "Profile picture updated", "profile_pic": full_url}