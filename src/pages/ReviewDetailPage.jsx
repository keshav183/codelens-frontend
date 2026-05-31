import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Code2 } from "lucide-react";
import useReviewStore from "../store/reviewStore.js";
import CommentCard from "../components/CommentCard.jsx";
import ScoreRing from "../components/ScoreRing.jsx";

const ReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentReview, fetchReview, loading } = useReviewStore();
  useEffect(() => { fetchReview(id); }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-bg pt-14 flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-line border-t-muted rounded-full animate-spin" />
    </div>
  );

  if (!currentReview) return (
    <div className="min-h-screen bg-bg pt-14 flex flex-col items-center justify-center gap-3">
      <p className="text-sm text-muted">Review not found</p>
      <button onClick={() => navigate("/history")} className="text-xs text-soft underline">Go back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg pt-14">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-7">
          <button onClick={() => navigate("/history")}
            className="p-1.5 rounded-lg border border-line text-muted hover:text-soft hover:bg-panel transition-colors">
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-base font-semibold text-text">{currentReview.title}</h1>
            <span className="text-xs text-muted font-mono">{currentReview.language} · {new Date(currentReview.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-line bg-surface overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line bg-panel">
              <Code2 size={12} className="text-muted" />
              <span className="text-xs text-muted font-mono">Code submitted</span>
            </div>
            <pre className="p-4 overflow-auto text-xs font-mono text-soft leading-relaxed max-h-[480px]">{currentReview.code}</pre>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3.5 rounded-xl border border-line bg-surface">
              <ScoreRing score={currentReview.score} />
              <div>
                <p className="text-xs font-medium text-soft mb-1">Summary</p>
                <p className="text-xs text-muted leading-relaxed">{currentReview.summary}</p>
              </div>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {currentReview.comments?.map((c, i) => <CommentCard key={i} comment={c} index={i} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewDetailPage;
