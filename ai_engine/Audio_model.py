import os
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
import torch.nn as nn
from torchaudio.transforms import AmplitudeToDB, MelSpectrogram

class MelSpecTransform(nn.Module):
    def __init__(self, sample_rate=16000, n_fft=1024, hop_length=512, n_mels=128):
        super().__init__()
        self.melspec = MelSpectrogram(
            sample_rate=sample_rate,
            n_fft=n_fft,
            hop_length=hop_length,
            n_mels=n_mels,
        )
        self.amplitude_to_db = AmplitudeToDB()

    def forward(self, waveform):
        if len(waveform.shape) == 1:
            waveform = waveform.unsqueeze(0)
        mel_spec = self.melspec(waveform)
        return self.amplitude_to_db(mel_spec)

class TransformerEncoderBlock(nn.Module):
    def __init__(self, d_model, num_heads, ff_dim, dropout=0.1):
        super().__init__()
        self.attention = nn.MultiheadAttention(embed_dim=d_model, num_heads=num_heads, batch_first=True)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, ff_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(ff_dim, d_model),
        )
        self.layernorm1 = nn.LayerNorm(d_model)
        self.layernorm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        attn_output, _ = self.attention(x, x, x)
        x = self.layernorm1(x + self.dropout(attn_output))
        ffn_output = self.ffn(x)
        return self.layernorm2(x + self.dropout(ffn_output))

class AdvancedAudioClassifier(nn.Module):
    def __init__(self, num_classes, d_model=256, num_heads=8, ff_dim=512, num_transformer_layers=6):
        super().__init__()
        self.conv_block = nn.Sequential(
            nn.Conv2d(1, 64, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2),
            nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2),
            nn.Conv2d(128, 256, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2),
            nn.Conv2d(256, 512, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2),
            nn.Conv2d(512, d_model, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(d_model),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2),
        )
        self.transformer_blocks = nn.ModuleList([
            TransformerEncoderBlock(d_model, num_heads, ff_dim) for _ in range(num_transformer_layers)
        ])
        self.fc = nn.Sequential(
            nn.Linear(d_model, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        x = self.conv_block(x)
        x = x.flatten(2).transpose(1, 2)
        for transformer in self.transformer_blocks:
            x = transformer(x)
        x = x.mean(dim=1)
        return self.fc(x)

def pad_or_trim(waveform, length):
    if waveform.shape[0] > length:
        return waveform[:length]
    padding = length - waveform.shape[0]
    return np.pad(waveform, (0, padding), "constant")


BASE_DIR = Path(__file__).resolve().parent
DATA_AUDIO_DIR = BASE_DIR / "Data_audio" / "Train"
MODEL_PATH = BASE_DIR / "Models" / "classification_model_train_49_82.5_test_91.6.pth"


def _load_classes():
    if not DATA_AUDIO_DIR.exists():
        return []
    return sorted([p.name for p in DATA_AUDIO_DIR.iterdir() if p.is_dir()])


CLASSES = _load_classes()


def audio_prediction(file_path: str):
    if not CLASSES:
        raise RuntimeError("No audio classes found. Ensure Data_audio/Train is present.")
    if not MODEL_PATH.exists():
        raise RuntimeError(f"Audio model missing at {MODEL_PATH}")

    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    transform = MelSpecTransform()

    waveform, _ = sf.read(file_path)
    waveform = pad_or_trim(waveform, 80000)
    waveform_tensor = torch.from_numpy(waveform).float()
    waveform_tensor = transform(waveform_tensor)

    model = AdvancedAudioClassifier(num_classes=len(CLASSES))
    state_dict = torch.load(MODEL_PATH, map_location=device)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()

    with torch.no_grad():
        input_tensor = waveform_tensor.to(device).unsqueeze(1)
        output = model(input_tensor)
        prediction = torch.argmax(output, dim=1).item()

    return CLASSES[prediction]
