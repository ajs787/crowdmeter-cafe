import { useEffect, useState } from "react";
import axios from "axios";
import CafeCard from "./components/CafeCard.jsx";
import SearchBar from "./components/SearchBar.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5175";

export default function App() {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [nextRefresh, setNextRefresh] = useState(null);

  async function fetchCafes() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/cafes`);
      setCafes(data);
      setFilteredCafes(data);
      setLastUpdated(new Date());
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

  // Smart auto-refresh that matches backend scheduling
  function getRefreshInterval() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Weekend hours (Saturday & Sunday)
    if (day === 0 || day === 6) {
      if (hour >= 8 && hour <= 18) return 2 * 60 * 1000; // 2 minutes during weekend day
      return 8 * 60 * 1000; // 8 minutes during weekend night
    }
    
    // Weekday peak hours
    if (hour >= 7 && hour <= 10) return 90 * 1000; // 1.5 minutes during morning rush
    if (hour >= 11 && hour <= 14) return 2 * 60 * 1000; // 2 minutes during lunch
    if (hour >= 15 && hour <= 18) return 3 * 60 * 1000; // 3 minutes during afternoon
    if (hour >= 19 && hour <= 22) return 4 * 60 * 1000; // 4 minutes during evening study
    
    // Off-peak hours (late night/early morning)
    return 10 * 60 * 1000; // 10 minutes during quiet hours
  }

  useEffect(() => { 
    // Initial fetch
    fetchCafes(); 
    
    // Set up smart auto-refresh
    const scheduleNextRefresh = () => {
      const interval = getRefreshInterval();
      const nextTime = new Date(Date.now() + interval);
      setNextRefresh(nextTime);
      
      return setTimeout(() => {
        fetchCafes();
        // Reschedule after each refresh to adapt to time changes
        scheduleNextRefresh();
      }, interval);
    };
    
    const timeoutId = scheduleNextRefresh();
    
    // Cleanup on unmount
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rutgers Cafe CrowdMeter</h1>
          <p className="text-white/60 mt-1">know when to go, before you go.</p>
          {lastUpdated && (
            <p className="text-white/40 text-xs mt-2">
              🔄 Auto-refreshing • Last updated: {lastUpdated.toLocaleTimeString()}
              {nextRefresh && ` • Next: ${nextRefresh.toLocaleTimeString()}`}
            </p>
          )}
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
