"""
GOALGUARD BACKEND
=================

FastAPI backend for:
- Natural-language goal monitoring
- Goal-drift detection
- Constraint violation detection
- Autonomous correction / re-planning
- India-wide hotel recommendations

Frontend:
    http://localhost:5173

Backend:
    http://127.0.0.1:8000

Swagger:
    http://127.0.0.1:8000/docs
"""

from typing import List, Optional
from urllib.parse import quote_plus

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="GoalGuard API",
    description="Autonomous Goal-Drift Detection and Correction API",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# DATA MODELS
# =========================================================

class DriftRequest(BaseModel):
    original_goal: str
    agent_action: str


class HotelRecommendation(BaseModel):
    name: str
    location: str
    price_per_night: float
    nights: int
    total_stay: float
    within_budget: bool
    image_url: str
    hotel_url: str
    description: str


class DriftResponse(BaseModel):
    drift_detected: bool
    drift_score: float
    severity: str
    violations: List[str]
    explanation: str
    recommended_action: str
    hotel_recommendations: List[HotelRecommendation]


# =========================================================
# INDIA-WIDE DESTINATION DATA
# =========================================================

INDIA_DESTINATIONS = {
    # -----------------------------------------------------
    # STATES
    # -----------------------------------------------------

    "andhra pradesh": "Andhra Pradesh",
    "arunachal pradesh": "Arunachal Pradesh",
    "assam": "Assam",
    "bihar": "Bihar",
    "chhattisgarh": "Chhattisgarh",
    "goa": "Goa",
    "gujarat": "Gujarat",
    "haryana": "Haryana",
    "himachal pradesh": "Himachal Pradesh",
    "jharkhand": "Jharkhand",
    "karnataka": "Karnataka",
    "kerala": "Kerala",
    "madhya pradesh": "Madhya Pradesh",
    "maharashtra": "Maharashtra",
    "manipur": "Manipur",
    "meghalaya": "Meghalaya",
    "mizoram": "Mizoram",
    "nagaland": "Nagaland",
    "odisha": "Odisha",
    "punjab": "Punjab",
    "rajasthan": "Rajasthan",
    "sikkim": "Sikkim",
    "tamil nadu": "Tamil Nadu",
    "telangana": "Telangana",
    "tripura": "Tripura",
    "uttar pradesh": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand",
    "west bengal": "West Bengal",

    # -----------------------------------------------------
    # UNION TERRITORIES
    # -----------------------------------------------------

    "andaman and nicobar islands": "Andaman and Nicobar Islands",
    "andaman and nicobar": "Andaman and Nicobar Islands",
    "andaman": "Andaman and Nicobar Islands",

    "chandigarh": "Chandigarh",

    "dadra and nagar haveli and daman and diu":
        "Dadra and Nagar Haveli and Daman and Diu",

    "dadra and nagar haveli":
        "Dadra and Nagar Haveli and Daman and Diu",

    "daman and diu":
        "Dadra and Nagar Haveli and Daman and Diu",

    "daman":
        "Dadra and Nagar Haveli and Daman and Diu",

    "diu":
        "Dadra and Nagar Haveli and Daman and Diu",

    "delhi": "Delhi",
    "new delhi": "Delhi",
    "national capital territory of delhi": "Delhi",

    "jammu and kashmir": "Jammu and Kashmir",
    "jammu": "Jammu and Kashmir",
    "kashmir": "Jammu and Kashmir",

    "ladakh": "Ladakh",

    "lakshadweep": "Lakshadweep",

    "puducherry": "Puducherry",
    "pondicherry": "Puducherry",

    # -----------------------------------------------------
    # ANDHRA PRADESH
    # -----------------------------------------------------

    "visakhapatnam": "Visakhapatnam",
    "vizag": "Visakhapatnam",
    "vijayawada": "Vijayawada",
    "tirupati": "Tirupati",
    "amaravati": "Amaravati",
    "araku": "Araku Valley",

    # -----------------------------------------------------
    # ARUNACHAL PRADESH
    # -----------------------------------------------------

    "itanagar": "Itanagar",
    "tawang": "Tawang",
    "bomdila": "Bomdila",
    "ziro": "Ziro",

    # -----------------------------------------------------
    # ASSAM
    # -----------------------------------------------------

    "guwahati": "Guwahati",
    "kaziranga": "Kaziranga",
    "kaziranga national park": "Kaziranga",
    "jorhat": "Jorhat",
    "dibrugarh": "Dibrugarh",
    "majuli": "Majuli",

    # -----------------------------------------------------
    # BIHAR
    # -----------------------------------------------------

    "patna": "Patna",
    "bodh gaya": "Bodh Gaya",
    "bodhgaya": "Bodh Gaya",
    "gaya": "Gaya",
    "nalanda": "Nalanda",
    "rajgir": "Rajgir",

    # -----------------------------------------------------
    # CHHATTISGARH
    # -----------------------------------------------------

    "raipur": "Raipur",
    "bilaspur": "Bilaspur",
    "jagdalpur": "Jagdalpur",

    # -----------------------------------------------------
    # GOA
    # -----------------------------------------------------

    "panaji": "Panaji",
    "panjim": "Panaji",
    "calangute": "Calangute",
    "candolim": "Candolim",
    "baga": "Baga",
    "anjuna": "Anjuna",
    "vagator": "Vagator",
    "margao": "Margao",
    "palolem": "Palolem",
    "goa": "Goa",

    # -----------------------------------------------------
    # GUJARAT
    # -----------------------------------------------------

    "ahmedabad": "Ahmedabad",
    "surat": "Surat",
    "vadodara": "Vadodara",
    "baroda": "Vadodara",
    "rajkot": "Rajkot",
    "gandhinagar": "Gandhinagar",
    "kutch": "Kutch",
    "rann of kutch": "Rann of Kutch",
    "dwarka": "Dwarka",
    "somnath": "Somnath",

    # -----------------------------------------------------
    # HARYANA
    # -----------------------------------------------------

    "gurgaon": "Gurugram",
    "gurugram": "Gurugram",
    "faridabad": "Faridabad",
    "panipat": "Panipat",
    "kurukshetra": "Kurukshetra",

    # -----------------------------------------------------
    # HIMACHAL PRADESH
    # -----------------------------------------------------

    "shimla": "Shimla",
    "manali": "Manali",
    "dharamshala": "Dharamshala",
    "dharamsala": "Dharamshala",
    "kasol": "Kasol",
    "kullu": "Kullu",
    "spiti": "Spiti Valley",
    "spiti valley": "Spiti Valley",
    "dalhousie": "Dalhousie",
    "kasauli": "Kasauli",

    # -----------------------------------------------------
    # JHARKHAND
    # -----------------------------------------------------

    "ranchi": "Ranchi",
    "jamshedpur": "Jamshedpur",
    "deoghar": "Deoghar",
    "dhanbad": "Dhanbad",

    # -----------------------------------------------------
    # KARNATAKA
    # -----------------------------------------------------

    "bengaluru": "Bengaluru",
    "bangalore": "Bengaluru",
    "mysore": "Mysuru",
    "mysuru": "Mysuru",
    "coorg": "Coorg",
    "kodagu": "Kodagu",
    "hampi": "Hampi",
    "mangalore": "Mangaluru",
    "mangaluru": "Mangaluru",
    "udupi": "Udupi",
    "gokarna": "Gokarna",
    "chikmagalur": "Chikmagalur",
    "chikkamagaluru": "Chikmagalur",
    "hubli": "Hubballi",
    "hubballi": "Hubballi",
    "belgaum": "Belagavi",
    "belagavi": "Belagavi",

    # -----------------------------------------------------
    # KERALA
    # -----------------------------------------------------

    "kochi": "Kochi",
    "cochin": "Kochi",
    "munnar": "Munnar",
    "alleppey": "Alappuzha",
    "alappuzha": "Alappuzha",
    "kovalam": "Kovalam",
    "wayanad": "Wayanad",
    "thiruvananthapuram": "Thiruvananthapuram",
    "trivandrum": "Thiruvananthapuram",
    "kollam": "Kollam",
    "kumarakom": "Kumarakom",
    "varkala": "Varkala",
    "bekal": "Bekal",

    # -----------------------------------------------------
    # MADHYA PRADESH
    # -----------------------------------------------------

    "bhopal": "Bhopal",
    "indore": "Indore",
    "ujjain": "Ujjain",
    "khajuraho": "Khajuraho",
    "gwalior": "Gwalior",
    "jabalpur": "Jabalpur",
    "pachmarhi": "Pachmarhi",

    # -----------------------------------------------------
    # MAHARASHTRA
    # -----------------------------------------------------

    "mumbai": "Mumbai",
    "bombay": "Mumbai",
    "pune": "Pune",
    "lonavala": "Lonavala",
    "mahabaleshwar": "Mahabaleshwar",
    "nashik": "Nashik",
    "nagpur": "Nagpur",
    "aurangabad": "Aurangabad",
    "sambhajinagar": "Chhatrapati Sambhajinagar",
    "alibaug": "Alibaug",
    "kolhapur": "Kolhapur",
    "shirdi": "Shirdi",

    # -----------------------------------------------------
    # MANIPUR
    # -----------------------------------------------------

    "imphal": "Imphal",

    # -----------------------------------------------------
    # MEGHALAYA
    # -----------------------------------------------------

    "shillong": "Shillong",
    "cherrapunji": "Cherrapunji",
    "sohra": "Sohra",
    "mawlynnong": "Mawlynnong",

    # -----------------------------------------------------
    # MIZORAM
    # -----------------------------------------------------

    "aizawl": "Aizawl",

    # -----------------------------------------------------
    # NAGALAND
    # -----------------------------------------------------

    "kohima": "Kohima",
    "dimapur": "Dimapur",

    # -----------------------------------------------------
    # ODISHA
    # -----------------------------------------------------

    "bhubaneswar": "Bhubaneswar",
    "puri": "Puri",
    "konark": "Konark",
    "cuttack": "Cuttack",
    "rourkela": "Rourkela",

    # -----------------------------------------------------
    # PUNJAB
    # -----------------------------------------------------

    "amritsar": "Amritsar",
    "ludhiana": "Ludhiana",
    "jalandhar": "Jalandhar",
    "patiala": "Patiala",

    # -----------------------------------------------------
    # RAJASTHAN
    # -----------------------------------------------------

    "jaipur": "Jaipur",
    "udaipur": "Udaipur",
    "jodhpur": "Jodhpur",
    "jaisalmer": "Jaisalmer",
    "pushkar": "Pushkar",
    "mount abu": "Mount Abu",
    "bikaner": "Bikaner",
    "ajmer": "Ajmer",
    "ranthambore": "Ranthambore",

    # -----------------------------------------------------
    # SIKKIM
    # -----------------------------------------------------

    "gangtok": "Gangtok",
    "pelling": "Pelling",
    "lachung": "Lachung",

    # -----------------------------------------------------
    # TAMIL NADU
    # -----------------------------------------------------

    "chennai": "Chennai",
    "madras": "Chennai",
    "ooty": "Ooty",
    "coimbatore": "Coimbatore",
    "madurai": "Madurai",
    "kodaikanal": "Kodaikanal",
    "rameshwaram": "Rameshwaram",
    "rameswaram": "Rameshwaram",
    "pondicherry": "Puducherry",
    "kanyakumari": "Kanyakumari",
    "mahabalipuram": "Mahabalipuram",
    "mamallapuram": "Mahabalipuram",

    # -----------------------------------------------------
    # TELANGANA
    # -----------------------------------------------------

    "hyderabad": "Hyderabad",
    "secunderabad": "Secunderabad",
    "warangal": "Warangal",

    # -----------------------------------------------------
    # TRIPURA
    # -----------------------------------------------------

    "agartala": "Agartala",

    # -----------------------------------------------------
    # UTTAR PRADESH
    # -----------------------------------------------------

    "lucknow": "Lucknow",
    "agra": "Agra",
    "varanasi": "Varanasi",
    "benaras": "Varanasi",
    "ayodhya": "Ayodhya",
    "prayagraj": "Prayagraj",
    "allahabad": "Prayagraj",
    "mathura": "Mathura",
    "vrindavan": "Vrindavan",
    "kanpur": "Kanpur",
    "noida": "Noida",
    "meerut": "Meerut",
    "rishikesh": "Rishikesh",

    # -----------------------------------------------------
    # UTTARAKHAND
    # -----------------------------------------------------

    "dehradun": "Dehradun",
    "rishikesh": "Rishikesh",
    "haridwar": "Haridwar",
    "nainital": "Nainital",
    "mussoorie": "Mussoorie",
    "jim corbett": "Jim Corbett",
    "corbett": "Jim Corbett",
    "almora": "Almora",
    "ranikhet": "Ranikhet",
    "auli": "Auli",

    # -----------------------------------------------------
    # WEST BENGAL
    # -----------------------------------------------------

    "kolkata": "Kolkata",
    "calcutta": "Kolkata",
    "darjeeling": "Darjeeling",
    "kalimpong": "Kalimpong",
    "siliguri": "Siliguri",
    "digha": "Digha",
    "sundarbans": "Sundarbans",

    # -----------------------------------------------------
    # JAMMU & KASHMIR
    # -----------------------------------------------------

    "srinagar": "Srinagar",
    "gulmarg": "Gulmarg",
    "pahalgam": "Pahalgam",
    "sonamarg": "Sonamarg",

    # -----------------------------------------------------
    # LADAKH
    # -----------------------------------------------------

    "leh": "Leh",
    "nubra": "Nubra Valley",
    "nubra valley": "Nubra Valley",
    "pangong": "Pangong Lake",
    "pangong lake": "Pangong Lake",

    # -----------------------------------------------------
    # CHANDIGARH
    # -----------------------------------------------------

    "chandigarh": "Chandigarh",

    # -----------------------------------------------------
    # PUDUCHERRY
    # -----------------------------------------------------

    "puducherry": "Puducherry",

    # -----------------------------------------------------
    # ANDAMAN
    # -----------------------------------------------------

    "port blair": "Port Blair",
    "swaraj dweep": "Swaraj Dweep",
    "havelock": "Swaraj Dweep",

    # -----------------------------------------------------
    # LAKSHADWEEP
    # -----------------------------------------------------

    "lakshadweep": "Lakshadweep",
    "kavaratti": "Kavaratti",
}


