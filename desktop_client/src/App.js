import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const STEPS = ["Intake", "Follow-up", "Report"];
const AUDIO_EXTENSIONS = [".wav", ".mp3", ".m4a", ".flac", ".ogg"];

const DEFAULT_QUESTIONS = [
  "What symptoms led you to seek care?",
  "When did the symptoms start?",
  "Have you had fever or chills?",
  "Do you have cough? If yes, is it dry or productive?",
  "Are you experiencing shortness of breath?",
  "Do you have chest pain? If yes, describe the character and timing.",
  "Any recent weight loss or night sweats?",
  "Any known heart or lung conditions?",
  "Have you been hospitalized recently or had recent infections?",
  "Do you smoke or have exposure to pollutants?",
  "Any current medications or allergies?",
  "Any recent travel or sick contacts?",
  "Have you noticed wheezing or noisy breathing?",
  "Do symptoms worsen with exertion or lying down?",
  "Any swelling in legs or new fatigue?",
];

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const GlobalStyle = createGlobalStyle`
    * { 
        box-sizing: border-box; 
        margin: 0;
        padding: 0;
    }

  html {
    font-size: 15px;
  }
    
    body {
      margin: 0;
      background: #1e1e1e;
      color: #cccccc;
      font-family: 'Space Grotesk', 'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 15px;
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

  button, input, select, textarea {
    font-family: 'Space Grotesk', 'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 14px;
  }
    
    ::selection {
        background: #264f78;
        color: #fff;
    }
`;

const SplashScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: ${({ show }) => (show ? 1 : 0)};
  pointer-events: ${({ show }) => (show ? "all" : "none")};
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SplashLogo = styled.div`
  font-size: 48px;
  font-weight: 600;
  color: #007acc;
  margin-bottom: 24px;
  animation: ${float} 3s ease-in-out infinite;
  letter-spacing: -0.01em;
`;

const SplashSubtitle = styled.div`
  font-size: 16px;
  color: #858585;
  margin-bottom: 40px;
  animation: ${fadeIn} 0.8s ease-out 0.5s both;

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, #007acc, transparent);
    animation: ${shimmer} 1.5s ease-in-out infinite;
  }
`;

const LoadingBar = styled.div`
  width: 160px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #007acc, #60e0c1, #007acc);
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
  opacity: 0.85;
`;

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
  animation: ${fadeIn} 0.6s ease-out;
  overflow-y: auto;
`;

const Shell = styled.div`
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  background: #1e1e1e;
  border: none;
  box-shadow: none;
  border-radius: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #1a1a1a;
  border-bottom: 1px solid #3c3c3c;
  -webkit-app-region: drag;
`;

const TitleIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TitleMark = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, #0e639c, #007acc);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  -webkit-app-region: no-drag;
`;

const TitleText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const TitleName = styled.span`
  color: #e6e6e6;
  font-size: 13px;
  font-weight: 600;
`;

const TitleSub = styled.span`
  color: #8c8c8c;
  font-size: 11px;
`;

const WindowActions = styled.div`
  display: flex;
  gap: 6px;
  -webkit-app-region: no-drag;
`;

const WindowButton = styled.button`
  width: 36px;
  height: 26px;
  border-radius: 4px;
  border: 1px solid #2d2d2d;
  background: #252526;
  color: #c8c8c8;
  display: grid;
  place-items: center;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ variant }) =>
      variant === "close" ? "#e81123" : "#2f2f2f"};
    color: #ffffff;
    border-color: ${({ variant }) =>
      variant === "close" ? "#e81123" : "#3c3c3c"};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  background: #1f1f1f;
  border-bottom: 1px solid #2a2a2a;
  animation: ${slideIn} 0.5s ease-out;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 400;
  color: #cccccc;
  letter-spacing: 0;
  line-height: 1.4;
`;

const Subtitle = styled.span`
  color: #858585;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 400;
`;

const Pill = styled.span`
  padding: 4px 12px;
  border-radius: 2px;
  background: #007acc;
  color: #ffffff;
  font-weight: 400;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #005a9e;
  }
`;

const StatusStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const StatusLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #858585;
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  background: ${({ state }) =>
    state === "ok" ? "#89d185" : state === "checking" ? "#cca700" : "#f48771"};
  animation: ${({ state }) => (state === "checking" ? pulse : "none")} 2s
    ease-in-out infinite;
  transition: all 0.3s ease;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  padding: 20px;
  gap: 20px;
  padding-bottom: 28px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: #151515;
  border: 1px solid #242424;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.4s ease-out;
  overflow-y: visible;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(130, 130, 130, 0.55);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(180, 180, 180, 0.7);
  }
`;

const StepperBar = styled.div`
  background: #2d2d30;
  border-bottom: 1px solid #2a2a2a;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  -webkit-app-region: no-drag;
`;

const Stepper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ active }) => (active ? "#cccccc" : "#6e6e6e")};
  font-size: 13px;
  transition: all 0.2s ease;
  font-weight: 400;

  &:not(:last-child)::after {
    content: "/";
    margin-left: 12px;
    color: #6e6e6e;
  }

  &:hover {
    color: ${({ active }) => (active ? "#ffffff" : "#858585")};
  }
`;

const StepDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#007acc" : "#4e4e4e")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 400;
  color: #cccccc;
  margin-bottom: 4px;
  display: block;
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const fieldStyles = `
    width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #2c2c2c;
  background: linear-gradient(180deg, #2b2b2b, #242424);
  color: #e6e6e6;
  font-size: 14px;
    font-family: inherit;
    outline: none;
  transition: all 0.18s ease;

    &:hover {
    background: linear-gradient(180deg, #303030, #262626);
    border-color: #3c3c3c;
    }

    &:focus {
    border-color: #0e639c;
    background: linear-gradient(180deg, #2f2f2f, #292929);
    box-shadow: 0 0 0 2px rgba(14, 99, 156, 0.35);
    outline: none;
    }
    
    &::placeholder {
    color: #7c7c7c;
    }
`;

const Input = styled.input`
  ${fieldStyles}
`;
const Select = styled.select`
  ${fieldStyles}
  cursor: pointer;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="%23858585" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px 8px;
  padding-right: 38px;

  option {
    background: #1f1f1f;
    color: #e6e6e6;
    padding: 10px 12px;
  }
`;

const Segmented = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const Segment = styled.button`
  padding: 11px 16px;
  border-radius: 8px;
  border: 1px solid ${({ active }) => (active ? "#0e639c" : "#2f2f2f")};
  background: ${({ active }) =>
    active ? "linear-gradient(135deg, #0e639c, #007acc)" : "#252525"};
  color: ${({ active }) => (active ? "#ffffff" : "#d6d6d6")};
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: ${({ active }) =>
      active ? "linear-gradient(135deg, #0f75b6, #0a84d0)" : "#2d2d2d"};
    border-color: ${({ active }) => (active ? "#0e639c" : "#3a3a3a")};
    box-shadow: 0 6px 18px rgba(0, 122, 204, 0.25);
  }

  &:active {
    transform: scale(0.985);
  }
`;

const Dropzone = styled.button`
  border: 1px dashed #3c3c3c;
  border-radius: 10px;
  background: linear-gradient(145deg, #1c1c1c, #141414);
  padding: 18px 20px;
  text-align: left;
  color: #cccccc;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;

  &:hover {
    border-color: #007acc;
    background: #1f1f1f;
    box-shadow: 0 8px 24px rgba(0, 122, 204, 0.22);
  }

  &:active {
    transform: scale(0.985);
  }
`;

const Hint = styled.div`
  font-size: 13px;
  color: #858585;
  line-height: 1.4;
  font-weight: 400;
`;

const PrimaryButton = styled.button`
  width: fit-content;
  padding: 9px 18px;
  border-radius: 8px;
  border: 1px solid #0e639c;
  background: linear-gradient(135deg, #0e639c, #0a84d0);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: linear-gradient(135deg, #0f75b6, #0a9ae0);
    box-shadow: 0 10px 28px rgba(10, 132, 208, 0.3);
  }

  &:active {
    transform: scale(0.985);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  padding: 9px 16px;
  border-radius: 8px;
  border: 1px solid #2f2f2f;
  background: #1e1e1e;
  color: #d6d6d6;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: #2a2a2a;
    border-color: #3a3a3a;
  }

  &:active {
    transform: scale(0.985);
  }
`;

