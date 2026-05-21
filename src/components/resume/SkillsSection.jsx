import React, { useState } from "react";

export default function SkillsSection({
  skills,
  isEditMode,
  onAddSkill,
  onDeleteSkill
}) {
  const [newSkill, setNewSkill] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanSkill = newSkill.trim();
    if (cleanSkill) {
      onAddSkill(cleanSkill);
      setNewSkill("");
    }
  };

  return (
    <section className="resume-card">
      <h2>
        <svg viewBox="0 0 24 24">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"></polygon>
          <line x1="12" y1="22" x2="12" y2="15.5"></line>
          <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
          <polyline points="2 15.5 12 8.5 22 15.5"></polyline>
          <line x1="12" y1="2" x2="12" y2="8.5"></line>
        </svg>
        Skills & Tech Stack
      </h2>

      <div className="skills-pill-group">
        {(skills ?? []).map((skill, idx) => (
          <span className="skill-pill" key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            {skill}
            {isEditMode && (
              <button
                type="button"
                className="skill-pill-remove-btn"
                onClick={() => onDeleteSkill(skill)}
                title={`Remove ${skill}`}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            )}
          </span>
        ))}
      </div>

      {isEditMode && (
        <form onSubmit={handleSubmit} className="skills-add-form" style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Add new skill (e.g. Docker)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            style={{ padding: "6px 12px", fontSize: "13px" }}
          />
          <button type="submit" className="btn-primary" style={{ padding: "6px 14px", fontSize: "13px", height: "auto" }}>
            Add
          </button>
        </form>
      )}
    </section>
  );
}
