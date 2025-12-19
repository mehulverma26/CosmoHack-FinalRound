import pandas as pd
import numpy as np

# ===============================
# LOAD DATA
# ===============================
df = pd.read_csv("Dataset_14-day_AA_depression_symptoms_mood_and_PHQ-9.csv")

phq_cols = [f"phq{i}" for i in range(1, 10)]
X = df[phq_cols].values

df["phq_sum"] = df[phq_cols].sum(axis=1)


def map_severity_label(phq_sum):
    if phq_sum < 5:
        return 0
    elif phq_sum < 10:
        return 1
    elif phq_sum < 15:
        return 2
    elif phq_sum < 20:
        return 3
    else:
        return 4


df["severity_label"] = df["phq_sum"].apply(map_severity_label)
y = df["severity_label"].values

print("Feature shape:", X.shape)
print("Label shape:", y.shape)

# ===============================
# TRAIN / TEST SPLIT
# ===============================
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ===============================
# TRAIN XGBOOST MODEL
# ===============================
from xgboost import XGBClassifier

model = XGBClassifier(
    n_estimators=300,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.9,
    colsample_bytree=0.9,
    objective="multi:softmax",
    num_class=5,
    random_state=42,
    eval_metric="mlogloss",
)

model.fit(X_train, y_train)

# ===============================
# EVALUATE
# ===============================
from sklearn.metrics import accuracy_score, classification_report

y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# ===============================
# EXPORT TO ONNX
# ===============================
import onnxmltools
from onnxmltools.convert.common.data_types import FloatTensorType
import onnx

initial_type = [("float_input", FloatTensorType([None, 9]))]

onnx_model = onnxmltools.convert_xgboost(model, initial_types=initial_type)

onnx.save_model(onnx_model, "phq9_severity_xgboost.onnx")

print("✅ ONNX model saved as phq9_severity_xgboost.onnx")
