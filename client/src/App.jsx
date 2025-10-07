import { useEffect, useState } from "react";
import axios from "axios";
import CafeCard from "./components/CafeCard.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5175";

export default function App() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCafes() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/cafes`);
      setCafes(data);
    } catch (error) {
      console.log("API not available, using mock data");
      // Mock data for development
      setCafes([
        {
          placeId: "1",
          name: "Rutgers Student Center",
          currentPopularity: 75,
          address: "126 College Ave, New Brunswick, NJ",
          photoUrl: null,
          mapsUrl: "https://maps.google.com/?q=Rutgers+Student+Center",
          appleMapsUrl: "https://maps.apple.com/?q=Rutgers+Student+Center"
        },
        {
          placeId: "2", 
          name: "Library Cafe",
          currentPopularity: 30,
          address: "169 College Ave, New Brunswick, NJ",
          photoUrl: null,
          mapsUrl: "https://maps.google.com/?q=Rutgers+Library+Cafe",
          appleMapsUrl: "https://maps.apple.com/?q=Rutgers+Library+Cafe"
        },
        {
          placeId: "3",
          name: "Brower Commons",
          currentPopularity: 90,
          address: "84 Joyce Kilmer Ave, Piscataway, NJ",
          photoUrl: null,
          mapsUrl: "https://maps.google.com/?q=Brower+Commons",
          appleMapsUrl: "https://maps.apple.com/?q=Brower+Commons"
        }
      ]);
    }
    setLoading(false);
  }

  useEffect(() => { fetchCafes(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">CrowdMeter Cafe</h1>
        <p className="text-white/60 mt-1">live busyness for rutgers new brunswick cafés</p>
      </header>

      {loading ? (
        <div className="text-white/50">loading…</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cafes.map(c => <CafeCard key={c.placeId} cafe={c} />)}
        </div>
      )}
    </div>
  );
}
