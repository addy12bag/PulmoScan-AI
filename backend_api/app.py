import os
import sys
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from ollama import chat

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DETECTION_DIR = PROJECT_ROOT / "ai_engine"
UPLOAD_DIR = BASE_DIR / "uploaded_files"
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")

# Make ai_engine importable
sys.path.insert(0, str(DETECTION_DIR))
from Audio_model import audio_prediction  # noqa: E402
from Image_model import predict_image  # noqa: E402

app = Flask(__name__)
CORS(app)


def _save_upload(file_storage):
    UPLOAD_DIR.mkdir(exist_ok=True)
    sanitized_name = file_storage.filename.replace("..", "")
    file_path = UPLOAD_DIR / sanitized_name
    file_storage.save(file_path)
    return file_path


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


@app.route('/audio_prediction', methods=['POST'])
def audio_prediction_route():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400

    file = request.files['file']
    if not file.filename:
        return jsonify({"error": "No selected file."}), 400

    try:
        file_path = _save_upload(file)
        prediction = audio_prediction(str(file_path))
        return jsonify({"prediction": prediction})
    except Exception as exc:  # pylint: disable=broad-except
        return jsonify({"error": f"Audio prediction failed: {exc}"}), 500


@app.route('/image_prediction', methods=['POST'])
def image_prediction_route():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400

    file = request.files['file']
    if not file.filename:
        return jsonify({"error": "No selected file."}), 400

    try:
        file_path = _save_upload(file)
        prediction = predict_image(str(file_path))
        return jsonify({"prediction": prediction})
    except Exception as exc:  # pylint: disable=broad-except
        return jsonify({"error": f"Image prediction failed: {exc}"}), 500


@app.route('/generate_questions', methods=['POST'])
def generate_questions():
    disease = request.json.get('disease', '')
    try:
        response = chat(
            model=OLLAMA_MODEL,
            messages=[{
                'role': 'user',
                'content': (
                    "You are generating focused clinical follow-up questions for a physician. "
                    "Avoid vagueness; make each question specific and information-rich. "
                    "Prefer objective details (onset, duration, progression, severity, triggers, relieving factors, comorbidities, meds, vitals, exposures). "
                    "Include at least one question on red-flag symptoms and one on relevant comorbidities/medications. "
                    "Return exactly 16 numbered questions. "
                    f"Context: suspected condition = {disease}."
                ),
            }],
        )
        response_text = response.message.content.strip()
        questions = [
            line.split('. ', 1)[1].strip()
            for line in response_text.split('\n')
            if line.strip() and line[0].isdigit()
        ]
        return jsonify({'questions': questions})
    except Exception as exc:  # pylint: disable=broad-except
        fallback = ["Describe your current symptoms.", "When did they start?", "Any recent travel?"]
        return jsonify({
            'questions': fallback,
            'warning': f"Question generator failed ({exc}); using defaults."
        }), 200


@app.route('/analyze_responses', methods=['POST'])
def analyze_responses():
    answers = request.json.get('answers', {})
    try:
        rich_prompt = (
            "You are a clinical decision support assistant for licensed physicians. "
            "Write a thorough, structured medical report based ONLY on the provided patient responses. "
            "Be detailed and explicit; the audience is a physician. "
            "If data is missing, note it as 'not provided' and infer cautiously.\n\n"
            "Input (patient responses as an indexed dict):\n"
            f"{answers}\n\n"
            "Return the report in markdown with these sections (use headings):\n"
            "1) Summary: 3-5 sentences capturing presentation and context.\n"
            "2) Likely conditions: ranked list with brief rationale.\n"
            "3) Severity assessment: label (low/moderate/urgent) with 2-3 bullets why.\n"
            "4) Red flags to monitor.\n"
            "5) Recommended tests: labs/imaging, each with a short reason.\n"
            "6) Medications (doctor review required): propose likely drug classes or specific agents with typical adult dosing ranges, key contraindications, interactions, and when NOT to use. If data insufficient, state that.\n"
            "7) Supportive care & lifestyle: rest, hydration targets, breathing aids/positions, pollution or irritant avoidance, pacing.\n"
            "8) Diet: foods to favor and foods to avoid (separate bullets).\n"
            "9) Home remedies until doctor visit: safe options (e.g., steam inhalation precautions, saline, humidification), and explicit cautions for what NOT to try.\n"
            "10) Follow-up / escalation: concrete triggers to seek urgent/ED care (include vitals thresholds if relevant) and routine follow-up timing.\n"
            "11) Differential to rule out: 3-5 items with 1-line rationale.\n"
            "Close with a one-line clinical plan reminder.\n"
            "Do not add prefatory text; output only the report."
        )

        response = chat(
            model=OLLAMA_MODEL,
            messages=[{
                'role': 'user',
                'content': rich_prompt,
            }],
        )
        analysis = response.message.content.strip()
        return jsonify({'analysis': analysis})
    except Exception as exc:  # pylint: disable=broad-except
        return jsonify({"error": f"Analysis failed: {exc}"}), 500


if __name__ == '__main__':
    UPLOAD_DIR.mkdir(exist_ok=True)
    app.run(host='0.0.0.0', port=5000)
