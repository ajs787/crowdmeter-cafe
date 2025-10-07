import LivePill from "./LivePill.jsx";
import Ring from "./Ring.jsx";

function colorFor(p) {
  if (p == null) return "border-white/10";
  if (p < 50) return "border-emerald-400/50";
  if (p <= 85) return "border-amber-400/50";
  return "border-rose-400/50";
}
function badgeBg(p) {
  if (p == null) return "bg-white/10";
  if (p < 50) return "bg-emerald-500/15";
  if (p <= 85) return "bg-amber-500/15";
  return "bg-rose-500/15";
}

export default function CafeCard({ cafe }) {
  const p = cafe.currentPopularity ?? null;
  return (
    <div className={`rounded-2xl border ${colorFor(p)} overflow-hidden shadow-sm bg-white/[0.02]`}>
      <div className="relative h-40 w-full overflow-hidden">
        {cafe.photoUrl ? (
          <img src={cafe.photoUrl} alt={cafe.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-white/40">no image</div>
        )}
        <div className="absolute top-3 right-3"><LivePill /></div>
      </div>
      <div className="p-4 flex items-start gap-4">
        <Ring value={p ?? 0} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{cafe.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${badgeBg(p)} text-white/80`}>
              {p == null ? "—" : `${p}% full`}
            </span>
          </div>
          <p className="text-sm text-white/60 mt-1">{cafe.address}</p>
          <div className="flex gap-3 mt-3 text-sm">
            <a href={cafe.mapsUrl} target="_blank" className="underline opacity-90 hover:opacity-100">google maps</a>
            <a href={cafe.appleMapsUrl} target="_blank" className="underline opacity-90 hover:opacity-100">apple maps</a>
          </div>
        </div>
      </div>
    </div>
  );
}
