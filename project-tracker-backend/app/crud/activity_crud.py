from sqlalchemy.orm import Session
from app.models.activity import Activity

def create_activity(db: Session, project_id: int, user_id: int, action_type: str, message: str):
    activity = Activity(
        project_id=project_id,
        user_id=user_id,
        action_type=action_type,
        message=message
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return activity