from sqlalchemy.orm import Session
from . import models, schemas

def get_people(db: Session):
    return db.query(models.Person).all()

def get_person(db: Session, person_id: int):
    return db.query(models.Person).filter(models.Person.id == person_id).first()

def create_person(db: Session, person: schemas.PersonCreate):
    db_person = models.Person(name=person.name, age=person.age)
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person

def update_person(db: Session, person_id: int, updated: schemas.PersonCreate):
    person = get_person(db, person_id)
    if not person:
        return None
    person.name = updated.name
    person.age = updated.age
    db.commit()
    db.refresh(person)
    return person

def delete_person(db: Session, person_id: int):
    person = get_person(db, person_id)
    if not person:
        return False
    db.delete(person)
    db.commit()
    return True
