import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

  const [doctorResults, setDoctorResults] = useState([]);
  const [keyInfo, setKeyInfo] = useState([]);
  const [showResults, setShowResults] = useState(false);

  /* -------------------------------
     LOAD PATIENT + DASHBOARD DATA
  -------------------------------- */
  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem("patientData") || "{}");
    const dashboardData = JSON.parse(
      localStorage.getItem("dashboardData") || "{}"
    );

    if (patient.name) setPatientName(patient.name);

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
  function cleanGeminiText(text) {
    return text
      .replace(/#{1,6}\s*/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\|/g, "")
      .replace(/[-:]{2,}/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();
  }

  /* -------------------------------
     PARSE GEMINI RESPONSE (SAFE)
  -------------------------------- */
  function parseGeminiResponse(text) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const doctors = [];
    const info = [];

    let currentDoctor = null;

    lines.forEach((line) => {
      if (/^dr\./i.test(line)) {
        if (currentDoctor) doctors.push(currentDoctor);
        currentDoctor = { name: line, details: [] };
        return;
      }

      if (currentDoctor) {
        currentDoctor.details.push(line);
        return;
      }

      if (
        !line.toLowerCase().includes("dr.") &&
        !/^\d+\./.test(line) &&
        line.length > 40
      ) {
        info.push(line);
      }
    });

    if (currentDoctor) doctors.push(currentDoctor);

    return { doctors, info: info.slice(0, 5) };
  }

  /* -------------------------------
     FIND DOCTORS
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
    setDoctorResults([]);
    setKeyInfo([]);

    try {
      const data = await searchDoctorsAPI({
        location,
        search_context: searchContext,
      });

      const candidate = data.candidates?.[0];
      if (!candidate) return;

      const cleanText = cleanGeminiText(
        candidate.content.parts[0].text
      );

      const { doctors, info } = parseGeminiResponse(cleanText);

      setDoctorResults(doctors);
      setKeyInfo(info);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------
     ANIMATION VARIANTS
  -------------------------------- */
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.main
      className="max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.section
        className="card p-8 space-y-6"
        variants={fadeUp}
      >
        <h2 className="text-2xl font-bold">
          {patientName ? `Welcome, ${patientName}` : "Dashboard"}
        </h2>

        {/* METRICS */}
        <div className="grid md:grid-cols-3 gap-6">
          {[phqScore, severity, risk].map((_, i) => (
            <motion.div
              key={i}
              className="card p-4 text-center"
              variants={fadeUp}
            >
              <p className="text-sm text-gray-500">
                {i === 0 ? "PHQ Score" : i === 1 ? "Severity" : "Risk Level"}
              </p>
              <h3 className="text-3xl font-bold">
                {i === 0 ? phqScore : i === 1 ? severity : risk}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* RECOMMENDATION */}
        <motion.p className="text-gray-600" variants={fadeUp}>
          {recommendation}
        </motion.p>

        {/* SEARCH */}
        <motion.div variants={fadeUp}>
          <h3 className="font-semibold mb-2">Find Doctors Near You</h3>
          <input
            type="text"
            placeholder="Enter city name (e.g. Delhi, Mumbai)"
            className="w-full p-3 border rounded-lg mb-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <motion.button
            onClick={findDoctors}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary w-full py-3"
          >
            Find Doctors Near Me
          </motion.button>
        </motion.div>

        {loading && (
          <motion.p
            className="text-center text-emerald-600"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            Searching trusted professionals…
          </motion.p>
        )}

        {/* RESULTS */}
        {showResults && (
          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-6"
            variants={fadeUp}
          >
            {/* KEY INSIGHTS */}
            <motion.div className="md:col-span-1 card p-5" variants={fadeUp}>
              <h3 className="font-semibold mb-4 text-emerald-600">
                Key Insights
              </h3>

              {keyInfo.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No summary insights available.
                </p>
              ) : (
                <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
                  {keyInfo.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-500 mt-1">●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            {/* DOCTOR CARDS */}
            <motion.div
              className="md:col-span-2 grid sm:grid-cols-2 gap-6"
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              {doctorResults.map((doc, index) => (
                <motion.div
                  key={index}
                  className="doctor-card"
                  variants={fadeUp}
                >
                  <h4 className="doctor-name">{doc.name}</h4>
                  <ul className="doctor-details">
                    {doc.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.section>
    </motion.main>
  );
}

export default Dashboard;
