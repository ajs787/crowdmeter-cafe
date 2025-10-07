export default function LivePill() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-3 w-3">
        <span className="animate-mega-pulse absolute inline-flex h-full w-full rounded-full bg-white"></span>
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 bg-white"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white/90"></span>
      </span>
      <span className="text-sm uppercase tracking-wide text-white/80 font-medium">live</span>
    </div>
  );
}
