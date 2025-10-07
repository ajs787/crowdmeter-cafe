import { Client } from "@googlemaps/google-maps-services-js";
const client = new Client({});

export async function searchPlace(query) {
  try {
    const { data } = await client.textSearch({
      params: {
        query,
        location: { lat: 40.5009, lng: -74.4474 }, // Rutgers NB
        radius: 3000,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    console.log("Google response for", query, "=>", data.status, data.results?.length);

    if (data.status !== "OK") {
      console.error("Google error:", data.status, data.error_message);
      return null;
    }
    return data.results[0]; // take the top hit
  } catch (err) {
    console.error("Google Places error:", err.response?.data || err.message);
    return null;
  }
}

export async function getPlaceDetails(place_id) {
  const { data } = await client.placeDetails({
    params: {
      place_id,
      fields: ["name","formatted_address","geometry","photos","url","place_id"],
      key: process.env.GOOGLE_MAPS_API_KEY
    },
  });
  return data.result;
}

export function buildPhotoUrl(ref) {
  return ref
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    : null;
}

export function mapLinks(name, lat, lng) {
  const q = encodeURIComponent(name);
  return {
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${q}`,
    appleMapsUrl: `http://maps.apple.com/?q=${q}&ll=${lat},${lng}`,
  };
}
