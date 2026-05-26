import React, { useState, useEffect } from "react";
import { transcriptData } from "../../data/transcriptData";
import EducationForm from "./EducationForm";

function getGradeColor(grade) {
  if (!grade) return "#94a3b8";
  const g = grade.toUpperCase();
  if (g.startsWith("A")) return "#34d399";
  if (g.startsWith("B")) return "#60a5fa";
  if (g.startsWith("C")) return "#fbbf24";
  if (g.startsWith("D")) return "#f87171";
  return "#f87171";
}

export default function EducationSection({
  education = [],
  isEditMode,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(isEditMode);
  const [expandedId, setExpandedId] = useState(null);
  const [transcriptOpenId, setTranscriptOpenId] = useState(null);
  const [minorOpenId, setMinorOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const allCourses = transcriptData.flatMap((sem) =>
    sem.courses.map((course) => ({
      ...course,
      semester: sem.semester,
    }))
  );

  const query = searchTerm.trim().toLowerCase();

  const filteredCourses = query
    ? allCourses.filter(
        (course) =>
          course.code.toLowerCase().includes(query) ||
          course.name.toLowerCase().includes(query)
      )
    : [];

  useEffect(() => {
    if (isEditMode) setOpen(true);
  }, [isEditMode]);

  return (
    <section className={`resume-card education-card ${open ? "open" : "collapsed"}`}>
      <h2 className="education-card-header">
        <button
          type="button"
          className="about-card-toggle"
          onClick={() => setOpen((p) => !p)}
          aria-expanded={open}
          aria-controls="education-card-panel"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "10px" }}>
            <span className="about-card-title">🎓 Education</span>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {isEditMode && !showForm && (
                <button
                  type="button"
                  className="btn-primary add-item-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowForm(true);
                  }}
                  style={{ padding: "4px 12px", fontSize: "12px", height: "auto" }}
                >
                  + Add Education
                </button>
              )}
              <span className={`about-card-icon ${open ? "open" : ""}`}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </button>
      </h2>

      <div id="education-card-panel" className="education-card-panel">
        <div style={{ padding: "0 20px 24px" }}>
          
          {/* ADD FORM */}
          {isEditMode && showForm && (
            <div className="inline-form-card" style={{ marginBottom: "24px", marginTop: "16px" }}>
              <h4 style={{ marginBottom: "16px", color: "var(--accent)" }}>Add Education</h4>
              <EducationForm 
                onSave={(newData) => {
                  onAdd(newData);
                  setShowForm(false);
                }} 
                onCancel={() => setShowForm(false)} 
              />
            </div>
          )}

          <div className="timeline">
            {education.map((item) => {
              const isExpanded = expandedId === item.id;
              const isTranscriptOpen = transcriptOpenId === item.id;
              const isEditing = editingId === item.id;

              if (isEditMode && isEditing) {
                return (
                  <div className="inline-form-card" key={item.id} style={{ marginBottom: "24px" }}>
                    <h4 style={{ marginBottom: "16px", color: "var(--accent)" }}>Edit Education</h4>
                    <EducationForm
                      initialData={item}
                      onSave={(updatedData) => {
                        onUpdate(item.id, updatedData);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                );
              }

              return (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  
                  <div className="timeline-header">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      style={{
                        all: "unset",
                        cursor: "pointer",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px"
                      }}
                    >
                      <span className="timeline-title">{item.degree}</span>
                      {item.minor && (
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", marginTop: "2px" }}>
                          Minor in {item.minor}
                        </span>
                      )}
                      <span className="timeline-company">{item.institution}</span>
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="timeline-date">
                        {item.startYear} — {item.endYear}
                      </span>
                      {isEditMode && (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="icon-action-btn edit-btn"
                            onClick={() => setEditingId(item.id)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="icon-action-btn delete-btn"
                            onClick={() => {
                              if (window.confirm(`Delete ${item.degree}?`)) {
                                onDelete(item.id);
                              }
                            }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="timeline-desc" style={{ marginTop: "8px" }}>
                    {item.description}
                  </p>

                  {item.cgpa && (
                    <div style={{ marginTop: "8px", fontSize: "13px", fontWeight: "600", color: "var(--accent)" }}>
                      GPA: {item.cgpa}
                    </div>
                  )}

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "12px" }}>
                    {/* TRANSCRIPT */}
                    {/(bsc|bachelor)/i.test(item.degree) && (
                      <div>
                        <button
                          className={`transcript-toggle-btn ${isTranscriptOpen ? "open" : ""}`}
                          onClick={() => setTranscriptOpenId(isTranscriptOpen ? null : item.id)}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                          {isTranscriptOpen ? "Hide Transcript" : "Show Transcript"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* TRANSCRIPT PANEL */}
                  {isTranscriptOpen && (
                    <div style={{ marginTop: "16px", animation: "slideDown 0.3s ease-out" }}>
                      <input
                        className="transcript-search-input"
                        placeholder="Search courses (e.g., CS101 or Data Structures)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginTop: 0 }}
                      />

                      <div style={{ overflowX: "auto", marginTop: "16px" }}>
                        <table className="transcript-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid var(--border)" }}>
                              <th style={{ textAlign: "left", padding: "10px", fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Code</th>
                              <th style={{ textAlign: "left", padding: "10px", fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Course Name</th>
                              <th style={{ textAlign: "right", padding: "10px", fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {query === "" ? (
                              <tr>
                                <td colSpan="3" style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
                                  Start typing to search transcript...
                                </td>
                              </tr>
                            ) : filteredCourses.length === 0 ? (
                              <tr>
                                <td colSpan="3" style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
                                  No matching courses found.
                                </td>
                              </tr>
                            ) : (
                              filteredCourses.map((c, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(148,163,184,0.06)" }}>
                                  <td style={{ padding: "12px 10px", fontSize: "13px", fontFamily: "var(--mono)" }}>{c.code}</td>
                                  <td style={{ padding: "12px 10px", fontSize: "14px", fontWeight: "500" }}>{c.name}</td>
                                  <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "700", color: getGradeColor(c.grade) }}>{c.grade}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
