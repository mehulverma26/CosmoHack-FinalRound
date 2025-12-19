import onnxruntime as ort
import numpy as np

session = ort.InferenceSession("phq9_severity_xgboost.onnx")
input_name = session.get_inputs()[0].name

sample = np.array([[1, 2, 0, 3, 2, 1, 1, 0, 0]], dtype=np.float32)
pred = session.run(None, {input_name: sample})

print("Predicted severity:", pred[0])
