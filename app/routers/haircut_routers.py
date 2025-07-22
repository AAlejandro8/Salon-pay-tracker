from datetime import datetime
from typing import List
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from models import HaircutLog
from db.database import get_db
import schemas

router = APIRouter()

# get all haircuts in the db
@router.get('', response_model=List[schemas.HaircutOut])
def get_haircuts(db: Session = Depends(get_db)):
    haircuts = db.query(HaircutLog).all()
    return haircuts

@router.post('',response_model=schemas.HaircutOut, status_code=status.HTTP_201_CREATED)
def log_haircut(haircut: schemas.HaircutCreate, db: Session = Depends(get_db)):
    new_cut = HaircutLog(
        employee_id = haircut.employee_id,
        price = haircut.price,
        description = haircut.description,
        date = datetime.now()
    )
    db.add(new_cut)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return new_cut

