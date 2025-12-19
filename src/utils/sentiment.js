import Sentiment from "sentiment";

// Initialize sentiment analyzer
const sentimentAnalyzer = new Sentiment();

/**
 * Analyze emotional sentiment from patient text
 * @param {string} text - Patient's open-ended emotional response
 * @returns {object} sentiment result
 */
export function analyzeSentiment(text) {
  // Safety check
  if (!text || text.trim().length === 0) {
    return {
      label: "Neutral",
      score: 0,
      confidence: 0.0, // ✅ numeric
      insight: "No emotional narrative provided",
      positiveWords: [],
      negativeWords: [],
    };
  }

  // Run sentiment analysis
  const result = sentimentAnalyzer.analyze(text);

  /**
   * result.score:
   *  > 0  → positive
   *  < 0  → negative
   *  = 0  → neutral
   */
  let label = "Neutral";
  if (result.score > 1) label = "Positive";
  else if (result.score < -1) label = "Negative";

  /**
   * Confidence calculation
   * comparative = score / number_of_words
   * Range is small, so normalize safely
   */
  const confidence = Math.min(
    1,
    Math.abs(result.comparative)
  ); // ✅ ALWAYS 0–1

  // Human-readable insight
  let insight = "Emotional tone appears balanced";
  if (label === "Negative") {
    insight = "Patient expresses emotional distress or negative feelings";
  } else if (label === "Positive") {
    insight = "Patient expresses hopeful or positive emotions";
  }

  return {
    label,                    // ✅ string
    score: result.score,      // ✅ number
    confidence,               // ✅ number (0–1)
    positiveWords: result.positive,
    negativeWords: result.negative,
    insight,
  };
}