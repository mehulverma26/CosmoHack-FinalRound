import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Assessment({ predictSeverity }) {
  const [submitting, setSubmitting] = useState(false);
  const [showEmotionPrompt, setShowEmotionPrompt] = useState(false);
  const [emotionText, setEmotionText] = useState("");

  const WORD_LIMIT = 250;

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
     SUBMIT PHQ-9 → OPEN TEXT POPUP
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

    predictSeverity(payload);

    setTimeout(() => {
      setSubmitting(false);
      setShowEmotionPrompt(true);
    }, 800);
  };

  /* -------------------------------
     HANDLE TEXT INPUT (250 WORDS)
  -------------------------------- */
  const handleEmotionChange = (e) => {
    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
    if (words.length <= WORD_LIMIT) {
      setEmotionText(e.target.value);
    }
  };

  const wordCount =
    emotionText.trim().length === 0
      ? 0
      : emotionText.trim().split(/\s+/).length;

  /* -------------------------------
     BUTTON ACTIONS
  -------------------------------- */
  const continueAfterPrompt = () => {
    localStorage.setItem("emotionNarrative", emotionText);
    setShowEmotionPrompt(false);
    window.location.href = "/dashboard";
  };

  const goBackToAssessment = () => {
    setShowEmotionPrompt(false);
  };

  return (
    <>
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
            <h4 className="font-semibold text-emerald-600 mb-3">
              🧠 How to choose your answer
            </h4>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div><strong>0</strong> – Not at all (0%)</div>
              <div><strong>1</strong> – Several days (~25%)</div>
              <div><strong>2</strong> – More than half the days (50–75%)</div>
              <div><strong>3</strong> – Nearly every day (90–100%)</div>
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

          {submitting && (
            <motion.p
              className="text-center text-emerald-600 text-sm"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              Please wait while we evaluate your mental health status…
            </motion.p>
          )}
        </section>
      </motion.main>

      {/* --------------------------------
           EMOTIONAL TEXT INPUT POPUP
      -------------------------------- */}
      {showEmotionPrompt && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-3 text-emerald-600">
              💬 Describe how you have been feeling emotionally
            </h3>

            <p className="text-gray-600 text-sm mb-3">
              You may describe your thoughts, emotions, or concerns in your own
              words. There is no right or wrong answer.
            </p>

            <textarea
              rows={5}
              className="w-full p-3 border rounded-lg text-sm"
              placeholder="Write here (maximum 250 words)..."
              value={emotionText}
              onChange={handleEmotionChange}
            />

            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{wordCount} / {WORD_LIMIT} words</span>
              {wordCount === WORD_LIMIT && (
                <span className="text-red-500">Word limit reached</span>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-between items-center mt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                onClick={goBackToAssessment}
              >
                ← Back
              </motion.button>

              <motion.button
                whileHover={{ scale: emotionText ? 1.03 : 1 }}
                whileTap={{ scale: emotionText ? 0.95 : 1 }}
                disabled={emotionText.trim().length === 0}
                className={`btn-primary px-6 py-2 ${
                  emotionText.trim().length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={continueAfterPrompt}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default Assessment;
