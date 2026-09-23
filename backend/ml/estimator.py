"""
estimator.py
Machine Learning Task Duration Estimator using Scikit-Learn.
Predicts actual_time_min and provides interpretable factor breakdowns
(Weather impact, Skill impact, Machine Age impact).
"""

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "task_log.csv")

class TaskEstimator:
    def __init__(self, data_path: str = DATA_PATH):
        self.data_path = data_path
        self.rf_pipeline = None
        self.ridge_pipeline = None
        self.r2_score = 0.0
        self.mae = 0.0
        self.train_count = 0
        self.baseline_times = {
            "Trenching": 120.0,
            "Mass Excavation": 150.0,
            "Slope Grading": 90.0,
            "Truck Loading": 45.0,
            "Pipe Laying": 110.0,
            "Stockpile Rehandling": 60.0
        }
        self._train()

    def _train(self):
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Training data not found at {self.data_path}")

        df = pd.read_csv(self.data_path)
        feature_cols = ["task_type", "weather", "operator_skill", "machine_age_yrs"]
        target_col = "actual_time_min"

        X = df[feature_cols]
        y = df[target_col]

        categorical_cols = ["task_type", "weather", "operator_skill"]
        numeric_cols = ["machine_age_yrs"]

        preprocessor = ColumnTransformer(
            transformers=[
                ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols),
                ("num", StandardScaler(), numeric_cols)
            ]
        )

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Random Forest Regressor for robust non-linear interaction
        self.rf_pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42))
        ])
        self.rf_pipeline.fit(X_train, y_train)

        # Ridge regressor for direct linear attribution
        self.ridge_pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", Ridge(alpha=1.0))
        ])
        self.ridge_pipeline.fit(X_train, y_train)

        y_pred = self.rf_pipeline.predict(X_test)
        self.r2_score = round(float(r2_score(y_test, y_pred)), 3)
        self.mae = round(float(mean_absolute_error(y_test, y_pred)), 2)
        self.train_count = len(X_train)
        print(f"[TaskEstimator] Trained on {self.train_count} tasks | R2: {self.r2_score} | MAE: {self.mae} mins")

    def predict(self, task_type: str, weather: str, operator_skill: str, machine_age_yrs: float) -> dict:
        """
        Predicts actual task duration and breaks down factor contributions:
        - Baseline standard time (Sunny, Intermediate, 3-yr machine)
        - Weather impact (delta min, % impact, reason)
        - Skill impact (delta min, % impact, reason)
        - Machine age impact (delta min, % impact, reason)
        """
        # Baseline reference: Sunny, Intermediate, 3.0 yrs age
        baseline_df = pd.DataFrame([{
            "task_type": task_type,
            "weather": "Sunny",
            "operator_skill": "Intermediate",
            "machine_age_yrs": 3.0
        }])
        baseline_pred = float(self.rf_pipeline.predict(baseline_df)[0])

        # Actual request prediction
        target_df = pd.DataFrame([{
            "task_type": task_type,
            "weather": weather,
            "operator_skill": operator_skill,
            "machine_age_yrs": float(machine_age_yrs)
        }])
        actual_pred = float(self.rf_pipeline.predict(target_df)[0])

        # Individual factor counterfactuals
        # 1. Weather factor
        weather_df = pd.DataFrame([{
            "task_type": task_type,
            "weather": weather,
            "operator_skill": "Intermediate",
            "machine_age_yrs": 3.0
        }])
        weather_pred = float(self.rf_pipeline.predict(weather_df)[0])
        weather_delta = round(weather_pred - baseline_pred, 1)
        weather_pct = round((weather_delta / baseline_pred) * 100, 1) if baseline_pred else 0.0

        # 2. Skill factor
        skill_df = pd.DataFrame([{
            "task_type": task_type,
            "weather": "Sunny",
            "operator_skill": operator_skill,
            "machine_age_yrs": 3.0
        }])
        skill_pred = float(self.rf_pipeline.predict(skill_df)[0])
        skill_delta = round(skill_pred - baseline_pred, 1)
        skill_pct = round((skill_delta / baseline_pred) * 100, 1) if baseline_pred else 0.0

        # 3. Machine age factor
        age_df = pd.DataFrame([{
            "task_type": task_type,
            "weather": "Sunny",
            "operator_skill": "Intermediate",
            "machine_age_yrs": float(machine_age_yrs)
        }])
        age_pred = float(self.rf_pipeline.predict(age_df)[0])
        age_delta = round(age_pred - baseline_pred, 1)
        age_pct = round((age_delta / baseline_pred) * 100, 1) if baseline_pred else 0.0

        # Descriptive explanations
        factors = [
            {
                "factor": "Weather Condition",
                "value": weather,
                "delta_min": weather_delta,
                "percentage": weather_pct,
                "impact": "delay" if weather_delta > 0 else ("accelerated" if weather_delta < 0 else "neutral"),
                "detail": self._get_weather_note(weather, weather_delta)
            },
            {
                "factor": "Operator Skill Level",
                "value": operator_skill,
                "delta_min": skill_delta,
                "percentage": skill_pct,
                "impact": "delay" if skill_delta > 0 else ("accelerated" if skill_delta < 0 else "neutral"),
                "detail": self._get_skill_note(operator_skill, skill_delta)
            },
            {
                "factor": "Equipment Age & Wear",
                "value": f"{machine_age_yrs:.1f} yrs",
                "delta_min": age_delta,
                "percentage": age_pct,
                "impact": "delay" if age_delta > 0 else ("accelerated" if age_delta < 0 else "neutral"),
                "detail": self._get_age_note(machine_age_yrs, age_delta)
            }
        ]

        # Nominal planned time
        nominal_time = self.baseline_times.get(task_type, round(baseline_pred, 1))

        return {
            "task_type": task_type,
            "nominal_time_min": round(nominal_time, 1),
            "predicted_time_min": round(actual_pred, 1),
            "total_variance_min": round(actual_pred - nominal_time, 1),
            "factors": factors,
            "model_metadata": {
                "algorithm": "RandomForestRegressor + Counterfactual Ridge Explainer",
                "r2_score": self.r2_score,
                "mae_min": self.mae,
                "training_samples": self.train_count
            }
        }

    def _get_weather_note(self, weather: str, delta: float) -> str:
        notes = {
            "Sunny": "Ideal ground conditions, optimal boom and swing cycle speeds.",
            "Rain": "Reduced traction, slippery tracks, and reduced cab visibility.",
            "Muddy/Wet": "Severe undercarriage slippage, heavy bucket soil adhesion, trench cave-in hazard.",
            "High Wind": "Boom swing drag, dust clouds, extra caution required near overhead obstacles.",
            "Fog/Low Visibility": "Operator must reduce travel speed by 25% to verify proximity hazards.",
            "Extreme Heat": "Hydraulic oil cooling cycle limit, frequent engine fan duty."
        }
        return notes.get(weather, f"Environmental impact adding {delta:+.1f} min.")

    def _get_skill_note(self, skill: str, delta: float) -> str:
        notes = {
            "Expert": "High grade-control precision, smooth compound bucket motions, zero re-cuts.",
            "Intermediate": "Standard operating velocity with regular grade verification checks.",
            "Novice": "Higher cycle count, cautious bucket positioning, slower swing acceleration."
        }
        return notes.get(skill, f"Skill variance impact {delta:+.1f} min.")

    def _get_age_note(self, age: float, delta: float) -> str:
        if age < 3.0:
            return "Next-Gen hydraulic valve responsiveness, tight linkage tolerances."
        elif age < 7.0:
            return "Normal wear on cylinder seals, standard hydraulic pump flow rate."
        else:
            return "Hydraulic flow drop, linkage play, requiring slower fine-grade feathering."

# Global singleton
_estimator_instance = None

def get_estimator() -> TaskEstimator:
    global _estimator_instance
    if _estimator_instance is None:
        _estimator_instance = TaskEstimator()
    return _estimator_instance
