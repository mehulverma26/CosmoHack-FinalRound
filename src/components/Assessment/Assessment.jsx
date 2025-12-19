import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { predictSeverityONNX } from "../../utils/onnxSeverity";
import { analyzeSentiment } from "../../utils/sentiment";
import { fuseMentalHealthSignals } from "../../utils/fusion"; // ✅ FUSION

function Assessment() {
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
     SUBMIT PHQ-9 → ONNX MODEL
  -------------------------------- */
  const submitAssessment = async () => {
    setSubmitting(true);

    let payload = {};
    for (let i = 1; i <= 9; i++) {
      const selected = document.querySelector(
        `input[name="phq${i}"]:checked`
      );
      payload[`phq${i}`] = selected ? selected.value : 0;
    }

    try {
      const result = await predictSeverityONNX(payload);

      localStorage.setItem(
        "dashboardData",
        JSON.stringify({
          phq_sum: Object.values(payload).reduce((a, b) => a + Number(b), 0),
          severity_text: result.severity_text,
          risk_label: result.risk_level,
          severity_level: result.severity_level, // ✅ IMPORTANT FOR FUSION
        })
      );

      setSubmitting(false);
      setShowEmotionPrompt(true);
    } catch (err) {
      console.error("ONNX inference failed:", err);
      setSubmitting(false);
    }
  };

  /* -------------------------------
     HANDLE EMOTIONAL TEXT INPUT
  -------------------------------- */
  const handleEmotionChange = (e) => {
    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
    if (words.length <= WORD_LIMIT) {
      setEmotionText(e.target.value);
    }
  };

  /* -------------------------------
     CONTINUE → SENTIMENT + FUSION
  -------------------------------- */
  const continueAfterPrompt = () => {
    const sentimentResult = analyzeSentiment(emotionText);
    const dashboardData = JSON.parse(localStorage.getItem("dashboardData"));

    // 🔥 FUSION LOGIC
    const fusionResult = fuseMentalHealthSignals({
      severityLevel: dashboardData.severity_level,
      severityText: dashboardData.severity_text,
      sentimentLabel: sentimentResult.label,
      sentimentConfidence: sentimentResult.confidence,
    });

    // Save sentiment
    localStorage.setItem(
      "sentimentData",
      JSON.stringify({
        text: emotionText,
        ...sentimentResult,
      })
    );

    // Save fusion result
    localStorage.setItem(
      "fusionData",
      JSON.stringify(fusionResult)
    );

    setShowEmotionPrompt(false);
    window.location.href = "/dashboard";
  };

  const goBackToAssessment = () => {
    setShowEmotionPrompt(false);
  };

  return (
    <>
      <motion.main className="max-w-5xl mx-auto">
        <section className="card p-8 space-y-6">
          <h2 className="text-2xl font-bold">📝 PHQ-9 Mental Health Assessment</h2>
          <form id="phq-form" className="space-y-6" />
          <button
            onClick={submitAssessment}
            disabled={submitting}
            className="btn-primary w-full py-3"
          >
            {submitting ? "Analyzing…" : "Submit Assessment"}
          </button>
        </section>
      </motion.main>

      {showEmotionPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-semibold text-emerald-600">
              💬 Describe how you feel emotionally
            </h3>
            <textarea
              rows={5}
              className="w-full p-3 border rounded-lg"
              value={emotionText}
              onChange={handleEmotionChange}
            />
            <div className="flex justify-between mt-4">
              <button onClick={goBackToAssessment}>← Back</button>
              <button
                className="btn-primary px-6 py-2"
                onClick={continueAfterPrompt}
                disabled={!emotionText.trim()}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Assessment;