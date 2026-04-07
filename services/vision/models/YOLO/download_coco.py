"""
download_coco.py
Downloads COCO 2017 images and annotations for YOLOv3 training/inference.

Supports two backends:
  1. FiftyOne  — recommended, handles incremental sync and subset filtering
  2. Direct    — urllib fallback, downloads official zip files from COCO CDN

Usage:
    python download_coco.py                  # FiftyOne full 2017 dataset
    python download_coco.py --backend direct # Direct zip download
    python download_coco.py --split val      # Val split only (fast test)
    python download_coco.py --classes person car --max-samples 500
    python download_coco.py --github-safe    # Small subset suitable for GitHub
"""

import argparse
import os
import shutil
import urllib.request
import zipfile
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Root directory where COCO data will be stored (relative to this script)
DEFAULT_COCO_ROOT = Path(__file__).parent / "data" / "coco"

# Official COCO download URLs
COCO_URLS = {
    "images": {
        "train2017": "http://images.cocodataset.org/zips/train2017.zip",        # 18 GB
        "val2017":   "http://images.cocodataset.org/zips/val2017.zip",          #  1 GB
        "test2017":  "http://images.cocodataset.org/zips/test2017.zip",         #  6 GB
        "unlabeled2017": "http://images.cocodataset.org/zips/unlabeled2017.zip",# 19 GB
    },
    "annotations": {
        "trainval2017":     "http://images.cocodataset.org/annotations/annotations_trainval2017.zip",     # 241 MB
        "stuff_trainval2017": "http://images.cocodataset.org/annotations/stuff_annotations_trainval2017.zip", # 1.1 GB
        "panoptic_trainval2017": "http://images.cocodataset.org/annotations/panoptic_annotations_trainval2017.zip", # 821 MB
        "image_info_test2017": "http://images.cocodataset.org/annotations/image_info_test2017.zip",      #   1 MB
        "image_info_unlabeled2017": "http://images.cocodataset.org/annotations/image_info_unlabeled2017.zip", # 4 MB
    },
}

# What to download by default (images + core annotations)
DEFAULT_DOWNLOADS = {
    "images": ["train2017", "val2017", "test2017"],
    "annotations": ["trainval2017", "image_info_test2017"],
}

FIFTYONE_SPLIT_ALIASES = {
    "train": "train",
    "training": "train",
    "val": "validation",
    "valid": "validation",
    "validation": "validation",
    "test": "test",
    "testing": "test",
    "unlabeled": "unlabeled",
    "unlabelled": "unlabeled",
    "train2017": "train",
    "val2017": "validation",
    "test2017": "test",
    "unlabeled2017": "unlabeled",
}

DIRECT_SPLIT_ALIASES = {
    "train": "train2017",
    "training": "train2017",
    "val": "val2017",
    "valid": "val2017",
    "validation": "val2017",
    "test": "test2017",
    "testing": "test2017",
    "unlabeled": "unlabeled2017",
    "unlabelled": "unlabeled2017",
    "train2017": "train2017",
    "val2017": "val2017",
    "test2017": "test2017",
    "unlabeled2017": "unlabeled2017",
}


def normalize_splits(raw_splits: list[str], backend: str) -> list[str]:
    """Normalise user split names to backend-specific canonical split keys."""
    aliases = FIFTYONE_SPLIT_ALIASES if backend == "fiftyone" else DIRECT_SPLIT_ALIASES
    normalised: list[str] = []

    for split in raw_splits:
        key = split.strip().lower()
        mapped = aliases.get(key)
        if not mapped:
            print(f"  Warning: unknown split '{split}' for backend '{backend}', skipping")
            continue
        if mapped not in normalised:
            normalised.append(mapped)

    if not normalised:
        raise SystemExit(
            "No valid splits left after normalization. "
            "Check --split values for the selected backend."
        )

    return normalised


# ---------------------------------------------------------------------------
# Direct download helpers
# ---------------------------------------------------------------------------

def _progress_hook(block_num: int, block_size: int, total_size: int) -> None:
    downloaded = block_num * block_size
    if total_size > 0:
        pct = min(downloaded / total_size * 100, 100)
        mb = downloaded / 1_048_576
        total_mb = total_size / 1_048_576
        print(f"\r  {pct:5.1f}%  {mb:.0f} / {total_mb:.0f} MB", end="", flush=True)


def download_file(url: str, dest: Path) -> None:
    """Download url to dest, skipping if the file already exists."""
    if dest.exists():
        print(f"  Already downloaded: {dest.name}")
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"  Downloading {dest.name} ...")
    urllib.request.urlretrieve(url, dest, reporthook=_progress_hook)
    print()  # newline after progress


def extract_zip(zip_path: Path, extract_to: Path) -> None:
    """Extract a zip archive, skipping if the target folder already exists."""
    marker = extract_to / zip_path.stem
    if marker.exists():
        print(f"  Already extracted: {zip_path.name}")
        return
    print(f"  Extracting {zip_path.name} ...")
    with zipfile.ZipFile(zip_path, "r") as z:
        z.extractall(extract_to)
    print(f"  Done: {zip_path.name}")


def download_direct(splits: list[str], include_annotations: list[str], coco_root: Path) -> None:
    """Download selected COCO splits directly from the COCO CDN."""
    zips_dir = coco_root / "zips"
    zips_dir.mkdir(parents=True, exist_ok=True)

    images_dir = coco_root / "images"
    ann_dir    = coco_root / "annotations"

    print("\n=== Downloading images ===")
    for split in splits:
        url = COCO_URLS["images"].get(split)
        if not url:
            print(f"  Unknown split '{split}', skipping.")
            continue
        dest = zips_dir / f"{split}.zip"
        download_file(url, dest)
        extract_zip(dest, images_dir)

    print("\n=== Downloading annotations ===")
    for key in include_annotations:
        url = COCO_URLS["annotations"].get(key)
        if not url:
            print(f"  Unknown annotation key '{key}', skipping.")
            continue
        dest = zips_dir / f"{key}.zip"
        download_file(url, dest)
        extract_zip(dest, ann_dir)

    print(f"\nCOCO data saved to: {coco_root.resolve()}")


