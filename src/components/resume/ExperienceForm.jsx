import React, { useState } from "react";

export default function ExperienceForm({ initialData, onSave, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [company, setCompany] = useState(initialData?.company || "");
  const [category, setCategory] = useState(initialData?.category || "Company");
  const [projectLink, setProjectLink] = useState(initialData?.projectLink || "");
  const [startYear, setStartYear] = useState(initialData?.startYear || "");
  const [endYear, setEndYear] = useState(initialData?.endYear || "");
  const [isPresent, setIsPresent] = useState(initialData?.endYear === "Present");
  const [description, setDescription] = useState(initialData?.description || "");
  const [tech, setTech] = useState(initialData?.tech || []);
  const [tagInput, setTagInput] = useState("");

  const categories = ["Company", "Academic", "Personal Project"];

  const handlePresentToggle = (e) => {
    const checked = e.target.checked;
    setIsPresent(checked);
    if (checked) {
      setEndYear("Present");
    } else {
      setEndYear(initialData?.endYear !== "Present" ? initialData?.endYear || "" : "");
    }
  };

  const addTag = (e) => {
    if (e) e.preventDefault();
    const cleanTag = tagInput.trim();
    if (cleanTag && !tech.includes(cleanTag)) {
      setTech([...tech, cleanTag]);
    }
    setTagInput("");
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setTech(tech.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) {
      alert("Job Title and Company Name are required.");
      return;
    }
    onSave({
      id: initialData?.id || crypto.randomUUID(),
      title: title.trim(),
      company: company.trim(),
      category,
      projectLink: projectLink.trim(),
      startYear: startYear.trim(),
      endYear: isPresent ? "Present" : endYear.trim(),
      description: description.trim(),
      tech
    });
  };

  return (
    <form onSubmit={handleSubmit} className="experience-form-container">
      <div className="form-group" style={{ marginBottom: "16px" }}>
        <label>Entry Category</label>
        <div className="category-toggle-group">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-toggle-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lead Software Engineer"
            required
          />
        </div>
        <div className="form-group">
          <label>Company *</label>
          <input
            type="text"
            className="form-input"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. InnovateTech Labs"
            required
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: "16px" }}>
        <label>Project Link (Optional)</label>
        <input
          type="url"
          className="form-input"
          value={projectLink}
          onChange={(e) => setProjectLink(e.target.value)}
          placeholder="e.g. https://project-demo.com"
        />
      </div>

      <div className="form-row dates-row">
        <div className="form-group">
          <label>Start Year</label>
          <input
            type="text"
            className="form-input"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            placeholder="e.g. 2023"
          />
        </div>
        <div className="form-group">
          <div className="label-with-checkbox">
            <label>End Year</label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPresent}
                onChange={handlePresentToggle}
              />
              <span>Currently Work Here</span>
            </label>
          </div>
          <input
            type="text"
            className="form-input"
            value={isPresent ? "Present" : endYear}
            onChange={(e) => setEndYear(e.target.value)}
            disabled={isPresent}
            placeholder="e.g. 2025 or Present"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your achievements, responsibilities, and tasks..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Tech Stack & Skills Used</label>
        <div className="tag-input-wrapper">
          <input
            type="text"
            className="form-input tag-input-field"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Type a skill and press Enter or comma"
          />
          <button type="button" className="btn-secondary add-tag-btn" onClick={addTag}>
            Add
          </button>
        </div>
        {tech.length > 0 && (
          <div className="form-pill-group" style={{ marginTop: "10px" }}>
            {tech.map((t, idx) => (
              <span className="form-skill-pill" key={idx}>
                {t}
                <button
                  type="button"
                  className="pill-remove-btn"
                  onClick={() => removeTag(t)}
                  title="Remove skill"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save Experience
        </button>
      </div>
    </form>
  );
}
