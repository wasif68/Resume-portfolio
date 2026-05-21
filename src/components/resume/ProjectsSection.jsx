import React, { useState } from "react";
import ProjectForm from "./ProjectForm";

export default function ProjectsSection({
  projects,
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
        <h2 style={{ margin: 0 }}>🚀 Projects</h2>

        {isEditMode && !showAddForm && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
            style={{ padding: "6px 14px", fontSize: "13px" }}
          >
            + Add Project
          </button>
        )}
      </div>

      {isEditMode && showAddForm && (
        <div className="inline-form-card" style={{ marginBottom: "24px" }}>
          <h4 style={{ marginBottom: "16px", color: "var(--accent)" }}>
            Add Project
          </h4>
          <ProjectForm
            onSave={handleAddSave}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="projects-list">
        {(projects || []).map((project) => {
          const isEditing = editingId === project.id;

          if (isEditMode && isEditing) {
            return (
              <div className="inline-form-card" key={project.id} style={{ marginBottom: "16px" }}>
                <h4 style={{ marginBottom: "16px", color: "var(--accent)" }}>
                  Edit Project
                </h4>
                <ProjectForm
                  initialData={project}
                  onSave={(updatedData) => handleUpdateSave(project.id, updatedData)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            );
          }

          return (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <h3 style={{ margin: 0 }}>{project.title}</h3>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      title="GitHub Repository"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      Repo
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      title="Live Demo"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Live
                    </a>
                  )}
                  {isEditMode && (
                    <div style={{ display: "flex", gap: "6px", marginLeft: "8px" }}>
                      <button
                        className="icon-action-btn edit-btn"
                        onClick={() => setEditingId(project.id)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-action-btn delete-btn"
                        onClick={() => {
                          if (window.confirm(`Delete project "${project.title}"?`)) {
                            onDelete(project.id);
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
