import React, { useState, useEffect, useRef } from "react";

// Helper to get initials for the avatar
const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const keywordPositionToPercent = (value, axis) => {
  if (!value) return 50;
  const normalized = value.trim().toLowerCase();
  if (normalized.endsWith("%")) {
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 50;
  }
  if (normalized === "left" && axis === "x") return 0;
  if (normalized === "right" && axis === "x") return 100;
  if (normalized === "top" && axis === "y") return 0;
  if (normalized === "bottom" && axis === "y") return 100;
  if (normalized === "center") return 50;
  return 50;
};

const parseAvatarPosition = (position) => {
  if (!position) return { x: 50, y: 50 };
  const [xPart = "center", yPart = "center"] = position.split(" ");
  return {
    x: keywordPositionToPercent(xPart, "x"),
    y: keywordPositionToPercent(yPart, "y")
  };
};

const formatAvatarPosition = ({ x, y }) => {
  const clamp = (val) => Math.min(100, Math.max(0, val));
  return `${clamp(x)}% ${clamp(y)}%`;
};

export function ProfileHeader({ about, isEditMode, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const avatarRef = useRef(null);
  const dragStateRef = useRef({ active: false, startX: 0, startY: 0, startPos: { x: 50, y: 50 } });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeBytes) {
        alert("Image size should be less than 5MB to fit local storage limits.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate("avatar", event.target.result);
        onUpdate("avatarPosition", "50% 50%");
        onUpdate("avatarScale", 1);
        onUpdate("avatarFit", "contain");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = (e) => {
    e.stopPropagation();
    onUpdate("avatar", "");
    onUpdate("avatarPosition", "50% 50%");
    onUpdate("avatarScale", 1);
    onUpdate("avatarFit", "contain");
  };

  const handleAvatarDragMove = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState.active) return;
    event.preventDefault();

    const container = avatarRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    const percentX = (deltaX / rect.width) * 100;
    const percentY = (deltaY / rect.height) * 100;

    const nextPosition = {
      x: dragState.startPos.x + percentX,
      y: dragState.startPos.y + percentY
    };

    onUpdate("avatarPosition", formatAvatarPosition(nextPosition));
  };

  const handleAvatarDragEnd = () => {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    setIsDragging(false);
    window.removeEventListener("mousemove", handleAvatarDragMove);
    window.removeEventListener("mouseup", handleAvatarDragEnd);
  };

  const handleAvatarDragStart = (event) => {
    if (!isEditMode || !about.avatar) return;
    event.preventDefault();

    const startingPosition = parseAvatarPosition(about.avatarPosition);
    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      startPos: startingPosition
    };
    setIsDragging(true);

    window.addEventListener("mousemove", handleAvatarDragMove);
    window.addEventListener("mouseup", handleAvatarDragEnd);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleAvatarDragMove);
      window.removeEventListener("mouseup", handleAvatarDragEnd);
    };
  }, []);

  const getFlagEmojiLocal = (countryCode) => {
    if (!countryCode) return "";
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const fetchFlagEmojiFromAPIVerve = async (countryCode) => {
    if (!countryCode) return "";
    try {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
      const countryName = regionNames.of(countryCode);
      const response = await fetch(
        `https://api.apiverve.com/v1/emoji?name=flag:%20${encodeURIComponent(countryName)}`,
        {
          headers: {
            "x-api-key": "jvt2te8o6rosnnlid0u1f84ppp1e6dmgf5cdetc8vpo8e48cea7rjo"
          }
        }
      );
      if (!response.ok) throw new Error("APIVerve Emoji API request failed");
      const result = await response.json();
      if (
        result.status === "ok" &&
        result.data &&
        result.data.emojisFound &&
        result.data.emojisFound.length > 0
      ) {
        return result.data.emojisFound[0].emoji;
      }
    } catch (err) {
      console.error("APIVerve Emoji API error, using local fallback:", err);
    }
    return getFlagEmojiLocal(countryCode);
  };

  const detectLocation = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://ipinfo.io/json?token=99fc062213f893");
      if (!response.ok) throw new Error("Failed to fetch location data");
      const data = await response.json();

      let locationText = "";
      if (data.city && data.region) {
        locationText = `${data.city}, ${data.region}`;
      } else if (data.city && data.country) {
        locationText = `${data.city}, ${data.country}`;
      } else {
        throw new Error("Invalid location data structure");
      }

      if (data.country) {
        const flagEmoji = await fetchFlagEmojiFromAPIVerve(data.country);
        if (flagEmoji) {
          locationText = `${locationText} ${flagEmoji}`;
        }
      }

      onUpdate("location", locationText);
    } catch (error) {
      console.error("Error detecting location:", error);
      alert("Could not detect location. Please input it manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="resume-header">
      <div className="profile-card" style={{ width: "100%" }}>
        <div
          className="avatar-wrapper"
          style={{
            position: "relative",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <div
            className="profile-avatar"
            ref={avatarRef}
            onMouseDown={about.avatar && isEditMode ? handleAvatarDragStart : undefined}
            style={{
              backgroundImage: about.avatar ? `url(${about.avatar})` : undefined,
              backgroundSize:
                about.avatarFit === "cover"
                  ? "cover"
                  : `${((Number(about.avatarScale) || 1) * 100).toFixed(0)}% auto`,
              backgroundPosition: about.avatarPosition || "50% 50%",
              backgroundRepeat: "no-repeat",
              cursor: about.avatar && isEditMode ? (isDragging ? "grabbing" : "grab") : "default"
            }}
          >
            {!about.avatar && getInitials(about.name)}
            {isEditMode && (
              <label htmlFor="avatar-upload" className="avatar-upload-overlay">
                Upload
              </label>
            )}
            {isEditMode && about.avatar && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  cursor: isDragging ? "grabbing" : "grab"
                }}
                onMouseDown={handleAvatarDragStart}
              />
            )}
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          {isEditMode && about.avatar && (
            <button
              type="button"
              onClick={removeAvatar}
              className="avatar-remove-btn"
              title="Remove Profile Image"
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "var(--elevated)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-h)",
                fontSize: "12px",
                fontWeight: "bold",
                boxShadow: "var(--shadow)",
                padding: 0
              }}
            >
              ×
            </button>
          )}
        </div>
        <div className="profile-info" style={{ flex: 1 }}>
          {isEditMode ? (
            <>
              <input
                type="text"
                className="editable-input name-input"
                value={about.name}
                onChange={(e) => onUpdate("name", e.target.value)}
                placeholder="Full Name"
              />
              <input
                type="text"
                className="editable-input title-input"
                value={about.title}
                onChange={(e) => onUpdate("title", e.target.value)}
                placeholder="Professional Title"
              />
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "8px" }}>
                <input
                  type="text"
                  className="editable-input"
                  value={about.location || ""}
                  onChange={(e) => onUpdate("location", e.target.value)}
                  placeholder="Location (e.g. San Francisco, CA)"
                  style={{ fontSize: "14px", padding: "6px 10px", flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={detectLocation}
                  disabled={loading}
                  style={{
                    padding: "6px 12px",
                    fontSize: "13px",
                    height: "auto",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  title="Detect location via IP Geolocation API"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                  </svg>
                  {loading ? "Detecting..." : "Autodetect"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>{about.name}</h1>
              <div className="profile-title">{about.title}</div>
              <div className="profile-location">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{about.location || "San Francisco, CA (Remote)"}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="profile-actions">
        <div className="social-links">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon-btn" title="GitHub">
            <svg viewBox="0 0 24 24">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn" title="LinkedIn">
            <svg viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

export function AboutCard({ about, isEditMode, onUpdate }) {
  const [open, setOpen] = useState(isEditMode);
  const textareaRef = useRef(null);

  // Auto-expand textarea
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isEditMode) {
      setOpen(true);
      // Adjust height on mount if in edit mode
      setTimeout(adjustHeight, 0);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (open) adjustHeight();
  }, [open, about.bio]);

  return (
    <section className={`resume-card about-card ${open ? "open" : "collapsed"}`}>
      <h2 className="about-card-header">
        <button
          type="button"
          className="about-card-toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="about-card-panel"
        >
          <span className="about-card-title">About Me</span>
          <span className={`about-card-icon ${open ? "open" : ""}`}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </h2>
      <div
        id="about-card-panel"
        className="about-card-panel"
        aria-hidden={!open}
      >
        {isEditMode ? (
          <textarea
            ref={textareaRef}
            className="editable-textarea bio-textarea"
            value={about.bio}
            onChange={(e) => {
              onUpdate("bio", e.target.value);
              adjustHeight();
            }}
            placeholder="Write a brief bio about yourself..."
          />
        ) : (
          <p className="about-bio-text">{about.bio}</p>
        )}
      </div>
    </section>
  );
}
