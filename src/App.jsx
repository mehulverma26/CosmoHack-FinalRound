import React, { useState } from "react";
import Home from "./components/Home/home";
import Navbar from "./components/Navbar";
import Assessment from "./components/Assessment/Assessment";
import Dashboard from "./components/Dashboard/Dashboard";
import PatientDetails from "./components/Patient/PatientDetails";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import "./dark.css";

/* ------------------ SEVERITY LOGIC ------------------ */

const SEVERITY_MAP = {
  0: "Minimal Depression",
  1: "Mild Depression",
  2: "Moderate Depression",
  3: "Moderately Severe Depression",
  4: "Severe Depression",
};

const RECOMMENDATION_MAP = {
  0: ["Maintain healthy routines.", "general wellness"],
  1: ["Monitor symptoms.", "mental health support"],
  2: ["Professional consultation recommended.", "therapy"],
  3: ["Seek mental health support immediately.", "psychiatrist"],
  4: ["Urgent intervention required.", "emergency mental health"],
};

function mapSeverity(sum) {
  if (sum <= 4) return 0;
  if (sum <= 9) return 1;
  if (sum <= 14) return 2;
  if (sum <= 19) return 3;
  return 4;
}

/* ------------------ GEMINI API ------------------ */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function searchDoctorsAPI({ location, search_context }) {
  const prompt = `Find top-rated ${search_context} near ${location} with details.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
      }),
    }
  );

  return res.json();
}

/* ------------------ APP ------------------ */

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("patientData")
  );

  const predictSeverity = (payload) => {
    const sum = Object.values(payload).reduce((a, b) => a + Number(b), 0);
    const sev = mapSeverity(sum);
    const [msg, ctx] = RECOMMENDATION_MAP[sev];

    localStorage.setItem(
      "dashboardData",
      JSON.stringify({
        phq_sum: sum,
        severity_text: SEVERITY_MAP[sev],
        risk_label: sev >= 3 ? "HIGH RISK" : "LOW / MODERATE",
        recommendation_message: msg,
        search_context: ctx,
      })
    );
  };

  return (
    <Router>
      <Navbar />
      {isLoggedIn}

      <Routes>
        <Route
          path="/"
          element={<PatientDetails setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/assessment"
          element={
            isLoggedIn ? (
              <Assessment predictSeverity={predictSeverity} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
