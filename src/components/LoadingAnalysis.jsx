const steps = [
  "Parsing syntax tree...",
  "Scanning for bugs...",
  "Detecting code smells...",
  "Generating suggestions...",
  "Calculating quality score...",
];

const LoadingAnalysis = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-5">
    <div className="w-8 h-8 border-2 border-line border-t-muted rounded-full animate-spin" />
    <div className="text-center">
      <p className="text-sm font-medium text-soft mb-0.5">Analyzing your code</p>
      <p className="text-xs text-muted">This takes a few seconds...</p>
    </div>
    <div className="flex flex-col gap-1.5 w-48">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2 opacity-0"
          style={{ animation: `fadeUp 0.3s ease ${i * 350}ms forwards` }}>
          <style>{`@keyframes fadeUp { to { opacity: 1 } }`}</style>
          <div className="w-1 h-1 rounded-full bg-subtle flex-shrink-0" />
          <span className="text-[11px] font-mono text-muted">{s}</span>
        </div>
      ))}
    </div>
  </div>
);
export default LoadingAnalysis;