const QuestionCard = styled.div`
  background: #181818;
  border: 1px solid #242424;
  border-radius: 10px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 2px;
  background: #3c3c3c;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ value }) => `${value}%`};
  background: #007acc;
  transition: width 0.3s ease;
`;

const Analysis = styled.div`
  background: #1e1e1e;
  border: 1px solid #3c3c3c;
  border-radius: 10px;
  padding: 20px;
  color: #d4d4d4;
  font-size: 13px;
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;

  strong {
    color: #4ec9b0;
    font-weight: 600;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(130, 130, 130, 0.55);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(180, 180, 180, 0.7);
  }
`;

const ReportCard = styled.div`
  background: radial-gradient(circle at 20% 20%, #151515 0%, #0f0f0f 55%);
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
`;

const ReportHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #1f1f1f;
`;

const SeverityBadge = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid ${({ color }) => color || "#3a3a3a"};
  background: ${({ color }) => `${color || "#2a2a2a"}22`};
  color: ${({ color }) => color || "#e6e6e6"};
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
`;

const SectionTitle = styled.div`
  font-weight: 700;
  color: #e6e6e6;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.6);
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 0;
  color: #c8c8c8;
  line-height: 1.5;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  li {
    list-style: none;
    position: relative;
    padding-left: 14px;
  }

  li::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #60e0c1;
    position: absolute;
    left: 0;
    top: 8px;
  }
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid #1f1f1f;
  border-radius: 8px;
  background: linear-gradient(135deg, #101010 0%, #0a0a0a 70%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
`;

const Stat = styled.div`
  background: #181818;
  border: 1px solid #242424;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.15s ease;

  &:hover {
    background: #1f1f1f;
  }
`;

const ErrorBox = styled.div`
  background: #5a1d1d;
  border: 1px solid #be1100;
  border-radius: 4px;
  padding: 12px 16px;
  color: #f48771;
  font-size: 13px;
  line-height: 1.4;
  animation: ${fadeIn} 0.2s ease-out;
  margin: 0 20px 12px 20px;
`;

