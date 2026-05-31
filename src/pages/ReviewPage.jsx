import { useState, useRef } from "react";
import { Play, RotateCcw, ChevronDown, Bug, Lightbulb, AlertTriangle, Star, FileCode } from "lucide-react";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import useReviewStore from "../store/reviewStore.js";
import CommentCard from "../components/CommentCard.jsx";
import ScoreRing from "../components/ScoreRing.jsx";
import LoadingAnalysis from "../components/LoadingAnalysis.jsx";

const LANGS = ["javascript","typescript","python","java","c","cpp","go","rust","php","ruby","kotlin","swift","csharp"];

const countTypes = (comments) => {
  const c = { bug: 0, smell: 0, suggestion: 0, praise: 0 };
  comments?.forEach(x => { if (c[x.type] !== undefined) c[x.type]++; });
  return c;
};

const ReviewPage = () => {
  const { createReview, loading, currentReview, clearReview } = useReviewStore();
  const [code, setCode] = useState("// Paste your code here and click Analyze\n\nfunction greet(name) {\n  console.log('Hello ' + name)\n  var x = 1;\n  return x\n}");
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const editorRef = useRef(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return toast.error("Paste some code first");
    clearReview();
    const result = await createReview(code, language, title || undefined);
    if (!result.success) toast.error(result.message);
  };

  const handleLineClick = (line) => {
    if (editorRef.current) {
      editorRef.current.revealLineInCenter(line);
      editorRef.current.setPosition({ lineNumber: line, column: 1 });
      editorRef.current.focus();
    }
  };

  const filtered = currentReview?.comments?.filter(c => filter === "all" || c.type === filter);
  const counts = countTypes(currentReview?.comments);

  return (
    <div className="min-h-screen bg-bg pt-14">
      <div className="max-w-7xl mx-auto px-6 py-5">

        {/* Top bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <FileCode size={13} className="text-muted" />
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Untitled review"
              className="bg-transparent text-sm text-text placeholder:text-muted focus:outline-none w-40" />
          </div>
          <div className="relative">
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="appearance-none bg-surface border border-line text-soft text-xs px-3 py-2 pr-7 rounded-lg focus:outline-none cursor-pointer font-mono">
              {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <button onClick={handleAnalyze} disabled={loading}
            className="flex items-center gap-2 bg-text hover:bg-soft text-surface font-medium text-xs px-5 py-2 rounded-lg transition-colors disabled:opacity-50">
            {loading
              ? <><span className="w-3.5 h-3.5 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />Analyzing...</>
              : <><Play size={12} fill="currentColor" />Analyze</>}
          </button>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Editor */}
          <div className="rounded-xl border border-line bg-surface overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-panel">
              <span className="text-xs font-mono text-muted">{language}</span>
              <button onClick={() => { setCode(""); clearReview(); }}
                className="text-muted hover:text-soft transition-colors">
                <RotateCcw size={12} />
              </button>
            </div>
            <Editor
              height="500px"
              language={language}
              value={code}
              onChange={v => setCode(v || "")}
              onMount={e => { editorRef.current = e; }}
              theme="vs"
              options={{
                fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false }, scrollBeyondLastLine: false,
                padding: { top: 14, bottom: 14 }, lineNumbers: "on",
                wordWrap: "on", tabSize: 2, renderLineHighlight: "gutter",
              }}
            />
          </div>

          {/* Results panel */}
          <div className="rounded-xl border border-line bg-surface overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-panel">
              <span className="text-xs font-medium text-soft">Analysis Results</span>
              {currentReview && (
                <span className="text-xs text-muted font-mono">{currentReview.comments?.length} findings</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && <LoadingAnalysis />}

              {!loading && !currentReview && (
                <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
                  <Play size={20} className="text-muted" />
                  <p className="text-sm text-muted">Paste your code and click Analyze</p>
                </div>
              )}

              {!loading && currentReview && (
                <div className="p-4 space-y-4">

                  {/* Score + summary */}
                  <div className="flex gap-4 p-3.5 rounded-lg border border-line bg-panel">
                    <ScoreRing score={currentReview.score} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-soft mb-1.5">Summary</p>
                      <p className="text-xs text-muted leading-relaxed">{currentReview.summary}</p>
                    </div>
                  </div>

                  {/* Type filter buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: "bug", icon: Bug, label: "Bugs" },
                      { key: "smell", icon: AlertTriangle, label: "Smells" },
                      { key: "suggestion", icon: Lightbulb, label: "Tips" },
                      { key: "praise", icon: Star, label: "Praise" },
                    ].map(({ key, icon: Icon, label }) => (
                      <button key={key}
                        onClick={() => setFilter(filter === key ? "all" : key)}
                        className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-all ${
                          filter === key
                            ? "border-subtle bg-panel"
                            : "border-line bg-surface hover:bg-panel"
                        }`}>
                        <Icon size={12} className="text-muted" />
                        <span className="text-sm font-semibold text-soft">{counts[key]}</span>
                        <span className="text-[10px] text-muted">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Comments */}
                  <div className="space-y-2">
                    {filtered?.length === 0 && (
                      <p className="text-center text-xs text-muted py-4">No {filter} findings</p>
                    )}
                    {filtered?.map((c, i) => (
                      <CommentCard key={i} comment={c} index={i} onLineClick={handleLineClick} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewPage;
