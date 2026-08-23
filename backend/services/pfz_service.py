from typing import List, Dict, Any

# Mock INCOIS Potential Fishing Zone (PFZ) database modeled on actual INCOIS ocean satellite advisories
PFZ_DATA: Dict[str, List[Dict[str, Any]]] = {
    "mumbai": [
        {
            "zone_id": "PFZ-MH-01",
            "sector": "North Maharashtra Coast",
            "landing_centre": "Sassoon Dock / Versova",
            "location_name": "Off Alibaug Bank (Zone Alpha)",
            "latitude": "18.82° N",
            "longitude": "72.45° E",
            "distance_nm": 14.5,
            "bearing_direction": "SW (225°)",
            "depth_meters": 28,
            "sea_surface_temp_c": 28.4,
            "chlorophyll_mg_m3": 2.1,
            "expected_species": "Indian Mackerel, Ribbonfish, Pomfret",
            "catch_likelihood": "High (85%)",
            "safety_rating": "yellow",
            "safety_note": "Moderate wind (18 knots). Safe for 30ft+ motorized trawlers."
        },
        {
            "zone_id": "PFZ-MH-02",
            "sector": "Central Konkan Ridge",
            "landing_centre": "Bhaucha Dhakka (Ferry Wharf)",
            "location_name": "Kashid Offshore Channel",
            "latitude": "18.45° N",
            "longitude": "72.30° E",
            "distance_nm": 22.0,
            "bearing_direction": "WSW (240°)",
            "depth_meters": 42,
            "sea_surface_temp_c": 27.9,
            "chlorophyll_mg_m3": 3.4,
            "expected_species": "Oil Sardine, Kingfish (Surmai), Prawns",
            "catch_likelihood": "Very High (92%)",
            "safety_rating": "green",
            "safety_note": "Ideal sea conditions. Wave height < 1.2m."
        }
    ],
    "ratnagiri": [
        {
            "zone_id": "PFZ-MH-03",
            "sector": "South Maharashtra Coast",
            "landing_centre": "Mirkarwada Fishing Harbour",
            "location_name": "Jaigad Bank Zone",
            "latitude": "17.30° N",
            "longitude": "72.80° E",
            "distance_nm": 11.2,
            "bearing_direction": "W (270°)",
            "depth_meters": 35,
            "sea_surface_temp_c": 29.1,
            "chlorophyll_mg_m3": 2.8,
            "expected_species": "Tuna, Mackeral, Squids",
            "catch_likelihood": "High (80%)",
            "safety_rating": "red",
            "safety_note": "SWELL WARNING: High waves (3.4m). INCOIS Red Alert active."
        }
    ]
}

def get_pfz_advisories(port: str = "mumbai") -> Dict[str, Any]:
    """
    Returns INCOIS Potential Fishing Zone advisories.
    REAL DATA INTEGRATION NOTE:
    In production, this integrates with INCOIS API / RSS feed:
    https://incois.gov.in/portal/pfz.jsp
    """
    key = port.strip().lower()
    zones = PFZ_DATA.get(key, PFZ_DATA["mumbai"])
    
    return {
        "agency": "INCOIS (Indian National Centre for Ocean Information Services)",
        "bulletin_id": "INCOIS-PFZ-2026-0823",
        "valid_until": "Today, 23:59 IST",
        "total_zones_active": len(zones),
        "zones": zones,
        "note": "PFZ advisories are generated using Oceansat-2 & Modis Aqua satellite Chlorophyll & SST data."
    }
