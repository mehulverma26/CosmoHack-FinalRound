/**
 * Rule-based fusion of PHQ-9 clinical severity
 * and emotional sentiment analysis
 * (Explainable & deterministic)
 */

const RED_FLAG_KEYWORDS = [
  "kill myself",
  "suicide",
  "end my life",
  "want to die",
  "die",
  "self harm",
  "hurt myself",
  "no reason to live",
  "giving up",
  "can't go on",
];

export function fuseMentalHealthSignals({
  severityLevel,
  sentimentLabel,
  sentimentConfidence,
  emotionText,
}) {
  const text = emotionText.toLowerCase();

  /* 🚨 RULE 0 — RED FLAG OVERRIDE */
  if (RED_FLAG_KEYWORDS.some((k) => text.includes(k))) {
    return {
      finalRisk: "HIGH RISK",
      alertLevel: "CRITICAL",
      explanation:
        "Self-harm or suicidal ideation detected in emotional narrative.",
    };
  }

  /* 🚨 RULE 1 — SEVERE PHQ-9 */
  if (severityLevel >= 3) {
    return {
      finalRisk: "HIGH RISK",
      alertLevel: "CRITICAL",
      explanation:
        "Severe PHQ-9 score indicates high clinical depression risk.",
    };
  }

  /* ⚠️ RULE 2 — MODERATE + NEGATIVE SENTIMENT */
  if (
    severityLevel === 2 &&
    sentimentLabel === "Negative" &&
    sentimentConfidence >= 0.5
  ) {
    return {
      finalRisk: "HIGH RISK",
      alertLevel: "WARNING",
      explanation:
        "Moderate depression combined with strong negative emotional tone.",
    };
  }

  /* ⚠️ RULE 3 — MILD + NEGATIVE */
  if (severityLevel === 1 && sentimentLabel === "Negative") {
    return {
      finalRisk: "MEDIUM RISK",
      alertLevel: "MONITOR",
      explanation:
        "Early depressive symptoms with negative emotional state detected.",
    };
  }

  /* ✅ DEFAULT */
  return {
    finalRisk: "LOW / MODERATE",
    alertLevel: "NORMAL",
    explanation: "Standard mental health assessment outcome.",
  };
}