# =========================================================
# DEMO HOTEL TEMPLATES
# =========================================================

HOTEL_TEMPLATES = [
    {
        "name": "City Comfort Hotel",
        "price": 2499,
        "description": (
            "A comfortable budget-friendly stay suitable for "
            "travelers who want to remain within the protected goal."
        ),
    },
    {
        "name": "Urban Stay Residency",
        "price": 2999,
        "description": (
            "A practical city accommodation option with a "
            "good balance between price and comfort."
        ),
    },
    {
        "name": "Premium Stay Inn",
        "price": 3999,
        "description": (
            "A higher-comfort accommodation option while "
            "remaining suitable for many travel budgets."
        ),
    },
    {
        "name": "Luxury Grand Resort",
        "price": 34500,
        "description": (
            "A deliberately expensive candidate used by the "
            "prototype to demonstrate goal drift."
        ),
    },
]


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def format_inr(value: float) -> str:
    """
    Format a number as Indian Rupees.
    """
    return f"₹{value:,.0f}"


def extract_location(text: str) -> str:
    """
    Detect an Indian state, union territory, city, or
    tourist destination from the user's goal/action.
    """

    safe_text = (text or "").lower().strip()

    if not safe_text:
        return "India"

    # Longest matches first so that:
    # "andaman and nicobar islands"
    # is checked before "andaman".
    locations = sorted(
        INDIA_DESTINATIONS.items(),
        key=lambda item: len(item[0]),
        reverse=True,
    )

    for key, value in locations:
        if key in safe_text:
            return value

    return "India"


