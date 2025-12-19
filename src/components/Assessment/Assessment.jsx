import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Assessment({ predictSeverity }) {
  const [submitting, setSubmitting] = useState(false);

  const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure",
    "Trouble concentrating on things",
    "Moving or speaking slowly, or being restless",
    "Thoughts that you would be better off dead or of hurting yourself",
  ];

  /* -------------------------------
     RENDER PHQ-9 QUESTIONS
  -------------------------------- */
  useEffect(() => {
    const form = document.getElementById("phq-form");
    if (!form) return;

    form.innerHTML = "";

    questions.forEach((q, index) => {
      form.innerHTML += `
        <div class="border rounded-lg p-4">
          <p class="font-medium mb-3">${index + 1}. ${q}</p>
          <div class="flex gap-4 flex-wrap">
            ${[
              [0, "Not at all"],
              [1, "Several days"],
              [2, "More than half the days"],
              [3, "Nearly every day"],
            ]
              .map(
                ([value, label]) => `
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="phq${index + 1}" value="${value}">
                  <span>${value} – ${label}</span>
                </label>
              `
              )
              .join("")}
          </div>
        </div>
      `;
    });
  }, []);

  /* -------------------------------
     SUBMIT ASSESSMENT
  -------------------------------- */
  const submitAssessment = () => {
    setSubmitting(true);

    let payload = {};
    for (let i = 1; i <= 9; i++) {
      const selected = document.querySelector(
        `input[name="phq${i}"]:checked`
      );
      payload[`phq${i}`] = selected ? selected.value : 0;
    }

    setTimeout(() => {
      predictSeverity(payload);
      window.location.href = "/dashboard";
    }, 1200);
  };

  return (
    <motion.main
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <section className="card p-8 space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          📝 PHQ-9 Mental Health Assessment
        </h2>

        {/* SELECTION GUIDE */}
        <div className="card p-5 border-l-4 border-emerald-500 bg-white/60">
          <h4 className="font-semibold text-emerald-600 mb-3 flex items-center gap-2">
            🧠 How to choose your answer
          </h4>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex gap-2">
              <span className="font-bold text-emerald-600">0</span>
              <span>Not at all (0%)</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-emerald-600">1</span>
              <span>Several days (~25%)</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-emerald-600">2</span>
              <span>More than half the days (50–75%)</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-emerald-600">3</span>
              <span>Nearly every day (90–100%)</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Select the option that best represents how often you experienced
            each symptom over the last <strong>2 weeks</strong>.
          </p>
        </div>

        {/* QUESTIONS */}
        <form id="phq-form" className="space-y-6" />

        {/* SUBMIT BUTTON */}
        <motion.button
          type="button"
          onClick={submitAssessment}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          disabled={submitting}
          className="btn-primary w-full py-3 text-lg"
        >
          {submitting ? "Analyzing your responses…" : "Submit Assessment"}
        </motion.button>

        {/* LOADING TEXT */}
        {submitting && (
          <motion.p
            className="text-center text-emerald-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            Please wait while we evaluate your mental health status…
          </motion.p>
        )}
      </section>
    </motion.main>
  );
}

export default Assessment;
