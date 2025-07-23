from datetime import datetime
from typing import Annotated, Optional
from pydantic import BaseModel, Field, constr

class HaircutCreate(BaseModel):
    employee_id:int
    pin: str
    price: Annotated[float, Field(ge=0.1, description="Must be greater than 0.1")]
    client_name: Optional[str] = None
    description: Optional[str] = None

class HaircutOut(BaseModel):
    id: int
    employee_id: int
    price: float
    description: Optional[str] = None
    date: datetime

    class Config:
        orm_mode=True

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
        orm_mode=True


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None