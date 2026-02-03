from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.attachment import Attachment
from app.schemas.attachment_schemas import AttachmentResponse
import os
import uuid

router = APIRouter(
    prefix="/api/v1/attachment",
    tags=["Attachment"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

#  UPLOAD ATTACHMENT
@router.post("/")
def upload_attachment(
    task_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # unique filename
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # save file
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # save db record
    attachment = Attachment(
        task_id=task_id,
        file_name=file.filename,
        file_url=f"/uploads/{filename}"
    )

    db.add(attachment)
    db.commit()
    db.refresh(attachment)

    return attachment

# Get all attachments for a task
@router.get("/task/{task_id}", response_model=list[AttachmentResponse])
def get_task_attachments(task_id: int, db: Session = Depends(get_db)):
    return db.query(Attachment).filter(Attachment.task_id == task_id).all()

# Delete attachment
@router.delete("/{attachment_id}")
def delete_attachment(
    attachment_id: int,
    db: Session = Depends(get_db)
):
    attachment = db.query(Attachment).filter(
        Attachment.attachment_id == attachment_id
    ).first()

    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")

    # delete file from uploads folder
    if attachment.file_url:
        file_path = "." + attachment.file_url
        if os.path.exists(file_path):
            os.remove(file_path)

    db.delete(attachment)
    db.commit()

    return {"message": "Attachment deleted successfully"}