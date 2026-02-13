from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database.database import Base
from sqlalchemy.orm import relationship


class Board(Base):
    __tablename__ = "board"

    board_id = Column(Integer, primary_key=True, index=True)
    board_title = Column(String(20))
    sprint_start_date = Column(DateTime)
    sprint_end_date = Column(DateTime)
    board_short_description = Column(String(50))
    is_active = Column(Boolean, default=False)
#Relationships
    tasks_mapping = relationship("BoardTaskMapping", back_populates="board", cascade="all, delete")