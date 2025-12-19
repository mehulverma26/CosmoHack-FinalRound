/**
 * Rule-based fusion of clinical PHQ-9 severity
 * and emotional sentiment analysis
 *
 * This module does NOT use ML.
 * It combines outputs of two independent models.
 */

/**
 * @param {Object} params
 * @param {number} params.severityLevel - 0 to 4 (PHQ-9 severity class)
 * @param {string} params.severityText - Human readable severity
 * @param {string} params.sentimentLabel - Positive | Neutral | Negative
 * @param {number} params.sentimentConfidence - 0 to 1
 *
 * @returns {Object} fused decision
 */
export function fuseMentalHealthSignals({
  severityLevel,
  severityText,
  sentimentLabel,
  sentimentConfidence,
}) {
  let finalRisk = "LOW / MODERATE";
  let alertLevel = "NORMAL";
  let explanation = "Standard mental health assessment outcome";

  /* ==================================================
     RULE 1: High clinical severity dominates everything
     ================================================== */
  if (severityLevel >= 3) {
    return {
      finalRisk: "HIGH RISK",
      alertLevel: "CRITICAL",
      explanation:
        "High PHQ-9 severity indicates serious depressive symptoms requiring immediate professional intervention.",
    };
  }

  /* ==================================================
     RULE 2: Moderate PHQ + strong negative emotion
     ================================================== */
  if (
    severityLevel === 2 &&
    sentimentLabel === "Negative" &&
    sentimentConfidence >= 0.5
  ) {
    return {
      finalRisk: "HIGH RISK",
      alertLevel: "ESCALATED",
      explanation:
        "Moderate clinical symptoms combined with strong negative emotional expression suggest elevated psychological distress.",
    };
  }

  /* ==================================================
     RULE 3: Mild PHQ + negative emotional narrative
     ================================================== */
  if (
    severityLevel === 1 &&
    sentimentLabel === "Negative" &&
    sentimentConfidence >= 0.6
  ) {
    return {
      finalRisk: "MEDIUM RISK",
      alertLevel: "WARNING",
      explanation:
        "Mild PHQ-9 symptoms but emotionally negative narrative indicate early warning signs of mental health decline.",
    };
  }

  /* ==================================================
     RULE 4: Minimal PHQ but emotionally distressed
     ================================================== */
  if (
    severityLevel === 0 &&
    sentimentLabel === "Negative" &&
    sentimentConfidence >= 0.7
  ) {
    return {
      finalRisk: "MEDIUM RISK",
      alertLevel: "MONITOR",
      explanation:
        "Low clinical score but strong emotional distress detected through sentiment analysis requires close monitoring.",
    };
  }

  /* ==================================================
     RULE 5: Positive emotional protective factor
     ================================================== */
  if (
    sentimentLabel === "Positive" &&
    sentimentConfidence >= 0.6
  ) {
    return {
      finalRisk: "LOW RISK",
      alertLevel: "PROTECTIVE",
      explanation:
        "Positive emotional expression acts as a protective psychological factor despite clinical symptoms.",
    };
  }

  /* ==================================================
     DEFAULT CASE
     ================================================== */
  return {
    finalRisk,
    alertLevel,
    explanation,
  };
}