def extract_budget(text: str) -> Optional[float]:
    """
    Extract budget from natural language.

    Supports examples such as:
        under ₹20,000
        below 5000
        budget of ₹30,000
        within Rs 10,000
        max ₹25,000
    """

    safe_text = text or ""

    patterns = [
        r"(?:under|below|within|upto|up to)"
        r"\s*[₹rs\.]*\s*([\d,]+)",

        r"(?:maximum|max)"
        r"(?:\s+budget)?"
        r"(?:\s+of)?"
        r"\s*[₹rs\.]*\s*([\d,]+)",

        r"(?:budget)"
        r"(?:\s+is|\s+of)?"
        r"\s*[₹rs\.]*\s*([\d,]+)",
    ]

    import re

    for pattern in patterns:
        match = re.search(
            pattern,
            safe_text,
            flags=re.IGNORECASE,
        )

        if match:
            try:
                return float(
                    match.group(1).replace(",", "")
                )
            except ValueError:
                return None

    return None


def extract_duration(text: str) -> Optional[int]:
    """
    Extract number of days from the goal.

    Example:
        3-day trip
        5 days
        7 day vacation
    """

    import re

    match = re.search(
        r"(\d+)\s*[- ]?\s*days?",
        text or "",
        flags=re.IGNORECASE,
    )

    if match:
        try:
            return int(match.group(1))
        except ValueError:
            return None

    return None


