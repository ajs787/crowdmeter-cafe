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
        return jsonify({
            "place_id": place_id,
            "name": data.get("name"),
            "current_popularity": data.get("current_popularity")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
