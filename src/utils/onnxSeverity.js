import * as ort from "onnxruntime-web";

/**
 * IMPORTANT CONFIGURATION
 * -----------------------
 * Tell ONNX Runtime where to load its WASM binaries from.
 * Without this, you will get:
 * "expected magic word 00 61 73 6d, found <!do"
 */
ort.env.wasm.wasmPaths =
  "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";

// Optional but recommended for performance
ort.env.wasm.numThreads = 1;
ort.env.wasm.simd = true;

// Cache session so model loads only once
let session = null;

// Severity label mapping (must match training)
export const SEVERITY_MAP = {
  0: "Minimal Depression",
  1: "Mild Depression",
  2: "Moderate Depression",
  3: "Moderately Severe Depression",
  4: "Severe Depression",
};

/**
 * Load ONNX model (runs once)
 */
export async function loadSeverityModel() {
  if (!session) {
    console.log("⏳ Loading PHQ-9 ONNX model...");

    session = await ort.InferenceSession.create(
      "models/phq9_severity_xgboost.onnx", // MUST be inside public/models/
      {
        executionProviders: ["wasm"],
      }
    );

    console.log("✅ PHQ-9 ONNX model loaded successfully");
  }

  return session;
}

/**
 * Predict severity using ONNX model
 * @param {Object} phqAnswers - { phq1, phq2, ..., phq9 }
 */
export async function predictSeverityONNX(phqAnswers) {
  const model = await loadSeverityModel();

  // Convert PHQ answers into Float32Array (order matters!)
  const inputData = new Float32Array([
    Number(phqAnswers.phq1),
    Number(phqAnswers.phq2),
    Number(phqAnswers.phq3),
    Number(phqAnswers.phq4),
    Number(phqAnswers.phq5),
    Number(phqAnswers.phq6),
    Number(phqAnswers.phq7),
    Number(phqAnswers.phq8),
    Number(phqAnswers.phq9),
  ]);

  // Create ONNX tensor
  const inputTensor = new ort.Tensor(
    "float32",
    inputData,
    [1, 9]
  );

  // IMPORTANT: input name must match ONNX export
  const feeds = {
    float_input: inputTensor,
  };

  // Run inference
  const results = await model.run(feeds);

  // XGBoost softmax → single class output
  const outputTensor = Object.values(results)[0];
  const severityClass = outputTensor.data[0];

  return {
    severity_label: severityClass,
    severity_text: SEVERITY_MAP[severityClass],
    risk_level:
      severityClass >= 3 ? "HIGH RISK" : "LOW / MODERATE",
  };
}