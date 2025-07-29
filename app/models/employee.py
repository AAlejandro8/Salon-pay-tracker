from sqlalchemy import Boolean, Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.db.database import Base

class Employee(Base):
    __tablename__ = 'employees'
    
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(Integer, unique=True, index=True)
    pin_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    pay_percentage = Column(Float, nullable=False)
    is_admin = Column(Boolean, default=False)

    service_logs = relationship("ServiceLog", back_populates="employee")
    