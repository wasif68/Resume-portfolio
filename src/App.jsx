import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Todo from "./pages/Todo";
import Journal from "./pages/Journal";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("dashboard_theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("dashboard_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
return (
  <div className={`dashboard-container ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
    <Sidebar 
      activePage={page} 
      setPage={handlePageChange} 
      theme={theme} 
      toggleTheme={toggleTheme} 
      isCollapsed={isSidebarCollapsed}
      onToggle={toggleSidebar}
    />

    <main className="main-content">
      {page === "home" && <Home />}
      {page === "todo" && <Todo />}
      {page === "journal" && <Journal />}
    </main>
  </div>
);
}