from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.notification import Notification
from app.schemas.notification_schemas import NotificationResponse, NotificationCreate
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.socket_instance import sio

router = APIRouter(
    prefix="/api/v1/notification",
    tags=["Notification"]
)

# ✅ Create notification (for logged-in user)
@router.post("/", response_model=NotificationResponse)
async def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_notification = Notification(
        user_id=current_user.user_id,
        message=notification.message,
        is_read=False
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)

    # 🔥 REAL-TIME EMIT
    await sio.emit(
        "new_notification",
        {
            "notification_id": db_notification.notification_id,
            "message": db_notification.message,
            "is_read": db_notification.is_read,
            "created_at": str(db_notification.created_at)
        },
        room=str(db_notification.user_id)
    )

    return db_notification

# ✅ Get logged-in user's notifications
@router.get("/", response_model=list[NotificationResponse])
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Notification)\
        .filter(Notification.user_id == current_user.user_id)\
        .order_by(Notification.created_at.desc())\
        .all()


# ✅ Mark notification as read
@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = db.query(Notification).filter(
        Notification.notification_id == notification_id,
        Notification.user_id == current_user.user_id
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.is_read = True
    db.commit()
    db.refresh(notification)

    return notification