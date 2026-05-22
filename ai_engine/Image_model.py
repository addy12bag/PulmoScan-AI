import os
import sys
from pathlib import Path

import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms


IMAGE_SIZE = (180, 180)
CLASS_NAMES = ["NORMAL", "PNEUMONIA"]

transform = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor(),
])


def conv_block(in_channels, out_channels):
    return nn.Sequential(
        nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.BatchNorm2d(out_channels),
        nn.MaxPool2d(2),
    )


def dense_block(in_features, out_features, dropout_rate):
    return nn.Sequential(
        nn.Linear(in_features, out_features),
        nn.ReLU(),
        nn.BatchNorm1d(out_features),
        nn.Dropout(dropout_rate),
    )


class ChestXRayModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.feature_extractor = nn.Sequential(
            conv_block(3, 16),
            conv_block(16, 32),
            conv_block(32, 64),
            conv_block(64, 128),
            nn.Dropout(0.2),
            conv_block(128, 256),
            nn.Dropout(0.2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            dense_block(256 * (IMAGE_SIZE[0] // 32) * (IMAGE_SIZE[1] // 32), 512, 0.7),
            dense_block(512, 128, 0.5),
            dense_block(128, 64, 0.3),
            nn.Linear(64, 1),
            nn.Sigmoid(),
        )

    def forward(self, x):
        x = self.feature_extractor(x)
        return self.classifier(x)


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "Image" / "model.pth"


def predict_image(file_path: str):
    if not MODEL_PATH.exists():
        raise RuntimeError(f"Image model missing at {MODEL_PATH}")

    image_data = Image.open(file_path).convert("RGB")
    image_data = transform(image_data)

    model = ChestXRayModel()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Workaround for models saved with torch.save(model, ...) from __main__
    # Temporarily inject this module as __main__ so PyTorch can find the class
    current_module = sys.modules[__name__]
    old_main = sys.modules.get('__main__')
    sys.modules['__main__'] = current_module
    
    try:
        checkpoint = torch.load(MODEL_PATH, map_location=device, weights_only=False)
        if isinstance(checkpoint, dict):
            model.load_state_dict(checkpoint)
        else:
            # Entire model was saved
            model = checkpoint
    finally:
        # Restore original __main__
        if old_main is not None:
            sys.modules['__main__'] = old_main
        else:
            sys.modules.pop('__main__', None)

    model.to(device)
    model.eval()

    with torch.no_grad():
        input_tensor = image_data.to(device).unsqueeze(0)
        output = model(input_tensor)
        prediction = (output.squeeze() > 0.5).int()

    return CLASS_NAMES[int(prediction)]
