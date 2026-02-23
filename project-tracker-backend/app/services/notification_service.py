from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.socket_instance import sio  # ✅ Socket.IO instance import

async def create_notification(
    db: Session,
    user_id: int,
    type: str,
    message: str,
    task_id: int | None = None
):
    notification = Notification(
        user_id=user_id,
        task_id=task_id,
        type=type,
        message=message,
        is_read=False
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    # 🔥 Real-time push using Socket.IO
    await sio.emit(
        "new_notification",
        {
            "notification_id": notification.notification_id,
            "user_id": user_id,
            "task_id": task_id,
            "type": type,
            "message": message,
            "is_read": False,
            "created_at": str(notification.created_at)
        },
        room=str(user_id)   # ⚠ must match join room
    )

    print("EMITTED TO ROOM:", user_id)

    return notification