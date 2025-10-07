import { useEffect, useState } from "react";
import axios from "axios";
import CafeCard from "./components/CafeCard.jsx";
import SearchBar from "./components/SearchBar.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5175";

export default function App() {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCafes() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/cafes`);
      setCafes(data);
      setFilteredCafes(data);
    } catch (error) {
      console.error("Failed to fetch cafes:", error);
      setCafes([]);
      setFilteredCafes([]);
    }
    setLoading(false);
  }

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredCafes(cafes);
      return;
    }

    const filtered = cafes.filter(cafe => 
      cafe.name.toLowerCase().includes(query.toLowerCase()) ||
      cafe.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCafes(filtered);
  };

  useEffect(() => { fetchCafes(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rutgers Cafe CrowdMeter</h1>
          <p className="text-white/60 mt-1">know when to go, before you go.</p>
        </div>
        <SearchBar onSearch={handleSearch} placeholder="Search cafes..." />
      </header>

      {loading ? (
        <div className="text-white/50">loading…</div>
      ) : (
        <>
          {filteredCafes.length !== cafes.length && (
            <div className="mb-4 text-sm text-white/60">
              Showing {filteredCafes.length} of {cafes.length} cafes
            </div>
          )}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCafes.map(c => <CafeCard key={c.placeId} cafe={c} />)}
          </div>
          {filteredCafes.length === 0 && cafes.length > 0 && (
            <div className="text-center py-12">
              <div className="text-white/40 text-lg">No cafes found</div>
              <div className="text-white/30 text-sm mt-1">Try searching for a different name or location</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