# ---------------------------------------------------------------------------
# FiftyOne download helpers
# ---------------------------------------------------------------------------

def download_fiftyone(
    splits: list[str],
    coco_root: Path,
    classes: list[str] | None = None,
    max_samples: int | None = None,
    label_types: list[str] | None = None,
) -> None:
    """Download COCO via FiftyOne with optional filtering."""
    zoo_dir = str((coco_root / "fiftyone").resolve())
    os.environ["FIFTYONE_DATASET_ZOO_DIR"] = zoo_dir

    try:
        import fiftyone as fo
        import fiftyone.zoo as foz
    except ImportError:
        raise SystemExit(
            "FiftyOne is not installed. Run:\n"
            "  pip install fiftyone\n"
            "or use --backend direct instead."
        )

    # Keep runtime config aligned with the target output path.
    fo.config.dataset_zoo_dir = zoo_dir

    # Default to detections only so pycocotools is not required unless
    # segmentations are explicitly requested.
    label_types = label_types or ["detections"]

    for split in splits:
        print(f"\n=== Downloading COCO 2017 — {split} ===")
        kwargs: dict = dict(
            dataset_name=f"coco-2017-{split}",
            split=split,
            label_types=label_types,
        )
        if classes:
            kwargs["classes"] = classes
        if max_samples:
            kwargs["max_samples"] = max_samples

        dataset = foz.load_zoo_dataset("coco-2017", **kwargs)
        print(f"  Loaded {len(dataset)} samples for split='{split}'")

    print(f"\nFiftyOne COCO data saved to: {(coco_root / 'fiftyone').resolve()}")


def prune_fiftyone_for_github(coco_root: Path) -> None:
    """Delete heavy raw archives/caches and keep only lightweight split data."""
    zoo_root = coco_root / "fiftyone" / "coco-2017"
    removable_dirs = [
        zoo_root / "raw",
        zoo_root / "tmp-download",
    ]

    removed_any = False
    for directory in removable_dirs:
        if directory.exists():
            shutil.rmtree(directory, ignore_errors=True)
            print(f"  Pruned: {directory}")
            removed_any = True

    if not removed_any:
        print("  No heavy FiftyOne cache directories found to prune")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download COCO 2017 dataset for YOLOv3 training."
    )
    parser.add_argument(
        "--backend",
        choices=["fiftyone", "direct"],
        default="fiftyone",
        help="Download backend (default: fiftyone)",
    )
    parser.add_argument(
        "--split",
        nargs="+",
        default=["train", "validation", "test"],
        help=(
            "Which splits to download. FiftyOne names: train, validation, test, unlabeled. "
            "Direct names: train2017, val2017, test2017, unlabeled2017. "
            "(default: train validation test)"
        ),
    )
    parser.add_argument(
        "--classes",
        nargs="+",
        default=None,
        help="Filter to specific COCO classes, e.g. --classes person car (FiftyOne only)",
    )
    parser.add_argument(
        "--max-samples",
        type=int,
        default=None,
        help="Limit number of samples per split (FiftyOne only, useful for quick tests)",
    )
    parser.add_argument(
        "--label-types",
        nargs="+",
        default=["detections"],
        help="Label types to include (FiftyOne only, default: detections)",
    )
    parser.add_argument(
        "--annotations",
        nargs="+",
        default=list(DEFAULT_DOWNLOADS["annotations"]),
        help="Annotation bundles to download (direct backend only)",
    )
    parser.add_argument(
        "--output-dir",
        default=str(DEFAULT_COCO_ROOT),
        help=(
            "Output directory for COCO data. Default keeps data under the YOLO folder: "
            "services/vision/models/YOLO/data/coco"
        ),
    )
    parser.add_argument(
        "--github-safe",
        action="store_true",
        help=(
            "Enable a condensed, GitHub-friendly preset: validation split only + max 200 "
            "samples (FiftyOne backend)."
        ),
    )
    parser.add_argument(
        "--prune-large-files",
        action="store_true",
        help=(
            "After FiftyOne download, remove heavy raw/tmp cache folders to keep only "
            "lightweight subset files."
        ),
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    coco_root = Path(args.output_dir).resolve()
    coco_root.mkdir(parents=True, exist_ok=True)

    if args.github_safe:
        if args.backend != "fiftyone":
            raise SystemExit("--github-safe currently supports only --backend fiftyone")
        if args.split == ["train", "validation", "test"]:
            args.split = ["validation"]
        if args.max_samples is None:
            args.max_samples = 200
        args.prune_large_files = True

    splits = normalize_splits(args.split, args.backend)

    print("=" * 60)
    print("  COCO 2017 Dataset Downloader")
    print(f"  Backend  : {args.backend}")
    print(f"  Splits   : {splits}")
    print(f"  Output   : {coco_root}")
    print(f"  GitHub-safe mode: {args.github_safe}")
    print("=" * 60)

    if args.backend == "fiftyone":
        download_fiftyone(
            splits=splits,
            coco_root=coco_root,
            classes=args.classes,
            max_samples=args.max_samples,
            label_types=args.label_types,
        )
        if args.prune_large_files:
            print("\n=== Pruning heavy cache files ===")
            prune_fiftyone_for_github(coco_root)
    else:
        download_direct(
            splits=splits,
            include_annotations=args.annotations,
            coco_root=coco_root,
        )


if __name__ == "__main__":
    main()
