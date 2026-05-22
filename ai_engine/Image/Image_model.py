import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset ,WeightedRandomSampler
from torchvision import transforms
import os
from PIL import Image
from sklearn.metrics import precision_score, recall_score, accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.model_selection import train_test_split

# import sys
# print("Python executable:", sys.executable)
# print("Python version:", sys.version)

BATCH_SIZE = 16
IMAGE_SIZE = (180, 180)
EPOCHS = 15

CLASS_NAMES = ["NORMAL", "PNEUMONIA"]

transform = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor()
])

def conv_block(in_channels, out_channels):
    return nn.Sequential(
        nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.BatchNorm2d(out_channels),
        nn.MaxPool2d(2)
    )
def dense_block(in_features, out_features, dropout_rate):
    return nn.Sequential(
        nn.Linear(in_features, out_features),
        nn.ReLU(),
        nn.BatchNorm1d(out_features),
        nn.Dropout(dropout_rate)
    )

class ChestXRayModel(nn.Module):
    def __init__(self):
        super(ChestXRayModel, self).__init__()
        self.feature_extractor = nn.Sequential(
            conv_block(3, 16),
            conv_block(16, 32),
            conv_block(32, 64),
            conv_block(64, 128),
            nn.Dropout(0.2),
            conv_block(128, 256),
            nn.Dropout(0.2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            dense_block(256 * (IMAGE_SIZE[0] // 32) * (IMAGE_SIZE[1] // 32), 512, 0.7),
            dense_block(512, 128, 0.5),
            dense_block(128, 64, 0.3),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        x = self.feature_extractor(x)
        x = self.classifier(x)
        return x

def predict_image(file_path):
    image_data = Image.open(file_path).convert("RGB")
    image_data = transform(image_data)

    model = ChestXRayModel()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = torch.load('D:\Sayan\Study\Program\Prog\ARS_Sir_Project\detection_model\Image\model.pth')
    # model.load_state_dict(state_dict)
    model.to(device)


    with torch.no_grad():
        input_tensor = image_data.to(device).unsqueeze(0)
        output = model(input_tensor)
        prediction = (output.squeeze() > 0.5).int()

    return CLASS_NAMES[prediction]

# str_name = predict_image('D:\Sayan\Study\Program\Prog\ARS_Sir_Project\detection_model\chest_xray\\test\PNEUMONIA\BACTERIA-40699-0001.jpeg')
# print(str_name)