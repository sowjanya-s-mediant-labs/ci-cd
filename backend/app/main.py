from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import Base, engine, get_db
from . import models, schemas, crud

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ Enable CORS for Dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # relax for dev
    allow_credentials=True,
    allow_methods=["*"],   # includes OPTIONS automatically
    allow_headers=["*"],
)

@app.get("/people")
def read_people(db: Session = Depends(get_db)):
    return crud.get_people(db)

@app.post("/people")
def create_person(person: schemas.PersonCreate, db: Session = Depends(get_db)):
    return crud.create_person(db, person)

@app.put("/people/{person_id}")
def update_person(person_id: int, person: schemas.PersonCreate, db: Session = Depends(get_db)):
    return crud.update_person(db, person_id, person)

@app.delete("/people/{person_id}")
def delete_person(person_id: int, db: Session = Depends(get_db)):
    return crud.delete_person(db, person_id)
