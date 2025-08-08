# Project Nemo - Salon Management System

A professional salon management API built with FastAPI, designed for tracking services, managing employees, and generating payroll reports.

## 🚀 Features

- **Employee Management** - Create employees with PIN authentication
- **Service Catalog** - Manage available services with pricing
- **Service Logging** - Track completed services with tips and client info
- **Payroll Reports** - Generate employee summaries and pay calculations
- **Admin Controls** - Secure endpoints for management functions
- **Historical Pricing** - Track price changes over time
- 🆕 **React Frontend** - Modern web interface for employees and admins
- 🆕 **Employee PIN Login** - Quick access for service logging
- 🆕 **Admin Dashboard** - Complete management interface
- 🆕 **Real-time Service Logging** - Intuitive form with commission preview

## 🛠️ Tech Stack

### Backend:
- FastAPI (Python)
- SQLite with SQLAlchemy ORM
- JWT tokens + PIN verification
- Alembic migrations
- Pydantic schemas

### 🆕 Frontend:

- React 18 with TypeScript
- React Router for navigation
- Fetch API for backend communication
- Modern CSS-in-JS styling
- Responsive design


## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/AAlejandro8/Salon-pay-tracker.git
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

Frontend

6 **Navigate to frontend**
```bash
cd frontend
```
7 **Install dependencies**
```bash
npm install
```
8 **Start development server**
```bash
npm run dev
```

9 **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🌐 Frontend Routes
- `/` - Employee PIN login
- `/service-log` - Service logging interface
- `/admin/login` - Admin authentication
- `/admin/dashboard`- Admin management panel


## 📚 API Endpoints

### Authentication
- `POST /auth/login` - Admin login (returns JWT token)
- `POST /auth` - Create admin account

### Employees
- `GET /employees` - List all employees
- `POST /employees` - Create employee (admin only)
- `POST /employees/validate-pin` - 🆕 Validate employee PIN
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
Project-Nemo/
├── app/                 # Backend FastAPI application
│   ├── main.py         # FastAPI application
│   ├── models/         # SQLAlchemy models
│   ├── routers/        # API route handlers
│   ├── schemas.py      # Pydantic schemas
│   ├── db/             # Database configuration
│   └── utils/          # Helper functions
├── frontend/           # 🆕 React frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── types/      # TypeScript definitions
│   │   ├── api/        # API integration
│   │   └── App.tsx     # Main application
│   ├── package.json
│   └── vite.config.ts
└── requirements.txt
```

## 🆕 Frontend Features
- PIN Authentication - Secure employee login with 5-digit PINs
- Service Logging Form - Auto-populated pricing with manual override
- Commission Calculator - Real-time preview of employee earnings
- Admin Dashboard - Complete CRUD operations for employees and services
- Responsive Design - Works on desktop and mobile devices
- Type Safety - Full TypeScript implementation

## 🌍 Deployment
Backend: Currently deployed on Railway at https://salon-pay-tracker-production.up.railway.app

Frontend: Ready for deployment to Vercel, Netlify, or similar platforms

Built with ❤️ 

## 🆕 Development Notes
- Backend serves API on port 8000
- Frontend dev server on port 5173
- CORS configured for local development
- JWT tokens stored in localStorage
- Real-time form validation and error handling
