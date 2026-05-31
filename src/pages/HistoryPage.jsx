import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Trash2, Clock, ChevronRight, TrendingUp, Bug, Trophy, Code2 } from "lucide-react";
import toast from "react-hot-toast";
import useReviewStore from "../store/reviewStore.js";

const timeAgo = (d) => {
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const HistoryPage = () => {
  const { history, stats, pagination, historyLoading, fetchHistory, fetchStats, deleteReview } = useReviewStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchHistory(page); fetchStats(); }, [page]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    const r = await deleteReview(id);
    if (r.success) toast.success("Deleted"); else toast.error(r.message);
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-bg pt-14">
      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h1 className="text-lg font-semibold text-text mb-0.5">Review History</h1>
          <p className="text-xs text-muted">All your past code analyses</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Reviews", value: stats.totalReviews, icon: Code2 },
              { label: "Avg Score", value: stats.avgScore ? `${stats.avgScore}/10` : "—", icon: TrendingUp },
              { label: "Bugs Found", value: stats.bugCount, icon: Bug },
              { label: "Top Language", value: stats.topLanguage || "—", icon: Trophy },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="p-4 rounded-xl border border-line bg-surface">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon size={12} className="text-muted" />
                  <span className="text-[10px] text-muted uppercase tracking-wider font-medium">{label}</span>
                </div>
                <p className="text-xl font-bold text-text font-mono">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* List */}
        <div className="space-y-2">
          {historyLoading && [1, 2, 3].map(i => (
            <div key={i} className="h-16 rounded-xl border border-line bg-surface animate-pulse" />
          ))}

          {!historyLoading && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <History size={24} className="text-muted" />
              <p className="text-sm text-muted">No reviews yet. Go analyze some code!</p>
            </div>
          )}

          {!historyLoading && history.map((review, i) => (
            <div key={review._id}
              onClick={() => navigate(`/review/${review._id}`)}
              className="group flex items-center gap-3 p-3.5 rounded-xl border border-line bg-surface hover:bg-panel transition-colors cursor-pointer">

              <div className="w-10 h-10 rounded-lg border border-line bg-panel flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-soft leading-none">{review.score ?? "—"}</span>
                <span className="text-[9px] text-muted mt-0.5">score</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-text truncate">{review.title || "Untitled"}</span>
                  <span className="text-[10px] font-mono text-muted bg-panel border border-line px-1.5 py-0.5 rounded flex-shrink-0">{review.language}</span>
                  {review.source === "github_pr" && (
                    <span className="text-[10px] font-mono text-muted bg-panel border border-line px-1.5 py-0.5 rounded flex-shrink-0">PR</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] text-muted font-mono">
                    <Clock size={9} />{timeAgo(review.createdAt)}
                  </span>
                  <span className="text-[10px] text-muted font-mono">{review.comments?.length ?? 0} findings</span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={e => handleDelete(e, review._id)} disabled={deletingId === review._id}
                  className="p-1.5 rounded-md text-muted hover:text-soft hover:bg-subtle/30 transition-all opacity-0 group-hover:opacity-100">
                  {deletingId === review._id
                    ? <span className="w-3.5 h-3.5 border border-muted border-t-soft rounded-full animate-spin block" />
                    : <Trash2 size={13} />}
                </button>
                <ChevronRight size={14} className="text-muted group-hover:text-soft transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs border border-line text-muted hover:text-soft hover:bg-panel transition-colors disabled:opacity-40">
              Previous
            </button>
            <span className="text-xs text-muted font-mono">{page} / {pagination.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={!pagination.hasNext}
              className="px-3 py-1.5 rounded-lg text-xs border border-line text-muted hover:text-soft hover:bg-panel transition-colors disabled:opacity-40">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default HistoryPage;
