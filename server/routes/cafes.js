import express from "express";
import Cafe from "../models/Cafe.js";
import { searchPlace, getPlaceDetails, buildPhotoUrl, mapLinks } from "../services/google.js";
import { getLivePopularity } from "../services/popular.js";

const router = express.Router();

const SEED = [
  "Hidden Grounds Coffee New Brunswick NJ",
  "Hatch44 Cafe New Brunswick NJ",
  "Khyber Coffee and Tea New Brunswick NJ",
  "Semicolon Cafe New Brunswick NJ",
  "Efes Cafe New Brunswick NJ",
  "Panera Bread College Ave New Brunswick NJ",
  "Kaito Bubble Tea New Brunswick NJ",
  "Birdies and Lattes New Brunswick NJ",
  "Starbucks College Ave New Brunswick NJ"
  // Removed: Cafe Zio & Legal Grounds Cafe (no Google popularity data available)
];

// seed route
router.post("/seed", async (_req, res) => {
  console.log("seeding cafes:", SEED.length);
  const added = [];
  
  for (const name of SEED) {
    try {
      const place = await searchPlace(name);

      if (!place) {
        console.warn(`No place found for: ${name}`);
        continue;
      }

      console.log(`Found: ${place.name} (${place.place_id})`);

      const details = await getPlaceDetails(place.place_id);
      const photoUrl = buildPhotoUrl(details.photos?.[0]?.photo_reference);
      const { mapsUrl, appleMapsUrl } = mapLinks(
        details.name,
        details.geometry.location.lat,
        details.geometry.location.lng
      );

      await Cafe.updateOne(
        { placeId: details.place_id },
        {
          $set: {
            name: details.name,
            address: details.formatted_address,
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
            photoUrl,
            mapsUrl,
            appleMapsUrl,
            lastUpdated: new Date(0),
          },
        },
        { upsert: true }
      );

      added.push(details.name);
    } catch (err) {
      console.error("seed error for", name, ":", err.message);
    }
  }

  console.log("done seeding, added:", added.length);
  res.json({ ok: true, added });
});


// refresh live busyness
router.post("/refresh", async (_req, res) => {
  const cafes = await Cafe.find({});
  let updated = 0;
  for (const c of cafes) {
    const popularityData = await getLivePopularity(c.placeId);
    await Cafe.updateOne(
      { _id: c._id },
      { 
        $set: { 
          currentPopularity: popularityData.value,
          isLiveData: popularityData.isLive,
          isEstimatedData: popularityData.isEstimated,
          dataAvailable: popularityData.dataAvailable,
          lastUpdated: new Date() 
        } 
      }
    );
    updated++;
  }
  res.json({ ok: true, updated });
});

// list all cafes
router.get("/", async (_req, res) => {
  const cafes = await Cafe.find({}).sort({ name: 1 }).lean();
  res.json(cafes);
});

// delete cafes without any data
router.delete("/no-data", async (_req, res) => {
  const result = await Cafe.deleteMany({ dataAvailable: false });
  res.json({ ok: true, deleted: result.deletedCount });
});

export default router;
