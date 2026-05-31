import { Bug, Lightbulb, AlertTriangle, Star } from "lucide-react";

const cfg = {
  bug:        { icon: Bug,           label: "Bug",        color: "text-soft",  bg: "bg-panel",   border: "border-line" },
  smell:      { icon: AlertTriangle, label: "Code Smell", color: "text-soft",  bg: "bg-panel",   border: "border-line" },
  suggestion: { icon: Lightbulb,     label: "Suggestion", color: "text-soft",  bg: "bg-surface", border: "border-line" },
  praise:     { icon: Star,          label: "Praise",     color: "text-soft",  bg: "bg-surface", border: "border-line" },
};

const typeTag = {
  bug:        "bg-gray-100 text-gray-600",
  smell:      "bg-gray-100 text-gray-600",
  suggestion: "bg-gray-50  text-gray-500",
  praise:     "bg-gray-50  text-gray-500",
};

const CommentCard = ({ comment, index, onLineClick }) => {
  const c = cfg[comment.type] || cfg.suggestion;
  const Icon = c.icon;
  return (
    <div className={`p-3 rounded-lg border ${c.border} ${c.bg}`}>
      <div className="flex items-start gap-2.5">
        <Icon size={13} className="text-muted mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${typeTag[comment.type]}`}>
              {c.label}
            </span>
            {comment.line && (
              <button
                onClick={() => onLineClick?.(comment.line)}
                className="text-[10px] font-mono text-muted hover:text-soft border border-line px-1.5 py-0.5 rounded transition-colors"
              >
                line {comment.line}
              </button>
            )}
          </div>
          <p className="text-xs text-soft leading-relaxed">{comment.message}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
