from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship, Session
from db.database import Base

class Employee(Base):
    __tablename__ = 'employees'
    
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(Integer, unique=True, index=True)
    pin_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    pay_percentage = Column(Float, nullable=False)

    haircuts = relationship("HaircutLog", back_populates="employee")
    