def extract_people(text: str) -> Optional[int]:
    """
    Extract number of travelers.

    Examples:
        2 people
        4 persons
        3 travelers
        5 guests
    """

    import re

    match = re.search(
        r"(\d+)\s*"
        r"(?:people|persons|travelers|travellers|guests)",
        text or "",
        flags=re.IGNORECASE,
    )

    if match:
        try:
            return int(match.group(1))
        except ValueError:
            return None

    return None


def extract_rating(text: str) -> Optional[float]:
    """
    Extract minimum rating.

    Examples:
        rating above 4.0
        rating above 4
        rating >= 4.2
        rating at least 4.0
    """

    import re

    patterns = [
        r"(?:rating|rated)"
        r"\s*(?:above|over|at least|minimum|min)"
        r"\s*([0-5](?:\.[0-9]+)?)",

        r"(?:rating|rated)"
        r"\s*(?:>=|>)"
        r"\s*([0-5](?:\.[0-9]+)?)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text or "",
            flags=re.IGNORECASE,
        )

        if match:
            try:
                return float(match.group(1))
            except ValueError:
                return None

    return None


def extract_count(text: str) -> Optional[int]:
    """
    Extract requested number of hotels/options.

    Example:
        Find 3 hotels
        Show 5 hotels
    """

    import re

    match = re.search(
        r"(?:find|show|select|recommend|choose)"
        r"\s+(\d+)"
        r"\s+(?:hotels?|options?|stays?)",
        text or "",
        flags=re.IGNORECASE,
    )

    if match:
        try:
            return int(match.group(1))
        except ValueError:
            return None

    return None


