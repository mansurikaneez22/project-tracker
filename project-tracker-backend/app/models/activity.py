# models/activity.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base  # adjust import if needed

class Activity(Base):
    __tablename__ = "activity"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("project.project_id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("user.user_id", ondelete="CASCADE"))

    action_type = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())

    # Optional relationships
    project = relationship("Project")
    user = relationship("User")