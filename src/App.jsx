import React from "react";
import Home from "./components/Home/home";
import Navbar from "./components/Navbar";
import Assessment from "./components/Assessment/Assessment";
import Dashboard from "./components/Dashboard/Dashboard";
import PatientDetail from "./components/PatientDetail/PatientDetail";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./App.css";
import "./dark.css";

/* ------------------ Flask logic rewritten in JS ------------------ */

const SEVERITY_MAP = {
  0: "Minimal Depression",
  1: "Mild Depression",
  2: "Moderate Depression",
  3: "Moderately Severe Depression",
  4: "Severe Depression",
};

const RECOMMENDATION_MAP = {
  0: [
    "Your symptoms indicate minimal depression. Maintain healthy routines.",
    "general wellness",
  ],
  1: [
    "Mild symptoms detected. Consider self-care and monitoring.",
    "mental health support",
  ],
  2: [
    "Moderate symptoms detected. Professional consultation is recommended.",
    "therapy",
  ],
  3: [
    "High risk detected. Please seek professional mental health support immediately.",
    "psychiatrist",
  ],
  4: [
    "Severe symptoms detected. Urgent professional intervention is required.",
    "emergency mental health",
  ],
};

function mapSeverity(phqSum) {
  if (phqSum <= 4) return 0;
  if (phqSum <= 9) return 1;
  if (phqSum <= 14) return 2;
  if (phqSum <= 19) return 3;
  return 4;
}

/* --------------------------------------------------------------- */
/* 🔵 Gemini API helper (SAFE)                                      */
/* --------------------------------------------------------------- */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function searchDoctorsAPI({ location, search_context }) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key missing");
  }

  const prompt = `Find top-rated ${search_context} near ${location} with contact details.`;

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

  if (!res.ok) {
    throw new Error("Gemini request failed");
  }

  return res.json();
}

/* --------------------------------------------------------------- */

function App() {
  // 🔴 Replaces Flask `/api/predict_severity`
  const predictSeverity = (payload) => {
    const phqSum = Object.values(payload).reduce(
      (sum, v) => sum + Number(v),
      0
    );

    const sevId = mapSeverity(phqSum);
    const [msg, ctx] = RECOMMENDATION_MAP[sevId];

    const result = {
      phq_sum: phqSum,
      severity_text: SEVERITY_MAP[sevId],
      risk_label: sevId >= 3 ? "HIGH RISK" : "LOW / MODERATE RISK",
      recommendation_message: msg,
      search_context: ctx,
    };

    localStorage.setItem("dashboardData", JSON.stringify(result));
    return result;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/assessment"
          element={<Assessment predictSeverity={predictSeverity} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient" element={<PatientDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
