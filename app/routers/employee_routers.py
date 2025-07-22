from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, Query, APIRouter, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from models import Employee, HaircutLog
from db.database import get_db
import schemas
from utils import create_employee
router = APIRouter()


# get all employees 
@router.get('', response_model= schemas.EmployeeOut)
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return employees

# Make an employee
@router.post('',response_model= schemas.EmployeeOut ,status_code=status.HTTP_201_CREATED)
def add_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    new_employee = create_employee(db,
                                  name=employee.name,
                                  pay_percentage=employee.pay_percentage)
    
    try:
        db.add(new_employee)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    return new_employee

# Generate a weekly pay stub
@router.get("/{employee_id}/summary")
def get_employee_summary(
    employee_id: int,
    start: Optional[str] = Query(None),  # query param: ?start=2025-07-14
    end: Optional[str] = Query(None),    # query param: ?end=2025-07-20
    db: Session = Depends(get_db),
):
    # see if the employee exists in our DB
    employee = (
       db.get(Employee, employee_id)
    )
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
    
    total_cuts, total_revenue = (
        db.query(
            func.count(HaircutLog.id),
            func.coalesce(func.sum(HaircutLog.price), 0)
        )
        .filter(HaircutLog.employee_id == employee_id)
        .filter(HaircutLog.date >= start_date)
        .filter(HaircutLog.date <= end_date)
        .one()
    )
    # Calculate pay due
    total_pay_due = round(total_revenue * (employee.pay_percentage / 100), 2)
    

    return{
        "employee":employee.name,
        "start": start_date.date(),
        "end": end_date.date(),
        "total_cuts": total_cuts,
        "total_revenue": total_revenue,
        "pay_percentage": employee.pay_percentage,
        "total_pay_due": total_pay_due,
    }