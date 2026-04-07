import argparse
import time

import cv2
from ultralytics import YOLO


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Live webcam YOLO object detection")
    parser.add_argument("--model", default="yolov8m.pt", help="Pretrained YOLO model file")
    parser.add_argument("--conf", type=float, default=0.35, help="Confidence threshold")
    parser.add_argument("--imgsz", type=int, default=960, help="Inference image size")
    parser.add_argument("--camera", type=int, default=0, help="Camera index")
    parser.add_argument("--max-det", type=int, default=50, help="Max detections per frame")
    parser.add_argument("--device", default="cpu", help="Inference device, e.g. cpu or 0")
    parser.add_argument(
        "--classes",
        type=int,
        nargs="*",
        default=None,
        help="Optional class IDs to keep (COCO indices), e.g. 0 56 57 62",
    )
    return parser.parse_args()


def open_camera(preferred_index: int) -> cv2.VideoCapture:
    for index in [preferred_index, 0, 1, 2]:
        cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)
        if cap.isOpened():
            return cap
        cap.release()
    raise RuntimeError("Could not open webcam. Try another --camera index.")


def main() -> None:
    args = parse_args()

    print(f"Loading model: {args.model}")
    model = YOLO(args.model)

    cap = open_camera(args.camera)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    print("Live demo started.")
    print("Controls: q = quit, f = fullscreen toggle")

    window_name = "YOLO Live Webcam"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    fullscreen = False
    prev_t = time.time()

    while True:
        ok, frame = cap.read()
        if not ok:
            print("Warning: failed to read frame from webcam")
            continue

        results = model.predict(
            source=frame,
            conf=args.conf,
            imgsz=args.imgsz,
            device=args.device,
            max_det=args.max_det,
            classes=args.classes,
            verbose=False,
        )

        plotted = results[0].plot()

        now = time.time()
        fps = 1.0 / max(now - prev_t, 1e-6)
        prev_t = now
        cv2.putText(
            plotted,
            f"FPS: {fps:.1f}",
            (12, 34),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (0, 255, 0),
            2,
            cv2.LINE_AA,
        )

        cv2.imshow(window_name, plotted)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        if key == ord("f"):
            fullscreen = not fullscreen
            cv2.setWindowProperty(
                window_name,
                cv2.WND_PROP_FULLSCREEN,
                cv2.WINDOW_FULLSCREEN if fullscreen else cv2.WINDOW_NORMAL,
            )

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
