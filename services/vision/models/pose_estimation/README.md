# Pose Estimation Prototype

This folder contains a simple local prototype for **movement-based action detection** using webcam video, MediaPipe Pose landmarks, and a basic scikit-learn classifier.

The goal is to detect motion or posture patterns (for example sweeping-like motion, reading posture, phone hunch), **not** to prove that a chore was fully completed.

## Files

- `data_collection.py`: Collects labeled pose samples from webcam input.
- `train_pose_model.py`: Trains a RandomForest classifier from collected samples.
- `main.py`: Runs live webcam inference with color feedback.
- `pose_data.csv`: CSV dataset (starts with header only).
- `labels.txt`: Supported labels.
- `requirements.txt`: Python package dependencies.

## 1) Install Dependencies

From this folder:

```bash
cd services/vision/models/pose_estimation
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 2) Collect Pose Data

Run:

```bash
python data_collection.py
```

How it works:

- Opens your webcam.
- Draws pose landmarks when detected.
- Shows key-to-label instructions on screen.
- Press a mapped key to save one sample row.
- Press `0` to save a `no_pose` sample.
- Press `q` or `ESC` to quit.

Tip: collect many samples per label from different angles and distances.

## 3) Train the Model

Run:

```bash
python train_pose_model.py
```

This script:

- Loads `pose_data.csv`.
- Validates that data is present and labels are diverse.
- Trains a `RandomForestClassifier`.
- Prints accuracy and classification report.
- Saves model as `pose_classifier.pkl`.
- Updates `labels.txt` with detected labels.

## 4) Run Live Inference

Run:

```bash
python main.py
```

This script:

- Loads `pose_classifier.pkl` and `labels.txt`.
- Predicts current action label from webcam landmarks.
- Overlays predicted label on the video stream.
- Uses color feedback:
  - green: positive action
  - red: negative/off-task action
  - yellow: neutral action
- Prints label updates to console.
- Exits on `ESC`.

## Limitations

- Pose landmarks capture body points, not objects (for example broom or phone).
- Similar body positions can look alike to the model.
- Webcam angle and lighting can reduce accuracy.
- This is a prototype and not a reliable proof of chore completion.
- The model can suggest action patterns only.

## Future Improvements

- Add object detection for books, phones, broom, and laundry basket.
- Add parent confirmation flow before reward approval.
- Add before/after image comparison for chore contexts.
- Add reward scoring based on repeated positive actions over time.