const Inline = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const App = () => {
  const fileInputRef = useRef(null);
  const [showSplash, setShowSplash] = useState(process.env.NODE_ENV !== "test");
  const [step, setStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "",
    disease: "",
  });
  const [inputType, setInputType] = useState(null);
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [apiHealth, setApiHealth] = useState("checking");
  const [isMaximized, setIsMaximized] = useState(false);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round((currentQuestionIndex / questions.length) * 100);
  }, [currentQuestionIndex, questions.length]);

  const report = useMemo(
    () => deriveReport(analysis, patientInfo),
    [analysis, patientInfo]
  );

  const parsedSections = useMemo(
    () => parseReportSections(analysis),
    [analysis]
  );

  useEffect(() => {
    // Splash screen timer
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      setApiHealth("down");
      return undefined;
    }

    let active = true;

    const checkApi = async () => {
      try {
        await axios.get(`${API_BASE}/health`);
        if (active) setApiHealth("ok");
      } catch (err) {
        if (active) setApiHealth("down");
        console.warn("API health check failed", err?.message || err);
      }
    };

    checkApi();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const api = window?.electronAPI;
    if (!api) return undefined;

    api.isMaximized?.().then((state) => {
      setIsMaximized(Boolean(state));
    });

    const unsubscribe = api.onMaximizeState?.((state) => {
      setIsMaximized(Boolean(state));
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const fileLabel = useMemo(() => {
    if (!file) return "Drop a file or browse";
    const mb = Math.max(file.size / (1024 * 1024), 0.01);
    return `${file.name} (${mb.toFixed(2)} MB)`;
  }, [file]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleMinimize = () => {
    window?.electronAPI?.minimize?.();
  };

  const handleToggleMaximize = () => {
    window?.electronAPI?.toggleMaximize?.();
  };

  const handleClose = () => {
    window?.electronAPI?.close?.();
  };

  const handleFilePick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!inputType) {
      setError("Choose audio or image before selecting a file.");
      return;
    }

    const { name, type } = selectedFile;
    const lowerName = name.toLowerCase();
    const isAudio = inputType === "audio";
    const isValidAudio =
      isAudio &&
      (type.startsWith("audio/") ||
        AUDIO_EXTENSIONS.some((ext) => lowerName.endsWith(ext)));
    const isValidImage = !isAudio && type.startsWith("image/");

    if ((isAudio && !isValidAudio) || (!isAudio && !isValidImage)) {
      setError(
        `Please select a valid ${
          isAudio ? "audio (.wav/.mp3/.m4a)" : "image"
        } file.`
      );
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const runPrediction = async (event) => {
    event.preventDefault();
    setError("");
    setAnalysis("");
    setStatus("");

    if (!patientInfo.name || !patientInfo.age || !patientInfo.gender) {
      setError("Please complete patient name, age, and gender.");
      return;
    }

    if (!inputType) {
      setError("Choose whether you are uploading audio or an image.");
      return;
    }

    if (!file) {
      setError("Attach a file to analyze.");
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE}/${
        inputType === "audio" ? "audio_prediction" : "image_prediction"
      }`;
      const formData = new FormData();
      formData.append("file", file);

      const predictionRes = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const prediction = predictionRes?.data?.prediction || "";
      if (!prediction) {
        throw new Error("No prediction returned by the model.");
      }

      setPatientInfo((prev) => ({ ...prev, disease: prediction }));

      const isHealthy = ["Healthy", "NORMAL"].includes(prediction);
      if (isHealthy) {
        setAnalysis(
          "Model indicates no apparent disease in the provided sample. Continue monitoring and consult a clinician if symptoms occur."
        );
        setQuestions([]);
        setStatus("No follow-up needed.");
        setStep(3);
        return;
      }

      const questionsRes = await axios.post(`${API_BASE}/generate_questions`, {
        disease: prediction,
      });
      const fetchedQuestions = questionsRes?.data?.questions || [];

      const merged = [];
      const seen = new Set();
      const pushIfNew = (q) => {
        const text = (q || "").trim();
        if (!text || text.length < 8) return;
        const key = text.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        merged.push(text);
      };

      fetchedQuestions.forEach(pushIfNew);
      DEFAULT_QUESTIONS.forEach(pushIfNew);
      const finalQuestions = merged.slice(0, 16);

      if (!finalQuestions.length) {
        setAnalysis("No follow-up questions were returned.");
        setQuestions([]);
        setStep(3);
        return;
      }

      setQuestions(finalQuestions);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setCurrentAnswer("");
      setStatus("Answer the follow-up to generate a report.");
      setStep(2);
    } catch (err) {
      const message =
        err?.response?.data?.error || err?.message || "Prediction failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      setError("Add a brief answer before proceeding.");
      return;
    }

    setError("");
    const updated = [
      ...answers,
      {
        question: questions[currentQuestionIndex],
        answer: currentAnswer.trim(),
      },
    ];
    setAnswers(updated);
    setCurrentAnswer("");

    const isLast = currentQuestionIndex + 1 === questions.length;
    if (!isLast) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    setLoading(true);
    try {
      const payload = Object.fromEntries(
        updated.map((item, idx) => [idx, item.answer])
      );
      const analysisRes = await axios.post(`${API_BASE}/analyze_responses`, {
        answers: payload,
      });
      setAnalysis(analysisRes?.data?.analysis || "No analysis provided.");
      setStatus("Report ready.");
      setStep(3);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Unable to analyze responses.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep(1);
    setPatientInfo({ name: "", age: "", gender: "", disease: "" });
    setInputType(null);
    setFile(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAnalysis("");
    setCurrentAnswer("");
    setError("");
    setStatus("");
  };

  return (
    <>
      <GlobalStyle />
      <SplashScreen show={showSplash}>
        <SplashLogo>🫁 PulmoScan AI</SplashLogo>
        <SplashSubtitle>Advanced Diagnostic System</SplashSubtitle>
        <LoadingBar />
      </SplashScreen>
      {!showSplash && (
        <Page>
          <Shell>
            <TitleBar>
              <TitleIdentity>
                <TitleMark>LI</TitleMark>
                <TitleText>
                  <TitleName>PulmoScan AI</TitleName>
                  <TitleSub>Diagnostic console</TitleSub>
                </TitleText>
              </TitleIdentity>
              <WindowActions>
                <WindowButton
                  type="button"
                  variant="minimize"
                  aria-label="Minimize"
                  onClick={handleMinimize}
                >
                  –
                </WindowButton>
                <WindowButton
                  type="button"
                  variant="maximize"
                  aria-label={isMaximized ? "Restore" : "Maximize"}
                  onClick={handleToggleMaximize}
                >
                  {isMaximized ? "⧉" : "▢"}
                </WindowButton>
                <WindowButton
                  type="button"
                  variant="close"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  ×
                </WindowButton>
              </WindowActions>
            </TitleBar>
            <Header>
              <TitleBlock>
                <Title>PulmoScan AI Console</Title>
                <Subtitle>
                  Upload patient audio or X-ray and guide the follow-up
                  automatically.
                </Subtitle>
              </TitleBlock>
              <StatusStack>
                <Pill>
                  {step === 1
                    ? "Intake"
                    : step === 2
                    ? "Follow-up"
                    : "Report ready"}
                </Pill>
                <StatusLine>
                  <StatusDot state={apiHealth} />
                  <span>
                    {apiHealth === "ok"
                      ? "API online"
                      : apiHealth === "down"
                      ? "API unreachable"
                      : "Checking API..."}
                  </span>
                </StatusLine>
              </StatusStack>
            </Header>

            <StepperBar>
              <Stepper>
                {STEPS.map((label, idx) => (
                  <StepItem key={label} active={idx + 1 <= step}>
                    <StepDot active={idx + 1 <= step} />
                    <span>{label}</span>
                  </StepItem>
                ))}
              </Stepper>
              {status && <Hint style={{ marginLeft: "auto" }}>{status}</Hint>}
            </StepperBar>

            {error && <ErrorBox>{error}</ErrorBox>}

            <Layout>
              <Panel>
                <FieldGroup>
                  <Label>Patient details</Label>
                  <InputRow>
                    <Input
                      name="name"
                      placeholder="Full name"
                      value={patientInfo.name}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="age"
                      type="number"
                      min="0"
                      placeholder="Age"
                      value={patientInfo.age}
                      onChange={handleInputChange}
                    />
                  </InputRow>
                  <Select
                    name="gender"
                    value={patientInfo.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FieldGroup>

                <FieldGroup>
                  <Label>Signal type</Label>
                  <Segmented>
                    <Segment
                      type="button"
                      active={inputType === "audio"}
                      onClick={() => setInputType("audio")}
                    >
                      🎤 Audio (breath sounds)
                    </Segment>
                    <Segment
                      type="button"
                      active={inputType === "image"}
                      onClick={() => setInputType("image")}
                    >
                      🩻 Chest X-ray image
                    </Segment>
                  </Segmented>
                  <Hint>
                    We support .wav audio and common image formats (PNG, JPG).
                  </Hint>
                </FieldGroup>

                <FieldGroup>
                  <Label>Attach file</Label>
                  <Dropzone
                    type="button"
                    disabled={loading}
                    onClick={handleFilePick}
                  >
                    <div
                      style={{
                        fontWeight: 500,
                        marginBottom: 4,
                        color: "#cccccc",
                      }}
                    >
                      {fileLabel}
                    </div>
                    <Hint>
                      {inputType
                        ? `Expecting ${
                            inputType === "audio"
                              ? "audio (.wav/.mp3/.m4a)"
                              : "image"
                          }`
                        : "Choose a type first to set the expected format."}
                    </Hint>
                  </Dropzone>
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    accept={
                      inputType === "audio" ? ".wav,.mp3,.m4a" : "image/*"
                    }
                    onChange={handleFileChange}
                  />
                </FieldGroup>

                <PrimaryButton
                  type="button"
                  disabled={loading}
                  onClick={runPrediction}
                >
                  {loading ? "Working…" : "Analyze sample"}
                </PrimaryButton>
                <Hint>
                  We keep your models as-is; only the orchestration and UI are
                  refreshed.
                </Hint>
              </Panel>

              <Panel>
                {step === 1 && (
                  <Hint>
                    Prediction results and follow-up will appear here after you
                    submit.
                  </Hint>
                )}

                {step === 2 && questions.length > 0 && (
                  <>
                    <QuestionCard>
                      <div style={{ color: "#cccccc", fontWeight: 500 }}>
                        {questions[currentQuestionIndex]}
                      </div>
                      <Input
                        placeholder="Type a concise answer"
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            submitAnswer();
                          }
                        }}
                      />
                      <Inline>
                        <SecondaryButton
                          onClick={() => {
                            setAnalysis("Follow-up questions were skipped.");
                            setStep(3);
                          }}
                        >
                          Skip follow-up
                        </SecondaryButton>
                        <PrimaryButton
                          type="button"
                          disabled={loading}
                          onClick={submitAnswer}
                        >
                          {currentQuestionIndex + 1 === questions.length
                            ? "Finish & analyze"
                            : "Next question"}
                        </PrimaryButton>
                      </Inline>
                      <ProgressBar>
                        <ProgressFill value={progress} />
                      </ProgressBar>
                      <Hint>
                        {currentQuestionIndex + 1} / {questions.length} answered
                      </Hint>
                    </QuestionCard>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Summary>
                      <Stat>
                        <Label>Patient</Label>
                        <div style={{ color: "#f7f9ff", fontWeight: 700 }}>
                          {patientInfo.name || "N/A"}
                        </div>
                      </Stat>
                      <Stat>
                        <Label>Age</Label>
                        <div style={{ color: "#f7f9ff", fontWeight: 700 }}>
                          {patientInfo.age || "N/A"}
                        </div>
                      </Stat>
                      <Stat>
                        <Label>Gender</Label>
                        <div style={{ color: "#f7f9ff", fontWeight: 700 }}>
                          {patientInfo.gender || "N/A"}
                        </div>
                      </Stat>
                      <Stat>
                        <Label>Model result</Label>
                        <div style={{ color: "#60e0c1", fontWeight: 700 }}>
                          {patientInfo.disease || "Pending"}
                        </div>
                      </Stat>
                    </Summary>

                    <ReportCard>
                      <ReportHeader>
                        <SectionTitle>Clinical report</SectionTitle>
                        <SeverityBadge color={report.severityColor}>
                          {report.severity} risk
                        </SeverityBadge>
                      </ReportHeader>

                      {parsedSections.length ? (
                        parsedSections.map((section) => (
                          <SectionBlock key={section.title}>
                            <SectionTitle>{section.title}</SectionTitle>
                            {section.items?.length ? (
                              <BulletList>
                                {section.items.map((item) => (
                                  <li
                                    key={item}
                                    dangerouslySetInnerHTML={{
                                      __html: formatInline(item),
                                    }}
                                  />
                                ))}
                              </BulletList>
                            ) : (
                              <div
                                style={{ color: "#c8c8c8", fontSize: 13 }}
                                dangerouslySetInnerHTML={{
                                  __html: formatInline(section.text),
                                }}
                              />
                            )}
                          </SectionBlock>
                        ))
                      ) : (
                        <Analysis
                          dangerouslySetInnerHTML={{
                            __html: formatAnalysis(
                              analysis || "No analysis provided."
                            ),
                          }}
                        />
                      )}
                    </ReportCard>

                    <Inline>
                      <PrimaryButton type="button" onClick={restart}>
                        Start new assessment
                      </PrimaryButton>
                      <SecondaryButton onClick={() => window.close()}>
                        Close window
                      </SecondaryButton>
                    </Inline>
                  </>
                )}
              </Panel>
            </Layout>
          </Shell>
        </Page>
      )}
    </>
  );
};

function formatAnalysis(text) {
  return (text || "")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>")
    .replace(/(\d+\.\s)/g, "<br>$1");
}

function formatInline(text) {
  return (text || "")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, " ");
}

function deriveReport(analysisText, patientInfo) {
  const text = (analysisText || "").toLowerCase();
  const disease = (patientInfo?.disease || "").toLowerCase();

  const explicitMatch = (analysisText || "").match(
    /(severity|risk)[^:]{0,20}:\s*(urgent|high|moderate|low)/i
  );

  const highKeywords = [
    "respiratory distress",
    "hypoxia",
    "spo2 < 94",
    "cyanosis",
    "unstable",
    "shock",
    "hemodynamic",
    "altered mental",
    "confusion",
    "rapidly worsening",
    "severe chest pain",
  ];

  const moderateKeywords = [
    "fever",
    "cough",
    "wheeze",
    "shortness",
    "chest pain",
    "infection",
    "pneumonia",
    "bronchitis",
    "copd",
    "asthma",
  ];

  let severity = "moderate";
  let severityColor = "#fbbf24";

  if (explicitMatch) {
    const label = explicitMatch[2].toLowerCase();
    if (label === "urgent" || label === "high") {
      severity = "urgent";
      severityColor = "#ef4444";
    } else if (label === "moderate") {
      severity = "moderate";
      severityColor = "#fbbf24";
    } else {
      severity = "low";
      severityColor = "#22c55e";
    }
  } else {
    const isHigh = highKeywords.some(
      (k) => text.includes(k) || disease.includes(k)
    );
    const isModerate = moderateKeywords.some(
      (k) => text.includes(k) || disease.includes(k)
    );

    if (isHigh) {
      severity = "urgent";
      severityColor = "#ef4444";
    } else if (isModerate) {
      severity = "moderate";
      severityColor = "#fbbf24";
    } else {
      severity = "low";
      severityColor = "#22c55e";
    }
  }

  const redFlags = [
    "Severe shortness of breath",
    "Chest pain or pressure",
    "Bluish lips or face",
    "Confusion or inability to stay awake",
    "Rapid worsening of symptoms",
  ];

  const actions = [
    "Seek in-person clinical evaluation; consider ER if symptoms escalate.",
    "Obtain vitals (SpO2, heart rate, temperature) if available.",
    "Get a chest X-ray and ECG if chest symptoms persist.",
    "Hydrate, rest, and avoid exertion until reviewed by a clinician.",
  ];

  const meds = [
    "OTC: acetaminophen for fever/pain (if not contraindicated).",
    "Consult clinician before using inhalers, antibiotics, or steroids.",
  ];

  const lifestyle = [
    "Plenty of fluids; warm soups; avoid alcohol and smoking.",
    "Small frequent meals; lean protein; fruits; low-salt if cardiac concern.",
    "Sleep on two pillows if breathing worsens when flat; avoid heavy exertion.",
  ];

  const whenToSeeDoctor = [
    "If symptoms persist beyond 24-48 hours or worsen at any time.",
    "Immediately if severe shortness of breath, chest pain, or SpO2 < 94%.",
  ];

  return {
    severity,
    severityColor,
    redFlags,
    actions,
    meds,
    lifestyle,
    whenToSeeDoctor,
  };
}

function parseReportSections(analysisText) {
  if (!analysisText) return [];

  const lines = analysisText.split(/\r?\n/);
  const sections = [];
  let current = null;

  const flush = () => {
    if (current) {
      current.items = current.items.filter((x) => x.trim().length > 0);
      sections.push(current);
    }
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;

    const headingMatch = line.match(/^#+\s*(.*)/);
    if (headingMatch) {
      flush();
      current = {
        title: headingMatch[1].trim() || "Section",
        items: [],
        text: "",
      };
      return;
    }

    if (line.match(/^[-*]\s+/)) {
      if (!current) current = { title: "Details", items: [], text: "" };
      current.items.push(line.replace(/^[-*]\s+/, ""));
      return;
    }

    if (line.match(/^\d+\.\s+/)) {
      if (!current) current = { title: "Details", items: [], text: "" };
      current.items.push(line.replace(/^\d+\.\s+/, ""));
      return;
    }

    if (!current) current = { title: "Details", items: [], text: "" };
    current.text = current.text ? `${current.text} ${line}` : line;
  });

  flush();
  return sections;
}

export default App;
