from fastapi import FastAPI
from db.database import engine, Base
from routers import employee_routers, auth_routers, service_routers, service_log_routers

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(
                   employee_routers.router,
                   prefix="/employees",
                   tags=['employees']
                   )

app.include_router(
                    auth_routers.router,
                    prefix="/auth",
                    tags=['auth']
)
app.include_router(
                    service_routers.router,
                    prefix="/services",
                    tags=['services']
)
app.include_router(
                    service_log_routers.router,
                    prefix="/service_log",
                    tags=['service_log']
)

@app.get("/")
def read_root():
    return {"Hello": "yo"}






