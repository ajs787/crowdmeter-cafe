import mongoose from "mongoose";

const CafeSchema = new mongoose.Schema({
  placeId: { type: String, unique: true },
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  photoUrl: String,
  mapsUrl: String,
  appleMapsUrl: String,
  currentPopularity: Number,
  isLiveData: { type: Boolean, default: false },
  isEstimatedData: { type: Boolean, default: false },
  dataAvailable: { type: Boolean, default: false },
  lastUpdated: Date,
});

export default mongoose.model("Cafe", CafeSchema);
