from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class BoardTaskMapping(Base):
    __tablename__ = "board_task_mapping"

    id = Column(Integer, primary_key=True, autoincrement=True)
    board_id = Column(Integer, ForeignKey("board.board_id", ondelete="CASCADE"))
    task_id = Column(Integer, ForeignKey("task.task_id", ondelete="CASCADE"))

    # Relationships
    board = relationship("Board", back_populates="tasks_mapping")
    task = relationship("Task", back_populates="boards_mapping")
