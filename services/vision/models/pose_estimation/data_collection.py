"""Collect labeled MediaPipe pose landmark samples from webcam input.

Uses the mediapipe.tasks.vision.PoseLandmarker API (v0.10+).
This script is intentionally simple and beginner-friendly.
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path
from typing import Dict, List
import time

import cv2
import mediapipe as mp
from mediapipe.tasks.python.vision import PoseLandmarker, PoseLandmarkerOptions, RunningMode
from mediapipe.tasks.python.vision import PoseLandmarksConnections

BASE_DIR = Path(__file__).resolve().parent
MODEL_ASSET = BASE_DIR / "pose_landmarker_lite.task"

# Each team member saves to their own CSV file.
TEAM_MEMBERS = ["vanya", "mason", "rodrigo", "samya", "oma", "rohan"]

# Key-to-label mapping for quick sample collection.
KEY_LABEL_MAP: Dict[str, str] = {
    "1": "sweeping_motion",
    "2": "wiping_table",
    "3": "picking_up_items",
    "4": "folding_clothes_motion",
    "5": "carrying_laundry",
    "6": "making_bed_motion",
    "7": "reading_time",
    "8": "idle_standing",
    "9": "slouching",
    "a": "phone_hunch",
    "s": "head_down_inactive",
    "d": "arms_crossed_refusal",
    "f": "lying_down",
    "g": "neutral_standing",
    "h": "sitting_neutral",
    "0": "no_pose",
}

# Pre-compute the set of connections for drawing.
POSE_CONNECTIONS = PoseLandmarksConnections.POSE_LANDMARKS


def get_header() -> List[str]:
    """Build CSV headers: label + x/y for 33 landmarks."""
    header = ["label"]
    for i in range(33):
        header.extend([f"x_lm_{i}", f"y_lm_{i}"])
    return header


def ensure_csv_exists(csv_path: Path) -> None:
    """Create CSV with header if it does not exist yet."""
    if csv_path.exists():
        return

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(get_header())


def extract_landmark_xy(landmarks) -> List[float]:
    """Flatten a list of NormalizedLandmark into [x0, y0, x1, y1, ...]."""
    values: List[float] = []
    for lm in landmarks:
        values.extend([lm.x, lm.y])
    return values


def draw_pose(frame, landmarks) -> None:
    """Draw pose landmarks and connections on the frame."""
    h, w, _ = frame.shape
    for connection in POSE_CONNECTIONS:
        start = landmarks[connection.start]
        end = landmarks[connection.end]
        sx, sy = int(start.x * w), int(start.y * h)
        ex, ey = int(end.x * w), int(end.y * h)
        cv2.line(frame, (sx, sy), (ex, ey), (0, 255, 0), 2)
    for lm in landmarks:
        cx, cy = int(lm.x * w), int(lm.y * h)
        cv2.circle(frame, (cx, cy), 4, (0, 0, 255), -1)


def draw_legend(frame, active_message: str) -> None:
    """Render key mapping instructions on top of the video frame."""
    cv2.putText(
        frame,
        "Press key to save sample | q or ESC to quit",
        (10, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (255, 255, 255),
        2,
    )

    items = list(KEY_LABEL_MAP.items())
    col_width = 340
    start_y = 50
    for idx, (key, label) in enumerate(items):
        col = idx // 8
        row = idx % 8
        x = 10 + (col * col_width)
        y = start_y + (row * 24)
        cv2.putText(
            frame,
            f"[{key}] {label}",
            (x, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (200, 255, 200),
            1,
        )

    cv2.putText(
        frame,
        active_message,
        (10, frame.shape[0] - 14),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (80, 220, 255),
        2,
    )


def append_sample(csv_path: Path, label: str, features: List[float]) -> None:
    """Append one labeled training sample to CSV."""
    with csv_path.open("a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([label] + features)


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Collect labeled pose samples.")
    parser.add_argument(
        "--name",
        required=True,
        choices=TEAM_MEMBERS,
        help=f"Your name. One of: {', '.join(TEAM_MEMBERS)}",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    csv_path = BASE_DIR / f"pose_data_{args.name}.csv"
    ensure_csv_exists(csv_path)
    print(f"Saving samples to: {csv_path.name}")

    if not MODEL_ASSET.exists():
        print(f"Error: Pose landmarker model not found at {MODEL_ASSET}")
        print("Download it with:")
        print('  curl -sL -o pose_landmarker_lite.task "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task"')
        return

    # Create a PoseLandmarker using the new tasks API (VIDEO mode for sequential frames).
    options = PoseLandmarkerOptions(
        base_options=mp.tasks.BaseOptions(model_asset_path=str(MODEL_ASSET)),
        running_mode=RunningMode.VIDEO,
        num_poses=1,
        min_pose_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    landmarker = PoseLandmarker.create_from_options(options)

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        landmarker.close()
        return

    message = "Waiting for pose..."
    frame_timestamp_ms = 0
    
    pending_label = None
    countdown_start = None
    countdown_seconds = 3

    while True:
        ok, frame = cap.read()
        if not ok:
            print("Warning: Could not read frame from webcam.")
            break

        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Convert to mediapipe Image and detect.
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        frame_timestamp_ms += 33  # ~30 fps
        result = landmarker.detect_for_video(mp_image, frame_timestamp_ms)

        features: List[float] | None = None

        has_pose = result.pose_landmarks and len(result.pose_landmarks) > 0
        if has_pose:
            landmarks = result.pose_landmarks[0]
            draw_pose(frame, landmarks)
            features = extract_landmark_xy(landmarks)
        else:
            message = "No pose detected. Press [0] for no_pose or move into frame."

        if pending_label is not None and countdown_start is not None:
            elapsed = time.time() - countdown_start
            remaining = countdown_seconds - int(elapsed)

            if remaining > 0:
                cv2.putText(
                    frame,
                    f"Capturing in {remaining}...",
                    (10, frame.shape[0] // 2),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.2,
                    (0, 255, 255),
                    3,
                )
                message = f"Get ready: {pending_label}"
            else:
                if pending_label == "no_pose":
                    empty_features = [-1.0] * 66
                    append_sample(csv_path, pending_label, empty_features)
                    message = "Saved: no_pose"
                elif features is None:
                    message = f"No pose detected for {pending_label}"
                else:
                    append_sample(csv_path, pending_label, features)
                    message = f"Saved: {pending_label}"

                pending_label = None
                countdown_start = None
        
        draw_legend(frame, message)
        cv2.imshow("Pose Data Collection", frame)

        key_val = cv2.waitKey(1) & 0xFF
        if key_val in (27, ord("q")):
            break

        if key_val == 255:
            continue

                # Ignore new key presses while countdown is active
        if pending_label is not None:
            continue

        key = chr(key_val).lower()
        if key not in KEY_LABEL_MAP:
            continue

        pending_label = KEY_LABEL_MAP[key]
        countdown_start = time.time()
        message = f"Preparing to save: {pending_label}"

    landmarker.close()
    cap.release()
    cv2.destroyAllWindows()
    print("Data collection stopped cleanly.")


if __name__ == "__main__":
    main()
