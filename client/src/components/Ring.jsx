export default function Ring({ value=0 }) {
  const size = 60, stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * c;

  return (
    <svg width={size} height={size} className="block">
      <circle cx={size/2} cy={size/2} r={r} stroke="currentColor" strokeWidth={stroke} className="text-white/10" fill="none"/>
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke="currentColor" strokeWidth={stroke} fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        className="text-white"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-white text-sm font-medium">
        {clamped}%
      </text>
    </svg>
  );
}