def calculate_nights(duration: Optional[int]) -> int:
    """
    A 3-day trip normally requires 2 nights.
    A 1-day trip is treated as at least 1 night
    for the prototype.
    """

    if duration is None:
        return 1

    return max(duration - 1, 1)


def accommodation_allowance(
    total_budget: Optional[float],
) -> Optional[float]:
    """
    GoalGuard protects approximately 60% of the
    total trip budget for accommodation.

    Example:
        Trip budget = ₹20,000
        Accommodation allowance = ₹12,000
    """

    if total_budget is None:
        return None

    return total_budget * 0.60


def build_google_search_url(
    hotel_name: str,
    location: str,
) -> str:
    """
    Creates a safe online-search link for the demo hotel.
    """

    query = quote_plus(
        f"{hotel_name} {location} hotel"
    )

    return (
        "https://www.google.com/search?q="
        f"{query}"
    )


def build_image_url(
    location: str,
    index: int,
) -> str:
    """
    Generates a generic hotel/travel image URL.

    These are presentation images for the prototype,
    not verified property photographs.
    """

    query = quote_plus(
        f"{location} hotel room"
    )

    return (
        "https://images.unsplash.com/"
        "photo-1566073771259-6a8506099945"
        "?auto=format&fit=crop&w=1200&q=80"
        f"&sig={index}"
    )


# =========================================================
# GOAL PARSING
# =========================================================

