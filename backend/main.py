import os
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from database import init_db, get_db, UserProfile
from services.weather_service import get_weather_data
from services.disease_service import classify_crop_disease
from services.pfz_service import get_pfz_advisories
from services.market_service import get_market_prices
from services.scheme_service import ask_scheme_assistant

app = FastAPI(
    title="KisanSagar AI Backend",
    description="SIH 2026 Problem Statement 5 - Inclusive AI Platform for Farmers & Coastal Fishermen",
    version="1.0.0"
)

# Enable CORS for local dev and mobile web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite database schema on startup
@app.on_event("startup")
def startup_event():
    init_db()

class ProfileRequest(BaseModel):
    user_id: Optional[str] = "default_user"
    role: str  # 'farmer' or 'fisherman'
    language: str  # 'en', 'hi', 'mr'
    name: Optional[str] = "Kisan Sathi"
    district: Optional[str] = "Nashik"
    state: Optional[str] = "Maharashtra"
    primary_crop: Optional[str] = "Tomato"
    boat_type: Optional[str] = "Motorized Boat"
    port: Optional[str] = "Mumbai Central Port"

class SchemeQueryRequest(BaseModel):
    query: str
    language: Optional[str] = "hi"
    role: Optional[str] = "farmer"

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "app": "KisanSagar AI",
        "version": "1.0.0",
        "sih_problem_statement": "PS-05 AI for Public Good"
    }

@app.get("/api/profile")
def get_user_profile(user_id: str = "default_user", db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        # Default profile fallback
        return {
            "user_id": "default_user",
            "role": "farmer",
            "language": "hi",
            "name": "रामराव पाटील (Ramrao Patil)",
            "district": "Nashik",
            "state": "Maharashtra",
            "primary_crop": "Tomato",
            "boat_type": "Motorized Craft (30ft)",
            "port": "Mumbai Sassoon Dock"
        }
    return profile

@app.post("/api/profile")
def save_user_profile(req: ProfileRequest, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == req.user_id).first()
    if not profile:
        profile = UserProfile(user_id=req.user_id)
        db.add(profile)

    profile.role = req.role
    profile.language = req.language
    profile.name = req.name
    profile.district = req.district
    profile.state = req.state
    profile.primary_crop = req.primary_crop
    profile.boat_type = req.boat_type
    profile.port = req.port
    db.commit()
    db.refresh(profile)
    return {"status": "success", "profile": profile}

@app.get("/api/weather")
async def fetch_weather(district: str = Query("Nashik"), role: str = Query("farmer")):
    data = await get_weather_data(district=district, role=role)
    return data

@app.post("/api/crop-disease/detect")
async def detect_crop_disease(
    file: UploadFile = File(...),
    crop: Optional[str] = Form("Tomato")
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    contents = await file.read()
    result = classify_crop_disease(image_bytes=contents, crop_hint=crop)
    return result

@app.get("/api/pfz")
def fetch_pfz_advisories(port: str = Query("mumbai")):
    data = get_pfz_advisories(port=port)
    return data

@app.get("/api/market-prices")
def fetch_market_prices(
    commodity: Optional[str] = Query(None),
    category: Optional[str] = Query(None)
):
    data = get_market_prices(commodity_filter=commodity, category_filter=category)
    return data

@app.post("/api/scheme-assistant/chat")
async def chat_scheme_assistant(req: SchemeQueryRequest):
    result = await ask_scheme_assistant(query=req.query, lang=req.language, user_role=req.role)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
