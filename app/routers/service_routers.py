from datetime import datetime
from typing import List
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from utils.auth import admin_required
from models.service_type import ServiceType
from models.service_log import ServiceLog
from db.database import get_db
from utils.utils import create_service
import schemas


router = APIRouter()

# get all available services
router.get('', response_model = schemas.ServiceTypeOut)
def get_services(db: Session = Depends(get_db)):
    services = db.query(ServiceType).all()
    return services

# add a new service
router.post('', status_code=status.HTTP_201_CREATED, dependencies=[Depends(admin_required)], response_model=schemas.ServiceTypeOut)
def add_service(service: schemas.ServiceTypeCreate, db: Session = Depends(get_db)):
    new_service = create_service(db,
                                 name=service.name,
                                 category=service.category,
                                 description=service.description,
                                 base_price=service.base_price)
    try:
        db.add(new_service)
        db.commit()
        db.refresh()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    return new_service


# update a service
router.put('/{service_id}', response_model=schemas.ServiceTypeOut, dependencies=[Depends(admin_required)], status_code=status.HTTP_200_OK)
def update_service(service_id: int, service: schemas.ServiceTypeCreate, db: Session = Depends(get_db)):
    # find the service using id
    existing_service = db.query(ServiceType).filter(ServiceType.id == service_id).first()

    if not existing_service:
        raise HTTPException(status_code=404, detail="Service doesn't exist")
    
    # update the service
    existing_service.name = service.name
    existing_service.category = service.category
    existing_service.description = service.description
    existing_service.base_price = service.base_price

    try:
        db.commit()
        db.refresh(existing_service)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    return existing_service

# patch certain parts
router.patch('/{service_id}', response_model=schemas.ServiceTypeOut, dependencies=[Depends(admin_required)], status_code=status.HTTP_200_OK)
def patch_service(service_id: int, service: schemas.ServiceTypePatch, db: Session = Depends(get_db)):
    # find the service using id
    existing_service = db.query(ServiceType).filter(ServiceType.id == service_id).first()

    if not existing_service:
        raise HTTPException(status_code=404, detail="Service doesn't exist")
    
    # only update what needs to be updated
    if service.name is not None:
        existing_service.name = service.name

    if service.category is not None:
        existing_service.category = service.category
    
    if service.description is not None:
        existing_service.description = service.description
    
    if service.base_price is not None:
        existing_service.base_price = service.base_price
    
    try:
        db.commit()
        db.refresh(existing_service)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    return existing_service

# delete a service
router.delete('/{service_id}', dependencies=[Depends(admin_required)], status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: int, db: Session = Depends(get_db)):
    # find the service to delete
    service_to_delete = db.query(ServiceType).filter(ServiceType.id == service_id).first()

    # check if it exists
    if not service_to_delete:
        raise HTTPException(status_code=404, detail="Service doesn't exist")
    
    # Check if it has logs in the DB
    usage_count = db.query(ServiceLog).filter(ServiceLog.service_type_id == service_id).count()

    if usage_count > 0:
        raise HTTPException(status_code=400, detail=f"Cannot delete - service has {usage_count} transaction records" )
    
    db.delete(service_to_delete)
    db.commit()

    return {"message": "Service deleted successfully!"}