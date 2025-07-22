from sqlalchemy.orm import Session
from models import Employee
import random
# make a 5 digit id and if in the db try again (no dupes)
def _generate_unique_5_digit_id(session: Session) -> int:
    for _ in range(10):
        candidate = random.randint(10000,99999)
        if not session.query(Employee).filter_by(public_id=candidate).first():
            return candidate
    raise Exception("Couldn't create a 5 digit id after 5 attemps")

# make the employee
def create_employee(session: Session, name: str, pay_percentage: float) -> Employee:
    public_id = _generate_unique_5_digit_id(session)
    return Employee(name=name, pay_percentage=pay_percentage, public_id=public_id)