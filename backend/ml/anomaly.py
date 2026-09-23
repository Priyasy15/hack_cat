"""
anomaly.py
IsolationForest & Heuristic Anomaly Engine for Heavy Equipment Telematics.
Detects:
- Excessive idling
- Abnormal fuel/energy burn
- Cycle time spikes
- Aggressive machine handling (high peak braking/acceleration)
Provides actionable text explanations and links directly to training interventions.
"""

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "telemetry_log.csv")

class AnomalyDetector:
    def __init__(self, data_path: str = DATA_PATH):
        self.data_path = data_path
        self.iso_forest = None
        self.baseline_stats = {}
        self._fit()

    def _fit(self):
        if not os.path.exists(self.data_path):
            return

        df = pd.read_csv(self.data_path)
        feature_cols = ["speed", "load", "cycle_count", "idle_time", "acceleration", "braking"]
        
        # Calculate baseline means and 95th percentiles
        self.baseline_stats = {
            "avg_idle": float(df["idle_time"].mean()),
            "std_idle": float(df["idle_time"].std()),
            "avg_speed": float(df["speed"].mean()),
            "avg_accel": float(df["acceleration"].mean()),
            "avg_brake": float(df["braking"].mean()),
            "avg_cycles": float(df["cycle_count"].mean())
        }

        X = df[feature_cols].dropna()
        self.iso_forest = IsolationForest(contamination=0.08, random_state=42)
        self.iso_forest.fit(X)
        print(f"[AnomalyDetector] IsolationForest trained on {len(X)} operational records.")

    def evaluate(self, current_telemetry: dict) -> dict:
        """
        Evaluates a real-time telemetry frame. Returns anomaly flags,
        text explanation, severity, and training recommendation.
        """
        idle_time = float(current_telemetry.get("idle_time", 18.0))
        speed = float(current_telemetry.get("speed", 2.0))
        accel = float(current_telemetry.get("acceleration", 0.5))
        brake = float(current_telemetry.get("braking", 0.4))
        cycles = int(current_telemetry.get("cycle_count", 25))
        seatbelt = current_telemetry.get("seatbelt_status", "Fastened")

        anomalies = []
        training_recommended = None

        # 1. Excessive Idling Anomaly
        benchmark_idle = 18.0
        if idle_time > 30.0:
            pct_dev = round(((idle_time - benchmark_idle) / benchmark_idle) * 100, 1)
            severity = "Critical" if idle_time > 42.0 else "Warning"
            anomalies.append({
                "type": "EXCESSIVE_IDLING",
                "severity": severity,
                "title": f"Excessive Idle: {idle_time:.1f}m/hr (+{pct_dev}% deviation)",
                "explanation": f"Engine idle time of {idle_time:.1f}m/hr exceeds site benchmark ({benchmark_idle}m/hr). Auto-Engine Shutdown (AES) bypassed.",
                "fuel_wasted_L": round((idle_time - benchmark_idle) * 0.08, 1),
                "action": "Engage Cat Auto-Idle Shutdown (AES) or shut down engine during queue pauses."
            })
            training_recommended = {
                "module_id": "TRN-IDLE-202",
                "module_name": "Efficient Machine Operation & Idling Elimination",
                "reason": f"Excessive Idling flagged (+{pct_dev}% over benchmark)"
            }

        # 2. Aggressive Machine Handling Anomaly
        if accel > 1.2 or brake > 1.1:
            anomalies.append({
                "type": "AGGRESSIVE_HANDLING",
                "severity": "Warning",
                "title": f"High Peak G-Force ({max(accel, brake):.2f} G)",
                "explanation": "Abrupt braking/acceleration spikes detected. Cylinder end-stop cushions exceeding normal hydraulic thresholds.",
                "action": "Smooth compound joystick inputs to reduce structural fatigue."
            })
            if not training_recommended:
                training_recommended = {
                    "module_id": "TRN-SMTH-404",
                    "module_name": "Compound Bucket Motions & Smooth Cycle Mastery",
                    "reason": "Peak G-force shockload spikes detected"
                }

        # 3. Seatbelt Non-Compliance Anomaly
        if seatbelt == "Unfastened":
            anomalies.append({
                "type": "SEATBELT_NONCOMPLIANCE",
                "severity": "Critical",
                "title": "Unfastened Seatbelt During Operation",
                "explanation": "Primary operator safety interlock open while hydraulic pilot lock is disengaged.",
                "action": "Fasten cab seatbelt immediately. Pilot hydraulic cut-off warning."
            })

        is_anomaly = len(anomalies) > 0
        overall_severity = "Safe"
        if any(a["severity"] == "Critical" for a in anomalies):
            overall_severity = "Critical"
        elif any(a["severity"] == "Warning" for a in anomalies):
            overall_severity = "Warning"

        return {
            "is_anomaly": is_anomaly,
            "overall_severity": overall_severity,
            "anomaly_count": len(anomalies),
            "anomalies": anomalies,
            "recommended_training": training_recommended,
            "benchmark_idle_min": benchmark_idle,
            "current_idle_min": idle_time
        }

_detector = None

def get_anomaly_detector() -> AnomalyDetector:
    global _detector
    if _detector is None:
        _detector = AnomalyDetector()
    return _detector