def parse_goal(goal: str) -> dict:
    """
    Convert the original natural-language goal into
    structured constraints.
    """

    safe_goal = goal or ""

    location = extract_location(safe_goal)

    budget = extract_budget(safe_goal)

    duration = extract_duration(safe_goal)

    people = extract_people(safe_goal)

    rating = extract_rating(safe_goal)

    count = extract_count(safe_goal)

    accommodation_requested = any(
        word in safe_goal.lower()
        for word in [
            "hotel",
            "accommodation",
            "stay",
            "resort",
            "hostel",
        ]
    )

    return {
        "location": location,
        "budget": budget,
        "duration": duration,
        "people": people,
        "rating": rating,
        "count": count or 3,
        "accommodation_requested": accommodation_requested,
    }


# =========================================================
# ACTION ANALYSIS
# =========================================================

def analyze_agent_action(
    original_goal: str,
    agent_action: str,
) -> dict:
    """
    Compare the proposed agent action against
    the protected original goal.
    """

    goal = parse_goal(original_goal)

    action = agent_action or ""

    action_location = extract_location(action)

    action_price = extract_budget(action)

    violations = []

    # -----------------------------------------------------
    # LOCATION CHECK
    # -----------------------------------------------------

    if (
        goal["location"] != "India"
        and action_location != "India"
        and action_location != goal["location"]
    ):
        violations.append(
            "Location constraint violated: "
            f"proposed action targets {action_location} "
            f"instead of {goal['location']}."
        )

    # -----------------------------------------------------
    # BUDGET CHECK
    # -----------------------------------------------------

    total_budget = goal["budget"]

    nights = calculate_nights(
        goal["duration"]
    )

    accommodation_budget = accommodation_allowance(
        total_budget
    )

    nightly_allowance = None

    if (
        accommodation_budget is not None
        and nights > 0
    ):
        nightly_allowance = (
            accommodation_budget / nights
        )

    if (
        action_price is not None
        and nightly_allowance is not None
        and action_price > nightly_allowance
    ):
        violations.append(
            "Budget constraint violated: "
            f"proposed accommodation price "
            f"{format_inr(action_price)} per night "
            f"exceeds the protected accommodation "
            f"allowance of "
            f"{format_inr(nightly_allowance)} per night."
        )

    # -----------------------------------------------------
    # DIRECT TOTAL-BUDGET CHECK
    # -----------------------------------------------------

    if (
        action_price is not None
        and total_budget is not None
        and action_price > total_budget
    ):
        direct_message = (
            "Proposed accommodation price "
            f"{format_inr(action_price)} exceeds "
            f"the entire trip budget of "
            f"{format_inr(total_budget)}."
        )

        if direct_message not in violations:
            violations.append(direct_message)

    return {
        "goal": goal,
        "action_location": action_location,
        "action_price": action_price,
        "nights": nights,
        "accommodation_budget": accommodation_budget,
        "nightly_allowance": nightly_allowance,
        "violations": violations,
    }


# =========================================================
# HOTEL RECOMMENDATIONS
# =========================================================

def get_hotel_recommendations(
    goal: dict,
) -> List[HotelRecommendation]:
    """
    Generate India-wide controlled demonstration
    recommendations based on the requested destination.

    The names/prices are prototype data and should not
    be interpreted as live hotel inventory.
    """

    location = goal.get(
        "location",
        "India",
    )

    if not location or location == "India":
        location = "India"

    nights = calculate_nights(
        goal.get("duration")
    )

    total_budget = goal.get("budget")

    accommodation_budget = accommodation_allowance(
        total_budget
    )

    nightly_allowance = None

    if (
        accommodation_budget is not None
        and nights > 0
    ):
        nightly_allowance = (
            accommodation_budget / nights
        )

    requested_count = goal.get(
        "count",
        3,
    )

    requested_rating = goal.get(
        "rating"
    )

    recommendations = []

    # -----------------------------------------------------
    # CONTROLLED PRICE OPTIONS
    # -----------------------------------------------------

    price_options = [
        2499,
        2999,
        3999,
        4499,
    ]

    # If the budget is very small, make sure the
    # generated options still demonstrate correction.
    if nightly_allowance is not None:
        safe_prices = [
            price
            for price in price_options
            if price <= nightly_allowance
        ]

        if safe_prices:
            price_options = safe_prices

    for index in range(
        min(requested_count, 4)
    ):
        price = price_options[
            min(index, len(price_options) - 1)
        ]

        rating = round(
            4.1 + (index * 0.2),
            1,
        )

        if requested_rating is not None:
            rating = max(
                rating,
                requested_rating,
            )

        total_stay = price * nights

        within_budget = (
            nightly_allowance is None
            or price <= nightly_allowance
        )

        hotel_name = (
            f"{location} "
            f"{['Comfort Hotel', 'Urban Stay', 'Premium Stay', 'City Residency'][index]}"
        )

        recommendations.append(
            HotelRecommendation(
                name=hotel_name,
                location=location,
                price_per_night=price,
                nights=nights,
                total_stay=total_stay,
                within_budget=within_budget,
                image_url=build_image_url(
                    location,
                    index,
                ),
                hotel_url=build_google_search_url(
                    hotel_name,
                    location,
                ),
                description=(
                    f"Controlled GoalGuard prototype "
                    f"recommendation for {location}. "
                    f"Nightly rate: "
                    f"{format_inr(price)}. "
                    f"Estimated stay: "
                    f"{format_inr(total_stay)}."
                ),
            )
        )

    return recommendations


