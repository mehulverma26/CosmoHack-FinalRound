# 🧠 CodeCure – AI-Powered Mental Health Assessment & Sentiment Analysis

> **CosmoHack – Healthcare Track | Final Round Project**

---

## 📌 Overview

**CodeCure** is an AI-powered mental health assessment platform that combines **clinically validated screening (PHQ-9)**, **machine-learning–based severity prediction**, and **sentiment analysis of emotional narratives** to deliver a holistic, explainable, and privacy-aware mental health risk assessment.

The platform focuses on **early detection**, **risk prioritization**, and **guided professional support**, while maintaining strong ethical boundaries and user data protection.

---

## 🎯 Problem Statement

Enable fast, stigma-free mental health screening using intelligent assessment techniques, helping users identify potential risks early and seek timely professional guidance.

---

## 💡 Proposed Solution

- AI-powered **PHQ-9 mental health assessment**
- **ML-driven depression severity prediction** (XGBoost → ONNX)
- **Sentiment analysis** of free-text emotional narratives
- **Explainable rule-based fusion engine** for final risk scoring
- **Personalized doctor recommendation system** using Gemini API
- **Interactive dashboard** for insights and visualization

---

## 🧩 Key Features

### 📝 PHQ-9 Clinical Assessment

- 9 standardized clinical questions  
- Score range: **0–27**  
- Severity levels:
  - Minimal
  - Mild
  - Moderate
  - Moderately Severe
  - Severe

### 🤖 ML-Based Severity Prediction (ONNX)

- XGBoost classifier trained on PHQ-9 datasets
- Exported to **ONNX** format
- Runs directly in the browser using `onnxruntime-web`
- Ensures fast, private, client-side inference

### 💬 Emotional Narrative & Sentiment Analysis

- Users provide an emotional description (up to 250 words)
- NLP-based sentiment classification:
  - Positive
  - Neutral
  - Negative
- Confidence-aware sentiment scoring

### 🧠 Mental Health Signal Fusion

A deterministic and explainable fusion engine combines:

- PHQ-9 severity level
- Sentiment label
- Sentiment confidence score
- Red-flag keyword detection (self-harm, suicidal ideation)

➡️ Produces:
- **Final risk category**
- **Alert level**
- **Human-readable explanation**

### 📊 Interactive Dashboard

- PHQ-9 score and severity
- Sentiment insights
- Risk classification
- Fused mental health assessment summary

### 🧑‍⚕️ Doctor Recommendation System

- Location-based mental health professional search
- Gemini API integration
- AI-generated insights and actionable guidance

---

## ⚙️ System Workflow

1. User enters basic details  
2. PHQ-9 questionnaire is completed  
3. ML model predicts depression severity (ONNX)  
4. Emotional narrative is submitted  
5. Sentiment analysis is performed  
6. Fusion engine evaluates overall risk  
7. Results displayed on dashboard  
8. User searches for nearby professionals  

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Lucide React Icons

### AI / ML
- Python (model training)
- XGBoost Classifier
- ONNX Runtime (Web)
- NLP-based sentiment analysis

### Backend / APIs
- Gemini API (doctor recommendations & insights)
- Browser LocalStorage (temporary state only)

---

## 📂 Project Structure

src/
│── components/
│ ├── Home/
│ ├── Patient/
│ ├── Assessment/
│ ├── Dashboard/
│ ├── Navbar.jsx
│── utils/
│ ├── onnxSeverity.js
│ ├── sentiment.js
│ ├── fusion.js
│── python/
│ ├── phq9_response_analysier.py
│ ├── testing.py
│── public/models/
│ └── phq9_severity_xgboost.onnx

---

## 🧪 Machine Learning Methodology

### Dataset Processing
- PHQ-9 response dataset
- Features: `phq1` → `phq9`
- Target: Severity class (0–4)

### Model Training
- Algorithm: **XGBoost Classifier**
- Stratified train-test split
- Hyperparameter tuning

### Evaluation
- Accuracy and classification report
- Balanced multi-class performance

### Deployment
- Exported to **ONNX**
- Loaded client-side using `onnxruntime-web`

---

## 🚀 Installation & Usage

### Prerequisites
- Node.js (v20+ recommended)
- npm

### Setup

```bash
git clone https://github.com/mehulverma26/CosmoHack-FinalRound.git
cd CosmoHack-FinalRound
npm install
npm start
```

## 🔐 Ethical Considerations

- ⚠️ Not a diagnostic or medical replacement tool

- Intended for screening and awareness only

- No permanent storage of sensitive health data

- Red-flag cases handled with caution

- Encourages professional consultation

## 🔮 Future Enhancements

- Multilingual sentiment analysis

- Voice-based emotional input

- AI-guided wellness plans

- Secure clinician dashboard

## 👥 Team – CodeCure

- Anirudh Garg

- Mehul Verma

- Vansh Gaba

- Ansh Shokeen

## 🏆 Hackathon Details

- Event: CosmoHack – Final Round

- Track: Healthcare

- Project Name: CodeCure

## 📚 References

- Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001).
The PHQ-9: Validity of a brief depression severity measure.
https://pubmed.ncbi.nlm.nih.gov/11556941/

- Spitzer, R. L., Kroenke, K., Williams, J. B., & Löwe, B. (2006).
A brief measure for assessing generalized anxiety disorder: The GAD-7.
https://pubmed.ncbi.nlm.nih.gov/16717171/

- Cohen, S., Kamarck, T., & Mermelstein, R. (1983).
A global measure of perceived stress.
https://www.jstor.org/stable/2136404

- De Choudhury, M., Gamon, M., Counts, S., & Horvitz, E. (2013).
Predicting Depression via Social Media.
https://www.aaai.org/ocs/index.php/ICWSM/ICWSM13/paper/view/6124

- Gratch, J., Artstein, R., Lucas, G. M., et al. (2014).
The Distress Analysis Interview Corpus (DAIC).
https://dcapswoz.ict.usc.edu/


💚 CodeCure aims to make mental health support accessible, explainable, and humane.