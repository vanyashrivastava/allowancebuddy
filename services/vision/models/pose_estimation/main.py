"""Run live pose action inference using webcam + trained classifier."""

from __future__ import annotations

from pathlib import Path
from typing import List, Tuple

import cv2
import joblib
import mediapipe as mp
from mediapipe.tasks.python.vision import PoseLandmarker, PoseLandmarkerOptions, RunningMode
from mediapipe.tasks.python.vision import PoseLandmarksConnections
import numpy as np

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "pose_classifier.pkl"
LABELS_PATH = BASE_DIR / "labels.txt"

POSITIVE_LABELS = {
    "sweeping_motion",
    "wiping_table",
    "picking_up_items",
    "folding_clothes_motion",
    "carrying_laundry",
    "making_bed_motion",
    "reading_time",
}

NEGATIVE_LABELS = {
    "slouching",
    "phone_hunch",
    "head_down_inactive",
    "arms_crossed_refusal",
    "lying_down",
}


def load_labels(path: Path) -> List[str]:
    """Load class labels from text file."""
    if not path.exists():
        return []
    return [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def get_action_group(label: str) -> str:
    """Map a fine-grained label into positive / negative / neutral groups."""
    if label in POSITIVE_LABELS:
        return "positive"
    if label in NEGATIVE_LABELS:
        return "negative"
    return "neutral"


def get_overlay_color(group: str) -> Tuple[int, int, int]:
    """Return BGR color for OpenCV text rendering."""
    if group == "positive":
        return (0, 220, 0)  # Green
    if group == "negative":
        return (0, 0, 255)  # Red
    return (0, 215, 255)  # Yellow


def extract_features(results) -> List[float]:
    """Flatten MediaPipe landmarks into model features."""
    features: List[float] = []
    for lm in results.pose_landmarks.landmark:
        features.extend([lm.x, lm.y])
    return features


def main() -> None:
    if not MODEL_PATH.exists():
        print(f"Error: Model file not found at {MODEL_PATH}")
        print("Run train_pose_model.py first.")
        return

    labels = load_labels(LABELS_PATH)
    model = joblib.load(MODEL_PATH)

    mp_pose = mp.solutions.pose
    mp_drawing = mp.solutions.drawing_utils

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    last_printed = None

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while True:
            ok, frame = cap.read()
            if not ok:
                print("Warning: Could not read frame from webcam.")
                break

            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(rgb)

            predicted_label = "no_pose"

            if results.pose_landmarks:
                # Draw skeleton to make prediction context visible.
                mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                features = extract_features(results)
                prediction = model.predict(np.array(features).reshape(1, -1))
                predicted_label = str(prediction[0])
            elif "no_pose" not in labels:
                predicted_label = "neutral_standing"

            group = get_action_group(predicted_label)
            color = get_overlay_color(group)
            overlay_text = f"Prediction: {predicted_label} ({group})"

            cv2.putText(
                frame,
                overlay_text,
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                color,
                2,
            )
            cv2.putText(
                frame,
                "Press ESC to exit",
                (10, 58),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),
                2,
            )

            if predicted_label != last_printed:
                print(overlay_text)
                last_printed = predicted_label

            cv2.imshow("Pose Action Inference", frame)

            key = cv2.waitKey(1) & 0xFF
            if key == 27:  # ESC
                break

    cap.release()
    cv2.destroyAllWindows()
    print("Live inference stopped cleanly.")


if __name__ == "__main__":
    main()
