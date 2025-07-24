from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from db.database import Base

class ServiceLog(Base):
    __tablename__ = 'service_logs'

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey('employees.public_id'), nullable=False)
    service_type_id = Column(Integer, ForeignKey('service_types.id'), nullable=False)
    client_name = Column(String, nullable=True) 
    price = Column(Float, nullable=False)
    base_price = Column(Float, nullable=True)
    notes = Column(String, nullable=True) 
    date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    service = relationship("ServiceType", back_populates="service_logs")
    employee = relationship("Employee", back_populates="service_logs")