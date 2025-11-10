from pydantic import BaseModel

class PersonBase(BaseModel):
    name: str
    age: int

class PersonCreate(PersonBase):
    pass

class PersonResponse(PersonBase):
    id: int

    class Config:
        orm_mode = True
