# from django.shortcuts import render
# from solar_app.aqi_calculator import calculate_current_aqi
# from solar_app.ml_model import predict_solar_irradiance
# from datetime import datetime
# import os
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# API_KEY = os.getenv("API_KEY")


# # Create your views here.
# import requests


# lat=28.7041
# lon= 77.1025


# # 1. Get coordinates from city name using OpenStreetMap
# def get_coordinates(city):
#     url = f"https://nominatim.openstreetmap.org/search?city={city}&format=json"
#     response = requests.get(url).json()
#     if response:
#         lat = float(response[0]["lat"])
#         lon = float(response[0]["lon"])
#         return lat, lon
#     return None, None

# # 2. Get weather using coordinates
# def get_weather(lat, lon):
    
#     url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}"
#     data = requests.get(url).json()
#     try:
#         temp = data["main"]["temp"] 
#         humidity = data["main"]["humidity"]
#         pressure = data["main"]["pressure"]
#         wind_speed = data["wind"]["speed"]
#         temp_min = data["main"]["temp_min"]
#         temp_max = data["main"]["temp_max"]
#         precipitation = data.get("rain", {}).get("1h", 0.0)
#     except KeyError:
#         return None
#     return {"temperature": temp, "humidity": humidity, "pressure": pressure, "wind_speed": wind_speed,"temp_min":temp_min,"temp_max":temp_max,"precipitation": precipitation}

# # 3. Get AQI using coordinates
# def get_aqi(lat, lon):
    
#     url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
#     data = requests.get(url).json()
#     try:
#         aqi = data["list"][0]["main"]["aqi"]  # AQI index
#         PM2_5 =data["list"][0]["components"]["pm2_5"]
#         PM10 =data["list"][0]["components"]["pm10"]
#         NO2 =data["list"][0]["components"]["no2"]
#         SO2 =data["list"][0]["components"]["so2"]
#         CO =data["list"][0]["components"]["co"]
#         Ozone =data["list"][0]["components"]["o3"]
#     except (KeyError, IndexError):
#         return None
#     return {"aqi": aqi,"PM2_5":PM2_5,"PM10":PM10,"NO2":NO2,"SO2":SO2,"CO":CO,"Ozone":Ozone}

# def calulate_aqi(lat,lon):
#     api_data = get_aqi(lat, lon)
    
#     if api_data:
#         print("Raw API Response:", api_data)
        
#         # Step 2: Pass pollutant values to our custom AQI calculator
#         result = calculate_current_aqi(api_data)
        
#         print("Calculated AQI:", result["AQI"])
#         print("Category:", result["Category"])
#     else:
#         print("Error: Could not fetch AQI data from API")


# def collect_environment_data(lat, lon):
#     weather = get_weather(lat, lon)
#     air = get_aqi(lat, lon)

#     if not weather or not air:
#         return None

#     # Calculate AQI
#     aqi_result = calculate_current_aqi(air)

#     # Current date
#     now = datetime.now()
#     year, month, day = now.year, now.month, now.day

#     record = {
#         "Year": year,
#         "Month": month,
#         "Day": day,
#         "Humidity": weather["humidity"],
#         "Precipitation": weather["precipitation"],
#         "Temprature": round(weather["temperature"], 2),
#         "MAX_Temp": round(weather["temp_max"], 2),
#         "MIN_Temp": round(weather["temp_min"], 2),
#         "Pressure": weather["pressure"],
#         "Wind_Speed": weather["wind_speed"],
#         "AQI": aqi_result["AQI"]
#     }
#     if record:
#         result = predict_solar_irradiance(record)
#         print("Predicted Solar Irradiance:", result)

#     return result

# def calculate_solar_energy(solar_irradiance, panel_area=2.0, efficiency=0.18):
#     """
#     Calculate daily solar energy generated from solar irradiance.
    
#     Parameters:
#     -----------
#     solar_irradiance : float or array-like
#         Solar irradiance in kWh/m²/day
#     panel_area : float
#         Area of the solar panel in m² (default = 2 m²)
#     efficiency : float
#         Panel + system efficiency as decimal (default = 0.18 for 18%)
        
#     Returns:
#     --------
#     energy_generated : float or array-like
#         Daily solar energy generated in kWh
#     """
#     return solar_irradiance * panel_area * efficiency

