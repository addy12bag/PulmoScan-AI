# 🫁 PulmoScan AI

### **Next-Generation Respiratory Diagnostics & Clinical Decision Support System**

PulmoScan AI is a sophisticated medical platform that bridges the gap between deep learning-based disease detection and actionable clinical reasoning. By integrating multi-modal AI analysis with advanced Large Language Models (LLMs), PulmoScan AI provides a comprehensive diagnostic ecosystem for respiratory health.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![React 17](https://img.shields.io/badge/React-17.0.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Ollama](https://img.shields.io/badge/LLM-Ollama-white?logo=ollama&logoColor=black)](https://ollama.com/)

[Features](#-features) • [Demo](#-demo) • [Architecture](#-architecture) • [Installation](#-installation) • [Usage](#-usage) • [Contact](#-contact)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Machine Learning Models](#-machine-learning-models)
- [Configuration](#-configuration)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

PulmoScan AI is a comprehensive diagnostic platform that bridges the gap between AI-powered disease detection and clinical decision-making. The system analyzes respiratory audio recordings and chest X-ray images to identify potential lung conditions, then leverages large language models to generate detailed clinical assessments and actionable recommendations.

### **What We're Doing**

**The Problem:** Traditional diagnostic workflows often miss critical follow-up questions, provide vague recommendations, and lack structured clinical reasoning that connects AI predictions to actionable medical insights.

**Our Solution:** PulmoScan AI integrates:
- **Multi-Modal Analysis**: Process both lung sounds (audio) and chest X-rays (images).
- **Deep Learning Detection**: Identify conditions like COPD, pneumonia, asthma, bronchitis, and more.
- **Intelligent Follow-Up**: Generate 16+ detailed, condition-specific clinical questions.
- **Structured Reporting**: Create comprehensive medical reports with severity assessment, red flags, treatment recommendations, and escalation criteria.
- **Privacy-First Design**: All processing happens locally—no data leaves your machine.

### **Key Capabilities**

✅ **Dual-Modal Detection**: Audio breath analysis + Chest X-ray classification  
✅ **LLM-Enhanced Reasoning**: Context-aware clinical question generation  
✅ **Structured Reports**: Severity scoring, medication guidance with contraindications  
✅ **Local Processing**: Privacy-preserving, offline-capable architecture  
✅ **Clinical Focus**: Red flag identification, differential diagnosis, escalation triggers  

---

## ✨ Features

### 🔬 Advanced Diagnostics
- **Audio Analysis**: CNN-based breath sound classification for respiratory conditions.
- **Image Analysis**: EfficientNet-B4/B7 architecture for chest X-ray interpretation.
- **Multi-Class Detection**: COPD, Pneumonia, Asthma, Bronchitis, URTI, Bronchiolitis, and Healthy classifications.

### 🤖 AI-Powered Clinical Reasoning
- **Smart Questionnaire**: Automatically generates 16 detailed, disease-specific follow-up questions.
- **Comprehensive Reports**: Structured analysis including:
  - Clinical summary and likely conditions.
  - Severity assessment (Low/Moderate/Urgent) with rationale.
  - Red flag identification.
  - Recommended diagnostic tests with rationale.
  - Medication guidance (dosing, contraindications, interactions).
  - Lifestyle and dietary recommendations.
  - Escalation triggers for emergency care.
  - Differential diagnosis considerations.

### 🎨 Modern User Experience
- **Desktop Application**: Native Electron-based interface for Windows.
- **Intuitive Workflow**: Three-step process (Intake → Follow-up → Report).
- **Real-time Feedback**: Progress indicators and immediate analysis.
- **Clean Design**: Modern typography (Space Grotesk), gradient accents, structured layouts.

### 🔒 Privacy & Security
- **Local-First Architecture**: All data processing happens on your machine.
- **No External APIs**: Uses local Ollama for LLM operations.
- **Secure Storage**: Uploads stored locally and excluded from version control.
- **HIPAA-Conscious Design**: No PHI transmission or cloud storage.

---

## 🎬 Demo

### **Application Workflow**

```
┌─────────────────┐
│  Step 1: Intake │  Upload audio/image + patient demographics
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI Analysis     │  Deep learning model processes input
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Step 2: Q&A     │  16 intelligent follow-up questions
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Step 3: Report  │  Comprehensive clinical assessment
└─────────────────┘
```

### **Sample Output**

**Input**: Chest X-ray showing infiltrates  
**Detection**: Pneumonia (Confidence: 94%)  
**Generated Questions**: 16 detailed questions about onset, fever patterns, comorbidities, current medications, etc.  
**Final Report**:
- **Severity**: Moderate  
- **Red Flags**: Fever >102°F for 3 days, productive cough  
- **Recommended Tests**: Complete blood count, CRP, sputum culture  
- **Medications**: Amoxicillin-clavulanate 875mg BID (avoid if penicillin allergy)  
- **Escalation Triggers**: Persistent fever >5 days, worsening dyspnea  

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 17 with Hooks
- **Desktop Shell**: Electron (multi-platform desktop application)
- **Styling**: styled-components for CSS-in-JS
- **Build Tools**: Webpack 5, Babel 7
- **HTTP Client**: Axios for API communication
- **Testing**: Jest + React Testing Library

### **Backend**
- **Framework**: Flask (Python web framework)
- **CORS**: Flask-CORS for cross-origin requests
- **Machine Learning**: PyTorch, scikit-learn, librosa
- **Image Processing**: OpenCV, PIL
- **Audio Processing**: librosa, soundfile
- **LLM Integration**: Ollama client (local inference)

### **Machine Learning**
- **Audio Model**: Custom CNN architecture for breath sound classification
- **Image Model**: EfficientNet (B4/B7) transfer learning
- **LLM**: Qwen 2.5 (3B/7B parameters) via Ollama
- **Frameworks**: PyTorch, TensorFlow/Keras

---

## 🏗️ Architecture

### **System Design**

```
┌──────────────────────────────────────────────────────────┐
│                    Electron Desktop App                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │           React UI (Renderer Process)              │  │
│  │  • File Upload  • Patient Intake  • Q&A Interface  │  │
│  │  • Report Parsing  • Severity Logic  • Styling     │  │
│  └────────────────┬───────────────────────────────────┘  │
│                   │ IPC (Secure Preload Bridge)          │
│  ┌────────────────▼───────────────────────────────────┐  │
│  │           Electron Main Process                    │  │
│  │  • Window Management  • File System Access         │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────┬──────────────────────────────────────┘
                    │ HTTP/REST API
┌───────────────────▼──────────────────────────────────────┐
│                  Flask Backend Server                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │  API Routes                                        │  │
│  │  • /health  • /audio_prediction                    │  │
│  │  • /image_prediction  • /generate_questions        │  │
│  │  • /analyze_responses                              │  │
│  └───────┬─────────────────────────┬──────────────────┘  │
│          │                         │                     │
│  ┌───────▼──────────┐     ┌────────▼─────────────────┐   │
│  │ ML Models        │     │ LLM Integration          │   │
│  │ • Audio CNN      │     │ • Ollama Client          │   │
│  │ • Image EfficNet │     │ • Prompt Engineering     │   │
│  └──────────────────┘     └──────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### **Data Flow**

1. **Intake Phase**: User uploads audio/image file via Electron UI.
2. **Transmission**: File sent to Flask backend via multipart/form-data.
3. **Prediction**: Appropriate ML model processes input and returns diagnosis.
4. **Question Generation**: LLM generates targeted follow-up questions based on diagnosis.
5. **User Response**: Patient/clinician answers questions in UI.
6. **Report Generation**: LLM synthesizes responses into structured clinical report.
7. **Rendering**: Frontend parses markdown report into formatted sections with severity badges.

---

## 📁 Project Structure

```
PulmoScanAI/
├── ai_engine/          # Deep Learning models & signal processing
│   ├── Architecture/   # Model architecture diagrams
│   ├── Image/          # Image model development & weights
│   ├── Models/         # Audio model weights
│   ├── Audio_model.py  # Audio classification pipeline
│   └── Image_model.py  # Image classification pipeline
├── backend_api/        # Flask REST API & LLM orchestration
│   ├── app.py          # Flask routes and LLM integration
│   ├── requirements.txt
│   └── .env.example
└── desktop_client/     # Electron + React desktop application
    ├── src/            # React components (App.js, index.js)
    ├── main.js         # Electron main process
    ├── package.json
    └── webpack.config.js
```

---

## 🚀 Installation

### **Prerequisites**
- **Python**: 3.12 or higher
- **Node.js**: 18.x or higher
- **Ollama**: For local LLM inference ([Download](https://ollama.ai))
- **Git**: For version control

### **Step 1: Clone Repository**
```bash
git clone https://github.com/addy12bag/PulmoScan-AI.git
cd PulmoScanAI
```

### **Step 2: Backend Setup**
```bash
cd backend_api
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

### **Step 3: Install Ollama & Download Model**
```bash
# Pull the required LLM model
ollama pull qwen2.5:3b
```

### **Step 4: Frontend Setup**
```bash
cd ../desktop_client
npm install
npm run build
```

---

## 💻 Usage

### **Starting the Application**

#### **Terminal 1: Start Flask Backend**
```bash
cd backend_api
python app.py
```

#### **Terminal 2: Start Electron App**
```bash
cd desktop_client
npm start
```

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | Backend health check |
| `/audio_prediction` | `POST` | Process audio breath sounds |
| `/image_prediction` | `POST` | Process Chest X-ray images |
| `/generate_questions` | `POST` | Generate targeted clinical questions |
| `/analyze_responses` | `POST` | Generate comprehensive medical report |

---

## 🧠 Machine Learning Models

### **Audio Classification Model**
- **Architecture**: Custom CNN-Transformer hybrid.
- **Classes**: COPD, Asthma, Bronchitis, URTI, Bronchiolitis, Healthy.
- **Accuracy**: 91.6% (Test).

### **Image Classification Model**
- **Architecture**: EfficientNet-B4/B7 (Transfer Learning).
- **Classes**: Pneumonia, NORMAL.

### **LLM Integration**
- **Model**: Qwen 2.5 (3B).
- **Tasks**: Dynamic question generation & clinical report synthesis.

---

## 🗺️ Roadmap

- [ ] **Multi-Language Support**: Internationalization for global use.
- [ ] **Report Export**: PDF/DOCX export functionality.
- [ ] **Patient History**: Session persistence and historical tracking.
- [ ] **Cloud Deployment**: Optional cloud-based inference.

---

## 👥 The Team

This project was developed by a dedicated team of engineers focused on the intersection of AI and Healthcare.

*   **Sayan Das** - *Lead Author & AI Developer*
*   **Sayantan Bag** - *Co-Author & Project Manager & Ml devloper*
*   **Project Partners & Friends** - *Research, Data Collection, and Testing*

---

## 📄 License

This project is licensed under the MIT License.

Copyright (c) 2026 **Sayan Das** (Lead Author) & **Sayantan Bag** (Co-Author).

---

<div align="center">

### **Developed with ❤️ for Medical Innovation**

</div>
