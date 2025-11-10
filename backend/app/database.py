import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

SQLALCHEMY_DATABASE_URL = "sqlite:///./data/people.db"

# Ensure SQLite directory exists when running locally or in Docker
os.makedirs("data", exist_ok=True)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# ✅ Add this function (this is what main.py needs)
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
