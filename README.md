# Project Nemo - Salon Management System

A professional salon management API built with FastAPI, designed for tracking services, managing employees, and generating payroll reports.

## 🚀 Features

- **Employee Management** - Create employees with PIN authentication
- **Service Catalog** - Manage available services with pricing
- **Service Logging** - Track completed services with tips and client info
- **Payroll Reports** - Generate employee summaries and pay calculations
- **Admin Controls** - Secure endpoints for management functions
- **Historical Pricing** - Track price changes over time

## 🛠️ Tech Stack

- **Backend:** FastAPI (Python)
- **Database:** SQLite with SQLAlchemy ORM
- **Authentication:** JWT tokens + PIN verification
- **Migration:** Alembic
- **Validation:** Pydantic schemas

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Project-Nemo
```

2. **Create virtual environment**
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up database**
```bash
alembic upgrade head
```

5. **Run the server**
```bash
uvicorn app.main:app --reload
```

## 📚 API Endpoints

### Authentication
- `POST /auth/login` - Admin login (returns JWT token)
- `POST /auth` - Create admin account

### Employees
- `GET /employees` - List all employees
- `POST /employees` - Create employee (admin only)
- `GET /employees/{id}/summary` - Generate payroll report (admin only)

### Services
- `GET /services` - List available services
- `POST /services` - Create service (admin only)
- `PUT /services/{id}` - Update service (admin only)
- `PATCH /services/{id}` - Partial update (admin only)
- `DELETE /services/{id}` - Delete service (admin only)

### Service Logs
- `GET /service-logs` - View all service logs (admin only)
- `POST /service-logs` - Log a completed service (PIN required)
- `PATCH /service-logs/{id}` - Correct service log (admin only)
- `DELETE /service-logs/{id}` - Delete service log (admin only)

## 🔐 Authentication

**Admin endpoints** require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

**Service logging** requires employee PIN verification in request body.

## 💡 Usage Examples

### Log a Service
```json
POST /service-logs
{
  "employee_id": 1,
  "pin": "12345",
  "service_type_id": 1,
  "client_name": "Jane Doe",
  "price": 35.0,
  "tip": 7.0,
  "notes": "Customer requested extra layers"
}
```

### Get Employee Summary
```
GET /employees/1/summary?start=2025-07-20&end=2025-07-26
```

## 🏗️ Project Structure

```
app/
├── main.py              # FastAPI application
├── models/              # SQLAlchemy models
├── routers/             # API route handlers
├── schemas.py           # Pydantic schemas
├── db/                  # Database configuration
└── utils/               # Helper functions
```

## 🚀 Next Steps

- [ ] Add React frontend
- [ ] Deploy to cloud platform
- [ ] Add more reporting features
- [ ] Mobile-responsive UI



Built with ❤️ 
