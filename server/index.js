import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cafesRouter from "./routes/cafes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/cafes", cafesRouter);

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(process.env.PORT || 5175, () =>
    console.log(`api on :${process.env.PORT || 5175}`)
  );
};
start();
