import React, { useState, useMemo } from "react";
import { contestProblems } from "../data/contestData";

export default function ContestSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  // Derive unique categories for filters
  const platforms = ["All", ...new Set(contestProblems.map(p => p.platform))];
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const algorithms = ["All", "Graphs", "Dynamic Programming", "Greedy", "Sorting", "Trees", "Backtracking", "Sliding Window", "MST", "BFS", "DFS"];

  // Statistics
  const stats = useMemo(() => {
    const solved = contestProblems.filter(p => p.status === "Solved").length;
    const uniqueAlgos = new Set();
    contestProblems.forEach(p => {
      p.concept.split(",").forEach(c => uniqueAlgos.add(c.trim()));
    });
    
    const platformCount = new Set(contestProblems.map(p => p.platform)).size;
    
    const languages = {};
    contestProblems.forEach(p => {
      languages[p.language] = (languages[p.language] || 0) + 1;
    });
    const mostUsedLang = Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return { solved, total: contestProblems.length, algos: uniqueAlgos.size, platforms: platformCount, language: mostUsedLang };
  }, []);

  // Filter Logic
  const filteredProblems = contestProblems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.concept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === "All" || p.platform === selectedPlatform;
    const matchesDifficulty = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    
    // Algorithm filter is a bit more complex since concepts can be comma-separated
    const matchesAlgorithm = selectedAlgorithm === "All" || 
                             p.concept.toLowerCase().includes(selectedAlgorithm.toLowerCase());

    return matchesSearch && matchesPlatform && matchesDifficulty && matchesAlgorithm;
  });

  const progressPercent = Math.round((stats.solved / stats.total) * 100);

  return (
    <div className="contest-section">
      {/* Stats Dashboard */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div className="resume-card glass-panel stat-card" style={{ textAlign: "center", padding: "20px" }}>
          <div className="stat-value" style={{ fontSize: "32px", fontWeight: "bold", color: "var(--accent)" }}>{stats.solved}</div>
          <div className="stat-label" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>Problems Solved</div>
          <div className="progress-mini" style={{ height: "4px", background: "var(--border)", borderRadius: "2px", marginTop: "12px", overflow: "hidden" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--accent)" }}></div>
          </div>
        </div>
        <div className="resume-card glass-panel stat-card" style={{ textAlign: "center", padding: "20px" }}>
          <div className="stat-value" style={{ fontSize: "32px", fontWeight: "bold", color: "var(--accent)" }}>{stats.algos}</div>
          <div className="stat-label" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>Algorithms Covered</div>
        </div>
        <div className="resume-card glass-panel stat-card" style={{ textAlign: "center", padding: "20px" }}>
          <div className="stat-value" style={{ fontSize: "32px", fontWeight: "bold", color: "var(--accent)" }}>{stats.platforms}</div>
          <div className="stat-label" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>Platforms Used</div>
        </div>
        <div className="resume-card glass-panel stat-card" style={{ textAlign: "center", padding: "20px" }}>
          <div className="stat-value" style={{ fontSize: "32px", fontWeight: "bold", color: "var(--accent)" }}>{stats.language}</div>
          <div className="stat-label" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>Most Used Language</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="resume-card glass-panel" style={{ padding: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search problems or concepts..."
            className="form-input"
            style={{ flex: "2", minWidth: "250px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="form-input" style={{ flex: "1", minWidth: "150px" }} value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
            {platforms.map(p => <option key={p} value={p}>{p} Platform</option>)}
          </select>
          <select className="form-input" style={{ flex: "1", minWidth: "150px" }} value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
            {difficulties.map(d => <option key={d} value={d}>{d} Difficulty</option>)}
          </select>
          <select className="form-input" style={{ flex: "1", minWidth: "150px" }} value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)}>
            {algorithms.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Problems List */}
      <div className="problems-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredProblems.map((p, idx) => (
          <div 
            key={p.id} 
            className={`problem-card-item ${expandedId === p.id ? 'expanded' : ''}`}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "16px 20px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden"
            }}
            onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
          >
            {/* Timeline element */}
            <div style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "4px", background: idx % 2 === 0 ? "var(--accent)" : "var(--accent-strong)", opacity: 0.6 }}></div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div className={`status-indicator ${p.status.toLowerCase()}`} style={{ 
                  width: "24px", height: "24px", borderRadius: "50%", background: "var(--accent-bg)", display: "flex", alignItems: "center", justifyContent: "center" 
                }}>
                  {p.status === "Solved" ? "✓" : "○"}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "16px", color: "var(--text-h)" }}>{p.title}</h4>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{p.platform} • {p.difficulty}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="project-tag" style={{ fontSize: "10px", background: "var(--code-bg)" }}>{p.language}</span>
                <div style={{ transform: expandedId === p.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                  ▼
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === p.id && (
              <div style={{ marginTop: "20px", padding: "16px", background: "var(--bg)", borderRadius: "8px", border: "1px solid var(--border)", animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>Core Concept</div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>{p.concept}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>Status</div>
                    <span style={{ 
                      fontSize: "12px", 
                      padding: "2px 8px", 
                      borderRadius: "12px", 
                      background: "var(--accent-bg)", 
                      color: "var(--accent-strong)",
                      fontWeight: 600
                    }}>
                      {p.status}
                    </span>
                  </div>
                </div>
                
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div className="project-tags">
                    {p.concept.split(",").map((c, i) => (
                      <span key={i} className="project-tag" style={{ fontSize: "10px" }}>{c.trim()}</span>
                    ))}
                  </div>
                  {p.link && (
                    <a 
                      href={p.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-secondary" 
                      style={{ padding: "4px 12px", fontSize: "12px" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Problem ↗
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredProblems.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
            No problems found matching your filters.
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .problem-card-item:hover {
          transform: translateX(8px);
          border-color: var(--accent) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .problem-card-item.expanded {
          border-color: var(--accent) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
