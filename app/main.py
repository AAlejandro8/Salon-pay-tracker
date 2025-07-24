from fastapi import FastAPI
from db.database import engine, Base
from routers import employee_routers, haircut_routers, auth_routers, service_routers

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(
                   employee_routers.router,
                   prefix="/employees",
                   tags=['employees']
                   )

app.include_router(
                   haircut_routers.router, 
                   prefix="/haircuts",
                   tags=['haircuts']
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

@app.get("/")
def read_root():
    return {"Hello": "yo"}






