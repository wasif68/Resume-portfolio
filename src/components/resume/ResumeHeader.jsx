import React from "react";

export default function ResumeHeader({ mode = "view", onRequestModeChange, onPrint, dbSource, isAdmin, userEmail, onOpenAuthModal, onSignOut }) {
  return (
    <header className="resume-header-controls">

      <div className="header-actions">
        {/* Mode switch: View / Owner */}
        <div className={`toggle-container subtle-toggle ${mode}`}>
          <div className="toggle-slider" />
          <button
            className={`toggle-option ${mode === "view" ? "active" : ""}`}
            onClick={() => onRequestModeChange && onRequestModeChange("view")}
            title="View mode"
            aria-label="Switch to view mode"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="sr-only">View</span>
          </button>

          <button
            className={`toggle-option toggle-empty ${mode === "owner" ? "active" : ""}`}
            onClick={() => onRequestModeChange && onRequestModeChange("owner")}
            title="Owner mode"
            aria-label="Switch to owner mode"
          >
            <span className="sr-only">Owner</span>
          </button>
        </div>

        {/* Print Action */}
        <button className="print-action-btn" onClick={onPrint} title="Print / Save PDF">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
            <polyline points="6 9 12 15 18 9"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
            <path d="M18 17H6a3 3 0 0 0-3 3v2h18v-2a3 3 0 0 0-3-3z"></path>
          </svg>
        </button>

        {/* Auth controls: Only show when logged in */}
        {userEmail && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "12px" }}>
            <div style={{ fontSize: "13px", opacity: 0.85, fontWeight: 500 }}>{userEmail}</div>
            <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }} onClick={onSignOut}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
