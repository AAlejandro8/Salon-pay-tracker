from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from db.database import get_db
import schemas
from utils import auth, utils
from models import Employee

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

    access_token = auth.create_access_token(data={"user_id": employee.public_id})

    return {"access_token": access_token, "token_type": "bearer"}