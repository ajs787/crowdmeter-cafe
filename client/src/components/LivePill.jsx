export default function LivePill() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 bg-white"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white/80"></span>
      </span>
      <span className="text-xs uppercase tracking-wide text-white/70">live</span>
    </div>
  );
}
