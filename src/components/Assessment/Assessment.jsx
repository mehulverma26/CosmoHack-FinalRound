import React, { useEffect } from "react";

function Assessment({ predictSeverity }) {
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

  useEffect(() => {
    const form = document.getElementById("phq-form");
    if (!form) return;

    form.innerHTML = "";

    // Render PHQ-9 questions
    questions.forEach((q, index) => {
      form.innerHTML += `
        <div class="border rounded-lg p-4">
          <p class="font-medium mb-3">${index + 1}. ${q}</p>
          <div class="flex gap-4 flex-wrap">
            ${[0, 1, 2, 3]
              .map(
                (value) => `
              <label class="flex items-center gap-1">
                <input type="radio" name="phq${index + 1}" value="${value}">
                ${value}
              </label>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    });
  }, []);

  // Submit PHQ-9 (Frontend-only replacement for Flask API)
  const submitAssessment = () => {
    let payload = {};

    for (let i = 1; i <= 9; i++) {
      const selected = document.querySelector(
        `input[name="phq${i}"]:checked`
      );
      payload[`phq${i}`] = selected ? selected.value : 0;
    }

    // 🔴 Replaces fetch("/api/predict_severity")
    predictSeverity(payload);

    // Redirect to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <>
      <main className="max-w-5xl mx-auto">
        <section className="card p-8 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <i data-lucide="clipboard-list" />
            PHQ-9 Mental Health Assessment
          </h2>

          <form id="phq-form" className="space-y-6" />

          <button
            type="button"
            onClick={submitAssessment}
            className="btn-primary w-full py-3 text-lg"
          >
            Submit Assessment
          </button>
        </section>
      </main>
    </>
  );
}

export default Assessment;
