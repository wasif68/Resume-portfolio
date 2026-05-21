import React, { useState } from "react";

export default function EducationSection({
  education = [],
  isEditMode,
  onAdd,
  onUpdate,
  onDelete
}) {
  const [form, setForm] = useState({
    id: "",
    degree: "",
    minor: "",
    institution: "",
    startYear: "",
    endYear: "",
    description: "",
    cgpa: "",
    courses: [],
    newCourseName: "",
    newCourseGrade: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setForm({
      id: "",
      degree: "",
      minor: "",
      institution: "",
      startYear: "",
      endYear: "",
      description: "",
      cgpa: "",
      courses: [],
      newCourseName: "",
      newCourseGrade: ""
    });
  };

  const handleSave = () => {
    if (!form.degree || !form.institution) return;

    if (editingId) {
      onUpdate(editingId, { ...form, id: editingId });
      setEditingId(null);
    } else {
      onAdd({
        ...form,
        id: `edu-${Date.now()}`
      });
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      ...item,
      minor: item.minor || "",
      newCourseName: "",
      newCourseGrade: ""
    });
    setShowForm(true);
  };

  return (
    <section className="resume-card">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          borderBottom: "2px solid var(--border)",
          paddingBottom: "10px"
        }}
      >
        <h2 style={{ margin: 0 }}>🎓 Education</h2>

        {isEditMode && !showForm && (
          <button
            className="btn-primary"
            onClick={() => {
              setEditingId(null);
              resetForm();
              setShowForm(true);
            }}
          >
            + Add
          </button>
        )}
      </div>

      {/* Form */}
      {isEditMode && showForm && (
        <div className="inline-form-card" style={{ marginBottom: "16px" }}>
          <div className="experience-form-container">
            <div className="form-group">
              <label>Degree (e.g. BSc in CSE) *</label>
              <input
                className="form-input"
                placeholder="e.g. BSc in Computer Science"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Minor (Optional)</label>
                <input
                  className="form-input"
                  placeholder="e.g. Mathematics"
                  value={form.minor}
                  onChange={(e) => setForm({ ...form, minor: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>CGPA / GPA</label>
                <input
                  className="form-input"
                  placeholder="e.g. 3.8/4.0"
                  value={form.cgpa}
                  onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Institution *</label>
              <input
                className="form-input"
                placeholder="e.g. Independent University"
                value={form.institution}
                onChange={(e) =>
                  setForm({ ...form, institution: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Year</label>
                <input
                  className="form-input"
                  placeholder="e.g. 2023"
                  value={form.startYear}
                  onChange={(e) =>
                    setForm({ ...form, startYear: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>End Year</label>
                <input
                  className="form-input"
                  placeholder="e.g. Present"
                  value={form.endYear}
                  onChange={(e) =>
                    setForm({ ...form, endYear: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-textarea"
                placeholder="Briefly describe your focus or achievements..."
                rows="3"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Key Courses</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  className="form-input"
                  placeholder="Course name"
                  value={form.newCourseName}
                  onChange={(e) => setForm({ ...form, newCourseName: e.target.value })}
                  style={{ flex: 1 }}
                />

                <input
                  className="form-input"
                  placeholder="Grade"
                  value={form.newCourseGrade}
                  onChange={(e) => setForm({ ...form, newCourseGrade: e.target.value })}
                  style={{ width: "100px" }}
                />

                <button
                  className="btn-secondary"
                  onClick={() => {
                    const name = (form.newCourseName || "").trim();
                    if (!name) return;
                    const nextCourses = [
                      ...(form.courses || []),
                      { name, grade: form.newCourseGrade }
                    ];
                    setForm({ ...form, courses: nextCourses, newCourseName: "", newCourseGrade: "" });
                  }}
                  type="button"
                >
                  Add
                </button>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(form.courses || []).map((c, idx) => (
                  <span key={idx} className="form-skill-pill">
                    {c.name} {c.grade ? <span style={{ opacity: 0.7, marginLeft: "4px" }}>({c.grade})</span> : null}
                    <button
                      type="button"
                      className="pill-remove-btn"
                      onClick={() => {
                        const next = (form.courses || []).filter((_, i) => i !== idx);
                        setForm({ ...form, courses: next });
                      }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                Save Education
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="projects-list">
        {education.map((item) => (
          <div key={item.id} className="project-card">
            <div className="project-card-header">
              <h3 style={{ margin: 0 }}>{item.degree}</h3>

              {isEditMode && (
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className="icon-action-btn edit-btn" onClick={() => handleEdit(item)} title="Edit">
                    ✏️
                  </button>
                  <button className="icon-action-btn delete-btn" onClick={() => {
                    if (window.confirm("Delete this education entry?")) {
                      onDelete(item.id);
                    }
                  }} title="Delete">
                    🗑️
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "2px 0 8px 0", alignItems: "center" }}>
              {item.cgpa && (
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-strong)", background: "var(--accent-bg)", padding: "2px 8px", borderRadius: "4px" }}>
                  CGPA: {item.cgpa}
                </span>
              )}
              {item.minor && (
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
                  Minor in {item.minor}
                </span>
              )}
            </div>

            <p style={{ margin: "4px 0", fontWeight: 500, color: "var(--accent)" }}>
              {item.institution} <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "13px", marginLeft: "8px" }}>({item.startYear} - {item.endYear})</span>
            </p>

            {item.description && (
              <p style={{ fontSize: "14px", margin: "8px 0" }}>
                {item.description}
              </p>
            )}

            {(item.courses || []).length > 0 && (
              <div className="project-tags" style={{ marginTop: "12px" }}>
                {item.courses.map((c, i) => (
                  <span key={i} className="project-tag">
                    {c.name} {c.grade ? `(${c.grade})` : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}