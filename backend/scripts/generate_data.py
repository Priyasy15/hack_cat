#!/usr/bin/env python3
"""
generate_data.py
OperatorOS synthetic dataset generator for Caterpillar heavy machinery.
Generates telemetry_log.csv and task_log.csv adhering to the strict schema.
"""

import os
import random
import datetime
import numpy as np
import pandas as pd

# Fix seed for reproducibility
np.random.seed(42)
random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

OPERATORS = [
    {"id": "OP-401", "name": "Dave Miller", "skill": "Intermediate", "anomaly_tendency": "high_idle"},
    {"id": "OP-402", "name": "Sarah Jenkins", "skill": "Expert", "anomaly_tendency": "low_incident"},
    {"id": "OP-403", "name": "Marcus Vance", "skill": "Novice", "anomaly_tendency": "seatbelt_infraction"},
    {"id": "OP-404", "name": "Elena Rostova", "skill": "Expert", "anomaly_tendency": "optimal"},
    {"id": "OP-405", "name": "Tom Chen", "skill": "Intermediate", "anomaly_tendency": "erratic_cycles"}
]

MACHINES = [
    {"id": "CAT-336-EX01", "type": "Excavator", "base_hours": 3420.0, "age_yrs": 3.5},
    {"id": "CAT-950-LD02", "type": "Wheel Loader", "base_hours": 5140.0, "age_yrs": 5.0},
    {"id": "CAT-349-EX03", "type": "Excavator", "base_hours": 1820.0, "age_yrs": 1.8},
    {"id": "CAT-980-LD04", "type": "Wheel Loader", "base_hours": 7890.0, "age_yrs": 8.2}
]

TASK_TYPES = [
    "Trenching",
    "Mass Excavation",
    "Slope Grading",
    "Truck Loading",
    "Pipe Laying",
    "Stockpile Rehandling"
]

WEATHER_CONDITIONS = [
    "Sunny",
    "Rain",
    "Muddy/Wet",
    "High Wind",
    "Fog/Low Visibility",
    "Extreme Heat"
]

def generate_telemetry_dataset():
    """
    Generates >= 500 rows spanning across at least 7 distinct calendar days per operator.
    Captures idling anomalies, seatbelt infractions, and cycle variations.
    """
    rows = []
    
    # Generate 10 consecutive days of shift telemetry (07:00 to 19:00 = 12 hourly snapshots)
    base_date = datetime.date(2026, 9, 13)
    
    for op in OPERATORS:
        op_id = op["id"]
        # Assign primary machine
        assigned_machine = MACHINES[0] if "EX" in op_id or op_id in ["OP-401", "OP-403"] else MACHINES[1]
        machine_id = assigned_machine["id"]
        
        current_engine_hours = assigned_machine["base_hours"]
        cumulative_fuel = 450.0
        
        for day_offset in range(10):
            current_date = base_date + datetime.timedelta(days=day_offset)
            
            # Each operator works a shift with 12 hourly telemetry snapshots: 07:00 to 18:00
            for hour_idx in range(7, 19):
                ts = datetime.datetime(current_date.year, current_date.month, current_date.day, hour_idx, random.randint(5, 55), 0)
                
                # Active work interval within the hour (typically 0.85 - 1.0 engine hours)
                hour_delta = round(random.uniform(0.75, 0.98), 2)
                current_engine_hours += hour_delta
                
                # Baseline idling time (10 - 22 mins per hour)
                base_idle = random.uniform(10.0, 22.0)
                
                # Anomaly injection based on operator tendency and specific days
                seatbelt = "Fastened"
                safety_alert = False
                
                if op["anomaly_tendency"] == "high_idle":
                    # Dave Miller has chronic idling issues (>45 mins/hr on days 3, 5, 7)
                    if day_offset in [3, 5, 7] and hour_idx in [11, 13, 14, 15]:
                        base_idle = random.uniform(46.0, 54.0)
                        # Sometimes unfastens seatbelt during excessive idling
                        if random.random() < 0.65:
                            seatbelt = "Unfastened"
                    elif random.random() < 0.2:
                        base_idle = random.uniform(32.0, 42.0)
                        
                elif op["anomaly_tendency"] == "seatbelt_infraction":
                    # Marcus Vance (Novice) occasionally unfastens seatbelt while operating
                    if random.random() < 0.35:
                        seatbelt = "Unfastened"
                        if random.random() < 0.5:
                            safety_alert = True
                    base_idle = random.uniform(15.0, 28.0)
                    
                elif op["anomaly_tendency"] == "erratic_cycles":
                    # Tom Chen has erratic fuel and cycle patterns
                    base_idle = random.uniform(12.0, 34.0)
                    if random.random() < 0.12:
                        safety_alert = True
                        
                else: # Sarah Jenkins & Elena Rostova (optimal / low incident)
                    base_idle = random.uniform(8.0, 16.0)
                    seatbelt = "Fastened"
                    if random.random() < 0.03:
                        safety_alert = True # rare external proximity event
                
                # Load cycles in this hour
                if base_idle > 40:
                    load_cycles = random.randint(2, 8)
                else:
                    load_cycles = random.randint(18, 38)
                    
                # Fuel used calculation
                # Working burns ~28-36 L/hr, Idling burns ~4-7 L/hr
                active_min = max(0.0, 60.0 - base_idle)
                fuel_burn = round((active_min / 60.0) * random.uniform(28.0, 35.0) + (base_idle / 60.0) * random.uniform(4.0, 6.5), 2)
                cumulative_fuel += fuel_burn
                
                rows.append({
                    "timestamp": ts.isoformat() + "Z",
                    "machine_id": machine_id,
                    "operator_id": op_id,
                    "engine_hours": round(current_engine_hours, 2),
                    "fuel_used_L": round(cumulative_fuel, 2),
                    "load_cycles": int(load_cycles),
                    "idling_time_min": round(base_idle, 1),
                    "seatbelt_status": seatbelt,
                    "safety_alert_triggered": bool(safety_alert)
                })
                
    df = pd.DataFrame(rows)
    output_path = os.path.join(DATA_DIR, "telemetry_log.csv")
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} telemetry rows spanning 8 days across {len(OPERATORS)} operators at {output_path}")
    return df