# =========================================================
# DELIBERATE DRIFT ACTION
# =========================================================

def create_demo_drift_action(
    goal: dict,
) -> str:
    """
    Create a deliberately misaligned action.

    This is used by the frontend/demo to prove that
    GoalGuard can detect a constraint violation.

    The action is intentionally expensive.
    """

    location = goal.get(
        "location",
        "Goa",
    )

    return (
        f"Book {location} Luxury Resort "
        f"for ₹34,500 per night."
    )


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/")
def root():
    return {
        "name": "GoalGuard API",
        "status": "online",
        "version": "1.0.0",
        "message": (
            "Autonomous Goal-Drift Detection "
            "and Correction API"
        ),
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


# =========================================================
# MAIN DRIFT-DETECTION ENDPOINT
# =========================================================

@app.post(
    "/detect-drift",
    response_model=DriftResponse,
)
def detect_drift(
    request: DriftRequest,
):
    """
    Main GoalGuard endpoint.

    Receives:
        original_goal
        agent_action

    Returns:
        drift detection
        drift score
        severity
        violations
        explanation
        correction recommendation
        hotel recommendations
    """

    analysis = analyze_agent_action(
        request.original_goal,
        request.agent_action,
    )

    violations = analysis["violations"]

    goal = analysis["goal"]

    drift_detected = len(violations) > 0

    # -----------------------------------------------------
    # DRIFT SCORE
    # -----------------------------------------------------

    if drift_detected:
        drift_score = min(
            0.60 + (
                len(violations) * 0.25
            ),
            0.99,
        )
    else:
        drift_score = 0.0

    # -----------------------------------------------------
    # SEVERITY
    # -----------------------------------------------------

    if drift_score >= 0.75:
        severity = "HIGH"
    elif drift_score >= 0.40:
        severity = "MEDIUM"
    elif drift_score > 0:
        severity = "LOW"
    else:
        severity = "NONE"

    # -----------------------------------------------------
    # EXPLANATION
    # -----------------------------------------------------

    if drift_detected:

        violation_text = " ".join(
            violations
        )

        explanation = (
            "GoalGuard detected a deviation from "
            "the protected original objective. "
            f"{violation_text} "
            "The proposed action is therefore "
            "blocked before execution."
        )

        recommended_action = (
            "REPLAN: Reject the misaligned action "
            "and generate a new execution plan "
            "using the original goal constraints."
        )

    else:

        explanation = (
            "The proposed agent action remains "
            "aligned with the protected original "
            "goal and does not violate the detected "
            "constraints."
        )

        recommended_action = (
            "ALLOW: Continue execution while "
            "monitoring the remaining constraints."
        )

    # -----------------------------------------------------
    # RECOMMENDATIONS
    # -----------------------------------------------------

    recommendations = get_hotel_recommendations(
        goal
    )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return DriftResponse(
        drift_detected=drift_detected,
        drift_score=round(
            drift_score,
            2,
        ),
        severity=severity,
        violations=violations,
        explanation=explanation,
        recommended_action=recommended_action,
        hotel_recommendations=recommendations,
    )


# =========================================================
# DEVELOPMENT ENTRY POINT
# =========================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )