"""Train a simple pose action classifier from collected MediaPipe landmark data."""

from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "pose_data.csv"
MODEL_PATH = BASE_DIR / "pose_classifier.pkl"
LABELS_PATH = BASE_DIR / "labels.txt"


def load_dataset(csv_path: Path) -> pd.DataFrame | None:
    """Load dataset safely and return None when data is missing or invalid."""
    if not csv_path.exists():
        print(f"Error: Missing dataset file at {csv_path}")
        return None

    df = pd.read_csv(csv_path)
    if df.empty:
        print("Error: Dataset is empty. Collect samples first.")
        return None

    if "label" not in df.columns:
        print("Error: Dataset must include a 'label' column.")
        return None

    return df


def main() -> None:
    df = load_dataset(DATA_PATH)
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
