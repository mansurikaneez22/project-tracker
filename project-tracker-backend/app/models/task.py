from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base
from datetime import datetime

class Task(Base):
    __tablename__ = "task"

    task_id = Column(Integer, primary_key=True, index=True)
    task_title = Column(String(50), nullable=False)
    task_description = Column(String(500))
    assignee_id = Column(Integer, ForeignKey("user.user_id"))
    reporter_id = Column(Integer, ForeignKey("user.user_id"))
    start_date = Column(DateTime)
    due_date = Column(DateTime)
    priority = Column(String(6))
    estimation_points = Column(Integer)
    status = Column(String(10), default="TODO")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    dependency = Column(Integer, ForeignKey("task.task_id"))
    project_id = Column(Integer, ForeignKey("project.project_id"), nullable=False)
    sprint_id = Column(Integer, ForeignKey("sprint.sprint_id"), nullable=True)

    # Relationships (string-based)
    boards_mapping = relationship("BoardTaskMapping", back_populates="task", cascade="all, delete")
    attachments = relationship("Attachment", back_populates="task", cascade="all, delete")
    comments = relationship("Comment", back_populates="task", cascade="all, delete")
    notifications = relationship("Notification", back_populates="task", cascade="all, delete")
    sprint = relationship("Sprint", back_populates="task")
    assignee = relationship("User", foreign_keys=[assignee_id])
    reporter = relationship("User", foreign_keys=[reporter_id])