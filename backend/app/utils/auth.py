from fastapi import Depends, status, HTTPException
import jwt
from jwt import InvalidTokenError as JWTError
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import models as models
from db.database import get_db
import os

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/login')

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")  # ← Fixed: get "user_id" not "sub"
        if user_id is None:
            raise credentials_exception
        return user_id 
    except JWTError:
        raise credentials_exception

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, 
        detail='Could not validate credentials',
        headers={"WWW-Authenticate": "Bearer"}
    )
    
    user_id = verify_token(token, credentials_exception) 

    user = db.query(models.Employee).filter(models.Employee.public_id == user_id).first()

    if user is None:  # ← Added user existence check
        raise credentials_exception

    return user

# checks is user is admin for admin only endpoints
def admin_required(user = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admins only")
    return user