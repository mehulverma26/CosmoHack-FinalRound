import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  House,
  ClipboardList,
  ChartColumn,
  Moon,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  // Dark mode toggle
  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  };

  useEffect(() => {
    // Apply saved theme on load
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-inner">
        {/* Logo */}
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <HeartPulse />
          <span>CodeCure</span>
          <br />
          <br />
        </div>

        {/* Navigation */}
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            end
          >
            <House />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/assessment"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <ClipboardList />
            <span>Assessment</span>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <ChartColumn />
            <span>Dashboard</span>
          </NavLink>

          <button
            id="theme-toggle"
            className="nav-item"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Moon />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