from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from datetime import datetime
import requests
from .aqi_calculator import calculate_current_aqi
from .ml_model import predict_solar_irradiance

API_KEY = settings.API_KEY


# ---------------- HELPER FUNCTIONS ----------------

# 1. Get weather data
def get_weather(lat, lon):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}"
    data = requests.get(url).json()
    try:
        temp = data["main"]["temp"]
        humidity = data["main"]["humidity"]
        pressure = data["main"]["pressure"]
        wind_speed = data["wind"]["speed"]
        temp_min = data["main"]["temp_min"]
        temp_max = data["main"]["temp_max"]
        precipitation = data.get("rain", {}).get("1h", 0.0)
    except KeyError:
        return None
    return {
        "temperature": temp,
        "humidity": humidity,
        "pressure": pressure,
        "wind_speed": wind_speed,
        "temp_min": temp_min,
        "temp_max": temp_max,
        "precipitation": precipitation,
    }

# 2. Get AQI data
def get_aqi(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    data = requests.get(url).json()
    try:
        aqi = data["list"][0]["main"]["aqi"]
        PM2_5 = data["list"][0]["components"]["pm2_5"]
        PM10 = data["list"][0]["components"]["pm10"]
        NO2 = data["list"][0]["components"]["no2"]
        SO2 = data["list"][0]["components"]["so2"]
        CO = data["list"][0]["components"]["co"]
        Ozone = data["list"][0]["components"]["o3"]
    except (KeyError, IndexError):
        return None
    return {
        "aqi": aqi,
        "PM2_5": PM2_5,
        "PM10": PM10,
        "NO2": NO2,
        "SO2": SO2,
        "CO": CO,
        "Ozone": Ozone,
    }

# 3. Calculate solar energy
def calculate_solar_energy(solar_irradiance, panel_area, efficiency=0.18):
    return solar_irradiance * panel_area * efficiency


def calculate_co2_offset(solar_energy, emission_factor=0.82):
    """
    Calculate CO2 offset from solar energy.
    
    Parameters:
    - solar_energy_kwh_per_m2: Solar energy received per m² per day (kWh/m²/day)
    - panel_area_m2: Total area of solar panels in m²
    - emission_factor: Grid emission factor in kg CO2/kWh (default 0.82)
    
    Returns:
    - CO2 offset in kg/day
    """

    co2_saved = solar_energy * emission_factor
    return co2_saved




# ---------------- MAIN VIEW ----------------

def get_solar_prediction(request):
    try:
        # Get input params from user
        lat = float(request.GET.get("lat"))
        lon = float(request.GET.get("lon"))
        panel_area = float(request.GET.get("panel_area"))   # ✅ required
    except (TypeError, ValueError):
        return JsonResponse(
            {"error": "Invalid or missing lat/lon/panel_area"}, status=400
        )

    # --- Weather + AQI ---
    weather = get_weather(lat, lon)
    air = get_aqi(lat, lon)
    if not weather or not air:
        return JsonResponse({"error": "Could not fetch data"}, status=500)

    # --- AQI calculation ---
    aqi_result = calculate_current_aqi(air)

    # --- Prepare record for ML model ---
    now = datetime.now()
    record = {
        "Year": now.year,
        "Month": now.month,
        "Day": now.day,
        "Humidity": weather["humidity"],
        "Precipitation": weather["precipitation"],
        "Temprature": round(weather["temperature"], 2),
        "MAX_Temp": round(weather["temp_max"], 2),
        "MIN_Temp": round(weather["temp_min"], 2),
        "Pressure": weather["pressure"],
        "Wind_Speed": weather["wind_speed"],
        "AQI": aqi_result["AQI"],
    }

    # --- Predict solar irradiance using ML model ---
    solar_irradiance = predict_solar_irradiance(record)

    # --- Calculate solar energy (user panel area) ---
    solar_energy = calculate_solar_energy(solar_irradiance, panel_area)
    solar_energy =solar_energy
    co2_offset =calculate_co2_offset(solar_energy)

    # --- Return response as JSON ---
    return JsonResponse({
        "solar_irradiance": solar_irradiance,
        "solar_energy": solar_energy,
        "panel_area": panel_area,
        "efficiency": 0.18,
        "weather": weather,
        "aqi": aqi_result,
        "co2_offset": co2_offset
    })


