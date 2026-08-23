# KisanSagar AI — Smart India Hackathon (SIH) 2026

**Problem Statement 5**: AI for Public Good — Theme: Inclusive AI, Social Impact and Empowerment of Underserved Communities  
**Working Title**: KisanSagar AI (Kisan = Farmer, Sagar = Sea)  
**Target Beneficiaries**: Smallholder Farmers (1–3 acres) & Coastal Fishermen across India  

---

## 📌 Problem Overview
India's small & marginal farmers and coastal fishermen make critical daily decisions — when to irrigate, how to treat crop blights, whether it's safe to venture out to sea, and where to sell produce/catch — under extreme information asymmetry. Existing agri-tech and marine apps are predominantly English-first, data-heavy, and assume steady 4G/5G connectivity, excluding rural users who need aid most.

---

## 💡 Solution Overview
**KisanSagar AI** is a mobile-first, multi-lingual, voice-enabled AI platform unifying agricultural advisories, ocean safety, crop disease diagnosis, market intelligence, and welfare scheme discovery in regional Indian languages (**English, Hindi, Marathi**).

### Key Features
1. **Persona Onboarding**: Quick toggle between **Farmer** and **Fisherman** profiles with automatic district and crop/boat customization.
2. **Dynamic Home Dashboard**: Real-time weather/sea-state metrics, wave height alerts, color-coded (Green/Yellow/Red) severity banners, and voice audio readouts for low-literacy users.
3. **AI Crop Disease Diagnoser**: Upload or snap a leaf photo → Instant AI model classification (MobileNetV2 / PlantVillage taxonomy) with confidence score, severity, organic remedies, and chemical spray dosages.
4. **INCOIS Fishing Zone Advisor**: Satellite ocean advisory displaying Potential Fishing Zones (PFZ), GPS coordinates, depth, sea surface temperature, chlorophyll levels, species probability, and swell safety advisories.
5. **e-NAM Live Mandi & Fish Prices**: Wholesale price listings from registered APMC mandis and fish landing harbors with modal price averages and trend indicators.
6. **Grounded Welfare Scheme AI Assistant**: Voice-enabled chat assistant grounded strictly in a curated welfare knowledge base (`PM-KISAN`, `PMFBY`, `KCC`, `PMMSY`). Responds in the user's chosen language without hallucinating.
7. **Feature Phone SMS Alert Simulation**: Demonstrates emergency SMS push delivery to non-smart feature phone users in zero-internet zones.
8. **PWA Offline Resilience**: Integrated Service Worker caches essential advisories for offline viewing when network connectivity drops.

---

## 🏗️ Architecture Overview

```
+-----------------------------------------------------------------------+
|                         KisanSagar AI Frontend                        |
|   React + Vite + Tailwind CSS + Lucide Icons + Web Speech API (PWA)   |
|   Languages: English (en) | Hindi (hi) | Marathi (mr)                  |
+-----------------------------------------------------------------------+
                                   | REST API / JSON
                                   v
+-----------------------------------------------------------------------+
|                         FastAPI Backend (Python)                      |
|                                                                       |
|  +---------------------+  +--------------------+  +-----------------+  |
|  | Weather & Sea State |  | Leaf Disease AI    |  | e-NAM Mandi API |  |
|  | (OpenWeather/IMD/   |  | (MobileNetV2/ONNX  |  | (Seeded Prices) |  |
|  |  INCOIS Mock PFZ)   |  |  PlantVillage ML)  |  |                 |  |
|  +---------------------+  +--------------------+  +-----------------+  |
|  +------------------------------------------------------------------+  |
|  | Scheme Assistant (Grounded RAG Engine / LLM + Knowledge Base)  |  |
|  +------------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                      SQLite Database (SQLAlchemy)                     |
|            User Profiles, Offline Cache, Saved Advisories             |
+-----------------------------------------------------------------------+
```

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Web Speech API (Speech Recognition & Speech Synthesis), Service Worker (PWA)
- **Backend**: Python 3.13+, FastAPI, Uvicorn, SQLAlchemy, Pydantic, Pillow, PyTorch/ONNX
- **Database**: SQLite (SQLAlchemy ORM — configured for Postgres migration via `DATABASE_URL`)
- **i18n**: Lightweight React Context with JSON dictionaries (`en.json`, `hi.json`, `mr.json`)

---

## 🏆 SIH 2026 Judging Criteria Mapping

| Judging Criterion | How KisanSagar AI Meets Criterion |
| :--- | :--- |
| **1. Innovation** | Unifies two distinct, vulnerable coastal & rural communities (Farmers & Fishermen) into a single adaptive AI interface with multimodal voice readouts and offline PWA capability. |
| **2. Feasibility** | Single-command launch, lightweight FastAPI backend, zero-latency local fallback models, and seamless offline caching ensure 100% demoability without external API dependencies. |
| **3. Social Impact** | Directly empowers low-literacy users in their native language (Hindi, Marathi, English) with actionable daily safety guidance, crop remedies, fair market prices, and welfare scheme access. |
| **4. Scalability** | Decoupled REST API + SQLite database can be migrated to PostgreSQL and deployed on cloud infrastructure (AWS/GCP/Azure) with Kubernetes horizontal pod autoscaling. |

---

## 🔍 Real Data Sources vs. Production Roadmap (Mock Analysis)

| Component | Prototype Implementation | Production Data Source |
| :--- | :--- | :--- |
| **Weather & Waves** | OpenWeatherMap API fallback to IMD/INCOIS advisory shape | IMD (India Meteorological Dept) & INCOIS Marine API |
| **Potential Fishing Zones** | Satellite Ocean PFZ advisory schema | INCOIS RSS & Satellite Chlorophyll Data Feed |
| **Crop Disease AI** | MobileNetV2 fine-tuned PlantVillage taxonomy | Edge-deployed PyTorch / ONNX model trained on local ICAR dataset |
| **Market Prices** | e-NAM APMC mandi & fish harbour price dataset | Agmarknet & e-NAM (National Agriculture Market) API |
| **Scheme Assistant** | Grounded RAG engine over curated schemes JSON | Enterprise RAG pipeline connected to MyScheme.gov.in database |

---

## ⚡ Quickstart & Setup Guide

### Option 1: Single-Command Launch (Recommended for Judges)
Simply run the root Python launcher:
```bash
python start_app.py
```
*Or double-click `run.bat` on Windows.*

### Option 2: Manual Step-by-Step Setup

#### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*API Swagger Documentation will be live at: http://localhost:8000/docs*

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend Web Application will be live at: http://localhost:5173*
