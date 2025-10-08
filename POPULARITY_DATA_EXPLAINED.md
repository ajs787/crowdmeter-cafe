# 📊 How CrowdMeter Popularity Data Works

## The Issue You Discovered 🔍

Some cafes were showing **0% popularity** even when open. This happens because **Google doesn't provide live popularity data for all businesses**.

### Which Cafes Have Live Data?

Based on testing (Oct 8, 2025 at 4:16 PM):

| Cafe | Live Data | Historical Data | Status |
|------|-----------|-----------------|--------|
| ✅ Starbucks | Yes (48%) | Yes | Full data available |
| ✅ Hidden Grounds | Yes (73%) | Yes | Full data available |
| ⚠️ Kaito Bubble Tea | No | Yes | Can estimate from history |
| ⚠️ Cafe Zio | No | No | No data available |
| ⚠️ Legal Grounds | No | No | No data available |

## The Solution 🛠️

We've enhanced the system with **3-tier fallback**:

### 1. **Live Data** (Best) 🟢
- Real-time popularity from Google Maps
- Most accurate, updates every few minutes
- Available for popular chains & high-traffic venues

### 2. **Historical Estimation** (Good) 🟡
- Uses typical popularity for current day/time
- Based on Google's historical patterns
- Shows "~51%" to indicate it's estimated

### 3. **No Data Available** (Unavailable) ⚪
- No live or historical data from Google
- Shows as "Data unavailable"
- Usually smaller venues or new businesses

## Technical Changes Made

### 1. Enhanced Flask API (`app.py`)
```python
# Now returns:
{
  "current_popularity": 48,        # Live data (or null)
  "estimated_popularity": 51,      # Historical fallback (or null)
  "data_available": true,          # Has live data
  "has_historical": true           # Has historical patterns
}
```

### 2. Updated Node.js Service (`services/popular.js`)
```javascript
// Returns rich metadata:
{
  value: 51,              // The popularity percentage
  isLive: false,          // Is this real-time?
  isEstimated: true,      // Is this from historical data?
  dataAvailable: true     // Does Google have any data?
}
```

### 3. Enhanced Database Schema (`models/Cafe.js`)
```javascript
{
  currentPopularity: 51,
  isLiveData: false,         // NEW: Is this live?
  isEstimatedData: true,     // NEW: Is this estimated?
  dataAvailable: true,       // NEW: Any data available?
  lastUpdated: Date
}
```

## Frontend Integration Guide 💡

Use the new metadata to show users what kind of data they're seeing:

```javascript
// Example usage in your React components
{cafe.isLiveData && (
  <span className="live-indicator">🔴 LIVE: {cafe.currentPopularity}%</span>
)}

{cafe.isEstimatedData && (
  <span className="estimated-indicator">📊 ~{cafe.currentPopularity}%</span>
)}

{!cafe.dataAvailable && (
  <span className="no-data">⚪ Data unavailable</span>
)}
```

## Why Some Cafes Don't Have Data

Google's popularity data depends on:
- **Volume of Android/Google Maps users** visiting
- **Location services** being enabled
- **Business age** (newer = less data)
- **Privacy thresholds** (too few visitors = no data)

Smaller, local cafes often lack sufficient tracking data, while chains like Starbucks have robust data from thousands of daily visitors.

## Next Steps 🚀

1. **Test the new system**: Restart your servers with `npm run dev:auto`
2. **Check the API response**: `curl http://localhost:5175/api/cafes`
3. **Update your frontend** to display the new metadata (live vs estimated)
4. **Add helpful tooltips** to explain to users why some data is estimated

---

**TLDR**: Your system now gracefully handles missing live data by falling back to historical estimates, and provides metadata so your frontend can show users exactly what kind of data they're looking at! 🎉
