from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.database import get_db
import app.schemas as schemas
from app.utils import auth, utils
from app.utils.utils import create_employee
from app.models import Employee

router = APIRouter()

@router.post('/login', response_model=schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(
        Employee.public_id == int(user_credentials.username)  
    ).first()

    if not employee:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials")

    if not utils.verify_pin(user_credentials.password, employee.pin_hash):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials")
    
    if not employee.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admins only")
    
    access_token = auth.create_access_token(data={"user_id": employee.public_id})

    return {"access_token": access_token, "token_type": "bearer"}

@router.post('', status_code=status.HTTP_201_CREATED,response_model=schemas.AdminCreatedOut)
def create_admin(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    new_employee, pin = create_employee(db,
                                  name=employee.name,
                                  pay_percentage=employee.pay_percentage,
                                  is_admin=employee.is_admin
                                  )
    
    try:
        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    return {
        "public_id": new_employee.public_id,
        "name": new_employee.name,
        "pay_percentage": new_employee.pay_percentage,
        "is_admin": new_employee.is_admin,
        "raw_pin": pin
    }