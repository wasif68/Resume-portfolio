import React, { useState } from "react";

export default function EducationForm({ initialData, onSave, onCancel }) {
  const [degree, setDegree] = useState(initialData?.degree || "");
  const [institution, setInstitution] = useState(initialData?.institution || "");
  const [minor, setMinor] = useState(initialData?.minor || "");
  const [startYear, setStartYear] = useState(initialData?.startYear || "");
  const [endYear, setEndYear] = useState(initialData?.endYear || "");
  const [isPresent, setIsPresent] = useState(initialData?.endYear === "Present");
  const [cgpa, setCgpa] = useState(initialData?.cgpa || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handlePresentToggle = (e) => {
    const checked = e.target.checked;
    setIsPresent(checked);
    if (checked) {
      setEndYear("Present");
    } else {
      setEndYear(initialData?.endYear !== "Present" ? initialData?.endYear || "" : "");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!degree.trim() || !institution.trim()) {
      alert("Degree and Institution are required.");
      return;
    }
    onSave({
      id: initialData?.id || `edu-${Date.now()}`,
      degree: degree.trim(),
      institution: institution.trim(),
      minor: minor.trim(),
      startYear: startYear.trim(),
      endYear: isPresent ? "Present" : endYear.trim(),
      cgpa: cgpa.trim(),
      description: description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="experience-form-container">
      <div className="form-row">
        <div className="form-group">
          <label>Degree *</label>
          <input
            type="text"
            className="form-input"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="e.g. BSc in Computer Science"
            required
          />
        </div>
        <div className="form-group">
          <label>Institution *</label>
          <input
            type="text"
            className="form-input"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="e.g. Independent University Bangladesh"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Minor (Optional)</label>
          <input
            type="text"
            className="form-input"
            value={minor}
            onChange={(e) => setMinor(e.target.value)}
            placeholder="e.g. Management Information Systems"
          />
        </div>
        <div className="form-group">
          <label>GPA / Grade</label>
          <input
            type="text"
            className="form-input"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            placeholder="e.g. 3.8/4.0"
          />
        </div>
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
              <span>Currently Studying</span>
            </label>
          </div>
          <input
            type="text"
            className="form-input"
            value={isPresent ? "Present" : endYear}
            onChange={(e) => setEndYear(e.target.value)}
            disabled={isPresent}
            placeholder="e.g. 2027 or Present"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your major courses, achievements, or research focus..."
          rows="4"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save Education
        </button>
      </div>
    </form>
  );
}
