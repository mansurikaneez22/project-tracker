from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Sprint(Base):
    __tablename__ = "sprint"

    sprint_id = Column(Integer, primary_key=True, index=True)
    sprint_name = Column(String(50), nullable=False)

    project_id = Column(Integer, ForeignKey("project.project_id"))

    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)

    status = Column(String(20), default="PLANNED")

    created_at = Column(DateTime)

    project = relationship("Project", back_populates="sprints")
    task = relationship("Task", back_populates="sprint")
