from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship

class Project(Base):
    __tablename__ = "project"

    project_id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("team.team_id"))
    project_title = Column(String(20), nullable=False)
    project_description = Column(String(500))
    project_manager = Column(Integer, ForeignKey("user.user_id"))
    created_by = Column(Integer, ForeignKey("user.user_id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="ACTIVE")

    sprints = relationship("Sprint", back_populates="project")
