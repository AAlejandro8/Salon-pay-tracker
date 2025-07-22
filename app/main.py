from fastapi import FastAPI
from db.database import engine, Base
from routers import employee_routers, haircut_routers

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

@app.get("/")
def read_root():
    return {"Hello": "yo"}






