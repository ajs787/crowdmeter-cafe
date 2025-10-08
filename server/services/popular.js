import fetch from "node-fetch";

export async function getLivePopularity(placeId) {
  try {
    const res = await fetch(`http://localhost:5050/api/popularity/${placeId}`);
    const data = await res.json();
    
    // Prefer live data, fall back to estimated from historical
    const popularity = data.current_popularity ?? data.estimated_popularity ?? null;
    const isLive = data.current_popularity !== null && data.current_popularity !== undefined;
    
    return {
      value: popularity,
      isLive: isLive,
      isEstimated: !isLive && popularity !== null,
      dataAvailable: data.has_historical || data.data_available
    };
  } catch (err) {
    console.error("populartimes fetch error:", err.message);
    return {
      value: null,
      isLive: false,
      isEstimated: false,
      dataAvailable: false
    };
  }
}
