import fetch from "node-fetch";

export async function getLivePopularity(placeId) {
  try {
    const res = await fetch(`http://localhost:5050/api/popularity/${placeId}`);
    const data = await res.json();
    return data.current_popularity ?? null;
  } catch (err) {
    console.error("populartimes fetch error:", err.message);
    return null;
  }
}
