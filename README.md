# 🫁 PulmoScan AI
### Next-Generation Respiratory Diagnostics & Clinical Decision Support System

PulmoScan AI is a sophisticated medical platform that bridges deep learning-based disease detection with actionable clinical reasoning. By integrating multi-modal AI analysis with Large Language Models (LLMs), it delivers a comprehensive diagnostic ecosystem for respiratory health — entirely on your local machine.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![React 17](https://img.shields.io/badge/React-17.0.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Ollama](https://img.shields.io/badge/LLM-Ollama-white?logo=ollama&logoColor=black)](https://ollama.com/)

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [Usage](#-usage) • [Contact](#-contact)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Machine Learning Models](#-machine-learning-models)
- [Roadmap](#-roadmap)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🎯 Overview

PulmoScan AI automates the most demanding parts of respiratory diagnostics — analyzing lung sounds and chest X-rays, generating condition-specific clinical questions, and synthesizing everything into a structured medical report with severity scoring and escalation guidance.

**The Problem**

Traditional diagnostic workflows often produce vague recommendations, miss critical follow-up questions, and fail to connect AI predictions to the kind of structured reasoning clinicians actually need.

**Our Solution**

- **Multi-Modal Analysis** — process both lung sounds (audio) and chest X-rays (images).
- **Deep Learning Detection** — identify COPD, pneumonia, asthma, bronchitis, and more.
- **Intelligent Follow-Up** — auto-generate 16+ detailed, condition-specific clinical questions.
- **Structured Reporting** — severity assessment, red flags, treatment recommendations, and escalation criteria in one report.
- **Privacy-First Design** — all processing happens locally; no data leaves your machine.

---

## ✨ Features

### 🔬 Advanced Diagnostics
- **Audio Analysis** — CNN-based breath sound classification for respiratory conditions.
- **Image Analysis** — EfficientNet-B4/B7 architecture for chest X-ray interpretation.
- **Multi-Class Detection** — COPD, Pneumonia, Asthma, Bronchitis, URTI, Bronchiolitis, and Healthy.

### 🤖 AI-Powered Clinical Reasoning
- **Smart Questionnaire** — automatically generates 16 disease-specific follow-up questions.
- **Comprehensive Reports** including:
  - Clinical summary and likely conditions
  - Severity assessment (Low / Moderate / Urgent) with rationale
  - Red flag identification
  - Recommended diagnostic tests with rationale
  - Medication guidance (dosing, contraindications, interactions)
  - Lifestyle and dietary recommendations
  - Escalation triggers for emergency care
  - Differential diagnosis considerations

### 🎨 Modern User Experience
- **Desktop Application** — native Electron-based interface for Windows.
- **Three-Step Workflow** — Intake → Follow-up → Report.
- **Real-Time Feedback** — progress indicators and immediate analysis results.
- **Clean Design** — modern typography (Space Grotesk) with gradient accents.

### 🔒 Privacy & Security
- **Local-First Architecture** — all data processing stays on your machine.
- **No External APIs** — LLM inference via local Ollama; no cloud dependency.
- **HIPAA-Conscious Design** — no PHI transmission or remote storage.

---

## 🎬 Application Workflow

```
┌─────────────────┐
│ Step 1: Intake  │  Upload audio/image + patient demographics
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Analysis    │  Deep learning model processes the input
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Step 2: Q&A   │  16 intelligent follow-up questions
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Step 3: Report  │  Comprehensive clinical assessment
└─────────────────┘
```

**Sample Output**

| Field | Value |
|---|---|
| Input | Chest X-ray with infiltrates |
| Detection | Pneumonia — 94% confidence |
| Severity | Moderate |
| Red Flags | Fever >102°F for 3 days, productive cough |
| Recommended Tests | CBC, CRP, sputum culture |
| Medications | Amoxicillin-clavulanate 875mg BID (avoid if penicillin allergy) |
| Escalation Triggers | Persistent fever >5 days, worsening dyspnea |

---

## 🛠️ Technology Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 17 with Hooks |
| Desktop Shell | Electron |
| Styling | styled-components (CSS-in-JS) |
| Build Tools | Webpack 5, Babel 7 |
| HTTP Client | Axios |
| Testing | Jest + React Testing Library |

### Backend
| Layer | Technology |
|---|---|
| Framework | Flask (Python) |
| CORS | Flask-CORS |
| ML & Audio | PyTorch, scikit-learn, librosa |
| Image Processing | OpenCV, PIL |
| LLM Inference | Ollama (local) |

### Machine Learning
| Component | Details |
|---|---|
| Audio Model | Custom CNN for breath sound classification |
| Image Model | EfficientNet-B4/B7 (transfer learning) |
| LLM | Qwen 2.5 (3B/7B) via Ollama |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Electron Desktop App                   │
│  ┌────────────────────────────────────────────────────┐  │
│  │           React UI (Renderer Process)              │  │
│  │  File Upload • Patient Intake • Q&A • Report View  │  │
│  └────────────────┬───────────────────────────────────┘  │
│                   │  IPC (Secure Preload Bridge)         │
│  ┌────────────────▼───────────────────────────────────┐  │
│  │             Electron Main Process                  │  │
│  │       Window Management • File System Access       │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────┬──────────────────────────────────────┘
                    │  HTTP / REST API
┌───────────────────▼──────────────────────────────────────┐
│                   Flask Backend Server                   │
│  ┌────────────────────────────────────────────────────┐  │
│  │  API Routes                                        │  │
│  │  /health • /audio_prediction • /image_prediction   │  │
│  │  /generate_questions • /analyze_responses          │  │
│  └───────┬─────────────────────────┬──────────────────┘  │
│          │                         │                     │
│  ┌───────▼──────────┐     ┌────────▼─────────────────┐   │
│  │   ML Models      │     │     LLM Integration      │   │
│  │  • Audio CNN     │     │  • Ollama Client         │   │
│  │  • EfficientNet  │     │  • Prompt Engineering    │   │
│  └──────────────────┘     └──────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

**Data Flow**

1. **Intake** — user uploads audio/image file via the Electron UI.
2. **Transmission** — file sent to Flask backend via multipart/form-data.
3. **Prediction** — ML model processes input and returns diagnosis with confidence score.
4. **Question Generation** — LLM generates targeted follow-up questions based on diagnosis.
5. **User Response** — patient or clinician answers questions in the UI.
6. **Report Generation** — LLM synthesizes responses into a structured clinical report.
7. **Rendering** — frontend parses the markdown report into formatted sections with severity badges.

---

## 📁 Project Structure

```
PulmoScanAI/
├── ai_engine/              # Deep learning models & signal processing
│   ├── Architecture/       # Model architecture diagrams
│   ├── Image/              # Image model development & weights
│   ├── Models/             # Audio model weights
│   ├── Audio_model.py      # Audio classification pipeline
│   └── Image_model.py      # Image classification pipeline
├── backend_api/            # Flask REST API & LLM orchestration
│   ├── app.py              # Routes and LLM integration
│   ├── requirements.txt
│   └── .env.example
└── desktop_client/         # Electron + React desktop application
    ├── src/                # React components (App.js, index.js)
    ├── main.js             # Electron main process
    ├── package.json
    └── webpack.config.js
```

---

## 🚀 Installation

**Prerequisites**
- Python 3.12 or higher
- Node.js 18.x or higher
- [Ollama](https://ollama.ai) for local LLM inference
- Git

**Step 1 — Clone the Repository**

```bash
git clone https://github.com/addy12bag/PulmoScan-AI.git
cd PulmoScanAI
```

**Step 2 — Backend Setup**

```bash
cd backend_api
python -m venv venv
source venv/bin/activate        # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

**Step 3 — Download the LLM Model**

```bash
ollama pull qwen2.5:3b
```

**Step 4 — Frontend Setup**

```bash
cd ../desktop_client
npm install
npm run build
```

---

## 💻 Usage

**Terminal 1 — Start the Flask Backend**

```bash
cd backend_api
python app.py
```

**Terminal 2 — Launch the Electron App**

```bash
cd desktop_client
npm start
```

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | Backend health check |
| `/audio_prediction` | `POST` | Process audio breath sounds |
| `/image_prediction` | `POST` | Process chest X-ray images |
| `/generate_questions` | `POST` | Generate targeted clinical questions |
| `/analyze_responses` | `POST` | Generate comprehensive medical report |

---

## 🧠 Machine Learning Models

### Audio Classification Model
- **Architecture:** Custom CNN-Transformer hybrid
- **Classes:** COPD, Asthma, Bronchitis, URTI, Bronchiolitis, Healthy
- **Test Accuracy:** 91.6%

### Image Classification Model
- **Architecture:** EfficientNet-B4/B7 (transfer learning)
- **Classes:** Pneumonia, Normal

### LLM Integration
- **Model:** Qwen 2.5 (3B)
- **Tasks:** Dynamic question generation and clinical report synthesis

---

## 🗺️ Roadmap

- [ ] **Multi-Language Support** — internationalization for global clinical use.
- [ ] **Report Export** — PDF/DOCX export functionality.
- [ ] **Patient History** — session persistence and longitudinal tracking.
- [ ] **Cloud Deployment** — optional cloud-based inference for resource-constrained devices.

---

## 👥 Contributors

| Name | Role |
|---|---|
| **Sayan Das** | Lead Author & AI/ML Developer |
| **Sayantan Bag** | Co-Author, ML Developer & Project Manager |

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

Copyright © 2026 Sayan Das & Sayantan Bag.

---

<div align="center">

**Developed with ❤️ for Medical Innovation**

</div>
