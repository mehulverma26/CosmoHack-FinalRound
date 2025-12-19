import React, { useEffect, useState } from "react";
import { searchDoctorsAPI } from "../../App";

function Dashboard() {
  const [patientName, setPatientName] = useState("");
  const [phqScore, setPhqScore] = useState("--");
  const [severity, setSeverity] = useState("--");
  const [risk, setRisk] = useState("--");
  const [recommendation, setRecommendation] = useState(
    "Take the assessment to view results."
  );

  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctorResults, setDoctorResults] = useState("");
  const [showResults, setShowResults] = useState(false);

  /* -------------------------------
     LOAD PATIENT + DASHBOARD DATA
  -------------------------------- */

  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem("patientData") || "{}");
    const dashboardData = JSON.parse(
      localStorage.getItem("dashboardData") || "{}"
    );

    if (patient.name) {
      setPatientName(patient.name);
    }

    setPhqScore(dashboardData.phq_sum ?? "--");
    setSeverity(dashboardData.severity_text ?? "--");
    setRisk(dashboardData.risk_label ?? "--");
    setRecommendation(
      dashboardData.recommendation_message ??
        "Take the assessment to view results."
    );
  }, []);

  /* -------------------------------
     CLEAN GEMINI TEXT
  -------------------------------- */

  function cleanGeminiText(rawText) {
    return rawText
      .replace(/#{1,6}\s*/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\|/g, "")
      .replace(/[-:]{2,}/g, "")
      .replace(/\n{2,}/g, "\n")
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" class="doctor-link">$1</a>'
      )
      .trim();
  }

  /* -------------------------------
     DOCTOR CARD RENDER
  -------------------------------- */

  function renderDoctorCard(lines) {
    const title = lines[0] || "Doctor";
    const details = lines.slice(1).join("<br>");

    return `
      <div class="doctor-card">
        <h4 class="doctor-name">${title}</h4>
        <p class="doctor-details">${details}</p>
      </div>
    `;
  }

  /* -------------------------------
     FIND DOCTORS (FIXED)
  -------------------------------- */

  async function findDoctors() {
    if (!location.trim()) {
      alert("Please enter a city name");
      return;
    }

    const dashboardData = JSON.parse(
      localStorage.getItem("dashboardData") || "{}"
    );

    const searchContext =
      dashboardData.search_context || "mental health professional";

    setShowResults(true);
    setLoading(true);
    setDoctorResults("");

    try {
      const data = await searchDoctorsAPI({
        location,
        search_context: searchContext,
      });

      const candidate = data.candidates?.[0];

      if (!candidate) {
        setDoctorResults("No doctors found for this location.");
        return;
      }

      const cleanText = cleanGeminiText(
        candidate.content.parts[0].text
      );

      const lines = cleanText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 10);

      let cardsHTML = "";
      let currentCard = [];

      lines.forEach((line) => {
        if (line.toLowerCase().startsWith("dr.")) {
          if (currentCard.length > 0) {
            cardsHTML += renderDoctorCard(currentCard);
            currentCard = [];
          }
        }
        currentCard.push(line);
      });

      if (currentCard.length > 0) {
        cardsHTML += renderDoctorCard(currentCard);
      }

      setDoctorResults(cardsHTML);
    } catch (err) {
      console.error(err);
      setDoctorResults("Failed to fetch doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto">
      <section className="card p-8 space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i data-lucide="bar-chart-3" />
          {patientName ? `Welcome, ${patientName}` : "Dashboard"}
        </h2>

        {/* METRICS */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-4 text-center">
            <p className="text-sm text-gray-500">PHQ Score</p>
            <h3 className="text-3xl font-bold">{phqScore}</h3>
          </div>
          <div className="card p-4 text-center">
            <p className="text-sm text-gray-500">Severity</p>
            <h3 className="font-semibold">{severity}</h3>
          </div>
          <div className="card p-4 text-center">
            <p className="text-sm text-gray-500">Risk Level</p>
            <h3 className="font-semibold">{risk}</h3>
          </div>
        </div>

        {/* RECOMMENDATION */}
        <p className="text-gray-600">{recommendation}</p>

        {/* DOCTOR SEARCH */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Find Doctors Near You</h3>
          <input
            type="text"
            placeholder="Enter city name (e.g. Delhi, Mumbai)"
            className="w-full p-3 border rounded-lg mb-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            onClick={findDoctors}
            className="btn-primary w-full py-3"
          >
            Find Doctors Near Me
          </button>
        </div>

        {/* LOADING */}
        {loading && <div className="loading-spinner" />}

        {/* RESULTS */}
        {showResults && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Recommended Doctors</h3>
            <div
              className="space-y-3 text-sm"
              dangerouslySetInnerHTML={{ __html: doctorResults }}
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
