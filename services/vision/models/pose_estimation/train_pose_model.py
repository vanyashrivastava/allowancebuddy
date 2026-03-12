"""Train a simple pose action classifier from collected MediaPipe landmark data."""

from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "pose_classifier.pkl"
LABELS_PATH = BASE_DIR / "labels.txt"


def load_all_datasets(base_dir: Path) -> pd.DataFrame | None:
    """Find and merge all pose_data_*.csv files from each team member."""
    csv_files = sorted(base_dir.glob("pose_data_*.csv"))

    # Also include the legacy pose_data.csv if it has data rows.
    legacy = base_dir / "pose_data.csv"
    if legacy.exists() and legacy not in csv_files:
        csv_files.append(legacy)

    if not csv_files:
        print("Error: No pose_data_*.csv files found. Collect samples first.")
        return None

    frames: list[pd.DataFrame] = []
    for f in csv_files:
        df = pd.read_csv(f)
        if not df.empty and "label" in df.columns:
            print(f"  Loaded {len(df)} samples from {f.name}")
            frames.append(df)
        else:
            print(f"  Skipped {f.name} (empty or missing 'label' column)")

    if not frames:
        print("Error: All CSV files are empty. Collect samples first.")
        return None

    merged = pd.concat(frames, ignore_index=True)
    print(f"  Merged total: {len(merged)} samples from {len(frames)} file(s)")
    return merged


def main() -> None:
    df = load_all_datasets(BASE_DIR)
    if df is None:
        return

    feature_columns = [c for c in df.columns if c != "label"]
    if not feature_columns:
        print("Error: No feature columns found in dataset.")
        return

    # Convert landmark values to numeric and fill missing values.
    X = df[feature_columns].apply(pd.to_numeric, errors="coerce").fillna(-1.0)
    y = df["label"].astype(str)

    total_samples = len(df)
    label_counts = y.value_counts()
    unique_labels = sorted(label_counts.index.tolist())

    print(f"Total samples: {total_samples}")
    print(f"Unique labels: {len(unique_labels)}")
    print("Label counts:")
    print(label_counts.to_string())

    if total_samples < 10:
        print("Warning: Very small dataset. Accuracy will likely be unstable.")

    if len(unique_labels) < 2:
        print("Error: Need at least 2 labels to train a classifier.")
        return

    can_stratify = label_counts.min() >= 2

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y if can_stratify else None,
    )

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced",
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    print(f"\nAccuracy: {acc:.4f}")
    print("\nClassification report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Save trained model and labels for live inference.
    joblib.dump(model, MODEL_PATH)
    with LABELS_PATH.open("w", encoding="utf-8") as f:
        for label in unique_labels:
            f.write(label + "\n")

    print(f"\nSaved model to: {MODEL_PATH}")
    print(f"Saved labels to: {LABELS_PATH}")


if __name__ == "__main__":
    main()
