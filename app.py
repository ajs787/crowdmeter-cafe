from flask import Flask, jsonify, request
import populartimes
from dotenv import load_dotenv
import os

load_dotenv()  # loads .env file
app = Flask(__name__)

API_KEY = os.getenv("GOOGLE_API_KEY")

@app.route("/api/popularity/<place_id>")
def get_popularity(place_id):
    try:
        data = populartimes.get_id(API_KEY, place_id)
        current = data.get("current_popularity")
        
        # If no live data, try to estimate from historical data
        estimated = None
        data_available = current is not None
        
        if current is None and "populartimes" in data:
            # Get current day and hour
            from datetime import datetime
            now = datetime.now()
            day_of_week = now.weekday()  # Monday=0, Sunday=6
            hour = now.hour
            
            # Get historical data for current time
            try:
                populartimes_data = data["populartimes"]
                if len(populartimes_data) > day_of_week:
                    day_data = populartimes_data[day_of_week]
                    if "data" in day_data and len(day_data["data"]) > hour:
                        estimated = day_data["data"][hour]
            except (KeyError, IndexError):
                pass
        
        return jsonify({
            "place_id": place_id,
            "name": data.get("name"),
            "current_popularity": current,
            "estimated_popularity": estimated,
            "data_available": data_available,
            "has_historical": "populartimes" in data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
