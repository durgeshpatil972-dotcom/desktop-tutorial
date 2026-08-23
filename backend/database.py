import os
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

# Serverless environment handling (Vercel / AWS Lambda / Read-Only Filesystems)
if os.getenv("VERCEL"):
    DB_PATH = "/tmp/kisansagar.db"
else:
    DB_PATH = os.path.join(os.path.dirname(__file__), "kisansagar.db")

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Structured for easy migration to PostgreSQL in production:
# Replace SQLALCHEMY_DATABASE_URL with os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/kisansagar")
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), unique=True, index=True, default="default_user")
    role = Column(String(20), default="farmer") # 'farmer' or 'fisherman'
    language = Column(String(10), default="hi")  # 'en', 'hi', 'mr'
    name = Column(String(100), default="Kisan Sathi")
    district = Column(String(100), default="Nashik")
    state = Column(String(100), default="Maharashtra")
    primary_crop = Column(String(100), default="Tomato")
    boat_type = Column(String(100), default="Motorized Boat")
    port = Column(String(100), default="Mumbai Central Port")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
