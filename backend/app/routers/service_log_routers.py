from datetime import datetime
from typing import List
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.auth import admin_required
from app.models.service_log import ServiceLog
from app.models.service_type import ServiceType
from app.models.employee import Employee
from app.db.database import get_db
from app.utils.utils import verify_pin
import app.schemas as schemas

router = APIRouter()

# Get all logs
@router.get('', response_model=List[schemas.ServiceLogOut], dependencies=[Depends(admin_required)])
def get_service_logs(db: Session = Depends(get_db)):
    service_logs = db.query(ServiceLog).all()
    return service_logs

# log a service
@router.post('', response_model=schemas.ServiceLogOut, status_code=status.HTTP_201_CREATED)
def log_service(service_log: schemas.ServiceLogCreate, db: Session = Depends(get_db)):
    # find employee by id
    employee = db.query(Employee).filter(Employee.id == service_log.employee_id).first()
    # check if the employee exits
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Employee doesnt exist')
    # verify the employee pin with the pin hash
    if not verify_pin(service_log.pin, employee.pin_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Pin doesnt match!')
    # get the Service type by id and make sure it exists
    service = db.query(ServiceType).filter(ServiceType.id == service_log.service_type_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Service doesnt exist')
    
    create_log = ServiceLog(
        employee_id=service_log.employee_id,
        service_type_id=service_log.service_type_id,
        client_name=service_log.client_name,
        price=service_log.price,
        tip=service_log.tip,
        notes=service_log.notes,
        base_price=service.base_price,  
        date=datetime.now()
    )

    try:
        db.add(create_log)
        db.commit()
        db.refresh(create_log)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return create_log

# update a servicelog (rare cases but needed)
@router.patch('/{service_log_id}', response_model=schemas.ServiceLogOut, dependencies=[Depends(admin_required)])
def patch_log(service_log_id: int, updates: schemas.ServiceLogPatch, db: Session = Depends(get_db)):
    # find the log we want to update
    service_log = db.query(ServiceLog).filter(ServiceLog.id == service_log_id).first()
    # check if exists
    if not service_log:
        raise(HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Log doesnt exist'))
    
    # only update what needs to be updated
    if updates.client_name is not None:
        service_log.client_name = updates.client_name
    if updates.price is not None:
        service_log.price = updates.price
    if updates.tip is not None:
        service_log.tip = updates.tip
    if updates.notes is not None:
        service_log.notes = updates.notes
    
    try:
        db.commit()
        db.refresh(service_log)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    return service_log


# delete serviceLog
@router.delete('/{service_log_id}', dependencies=[Depends(admin_required)], status_code=status.HTTP_204_NO_CONTENT)
def delete_log(service_log_id: int, db: Session = Depends(get_db)):
    # get the log to delete
    log_to_delete = db.query(ServiceLog).filter(ServiceLog.id == service_log_id).first()
    if not log_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Log to be deleted doesnt exist')
    
    try:
        db.delete(log_to_delete)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    