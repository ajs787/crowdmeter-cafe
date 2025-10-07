import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cafesRouter from "./routes/cafes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/cafes", cafesRouter);

const PORT = process.env.PORT || 5175;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB!");
    app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err.message));
