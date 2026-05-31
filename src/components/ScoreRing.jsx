const ScoreRing = ({ score }) => {
  const r = 34, circ = 2 * Math.PI * r;
  const pct = score != null ? score / 10 : 0;
  const offset = circ * (1 - pct);
  const color = score >= 8 ? "#555" : score >= 5 ? "#888" : "#aaa";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="82" height="82" className="-rotate-90">
        <circle cx="41" cy="41" r={r} fill="none" stroke="#e8e8e8" strokeWidth="4" />
        <circle cx="41" cy="41" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }} />
        <text x="41" y="41" textAnchor="middle" dominantBaseline="central"
          style={{ transform: "rotate(90deg)", transformOrigin: "41px 41px",
            fontSize: "18px", fontFamily: "Inter", fontWeight: 600, fill: color }}>
          {score ?? "—"}
        </text>
      </svg>
      <span className="text-[10px] text-muted">Quality</span>
    </div>
  );
};
export default ScoreRing;
