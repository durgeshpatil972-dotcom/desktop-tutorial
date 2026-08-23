from typing import List, Dict, Any

# Seeded e-NAM (National Agriculture Market) Mandi & Fish Harbor Price Dataset
MARKET_DATA: List[Dict[str, Any]] = [
    {
        "id": "m1",
        "commodity": "Tomato",
        "category": "Crop",
        "variety": "Hybrid Red",
        "mandi": "Nashik APMC Mandi",
        "district": "Nashik",
        "state": "Maharashtra",
        "unit": "₹ / Quintal (100 kg)",
        "min_price": 2200,
        "max_price": 2850,
        "modal_price": 2600,
        "price_change": "+ ₹150",
        "trend": "up",
        "date": "Today"
    },
    {
        "id": "m2",
        "commodity": "Onion",
        "category": "Crop",
        "variety": "Red Nashik",
        "mandi": "Lasalgaon APMC (Largest Onion Market)",
        "district": "Nashik",
        "state": "Maharashtra",
        "unit": "₹ / Quintal (100 kg)",
        "min_price": 1800,
        "max_price": 2400,
        "modal_price": 2150,
        "price_change": "- ₹50",
        "trend": "down",
        "date": "Today"
    },
    {
        "id": "m3",
        "commodity": "Potato",
        "category": "Crop",
        "variety": "Jyoti / Kufri",
        "mandi": "Pune APMC Market",
        "district": "Pune",
        "state": "Maharashtra",
        "unit": "₹ / Quintal (100 kg)",
        "min_price": 1500,
        "max_price": 1950,
        "modal_price": 1750,
        "price_change": "Stable",
        "trend": "stable",
        "date": "Today"
    },
    {
        "id": "m4",
        "commodity": "Indian Mackerel (Bangda)",
        "category": "Fish",
        "variety": "Fresh Marine Catch",
        "mandi": "Sassoon Dock Fish Harbour",
        "district": "Mumbai",
        "state": "Maharashtra",
        "unit": "₹ / Kg",
        "min_price": 180,
        "max_price": 240,
        "modal_price": 220,
        "price_change": "+ ₹20",
        "trend": "up",
        "date": "Today"
    },
    {
        "id": "m5",
        "commodity": "Pomfret (White)",
        "category": "Fish",
        "variety": "Grade A Export Quality",
        "mandi": "Versova Fish Market",
        "district": "Mumbai",
        "state": "Maharashtra",
        "unit": "₹ / Kg",
        "min_price": 750,
        "max_price": 950,
        "modal_price": 850,
        "price_change": "+ ₹50",
        "trend": "up",
        "date": "Today"
    },
    {
        "id": "m6",
        "commodity": "Kingfish (Surmai)",
        "category": "Fish",
        "variety": "Large Catch",
        "mandi": "Mirkarwada Dock Market",
        "district": "Ratnagiri",
        "state": "Maharashtra",
        "unit": "₹ / Kg",
        "min_price": 550,
        "max_price": 700,
        "modal_price": 620,
        "price_change": "- ₹30",
        "trend": "down",
        "date": "Today"
    },
    {
        "id": "m7",
        "commodity": "Soyabean",
        "category": "Crop",
        "variety": "Yellow",
        "mandi": "Latur APMC Mandi",
        "district": "Latur",
        "state": "Maharashtra",
        "unit": "₹ / Quintal (100 kg)",
        "min_price": 4200,
        "max_price": 4750,
        "modal_price": 4500,
        "price_change": "+ ₹80",
        "trend": "up",
        "date": "Today"
    }
]

def get_market_prices(commodity_filter: str = None, category_filter: str = None) -> Dict[str, Any]:
    """
    Returns e-NAM live Mandi price listings.
    PRODUCTION INTEGRATION NOTE:
    In production, this queries Agmarknet / e-NAM API:
    https://enam.gov.in/web/dashboard/trade-data
    """
    results = MARKET_DATA
    if category_filter:
        results = [item for item in results if item["category"].lower() == category_filter.lower()]
    if commodity_filter and commodity_filter.strip():
        q = commodity_filter.strip().lower()
        results = [item for item in results if q in item["commodity"].lower() or q in item["variety"].lower()]

    return {
        "portal": "e-NAM (National Agriculture Market) Live Feed",
        "total_records": len(results),
        "listings": results
    }
