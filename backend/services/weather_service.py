import os
import httpx
from typing import Dict, Any

# Mock weather & sea-state repository representing IMD (India Meteorological Dept)
# and INCOIS (Indian National Centre for Ocean Information Services) real-world data models.
DISTRICT_WEATHER_MOCK: Dict[str, Dict[str, Any]] = {
    "nashik": {
        "location": "Nashik, Maharashtra",
        "temperature": 27.5,
        "humidity": 78,
        "rainfall_probability": 35,
        "wind_speed_kmh": 14,
        "condition": "Partly Cloudy",
        "icon": "cloud-sun",
        "safety_level": "green",  # green, yellow, red
        "safety_title": "Normal Agricultural Conditions",
        "safety_message": "Favorable weather for irrigation and fertilizer application today.",
        "recommendations": [
            "Good day for light drip irrigation for tomato and onion crops.",
            "Apply neem oil spray in evening if aphid activity is noticed.",
            "Soil moisture level is optimal; harvest mature vegetables before expected weekend rain."
        ]
    },
    "ratnagiri": {
        "location": "Ratnagiri Coast, Maharashtra",
        "temperature": 30.2,
        "humidity": 88,
        "rainfall_probability": 85,
        "wind_speed_kmh": 38,
        "wave_height_meters": 3.4,
        "sea_state": "Rough / High Swell",
        "condition": "Thunderstorms & High Waves",
        "icon": "cloud-lightning",
        "safety_level": "red",
        "safety_title": "CRITICAL SEA SAFETY WARNING - DO NOT VENTURE",
        "safety_message": "INCOIS Bulletin: High wave warning (3.4m) and gale force squalls up to 45 km/h expected along South Maharashtra coast.",
        "recommendations": [
            "FISHERMEN WARNING: Do not venture into sea for the next 24 hours.",
            "Anchor small boats and motorized craft securely at coastal landing centres.",
            "Check GPS transponders and emergency distress alerts on vessel."
        ]
    },
    "mumbai": {
        "location": "Mumbai Coastal Zone",
        "temperature": 29.8,
        "humidity": 82,
        "rainfall_probability": 40,
        "wind_speed_kmh": 22,
        "wave_height_meters": 1.8,
        "sea_state": "Moderate Sea",
        "condition": "Breezy & humid",
        "icon": "wind",
        "safety_level": "yellow",
        "safety_title": "Moderate Sea Advisory",
        "safety_message": "Moderate swells (1.8m). Caution advised for small non-motorized fishing craft during high tide.",
        "recommendations": [
            "Deep-sea motorized trawlers may operate with caution within 15 nautical miles.",
            "Ensure life jackets and satellite transponders are operational.",
            "Sell morning catch early at Sassoon Dock for maximum market return."
        ]
    },
    "pune": {
        "location": "Pune Rural, Maharashtra",
        "temperature": 26.0,
        "humidity": 65,
        "rainfall_probability": 15,
        "wind_speed_kmh": 10,
        "condition": "Sunny",
        "icon": "sun",
        "safety_level": "green",
        "safety_title": "Clear & Sunny",
        "safety_message": "Ideal harvesting and crop spraying conditions.",
        "recommendations": [
            "Ideal day for solar crop drying and threshing.",
            "Inspect sugarcane fields for early shoot borer attacks.",
            "Check soil moisture before scheduled canal watering."
        ]
    }
}

async def get_weather_data(district: str = "Nashik", role: str = "farmer") -> Dict[str, Any]:
    """
    Fetches real OpenWeather API data if OPENWEATHER_API_KEY is present,
    else returns realistic IMD / INCOIS shaped mock advisory data.
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")
    key_clean = district.strip().lower()

    if api_key:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"https://api.openweathermap.org/data/2.5/weather?q={district},IN&appid={api_key}&units=metric",
                    timeout=4.0
                )
                if resp.status_code == 200:
                    data = resp.json()
                    temp = data["main"]["temp"]
                    humidity = data["main"]["humidity"]
                    wind = round(data["wind"]["speed"] * 3.6, 1)
                    weather_desc = data["weather"][0]["description"].title()
                    
                    safety_level = "green"
                    if wind > 35 or temp > 40:
                        safety_level = "red"
                    elif wind > 20 or temp > 35:
                        safety_level = "yellow"

                    return {
                        "location": f"{data['name']}, India",
                        "temperature": temp,
                        "humidity": humidity,
                        "rainfall_probability": 40 if "rain" in weather_desc.lower() else 10,
                        "wind_speed_kmh": wind,
                        "condition": weather_desc,
                        "icon": "cloud-sun",
                        "safety_level": safety_level,
                        "safety_title": f"Live Weather Update: {weather_desc}",
                        "safety_message": f"Temperature {temp}°C, Wind {wind} km/h.",
                        "recommendations": [
                            f"Current temp is {temp}°C with {humidity}% humidity.",
                            "Adjust irrigation based on local field moisture.",
                            "Monitor IMD local bulletins for unexpected weather shifts."
                        ],
                        "source": "Live OpenWeatherMap API"
                    }
        except Exception as e:
            pass  # Fall back to mock

    # Default fallback to mock database
    base = DISTRICT_WEATHER_MOCK.get(key_clean)
    if not base:
        # Default fallback for unknown districts
        if role == "fisherman":
            base = DISTRICT_WEATHER_MOCK["mumbai"]
        else:
            base = DISTRICT_WEATHER_MOCK["nashik"]
            base["location"] = f"{district.title()}, India"

    base["source"] = "IMD & INCOIS Advisory Bulletin (Seeded Mock Data)"
    return base
