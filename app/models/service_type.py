from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.db.database import Base

class ServiceType(Base):
    __tablename__ = 'service_types'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)  
    category = Column(String, nullable=True)  
    description = Column(String, nullable=True)
    base_price = Column(Float, nullable=False)
    
    # Relationship to service logs
    service_logs = relationship("ServiceLog", back_populates="service")