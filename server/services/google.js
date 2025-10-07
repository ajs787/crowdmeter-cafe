import { Client } from "@googlemaps/google-maps-services-js";
const client = new Client({});

export async function searchPlaceByText(text) {
  const { data } = await client.textSearch({
    params: { query: text, key: process.env.GOOGLE_MAPS_API_KEY },
  });
  return data.results?.[0]; // take top hit
}

export async function getPlaceDetails(place_id) {
  const { data } = await client.placeDetails({
    params: {
      place_id,
      fields: ["place_id","name","formatted_address","geometry","photos","url"],
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });
  return data.result;
}

export function buildPhotoUrl(photoRef, maxwidth = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${photoRef}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
}

export function mapLinks(name, lat, lng) {
  const q = encodeURIComponent(name);
  return {
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${q}`,
    appleMapsUrl: `http://maps.apple.com/?q=${q}&ll=${lat},${lng}`,
  };
}
