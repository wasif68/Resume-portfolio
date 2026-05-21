import React, { useState, useEffect } from "react";
import { fetchJournalEntries, saveJournalEntries } from "../utils/syncService";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [dbSource, setDbSource] = useState("local");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load from Supabase (or localStorage fallback) on mount
  useEffect(() => {
    const defaultEntries = [
      {
        id: "entry-1",
        title: "Launched Personal Dashboard V1",
        date: "2026-05-20T08:30:00Z",
        content: "Today I successfully initialized the React + Vite personal portfolio dashboard application.\n\nKey accomplishments:\n- Established modular resume sections (header, experience, skills, and projects).\n- Added light and dark mode CSS variables to match standard theme settings.\n- Set up local storage persistence for user data."
      },
      {
        id: "entry-2",
        title: "Deep Dive into React 19 state",
        date: "2026-05-18T14:20:00Z",
        content: "Exploring the new feature integrations in React 19. The hydration error logs are much cleaner, and the server action support is very promising.\n\nNeed to keep refactoring hooks to make state updates highly optimized."
      }
    ];

    fetchJournalEntries(defaultEntries).then((res) => {
      if (res && res.data) {
        setEntries(res.data);
        setDbSource(res.source);
        if (res.data.length > 0) {
          setActiveId(res.data[0].id);
        }
      }
      setIsInitialLoad(false);
    });
  }, []);

  // Sync to localStorage immediately, and debounce Supabase sync to avoid keystroke rate-limiting
  useEffect(() => {
    if (isInitialLoad) return;
    
    // Save to localStorage immediately
    localStorage.setItem("journal_entries", JSON.stringify(entries));

    // Debounce Supabase write by 1 second
    const timer = setTimeout(() => {
      saveJournalEntries(entries).then((res) => {
        setDbSource(res.success ? "supabase" : "local");
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [entries, isInitialLoad]);

  const activeEntry = entries.find((e) => e.id === activeId);

  const createNewEntry = () => {
    const newEntry = {
      id: crypto.randomUUID(),
      title: "Untitled Entry",
      date: new Date().toISOString(),
      content: ""
    };
    setEntries([newEntry, ...entries]);
    setActiveId(newEntry.id);
    setIsEditing(true);
  };

  const updateActiveEntry = (field, value) => {
    setEntries(
      entries.map((entry) =>
        entry.id === activeId ? { ...entry, [field]: value } : entry
      )
    );
  };

  const deleteEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      const remaining = entries.filter((e) => e.id !== id);
      setEntries(remaining);
      setActiveId(remaining[0]?.id || null);
      setIsEditing(false);
    }
  };

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Filter entries based on search query
  const filteredEntries = entries.filter((e) => {
    const query = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(query) ||
      e.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="journal-page-container">
      {/* Page Header */}
      <div className="resume-header-controls" style={{ borderBottom: "none", marginBottom: "16px" }}>
        <div className="header-title-wrapper">
          <h1 className="dashboard-title">Journal Workspace</h1>
          <p className="dashboard-subtitle">Document your coding journey, ideas, and accomplishments</p>
        </div>
      </div>

      <div className="resume-body-grid" style={{ gridTemplateColumns: "1fr 1.6fr", gap: "24px" }}>
        {/* Left Pane: Entry Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            type="button"
            className="btn-primary"
            onClick={createNewEntry}
            style={{ width: "100%", justifyContent: "center", padding: "12px" }}
          >
            + New Journal Entry
          </button>

          {/* Search Input */}
          <input
            type="text"
            className="journal-search-input"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Entries list container */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "60vh", overflowY: "auto" }}>
            {filteredEntries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--text)" }}>
                <p style={{ fontSize: "14px" }}>No entries found.</p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`journal-entry-item ${entry.id === activeId ? "active" : ""}`}
                  onClick={() => {
                    setActiveId(entry.id);
                    setIsEditing(false);
                  }}
                >
                  <div className="journal-entry-title">{entry.title || "Untitled Entry"}</div>
                  <div className="journal-entry-date">{formatDate(entry.date)}</div>
                  <div className="journal-entry-snippet">
                    {entry.content || "Empty content..."}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Entry Editor / Previewer */}
        <div>
          {activeEntry ? (
            <div className="resume-card glass-panel" style={{ padding: "28px", minHeight: "65vh", display: "flex", flexDirection: "column" }}>
              {/* Toolbar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid var(--border)", paddingBottom: "12px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className={`filter-btn ${!isEditing ? "active" : ""}`}
                    onClick={() => setIsEditing(false)}
                  >
                    Preview
                  </button>
                  <button
                    className={`filter-btn ${isEditing ? "active" : ""}`}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                </div>
                <button
                  type="button"
                  className="icon-action-btn delete-btn"
                  onClick={() => deleteEntry(activeEntry.id)}
                  title="Delete Entry"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              {/* Title & Metadata */}
              <div style={{ marginBottom: "16px" }}>
                {isEditing ? (
                  <input
                    type="text"
                    className="editable-input name-input"
                    value={activeEntry.title}
                    onChange={(e) => updateActiveEntry("title", e.target.value)}
                    placeholder="Entry Title"
                    style={{ fontSize: "24px", fontWeight: "700", borderStyle: "dashed" }}
                  />
                ) : (
                  <h2 style={{ border: "none", margin: 0, padding: 0, fontSize: "24px", color: "var(--text-h)" }}>
                    {activeEntry.title || "Untitled Entry"}
                  </h2>
                )}
                <div style={{ fontSize: "13px", color: "var(--text)", marginTop: "6px", fontFamily: "var(--mono)", opacity: 0.8 }}>
                  📅 Created: {formatDate(activeEntry.date)}
                </div>
              </div>

              {/* Content Panel */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {isEditing ? (
                  <textarea
                    className="editable-textarea"
                    value={activeEntry.content}
                    onChange={(e) => updateActiveEntry("content", e.target.value)}
                    placeholder="Start writing down your ideas, goals, or meeting notes..."
                    style={{
                      flex: 1,
                      minHeight: "350px",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      fontFamily: "inherit",
                      borderStyle: "dashed",
                      resize: "none"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      flex: 1,
                      fontSize: "15px",
                      lineHeight: "1.7",
                      color: "var(--text-h)",
                      whiteSpace: "pre-line",
                      padding: "4px"
                    }}
                  >
                    {activeEntry.content || (
                      <span style={{ fontStyle: "italic", color: "var(--text)", opacity: 0.6 }}>
                        No content written. Click Edit to start writing.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="resume-card glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "65vh", textAlign: "center", padding: "40px" }}>
              <svg viewBox="0 0 24 24" width="64" height="64" stroke="var(--accent)" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginBottom: "16px" }}>
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <h3 style={{ margin: "0 0 6px 0", color: "var(--text-h)" }}>No Entry Selected</h3>
              <p style={{ fontSize: "14px", color: "var(--text)", maxWidth: "260px" }}>
                Choose an existing entry from the list or create a brand new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}