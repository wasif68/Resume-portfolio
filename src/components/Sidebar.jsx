import React from "react";

export default function Sidebar({ activePage, setPage, theme, toggleTheme, isCollapsed, onToggle }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-header">
          {!isCollapsed && (
            <div className="sidebar-logo">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ stroke: "var(--accent)" }}
              >
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              <span>My Dashboard</span>
            </div>
          )}
          <button className="sidebar-toggle-btn" onClick={onToggle} title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
              {isCollapsed ? (
                <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
              ) : (
                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
              )}
            </svg>
          </button>
        </div>

        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${activePage === "home" ? "active" : ""}`}
            onClick={() => setPage("home")}
            title={isCollapsed ? "Resume" : ""}
          >
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            {!isCollapsed && <span>Resume</span>}
          </li>
          <li
            className={`sidebar-item ${activePage === "todo" ? "active" : ""}`}
            onClick={() => setPage("todo")}
            title={isCollapsed ? "Todo" : ""}
          >
            <svg viewBox="0 0 24 24">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            {!isCollapsed && <span>Todo</span>}
          </li>
          <li
            className={`sidebar-item ${activePage === "journal" ? "active" : ""}`}
            onClick={() => setPage("journal")}
            title={isCollapsed ? "Journal" : ""}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            {!isCollapsed && <span>Journal</span>}
          </li>
        </ul>

        <div className="theme-switch-wrapper">
          <div className={`theme-switch ${isCollapsed ? "collapsed" : ""}`}>
            <button
              type="button"
              className={`theme-option ${theme === "light" ? "active" : ""}`}
              onClick={() => theme !== "light" && toggleTheme()}
              title="Light mode"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              {!isCollapsed && <span>Light</span>}
            </button>
            <button
              type="button"
              className={`theme-option ${theme === "dark" ? "active" : ""}`}
              onClick={() => theme !== "dark" && toggleTheme()}
              title="Dark mode"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              {!isCollapsed && <span>Dark</span>}
            </button>
          </div>
        </div>
      </div>
      <div className="sidebar-footer">
        {!isCollapsed && <p>© 2026 Dashboard</p>}
      </div>
    </aside>
  );
}