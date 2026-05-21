import React, { useState } from "react";
import ExperienceForm from "./ExperienceForm";

export default function ExperienceSection({
  experience,
  isEditMode,
  onAdd,
  onUpdate,
  onDelete
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleAddSave = (newData) => {
    onAdd(newData);
    setShowAddForm(false);
  };

  const handleUpdateSave = (id, updatedData) => {
    onUpdate(id, updatedData);
    setEditingId(null);
  };

  return (
    <section className="resume-card">

      {/* HEADER */}
      <div
        className="section-header-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "2px solid var(--border)",
          paddingBottom: "10px"
        }}
      >
        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          Work Experience
        </h2>

        {isEditMode && !showAddForm && (
          <button
            type="button"
            className="btn-primary add-item-btn"
            onClick={() => setShowAddForm(true)}
            style={{ padding: "6px 14px", fontSize: "13px" }}
          >
            + Add Experience
          </button>
        )}
      </div>

      {/* ADD FORM */}
      {isEditMode && showAddForm && (
        <div className="inline-form-card" style={{ marginBottom: "24px" }}>
          <h4 style={{ marginBottom: "16px", color: "var(--accent)" }}>
            Add Work Experience
          </h4>

          <ExperienceForm
            onSave={handleAddSave}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* TIMELINE */}
      <div className="timeline">
        {(experience || []).map((item) => {
          const isEditing = editingId === item.id;

          // EDIT MODE FORM
          if (isEditMode && isEditing) {
            return (
              <div className="inline-form-card" key={item.id}>
                <h4 style={{ marginBottom: "16px", color: "var(--accent)" }}>
                  Edit Work Experience
                </h4>

                <ExperienceForm
                  initialData={item}
                  onSave={(updatedData) =>
                    handleUpdateSave(item.id, updatedData)
                  }
                  onCancel={() => setEditingId(null)}
                />
              </div>
            );
          }

          // VIEW MODE CARD
          return (
            <div className="timeline-item" key={item.id}>
              <div className="timeline-dot"></div>

              {item.category && (
                <div className={`category-tag ${item.category.toLowerCase().replace(" ", "-")}`}>
                  {item.category}
                </div>
              )}

              <div className="timeline-header">
                <div>
                  <span className="timeline-title">{item.title}</span>{" "}
                  <span>at</span>{" "}
                  <span className="timeline-company">{item.company}</span>
                  {item.projectLink && (
                    <a 
                      href={item.projectLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        marginLeft: "8px", 
                        color: "var(--accent-strong)", 
                        display: "inline-flex", 
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textDecoration: "none",
                        border: "1px solid var(--border)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "var(--accent-bg)"
                      }}
                      title="View Project"
                    >
                      Project
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="timeline-date">
                    {item.startYear} - {item.endYear}
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
                          if (
                            window.confirm(
                              `Delete experience at ${item.company}?`
                            )
                          ) {
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

              <p
                style={{
                  whiteSpace: "pre-line",
                  marginTop: "8px",
                  fontSize: "14px",
                  lineHeight: "1.5"
                }}
              >
                {item.description}
              </p>

              {item.tech?.length > 0 && (
                <div className="project-tags" style={{ marginTop: "10px" }}>
                  {item.tech.map((t, idx) => (
                    <span className="project-tag" key={idx}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}