from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import Depends, HTTPException, Query, APIRouter, status, dependencies
from sqlalchemy import func
from sqlalchemy.orm import Session
from models import Employee, ServiceLog
from db.database import get_db
import schemas as schemas
from utils.utils import create_employee, verify_pin
from utils.auth import admin_required
router = APIRouter()


# get all employees 
@router.get('', response_model=List[schemas.EmployeeOut])
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return employees

# Make an employee
@router.post('', status_code=status.HTTP_201_CREATED,  dependencies = [Depends(admin_required)])
def add_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    new_employee, pin = create_employee(db,
                                  name=employee.name,
                                  pay_percentage=employee.pay_percentage,
                                  is_admin=employee.is_admin)
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
        "raw_pin": pin
    }

# update an employees pay percentage
@router.patch('/{employee_id}', dependencies = [Depends(admin_required)])
def update_pay_percentage(employee_id: int, update: schemas.EmployeeUpdatePayPercentage, db: Session = Depends(get_db)):
    # find employee to update pay percentage
    employee = db.query(Employee).filter(Employee.public_id == employee_id).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail='Employee not found')
    
    # update the pay
    employee.pay_percentage = update.pay_percentage

    try:
        db.commit()
        db.refresh(employee)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    return employee

# Delete an employee
@router.delete('/{employee_id}', dependencies = [Depends(admin_required)])
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    # find the employee to delete
    employee = db.query(Employee).filter(Employee.public_id == employee_id).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail='Employee not found')

    try:
        db.delete(employee)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/validate-pin', response_model=schemas.EmployeeOut)
def validate_employee_pin(pin_data: schemas.PinInput, db: Session = Depends(get_db)):
    pin = pin_data.pin.strip()

    if not pin:
        raise HTTPException(status_code=400, detail="PIN is required")

    employees = db.query(Employee).all()

    for employee in employees:
        if verify_pin(pin, employee.pin_hash):
            return schemas.EmployeeOut(
                public_id=employee.public_id,
                name=employee.name,
                pay_percentage=employee.pay_percentage,
                is_admin=employee.is_admin
            )

    raise HTTPException(status_code=401, detail="Invalid PIN")



# Generate a weekly pay stub
@router.get("/{employee_id}/summary", dependencies = [Depends(admin_required)])
def get_employee_summary(
    employee_id: int,
    start: Optional[str] = Query(None),  # query param: ?start=2025-07-14
    end: Optional[str] = Query(None),    # query param: ?end=2025-07-20
    db: Session = Depends(get_db),
):
    # see if the employee exists in our DB
    employee = db.query(Employee).filter(Employee.public_id == employee_id).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Parse the start and end date
    if start and end:
        # make the string into an ISO format YYYY-MM-DD
        try:
            start_date = datetime.combine(datetime.fromisoformat(start).date(), datetime.min.time())
            end_date = datetime.combine(datetime.fromisoformat(end).date(), datetime.max.time())

        # wrong format given, throw error
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Dates must be in ISO format: YYYY-MM-DD"
            )
        
    # everything is correct, set the start and end dates
    else:
        # make the dates the last 7 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)

        
    # Query HaircutLog for this employee in that range
    
    total_cuts, total_revenue, total_tips = (
        db.query(
            func.count(ServiceLog.id),
            func.coalesce(func.sum(ServiceLog.price), 0),
            func.coalesce(func.sum(ServiceLog.tip), 0)
        )
        .filter(ServiceLog.employee_id == employee_id)
        .filter(ServiceLog.date >= start_date)
        .filter(ServiceLog.date <= end_date)
        .one()
    )
    # Calculate pay due
    total_pay_due = round((total_revenue + total_tips) * (employee.pay_percentage / 100), 2)
    

    return {
        "employee": employee.name,
        "start": start_date.date(),
        "end": end_date.date(),
        "total_services": total_cuts, 
        "total_revenue": total_revenue,
        "total_tips": total_tips,
        "pay_percentage": employee.pay_percentage,
        "total_pay_due": total_pay_due,
}

@router.get("/payroll/bulk", dependencies=[Depends(admin_required)])
def get_all_employee_summaries(
    start: Optional[str] = Query(None),
    end: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
     # Parse the start and end date
    if start and end:
        # make the string into an ISO format YYYY-MM-DD
        try:
            start_date = datetime.combine(datetime.fromisoformat(start).date(), datetime.min.time())
            end_date = datetime.combine(datetime.fromisoformat(end).date(), datetime.max.time())

        # wrong format given, throw error
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Dates must be in ISO format: YYYY-MM-DD"
            )
        
    # everything is correct, set the start and end dates
    else:
        # make the dates the last 7 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
    
    # Single query with GROUP BY
    results = (
        db.query(
            Employee.id,
            Employee.name,
            Employee.pay_percentage,
            func.count(ServiceLog.id).label('total_services'), # How many services this employee did
            func.coalesce(func.sum(ServiceLog.price), 0).label('total_revenue'),  # Sum of all their service prices, coalesce converts NULL to 0
            func.coalesce(func.sum(ServiceLog.tip), 0).label('total_tips') # Sum of all their tips, coalesce converts NULL to 0
        )
        .outerjoin(ServiceLog, Employee.id == ServiceLog.employee_id) # Links tables
        .filter(ServiceLog.date >= start_date)
        .filter(ServiceLog.date <= end_date)
        .group_by(Employee.id, Employee.name, Employee.pay_percentage) # Groups by employee
        .all()
    )
    
    # Process results
    summaries = {}
    for result in results:
        total_pay_due = round((result.total_revenue + result.total_tips) * (result.pay_percentage / 100), 2)
        summaries[result.id] = {
            "name": result.name,
            "total_services": result.total_services,
            "total_revenue": result.total_revenue,
            "total_tips": result.total_tips,
            "pay_percentage": result.pay_percentage,
            "total_pay_due": total_pay_due
        }
    
    return summaries