from datetime import datetime
from typing import Annotated, Optional
from pydantic import BaseModel, Field, constr

# Services
class ServiceTypeCreate(BaseModel):
    name: str
    category: str
    description: Optional[str] = None # optional details
    base_price: Annotated[float, Field(ge=0.1, description="Price must be greater than 0.1")]

class ServiceTypeOut(ServiceTypeCreate):
    id: int

    class Config:
        from_attributes = True

class ServiceTypePatch(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[Annotated[float, Field(ge=0.1, description="Price must be greater than 0.1")]] = None

# service log 
class ServiceLogCreate(BaseModel):
    employee_id: int
    pin: str
    service_type_id: int
    client_name: Optional[str] = None
    price: Annotated[float, Field(ge=0.1, description="Price must be greater than 0.1")] 
    tip: Optional[Annotated[float, Field(ge=0, description="Tip must be 0 or greater")]] = None
    notes: Optional[str] = None

class ServiceLogOut(BaseModel):
    id: int
    employee_id: int
    service_type_id: int
    client_name: Optional[str] = None
    price: float
    tip: Optional[float] = None
    notes: Optional[str] = None
    base_price: Optional[float] = None
    date: datetime
    class Config:
        from_attributes = True

class ServiceLogPatch(BaseModel):
    client_name: Optional[str] = None
    price: Optional[Annotated[float, Field(ge=0.1, description='Price must be greater than 0.1')]] = None
    tip: Optional[Annotated[float, Field(ge=0.1, description='Price must be greater than 0.1')]] = None
    notes: Optional[str] = None

# Employee Schemas
class EmployeeCreate(BaseModel):
    name: str
    pay_percentage: Annotated[float, Field(ge=0, le=100, description="Percentage between 0 and 100")]
    is_admin: Optional[bool] = False

class EmployeeOut(BaseModel):
    public_id: int
    name: str
    pay_percentage: float
    is_admin: bool

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None

class AdminCreatedOut(EmployeeOut):
    raw_pin: str
    
    class Config:
        from_attributes = True