import React, { useState, useEffect } from "react";
import { transcriptData } from "../../data/transcriptData";

/* ── Grade color helper ── */
function getGradeColor(grade) {
  if (!grade) return "#94a3b8";

  const g = grade.toUpperCase();

  if (g.startsWith("A")) return "#34d399";
  if (g.startsWith("B")) return "#60a5fa";
  if (g.startsWith("C")) return "#fbbf24";
  if (g.startsWith("D") || g === "F") return "#f87171";

  return "#94a3b8";
}

/* ── Flatten transcript ── */
const allCourses = transcriptData.flatMap((sem) =>
  sem.courses.map((course) => ({
    ...course,
    semester: sem.semester,
  }))
);

export default function EducationSection({
  education = [],
  isEditMode,
  onAdd,
  onUpdate,
  onDelete,
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
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(false);

  /* ── Transcript state ── */
  const [showTranscript, setShowTranscript] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isEditMode) setOpen(true);
  }, [isEditMode]);

  const filteredCourses = allCourses.filter((course) => {
    const q = searchTerm.toLowerCase().trim();

    return (
      q === "" ||
      course.code?.toLowerCase().includes(q) ||
      course.name?.toLowerCase().includes(q)
    );
  });

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
    });
  };

  const handleSave = () => {
    if (!form.degree || !form.institution) return;

    if (editingId) {
      onUpdate(editingId, {
        ...form,
        id: editingId,
      });
      setEditingId(null);
    } else {
      onAdd({
        ...form,
        id: `edu-${Date.now()}`,
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
    });

    setShowForm(true);
  };

  return (
    <section
      className={`resume-card education-card ${open ? "open" : ""}`}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          borderBottom: "2px solid var(--border)",
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>🎓 Education</h2>

        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          ⌄
        </button>
      </div>

      {/* CONTENT */}
      {open && (
        <div className="education-card-panel">
          {/* FORM */}
          {isEditMode && showForm && (
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <input
                placeholder="Degree"
                value={form.degree}
                onChange={(e) =>
                  setForm({
                    ...form,
                    degree: e.target.value,
                  })
                }
              />

              <input
                placeholder="Minor (e.g. Management Information Systems - MIS)"
                value={form.minor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minor: e.target.value,
                  })
                }
              />

              <input
                placeholder="Institution"
                value={form.institution}
                onChange={(e) =>
                  setForm({
                    ...form,
                    institution: e.target.value,
                  })
                }
              />

              <input
                placeholder="Start Year"
                value={form.startYear}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startYear: e.target.value,
                  })
                }
              />

              <input
                placeholder="End Year"
                value={form.endYear}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endYear: e.target.value,
                  })
                }
              />

              <input
                placeholder="CGPA"
                value={form.cgpa}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cgpa: e.target.value,
                  })
                }
              />

              <button onClick={handleSave}>Save</button>

              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* ADD BUTTON */}
          {isEditMode && !showForm && (
            <button onClick={() => setShowForm(true)}>
              + Add Education
            </button>
          )}

          {/* EDUCATION LIST */}
          <div style={{ marginTop: "18px" }}>
            {education.map((item) => (
              <div
                key={item.id}
                style={{ marginBottom: "18px" }}
              >
                <h3 style={{ margin: 0 }}>
                  {item.degree}
                </h3>

                {item.minor && (
                  <p
                    style={{
                      margin: "4px 0",
                      color: "#c084fc",
                    }}
                  >
                    Minor in {item.minor}
                  </p>
                )}

                <p style={{ margin: "4px 0" }}>
                  {item.institution}
                  {(item.startYear || item.endYear) && (
                    <>
                      {" "}
                      ({item.startYear} - {item.endYear})
                    </>
                  )}
                </p>

                {item.cgpa && (
                  <span style={{ color: "#60a5fa" }}>
                    CGPA: {item.cgpa}
                  </span>
                )}

                {isEditMode && (
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        onDelete(item.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* TRANSCRIPT */}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() =>
                setShowTranscript((prev) => !prev)
              }
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                border: "1px solid #334155",
                background: "transparent",
                color: "#94a3b8",
                borderRadius: "999px",
                cursor: "pointer",
              }}
            >
              {showTranscript
                ? "Hide Transcript"
                : "View Transcript"}
            </button>

            {showTranscript && (
              <div>
                <input
                  placeholder="Search by course code or name..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    background: "#0f172a",
                    color: "#e2e8f0",
                  }}
                />

                <table
                  style={{
                    width: "100%",
                    marginTop: "12px",
                  }}
                >
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Grade</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={3}>
                          No courses found
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((c, i) => (
                        <tr key={i}>
                          <td>{c.code}</td>
                          <td>{c.name}</td>
                          <td
                            style={{
                              color: getGradeColor(
                                c.grade
                              ),
                            }}
                          >
                            {c.grade}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}