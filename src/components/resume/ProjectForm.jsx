import React, { useState } from "react";

export default function ProjectForm({ initialData, onSave, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [github, setGithub] = useState(initialData?.github || "");
  const [live, setLive] = useState(initialData?.live || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Project Title is required.");
      return;
    }
    onSave({
      id: initialData?.id || crypto.randomUUID(),
      title: title.trim(),
      github: github.trim(),
      live: live.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="experience-form-container">
      <div className="form-group">
        <label>Project Name *</label>
        <input
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. SaaS Analytics Dashboard"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Project Link (GitHub)</label>
          <input
            type="url"
            className="form-input"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="e.g. https://github.com/username/project"
          />
        </div>
        <div className="form-group">
          <label>Deployed (Hosting Link)</label>
          <input
            type="url"
            className="form-input"
            value={live}
            onChange={(e) => setLive(e.target.value)}
            placeholder="e.g. https://myproject.com"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save Project
        </button>
      </div>
    </form>
  );
}
