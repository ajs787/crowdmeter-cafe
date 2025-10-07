import express from "express";
import Cafe from "../models/Cafe.js";
import { searchPlaceByText, getPlaceDetails, buildPhotoUrl, mapLinks } from "../services/google.js";
import { getLivePopularityByPlaceUrl } from "../services/popular.js";

const router = express.Router();

// seed list (rutgers nb campus + easton ave)
// add/remove freely — these are text queries for initial placeId resolution
const SEED_NAMES = [
  "Hidden Grounds Coffee College Ave New Brunswick",
  "Hatch44 Cafe New Brunswick",
  "Khyber Coffee and Tea New Brunswick",
  "Cafe Zio New Brunswick",
  "Semicolon Cafe New Brunswick",
  "Efes Cafe New Brunswick",
  "Panera Bread College Ave New Brunswick",
  "Legal Grounds Cafe Rutgers",
  "Kaito Bubble Tea New Brunswick",
  "Birdies and Lattes New Brunswick",
  "Starbucks College Ave New Brunswick"
];

// 1) init seed (idempotent)
router.post("/seed", async (_req, res) => {
  const created = [];
  for (const q of SEED_NAMES) {
    try {
      const hit = await searchPlaceByText(q);
      if (!hit) continue;
      const details = await getPlaceDetails(hit.place_id);
      const photoRef = details.photos?.[0]?.photo_reference;
      const photoUrl = photoRef ? buildPhotoUrl(photoRef, 1200) : null;
      const { mapsUrl, appleMapsUrl } = mapLinks(details.name, details.geometry.location.lat, details.geometry.location.lng);

      await Cafe.updateOne(
        { placeId: details.place_id },
        {
          $set: {
            placeId: details.place_id,
            name: details.name,
            address: details.formatted_address,
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
            photoUrl,
            mapsUrl,
            appleMapsUrl,
          },
          $setOnInsert: { lastUpdated: new Date(0) }
        },
        { upsert: true }
      );
      created.push(details.name);
    } catch (e) {
      console.error("seed error", q, e.message);
    }
  }
  res.json({ ok: true, created });
});

// 2) refresh live popularity for all cafes
router.post("/refresh", async (_req, res) => {
  const cafes = await Cafe.find({});
  let updated = 0;
  for (const c of cafes) {
    try {
      // construct a stable place URL (details.url is good if available)
      const mapsPlaceUrl = `https://www.google.com/maps/place/?q=place_id:${c.placeId}`;
      const live = await getLivePopularityByPlaceUrl(mapsPlaceUrl);
      await Cafe.updateOne(
        { _id: c._id },
        { $set: { currentPopularity: live, lastUpdated: new Date() } }
      );
      updated++;
    } catch (e) {
      console.error("refresh error", c.name, e.message);
    }
  }
  res.json({ ok: true, updated });
});

// 3) list cafes for frontend
router.get("/", async (_req, res) => {
  const docs = await Cafe.find({}).sort({ name: 1 }).lean();
  res.json(docs);
});

export default router;
