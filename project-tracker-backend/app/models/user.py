from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from app.database.database import Base

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    email_id = Column(String, unique=True, index=True, nullable=False)
    job_profile = Column(String, nullable=True)

    company_id = Column(Integer, ForeignKey("company.company_id"), nullable=False)
    department_id = Column(Integer, ForeignKey("department.department_id"), nullable=True)
    team_id = Column(Integer, ForeignKey("team.team_id"), nullable=True)

    password = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=False)
    
    profile_pic = Column(String, nullable=True) 