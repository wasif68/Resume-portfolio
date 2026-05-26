import React, { useState, useEffect } from "react";
import { dsaTasks as defaultTasks } from "../data/dsaTasks";
import { fetchDsaTasks, saveDsaTasks } from "../utils/syncService";

export default function DSAProgressSection({ isEditMode, onStatsUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const languages = ["Php", "Java", "Python"];
  const statuses = ["Solved", "Pending", "Pushed to GitHub"];

  // 1. Initial Load from Supabase/Local
  useEffect(() => {
    const defaultWithLangs = defaultTasks.map(t => ({ 
      ...t, 
      selectedLangs: t.selectedLangs || ["Python"] 
    }));

    fetchDsaTasks(defaultWithLangs).then(res => {
      if (res && res.data) {
        setTasks(res.data);
      }
      setIsInitialLoad(false);
    });
  }, []);

  // 2. Save to Supabase/Local on Change
  useEffect(() => {
    if (isInitialLoad) return;
    
    saveDsaTasks(tasks);

    if (onStatsUpdate) {
      onStatsUpdate({
        solved: tasks.filter(t => t.status === "Solved").length,
        total: tasks.length
      });
    }
  }, [tasks, isInitialLoad, onStatsUpdate]);

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const toggleTaskLanguage = (id, lang) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const currentLangs = task.selectedLangs || [];
    const nextLangs = currentLangs.includes(lang)
      ? currentLangs.filter(l => l !== lang)
      : [...currentLangs, lang];
    
    updateTask(id, { selectedLangs: nextLangs });
  };

  const filteredTasks = tasks.filter((task, index) => {
    const numericId = (index + 1).toString();
    const query = search.toLowerCase().trim();
    
    const matchesSearch = 
      query === "" ||
      task.title.toLowerCase().includes(query) ||
      task.slug.toLowerCase().includes(query) ||
      numericId === query;

    const matchesStatus = statusFilter === "All" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dsa-dashboard-container" style={{ marginTop: "40px" }}>
      <div className="resume-header-controls" style={{ borderBottom: "none", marginBottom: "16px", padding: 0 }}>
        <div className="header-title-wrapper">
          <h2 className="dashboard-title" style={{ fontSize: "24px" }}>DSA Problem Tracker</h2>
          {isEditMode && (
            <p className="dashboard-subtitle">
              ✏️ Edit Mode: Manage problem statuses and languages
            </p>
          )}
        </div>
      </div>

      <div className="resume-card dsa-controls-card" style={{ marginBottom: "20px", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Search */}
          <div className="form-group">
            <label style={{ marginBottom: "8px", display: "block", fontWeight: "600" }}>Search Problems</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by ID, Title, or Slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "40px" }}
              />
              <svg 
                viewBox="0 0 24 24" 
                width="18" height="18" 
                stroke="var(--text-secondary)" 
                strokeWidth="2" 
                fill="none" 
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="form-group">
            <label style={{ marginBottom: "8px", display: "block", fontWeight: "600" }}>Global Status Filter</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["All", ...statuses].map(s => (
                <button
                  key={s}
                  className={`filter-btn ${statusFilter === s ? "active" : ""}`}
                  onClick={() => setStatusFilter(s)}
                  style={{ flex: 1, minWidth: "80px" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div className="resume-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="transcript-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--code-bg)", borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: "16px", textAlign: "left", width: "60px" }}>#</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Problem Details</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Platform</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Language Used</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Progress Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                    No problems found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const displayId = tasks.indexOf(task) + 1;
                  return (
                    <tr key={task.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "16px", color: "var(--text-secondary)", fontWeight: "600" }}>
                        {displayId}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{ fontWeight: "700", color: "var(--text-h)" }}>{task.title}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--mono)" }}>
                          {task.slug}
                        </div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ 
                          fontSize: "12px", 
                          padding: "4px 8px", 
                          borderRadius: "4px", 
                          background: task.platform === "HackerRank" ? "rgba(46, 184, 92, 0.1)" : "rgba(59, 130, 246, 0.1)",
                          color: task.platform === "HackerRank" ? "#2eb85c" : "#3b82f6",
                          fontWeight: "600"
                        }}>
                          {task.platform}
                        </span>
                      </td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                          {languages.map(l => (
                            <button
                              key={l}
                              disabled={!isEditMode}
                              onClick={() => toggleTaskLanguage(task.id, l)}
                              style={{ 
                                fontSize: "11px", 
                                background: (task.selectedLangs || []).includes(l) ? "var(--accent-bg)" : "var(--border)", 
                                border: (task.selectedLangs || []).includes(l) ? "1px solid var(--accent)" : "1px solid transparent",
                                padding: "4px 10px", 
                                borderRadius: "6px",
                                color: (task.selectedLangs || []).includes(l) ? "var(--accent)" : "var(--text-secondary)",
                                cursor: isEditMode ? "pointer" : "default",
                                transition: "all 0.2s ease",
                                opacity: !isEditMode && !(task.selectedLangs || []).includes(l) ? 0 : 1,
                                display: !isEditMode && !(task.selectedLangs || []).includes(l) ? "none" : "inline-block"
                              }}
                            >
                              {l}
                            </button>
                          ))}
                          {!isEditMode && (task.selectedLangs || []).length === 0 && (
                            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontStyle: "italic" }}>None</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        {isEditMode ? (
                          <select 
                            className="form-input" 
                            style={{ width: "auto", fontSize: "12px", padding: "4px 8px" }}
                            value={task.status}
                            onChange={(e) => updateTask(task.id, { status: e.target.value })}
                          >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span style={{ 
                            fontSize: "12px", 
                            fontWeight: "700",
                            color: task.status === "Solved" ? "#2eb85c" : task.status === "Pending" ? "#f9b115" : "#3b82f6"
                          }}>
                            {task.status === "Solved" && "✓ "}
                            {task.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
