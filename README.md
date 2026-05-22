# 🫁 PulmoScan AI

### **Next-Generation Respiratory Diagnostics & Clinical Decision Support**

PulmoScan AI is a sophisticated medical platform that bridges the gap between deep learning-based disease detection and actionable clinical reasoning. By integrating multi-modal AI analysis with advanced Large Language Models (LLMs), PulmoScan AI provides a comprehensive diagnostic ecosystem for respiratory health.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![React 17](https://img.shields.io/badge/React-17.0.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Ollama](https://img.shields.io/badge/LLM-Ollama-white?logo=ollama&logoColor=black)](https://ollama.com/)

---

## 🌟 Overview

PulmoScan AI leverages the power of Convolutional Neural Networks (CNNs) and Vision Transformers to analyze lung sounds and chest X-rays. Unlike traditional AI tools that stop at detection, PulmoScan AI continues the diagnostic journey by generating condition-specific clinical follow-up questions and synthesizing them into a structured medical report.

### **The Vision**
To empower physicians with an intelligent, privacy-first diagnostic assistant that handles the data-heavy aspects of respiratory assessment, allowing for faster and more accurate clinical decisions.

---

## 🚀 Key Features

*   **🔍 Dual-Modality Intelligence**: Seamlessly switch between **Audio Analysis** (breath sounds) and **Image Classification** (Chest X-rays).
*   **🧠 LLM-Driven Reasoning**: Utilizes local LLMs (Qwen 2.5) to generate 16+ clinical follow-up questions tailored to the AI's initial findings.
*   **📋 Structured Clinical Reports**: Automatically generates detailed markdown reports including:
    *   **Severity Assessment**: (Low/Moderate/Urgent) with rationale.
    *   **Likely Conditions**: Ranked list with clinical evidence.
    *   **Red Flag Alerts**: Immediate identification of life-threatening symptoms.
    *   **Medication Guidance**: Suggested drug classes, dosages, and critical contraindications.
    *   **Differential Diagnosis**: Mapping alternative conditions to rule out.
*   **🛡️ Privacy-First Architecture**: All processing is performed locally via Ollama and local ML models. No patient data ever leaves the secure local environment.
*   **🎨 Elite User Experience**: A modern, high-fidelity desktop interface built with Electron, React, and Styled Components.

---

## 🛠️ How It Works

PulmoScan AI follows a rigorous three-stage diagnostic workflow:

### **Phase 1: Multi-Modal Intake**
The user provides patient demographics and uploads either an audio recording of breath sounds or a chest X-ray image.
- **Audio**: Processed via a CNN-Transformer hybrid model (Mel-spectrogram analysis).
- **Image**: Processed via a custom Deep CNN architecture.

### **Phase 2: Intelligent Follow-Up**
Based on the AI's initial prediction (e.g., Pneumonia, COPD, Asthma), the LLM generates a targeted questionnaire. This captures vital clinical context that images and sounds alone might miss.

### **Phase 3: Clinical Synthesis**
The system aggregates the AI prediction and the patient's responses. The LLM then synthesizes this data into a structured report designed for physician review, complete with risk scoring and escalation triggers.

---

## 🏗️ Project Architecture

```
PulmoScanAI/
├── ai_engine/          # Deep Learning models & signal processing
├── backend_api/        # Flask REST API & LLM orchestration
└── desktop_client/     # Electron + React desktop application
```

---

## 💻 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Electron, Styled Components, Webpack |
| **Backend** | Flask, Python 3.12, Ollama API |
| **Machine Learning** | PyTorch, Torchaudio, Torchvision, NumPy |
| **LLM Inference** | Ollama (Qwen 2.5:3b) |
| **Styling** | Space Grotesk Typography, Tailwind CSS (Design) |

---

## ⚙️ Installation & Setup

### **Prerequisites**
- Python 3.12+
- Node.js & npm
- [Ollama](https://ollama.com/) installed and running

### **1. Clone & Prepare**
```bash
git clone https://github.com/Necromancer0912/LungInsight.git
cd PulmoScanAI
```

### **2. Backend API Setup**
```bash
cd backend_api
python -m venv venv
source venv/bin/activate  # Or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### **3. LLM Setup**
```bash
ollama pull qwen2.5:3b
```

### **4. Desktop Client Setup**
```bash
cd ../desktop_client
npm install
npm run build
```

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
