import { getLivePopularity } from "./services/popular.js";

const p = await getLivePopularity("ChIJITn3tVbGw4kRl0g8SzRNe_Y"); // Hidden Grounds Coffee
console.log("Popularity:", p);
