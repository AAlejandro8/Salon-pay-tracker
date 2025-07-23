from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from db.database import Base


class HaircutLog(Base):
    __tablename__ = 'haircut_logs'

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.public_id"), nullable=False)
    client = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.today)
    employee = relationship("Employee", back_populates="haircuts")