def generate_task_dataset():
    """
    Generates 450+ task log rows for ML regression modeling.
    Features: task_type, weather, operator_skill, machine_age_yrs, estimated_time_min, actual_time_min.
    Correlation rules:
    - Base time depends on task type (45 min - 180 min)
    - Severe weather (Rain, Muddy/Wet, High Wind) adds +20% to +45% duration
    - Operator skill: Novice adds +15% to +35%, Expert reduces -10% to -20%
    - Machine age > 5 yrs adds +5% to +18% due to hydraulic lag / mechanical wear
    """
    base_times = {
        "Trenching": 120.0,
        "Mass Excavation": 150.0,
        "Slope Grading": 90.0,
        "Truck Loading": 45.0,
        "Pipe Laying": 110.0,
        "Stockpile Rehandling": 60.0
    }
    
    weather_multiplier = {
        "Sunny": 1.00,
        "Extreme Heat": 1.08,
        "Fog/Low Visibility": 1.15,
        "High Wind": 1.20,
        "Rain": 1.28,
        "Muddy/Wet": 1.38
    }
    
    skill_multiplier = {
        "Expert": 0.88,
        "Intermediate": 1.02,
        "Novice": 1.25
    }
    
    tasks = []
    
    for i in range(1, 501):
        task_id = f"TSK-{1000 + i}"
        task_type = random.choice(TASK_TYPES)
        weather = random.choice(WEATHER_CONDITIONS)
        skill = random.choice(["Novice", "Intermediate", "Expert"])
        machine_age = round(random.uniform(0.8, 11.5), 1)
        
        # Nominal estimated time (planned target with typical 1.0 multipliers)
        nominal_base = base_times[task_type]
        # Introduce reasonable variance in the job estimate (+-10%)
        estimated_time = round(nominal_base * random.uniform(0.92, 1.08), 1)
        
        # Actual time generation using realistic physical correlations
        weather_factor = weather_multiplier[weather]
        skill_factor = skill_multiplier[skill]
        
        # Machine age penalty: older equipment has hydraulic seal degradation and throttle wear
        age_factor = 1.0 + max(0.0, (machine_age - 3.0) * 0.02)
        
        # Random noise / site unpredictability (+- 6%)
        noise = random.uniform(0.94, 1.06)
        
        actual_time = round(estimated_time * weather_factor * skill_factor * age_factor * noise, 1)
        
        tasks.append({
            "task_id": task_id,
            "task_type": task_type,
            "weather": weather,
            "operator_skill": skill,
            "machine_age_yrs": machine_age,
            "estimated_time_min": estimated_time,
            "actual_time_min": actual_time
        })
        
    df = pd.DataFrame(tasks)
    output_path = os.path.join(DATA_DIR, "task_log.csv")
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} task rows with realistic correlations at {output_path}")
    return df

if __name__ == "__main__":
    generate_telemetry_dataset()
    generate_task_dataset()
