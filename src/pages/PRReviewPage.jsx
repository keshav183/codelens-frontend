import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GitBranch, GitPullRequest, RefreshCw, Play, ExternalLink, Send, CheckCircle, FileCode, Lock, Unlock, GitMerge, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import useGithubStore from "../store/githubStore.js";
import CommentCard from "../components/CommentCard.jsx";
import ScoreRing from "../components/ScoreRing.jsx";
import LoadingAnalysis from "../components/LoadingAnalysis.jsx";

const RepoCard = ({ repo, selected, onClick }) => (
  <button onClick={onClick}
    className={`w-full text-left p-3 rounded-lg border transition-colors ${selected ? "border-subtle bg-panel" : "border-line bg-surface hover:bg-panel"}`}>
    <div className="flex items-center gap-2">
      {repo.private ? <Lock size={11} className="text-muted" /> : <Unlock size={11} className="text-muted" />}
      <div className="min-w-0">
        <p className="text-xs font-medium text-soft truncate">{repo.name}</p>
        <p className="text-[10px] text-muted font-mono">{repo.language || "—"}</p>
      </div>
    </div>
  </button>
);

const PRCard = ({ pr, selected, onClick }) => (
  <button onClick={onClick}
    className={`w-full text-left p-3 rounded-lg border transition-colors ${selected ? "border-subtle bg-panel" : "border-line bg-surface hover:bg-panel"}`}>
    <div className="flex items-start gap-2">
      <GitPullRequest size={11} className="text-muted mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-soft line-clamp-2 leading-snug">{pr.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-mono text-muted">#{pr.number}</span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono text-muted"><Plus size={8} />{pr.additions}</span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono text-muted"><Minus size={8} />{pr.deletions}</span>
        </div>
      </div>
    </div>
  </button>
);

const PRReviewPage = () => {
  const [searchParams] = useSearchParams();
  const { connected, username, repos, prs, prReview, statusLoading, reposLoading, prsLoading, reviewing, postingToGithub,
    fetchStatus, getAuthUrl, disconnect, fetchRepos, fetchPRs, reviewPR, postToGithub, clearPRReview } = useGithubStore();
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedPR, setSelectedPR] = useState(null);
  const [repoSearch, setRepoSearch] = useState("");

  useEffect(() => {
    const s = searchParams.get("github");
    if (s === "connected") { toast.success(`GitHub connected as @${searchParams.get("username")}`); window.history.replaceState({}, "", window.location.pathname); }
    else if (s === "error") { toast.error("GitHub connection failed"); window.history.replaceState({}, "", window.location.pathname); }
  }, [searchParams]);

  useEffect(() => { fetchStatus(); }, []);
  useEffect(() => { if (connected) fetchRepos(); }, [connected]);

  const handleConnect = async () => {
    try { window.location.href = await getAuthUrl(); }
    catch { toast.error("Failed to get auth URL"); }
  };

  const handleSelectRepo = async (repo) => {
    setSelectedRepo(repo); setSelectedPR(null); clearPRReview();
    const r = await fetchPRs(repo.owner, repo.name);
    if (!r.success) toast.error(r.message);
  };

  const handleReview = async () => {
    if (!selectedRepo || !selectedPR) return;
    clearPRReview();
    const r = await reviewPR(selectedRepo.owner, selectedRepo.name, selectedPR.number);
    if (!r.success) toast.error(r.message);
  };

  const handlePost = async () => {
    const r = await postToGithub(prReview.id);
    if (r.success) toast.success(r.message); else toast.error(r.message);
  };

  const filteredRepos = repos.filter(r => r.name.toLowerCase().includes(repoSearch.toLowerCase()));

  if (statusLoading) return (
    <div className="min-h-screen bg-bg pt-14 flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-line border-t-muted rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg pt-14">
      <div className="max-w-7xl mx-auto px-6 py-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-text mb-0.5">PR Review</h1>
            <p className="text-xs text-muted">AI-powered GitHub Pull Request analysis</p>
          </div>
          {connected && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface">
                <GitBranch size={12} className="text-muted" />
                <span className="text-xs font-mono text-soft">@{username}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-muted" />
              </div>
              <button onClick={disconnect} className="text-xs text-muted hover:text-soft transition-colors px-1">Disconnect</button>
            </div>
          )}
        </div>

        {!connected && (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-14 h-14 rounded-xl border border-line bg-surface flex items-center justify-center">
              <GitBranch size={24} className="text-muted" />
            </div>
            <div className="text-center">
              <h2 className="text-base font-semibold text-text mb-1">Connect GitHub</h2>
              <p className="text-xs text-muted max-w-xs">Connect your GitHub account to review PRs and post inline comments.</p>
            </div>
            <button onClick={handleConnect}
              className="flex items-center gap-2 bg-text hover:bg-soft text-surface font-medium text-sm px-5 py-2.5 rounded-lg transition-colors">
              <GitBranch size={14} />Connect GitHub
            </button>
          </div>
        )}

        {connected && (
          <div className="grid grid-cols-12 gap-4">

            {/* Repos */}
            <div className="col-span-12 lg:col-span-3">
              <div className="rounded-xl border border-line bg-surface overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-line bg-panel">
                  <span className="text-xs font-medium text-soft">Repositories</span>
                  <button onClick={fetchRepos} disabled={reposLoading} className="text-muted hover:text-soft transition-colors">
                    <RefreshCw size={12} className={reposLoading ? "animate-spin" : ""} />
                  </button>
                </div>
                <div className="p-2 border-b border-line">
                  <input type="text" placeholder="Search repos..." value={repoSearch} onChange={e => setRepoSearch(e.target.value)}
                    className="w-full bg-panel border border-line text-soft text-xs px-2.5 py-1.5 rounded-md focus:outline-none focus:border-subtle placeholder:text-muted font-mono" />
                </div>
                <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
                  {reposLoading && <div className="flex justify-center py-6"><span className="w-4 h-4 border border-line border-t-muted rounded-full animate-spin" /></div>}
                  {!reposLoading && filteredRepos.length === 0 && <p className="text-center text-xs text-muted py-6">No repos found</p>}
                  {!reposLoading && filteredRepos.map(r => <RepoCard key={r.id} repo={r} selected={selectedRepo?.id === r.id} onClick={() => handleSelectRepo(r)} />)}
                </div>
              </div>
            </div>

            {/* PRs */}
            <div className="col-span-12 lg:col-span-3">
              <div className="rounded-xl border border-line bg-surface overflow-hidden">
                <div className="px-3 py-2.5 border-b border-line bg-panel">
                  <span className="text-xs font-medium text-soft">{selectedRepo ? `${selectedRepo.name} — PRs` : "Pull Requests"}</span>
                </div>
                <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
                  {!selectedRepo && (
                    <div className="flex flex-col items-center justify-center py-12 gap-2">
                      <GitMerge size={18} className="text-muted" />
                      <p className="text-xs text-muted">Select a repository first</p>
                    </div>
                  )}
                  {selectedRepo && prsLoading && <div className="flex justify-center py-6"><span className="w-4 h-4 border border-line border-t-muted rounded-full animate-spin" /></div>}
                  {selectedRepo && !prsLoading && prs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 gap-2">
                      <CheckCircle size={18} className="text-muted" />
                      <p className="text-xs text-muted">No open PRs</p>
                    </div>
                  )}
                  {selectedRepo && !prsLoading && prs.map(pr => (
                    <PRCard key={pr.number} pr={pr} selected={selectedPR?.number === pr.number}
                      onClick={() => { setSelectedPR(pr); clearPRReview(); }} />
                  ))}
                </div>
                {selectedPR && (
                  <div className="p-2 border-t border-line">
                    <button onClick={handleReview} disabled={reviewing}
                      className="w-full flex items-center justify-center gap-2 bg-text hover:bg-soft text-surface font-medium text-xs py-2 rounded-lg transition-colors disabled:opacity-50">
                      {reviewing
                        ? <><span className="w-3.5 h-3.5 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />Analyzing...</>
                        : <><Play size={12} fill="currentColor" />Analyze PR</>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="col-span-12 lg:col-span-6">
              <div className="rounded-xl border border-line bg-surface overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-line bg-panel">
                  <span className="text-xs font-medium text-soft">AI Review</span>
                  {prReview?.github?.prUrl && (
                    <a href={prReview.github.prUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-muted hover:text-soft transition-colors">
                      View PR <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                <div className="overflow-y-auto max-h-[520px]">
                  {reviewing && <LoadingAnalysis />}
                  {!reviewing && !prReview && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <GitPullRequest size={20} className="text-muted" />
                      <p className="text-xs text-muted text-center">Select a repo, pick a PR,<br />then click Analyze PR</p>
                    </div>
                  )}

                  {!reviewing && prReview && (
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg border border-line bg-panel">
                        <GitPullRequest size={12} className="text-muted flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-soft truncate">{prReview.title}</p>
                          <span className="text-[10px] font-mono text-muted">{prReview.github?.owner}/{prReview.github?.repo}</span>
                        </div>
                      </div>

                      {prReview.filesReviewed?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {prReview.filesReviewed.map(f => (
                            <span key={f.filename} className="flex items-center gap-1 text-[10px] font-mono text-muted border border-line bg-panel px-2 py-0.5 rounded">
                              <FileCode size={9} />{f.filename.split("/").pop()}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3 p-3.5 rounded-lg border border-line bg-panel">
                        <ScoreRing score={prReview.score} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-soft mb-1.5">Summary</p>
                          <p className="text-xs text-muted leading-relaxed">{prReview.summary}</p>
                        </div>
                      </div>

                      {!prReview.github?.postedToGithub
                        ? <button onClick={handlePost} disabled={postingToGithub}
                            className="w-full flex items-center justify-center gap-2 border border-line text-soft font-medium text-xs py-2 rounded-lg hover:bg-panel transition-colors disabled:opacity-50">
                            {postingToGithub
                              ? <><span className="w-3.5 h-3.5 border border-muted border-t-soft rounded-full animate-spin" />Posting...</>
                              : <><Send size={12} />Post Comments to GitHub</>}
                          </button>
                        : <div className="flex items-center justify-center gap-2 py-2 text-xs text-soft">
                            <CheckCircle size={14} />Comments posted to GitHub
                          </div>}

                      <div className="space-y-2">
                        {prReview.comments?.map((c, i) => (
                          <div key={i}>
                            {c.path && <p className="text-[10px] font-mono text-muted mb-1 ml-1">📄 {c.path}</p>}
                            <CommentCard comment={c} index={i} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PRReviewPage;
