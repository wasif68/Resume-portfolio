import React, { useState, useEffect } from "react";
import { fetchTodos, saveTodos } from "../utils/syncService";
import { getCurrentUser, onAuthStateChange } from "../utils/supabase";
import DSAProgressSection from "../components/DSAProgressSection";
import AuthModal from "../components/AuthModal";

export default function Todo() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [dbSource, setDbSource] = useState("local");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dsaStats, setDsaStats] = useState({ solved: 0, total: 0 });

  // Auth State
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("view");
  const isAdmin = !!user;
  const isEditMode = isAdmin && mode === "owner";

  useEffect(() => {
    // 1. Initial Data Load
    const defaultTasks = [
      { id: "dsa-tracker-task", text: "DSA Problem Tracker", completed: false, priority: "High", type: "dsa" },
      { id: "todo-1", text: "Finish portfolio header adjustments", completed: true, priority: "High" },
      { id: "todo-2", text: "Add project CRUD views to dashboard", completed: false, priority: "High" },
      { id: "todo-3", text: "Draft new blog post in journal", completed: false, priority: "Medium" },
    ];

    fetchTodos(defaultTasks).then((res) => {
      if (res && res.data) {
        // Ensure DSA tracker is always there if missing from loaded data
        const loadedTasks = res.data;
        const hasDsa = loadedTasks.some(t => t.id === "dsa-tracker-task");
        if (!hasDsa) {
          loadedTasks.unshift({ id: "dsa-tracker-task", text: "DSA Problem Tracker", completed: false, priority: "High", type: "dsa" });
        }
        setTasks(loadedTasks);
        setDbSource(res.source);
      }
      setIsInitialLoad(false);
    });

    // 2. Auth Status
    getCurrentUser().then(r => {
      setUser(r?.user ?? null);
      if (r?.user) setMode("owner");
    });

    const sub = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) setMode("owner");
      else setMode("view");
    });

    return () => {
      try { sub?.unsubscribe?.(); } catch(e) {}
    };
  }, []);

  const handleRequestModeChange = (targetMode) => {
    if (targetMode === "view") {
      setMode("view");
      return;
    }
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setMode("owner");
  };

  const handleAuthSuccess = async () => {
    setAuthModalOpen(false);
    const r = await getCurrentUser();
    setUser(r?.user ?? null);
    if (r?.user) setMode("owner");
  };

  // Save to localStorage and Supabase when tasks change (only after initial load has finished)
  useEffect(() => {
    if (isInitialLoad) return;
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    saveTodos(tasks).then((res) => {
      setDbSource(res.success ? "supabase" : "local");
    });
  }, [tasks, isInitialLoad]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask = {
      id: crypto.randomUUID(),
      text: input.trim(),
      completed: false,
      priority
    };
    setTasks([newTask, ...tasks]);
    setInput("");
  };

  const toggleTask = (id) => {
    if (!isEditMode) return;
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    if (!isEditMode) return;
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    if (!isEditMode) return;
    setTasks(tasks.filter((t) => !t.completed));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true;
  });

  const dsaPercent = dsaStats.total > 0 ? Math.round((dsaStats.solved / dsaStats.total) * 100) : 0;
  
  // Custom progress calculation: Treat DSA as one task that is X% complete
  const normalTasks = tasks.filter(t => t.type !== "dsa");
  const dsaTask = tasks.find(t => t.type === "dsa");
  
  const totalWeight = normalTasks.length + (dsaTask ? 1 : 0);
  const completedWeight = normalTasks.filter(t => t.completed).length + (dsaTask ? (dsaPercent / 100) : 0);
  
  const percentComplete = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  const totalTasksCount = normalTasks.length + (dsaTask ? 1 : 0);

  return (
    <div className="todo-page-container">
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
      
      {/* Page Header */}
      <div className="resume-header-controls" style={{ borderBottom: "none", marginBottom: "16px" }}>
        <div className="header-title-wrapper">
          <h1 className="dashboard-title">Task Workspace</h1>
          <p className="dashboard-subtitle">
            {isEditMode ? "✏️ Owner Mode: Manage your development roadmap" : "👁️ View Mode: Explore planned and completed milestones"}
          </p>
        </div>

        <div className="header-actions">
          <div className={`toggle-container ${mode}`}>
            <div className="toggle-slider" />
            <button
              className={`toggle-option ${mode === "view" ? "active" : ""}`}
              onClick={() => handleRequestModeChange("view")}
              title="View mode"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button
              className={`toggle-option ${mode === "owner" ? "active" : ""}`}
              onClick={() => handleRequestModeChange("owner")}
              title="Owner mode"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard Card */}
      <div className="resume-card todo-stats-card" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h3 style={{ margin: "0 0 6px 0", color: "var(--text-h)" }}>Task Completion Progress</h3>
            <span style={{ fontSize: "14px", color: "var(--text)" }}>
              Overall completion across {totalTasksCount} milestones ({percentComplete}%)
            </span>
          </div>
          {isEditMode && normalTasks.filter(t => t.completed).length > 0 && (
            <button className="btn-secondary" onClick={clearCompleted} style={{ padding: "6px 14px", fontSize: "13px" }}>
              Clear Completed
            </button>
          )}
        </div>
        {/* Progress Bar */}
        <div style={{ width: "100%", height: "10px", background: "var(--border)", borderRadius: "5px", marginTop: "16px", overflow: "hidden" }}>
          <div style={{
            width: `${percentComplete}%`,
            height: "100%",
            background: "var(--text-h)",
            borderRadius: "5px",
            transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          }}></div>
        </div>
      </div>

      <div className="resume-body-grid" style={{ gridTemplateColumns: isEditMode ? "1.4fr 1fr" : "1fr" }}>
        {/* Left Pane: Tasks List */}
        <div style={{ maxWidth: isEditMode ? "none" : "800px", margin: isEditMode ? "0" : "0 auto", width: "100%" }}>
          {/* Filters Row */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {["All", "Active", "Completed"].map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List Card */}
          <div className="resume-card" style={{ padding: "20px" }}>
            {filteredTasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, marginBottom: "12px" }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h4 style={{ margin: "0 0 4px 0", color: "var(--text-h)" }}>No tasks found</h4>
                <p style={{ fontSize: "14px", color: "var(--text)" }}>
                  {filter === "All"
                    ? (isEditMode ? "Add a new task below to kickstart your work!" : "No tasks have been added yet.")
                    : `No ${filter.toLowerCase()} tasks match this filter.`}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="todo-item-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "var(--code-bg)",
                      border: `1px solid ${task.completed ? "var(--border)" : "transparent"}`,
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                      <label className="checkbox-container" style={{ position: "relative", cursor: (isEditMode && task.type !== "dsa") ? "pointer" : "default", display: "inline-block", width: "20px", height: "20px" }}>
                        <input
                          type="checkbox"
                          checked={task.type === "dsa" ? dsaPercent === 100 : task.completed}
                          onChange={() => task.type !== "dsa" && toggleTask(task.id)}
                          disabled={!isEditMode || task.type === "dsa"}
                          style={{
                            opacity: 0,
                            width: 0,
                            height: 0,
                            position: "absolute"
                          }}
                        />
                        <span className={`custom-checkbox ${ (task.type === "dsa" ? dsaPercent === 100 : task.completed) ? "checked" : ""}`} style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "20px",
                          width: "20px",
                          backgroundColor: (task.type === "dsa" ? dsaPercent === 100 : task.completed) ? "var(--accent)" : "transparent",
                          border: `2px solid ${(task.type === "dsa" ? dsaPercent === 100 : task.completed) ? "var(--accent)" : "var(--text)"}`,
                          borderRadius: "6px",
                          transition: "all 0.2s ease"
                        }}>
                          {(task.type === "dsa" ? dsaPercent === 100 : task.completed) && (
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", top: "1px", left: "1px" }}>
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </span>
                      </label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                        <span style={{
                          fontSize: "15px",
                          color: task.completed ? "var(--text)" : "var(--text-h)",
                          textDecoration: task.completed ? "line-through" : "none",
                          opacity: task.completed ? 0.6 : 1,
                          transition: "all 0.2s ease",
                          wordBreak: "break-word"
                        }}>
                          {task.text}
                        </span>
                        {task.type === "dsa" && (
                          <div style={{ width: "100%", maxWidth: "150px", height: "6px", background: "var(--border)", borderRadius: "3px", marginTop: "4px", overflow: "hidden" }}>
                            <div style={{
                              width: `${dsaPercent}%`,
                              height: "100%",
                              background: "var(--accent)",
                              borderRadius: "3px",
                              transition: "width 0.4s ease"
                            }}></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className={`priority-badge ${task.priority.toLowerCase()}`} style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        letterSpacing: "0.2px",
                        textTransform: "uppercase"
                      }}>
                        {task.priority}
                      </span>
                      {isEditMode && (
                        <button
                          className="icon-action-btn delete-btn"
                          onClick={() => deleteTask(task.id)}
                          title="Delete task"
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Create Task Form */}
        {isEditMode && (
          <div>
            <div className="resume-card glass-panel" style={{ padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "var(--text-h)", borderBottom: "2px solid var(--border)", paddingBottom: "8px" }}>
                Add New Task
              </h3>
              <form onSubmit={addTask} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="form-group">
                  <label>Task Description *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Design app database schema"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Priority Level</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["Low", "Medium", "High"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`filter-btn ${priority === p ? "active" : ""}`}
                        onClick={() => setPriority(p)}
                        style={{ flex: 1, padding: "6px 0", fontSize: "13px" }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                  Add Task
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* DSA Progress Section */}
      <DSAProgressSection isEditMode={isEditMode} onStatsUpdate={setDsaStats} />
    </div>
  );
}