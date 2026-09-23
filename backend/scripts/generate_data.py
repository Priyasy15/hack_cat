#!/usr/bin/env python3
"""
generate_data.py
Comprehensive synthetic dataset generator for CAT Smart Operator Assistant (OperatorOS).
Generates logically connected CSV and JSON files across:
- operators (including OP1001 - Arun)
- machines (Excavator, Wheel Loader, Haul Truck, Dozer; Diesel & Electric)
- tasks with priority and scheduling
- telemetry_log (500+ rows spanning 8+ days per operator, correlated physics)
- environment (weather, ambient noise dB, visibility)
- safety_events (with response times and resolution)
- proximity_tracking (personnel coordinates, blind spots, zones)
- training_modules & training_records
- safety_score (daily multi-pillar score history)
"""

import os
import json
import random
import datetime
import numpy as np
import pandas as pd

np.random.seed(42)
random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# 1. OPERATORS
OPERATORS = [
    {
        "operator_id": "OP1001",
        "name": "Arun Kumar",
        "role": "Lead Excavator Specialist",
        "skill_level": "Advanced",
        "experience_hours": 4850,
        "assigned_machine_id": "CAT-336-EX01"
    },
    {
        "operator_id": "OP1002",
        "name": "Sarah Jenkins",
        "role": "Wheel Loader Master",
        "skill_level": "Advanced",
        "experience_hours": 5200,
        "assigned_machine_id": "CAT-950-LD02"
    },
    {
        "operator_id": "OP1003",
        "name": "Marcus Vance",
        "role": "Apprentice Operator",
        "skill_level": "Beginner",
        "experience_hours": 420,
        "assigned_machine_id": "CAT-336-EX01"
    },
    {
        "operator_id": "OP1004",
        "name": "Elena Rostova",
        "role": "Heavy Trench & Quarry Lead",
        "skill_level": "Advanced",
        "experience_hours": 6400,
        "assigned_machine_id": "CAT-349-EX03"
    },
    {
        "operator_id": "OP1005",
        "name": "Tom Chen",
        "role": "Haul Truck & Earthmover Operator",
        "skill_level": "Intermediate",
        "experience_hours": 2150,
        "assigned_machine_id": "CAT-777-HT05"
    }
]

# 2. MACHINES
MACHINES = [
    {
        "machine_id": "CAT-336-EX01",
        "machine_type": "Excavator",
        "power_type": "Diesel",
        "site_type": "Infrastructure Trenching",
        "model": "Cat 336 Next Gen",
        "operating_hours": 3432.5,
        "machine_condition": "Optimal",
        "swing_radius_m": 7.2,
        "danger_zone_m": 4.5,
        "caution_zone_m": 9.0
    },
    {
        "machine_id": "CAT-950-LD02",
        "machine_type": "Wheel Loader",
        "power_type": "Diesel",
        "site_type": "Pit Aggregate Loading",
        "model": "Cat 950M High Lift",
        "operating_hours": 5140.0,
        "machine_condition": "Good",
        "swing_radius_m": 4.0,
        "danger_zone_m": 5.0,
        "caution_zone_m": 10.0
    },
    {
        "machine_id": "CAT-349-EX03",
        "machine_type": "Excavator",
        "power_type": "Electric",
        "site_type": "Urban Tunneling",
        "model": "Cat 349E Tethered Electric",
        "operating_hours": 1820.0,
        "machine_condition": "Optimal",
        "swing_radius_m": 8.0,
        "danger_zone_m": 5.0,
        "caution_zone_m": 10.5
    },
    {
        "machine_id": "CAT-D8T-DZ04",
        "machine_type": "Dozer",
        "power_type": "Diesel",
        "site_type": "Overburden Stripping",
        "model": "Cat D8T Track-Type Tractor",
        "operating_hours": 4210.0,
        "machine_condition": "Good",
        "swing_radius_m": 3.5,
        "danger_zone_m": 4.0,
        "caution_zone_m": 8.5
    },
    {
        "machine_id": "CAT-777-HT05",
        "machine_type": "Haul Truck",
        "power_type": "Electric",
        "site_type": "Quarry Haulage",
        "model": "Cat 777XE Battery-Electric",
        "operating_hours": 1150.0,
        "machine_condition": "Optimal",
        "swing_radius_m": 5.5,
        "danger_zone_m": 6.0,
        "caution_zone_m": 12.0
    }
]

# 3. TRAINING MODULES
TRAINING_MODULES = [
    {
        "module_id": "TRN-PROX-101",
        "module_name": "Blind Spot Awareness & Proximity Defenses",
        "applicable_role": "All Operators",
        "applicable_machine": "All Heavy Equipment",
        "skill_level": "All Levels",
        "duration": "8 min",
        "skill_area": "Proximity Safety",
        "description": "Strategies to actively mitigate ground-personnel blind spots, utilize dual-mirror scanning, and execute audible swing warnings."
    },
    {
        "module_id": "TRN-IDLE-202",
        "module_name": "Efficient Machine Operation & Idling Elimination",
        "applicable_role": "Excavator & Loader Leads",
        "applicable_machine": "Excavator, Wheel Loader",
        "skill_level": "Intermediate",
        "duration": "10 min",
        "skill_area": "Fuel & Eco-Efficiency",
        "description": "Understanding Cat Auto-Engine Shutdown (AES), feathering hydraulics to prevent cavitation, and saving 4.5L/hr diesel."
    },
    {
        "module_id": "TRN-STAB-303",
        "module_name": "Slope Stability & Dynamic Rollover Prevention",
        "applicable_role": "Excavator & Dozer Specialists",
        "applicable_machine": "Excavator, Dozer",
        "skill_level": "Advanced",
        "duration": "12 min",
        "skill_area": "Stability Control",
        "description": "Safe track positioning perpendicular to grade cuts, center-of-gravity shifts during full bucket extension, and wet mud benching."
    },
    {
        "module_id": "TRN-SMTH-404",
        "module_name": "Compound Bucket Motions & Smooth Cycle Mastery",
        "applicable_role": "Junior & Intermediate Operators",
        "applicable_machine": "Excavator, Wheel Loader",
        "skill_level": "Beginner",
        "duration": "15 min",
        "skill_area": "Smooth Operation",
        "description": "Reducing peak G-force telemetry, avoiding hard stops against hydraulic cylinder end-stops, and increasing component lifespan by 40%."
    }
]

def generate_all_datasets():
    # Save Operators & Machines JSON
    with open(os.path.join(DATA_DIR, "operators.json"), "w", encoding="utf-8") as f:
        json.dump(OPERATORS, f, indent=2)
    pd.DataFrame(OPERATORS).to_csv(os.path.join(DATA_DIR, "operators.csv"), index=False)

    with open(os.path.join(DATA_DIR, "machines.json"), "w", encoding="utf-8") as f:
        json.dump(MACHINES, f, indent=2)
    pd.DataFrame(MACHINES).to_csv(os.path.join(DATA_DIR, "machines.csv"), index=False)

    with open(os.path.join(DATA_DIR, "training_modules.json"), "w", encoding="utf-8") as f:
        json.dump(TRAINING_MODULES, f, indent=2)

    # 4. TASKS LOG
    task_types = [
        ("Foundation Trenching", "Zone B - West Sector", "High", 70.0),
        ("Mass Quarry Excavation", "Pit 3 - Deep Bench", "Critical", 120.0),
        ("Haul Truck Loading", "Pit 2 Haul Ramp", "Medium", 45.0),
        ("Slope Grading & Compaction", "South Retention Pond", "Critical", 85.0),
        ("Stockpile Material Rehandling", "Crusher Feed Point A", "Low", 50.0),
        ("Stormwater Drainage Pipe Laying", "North Perimeter Road", "High", 95.0),
        ("Overburden Stripping", "East Expansion Ridge", "High", 110.0),
        ("Culvert Trench Backfilling", "Section 4 Access Road", "Medium", 60.0)
    ]

    tasks = []
    base_date = datetime.date(2026, 9, 14)
    task_counter = 101

    for day_idx in range(10):
        c_date = base_date + datetime.timedelta(days=day_idx)
        for op in OPERATORS:
            # 2 to 3 tasks per day per operator
            for t_idx in range(random.randint(2, 3)):
                t_def = random.choice(task_types)
                t_id = f"TSK-{task_counter}"
                task_counter += 1
                
                # Correlated duration
                nominal = t_def[3]
                # weather effect
                weather_choice = random.choice(["Sunny", "Rain", "Muddy/Wet", "High Wind"])
                weather_mult = 1.0
                if weather_choice == "Rain": weather_mult = 1.25
                elif weather_choice == "Muddy/Wet": weather_mult = 1.38
                elif weather_choice == "High Wind": weather_mult = 1.15

                # skill effect
                skill_mult = 0.90 if op["skill_level"] == "Advanced" else (1.02 if op["skill_level"] == "Intermediate" else 1.25)
                
                actual_duration = round(nominal * weather_mult * skill_mult * random.uniform(0.95, 1.05), 1)
                
                start_h = 7 + t_idx * 3
                start_time = datetime.datetime(c_date.year, c_date.month, c_date.day, start_h, random.randint(0, 15))
                end_time = start_time + datetime.timedelta(minutes=int(actual_duration))

                tasks.append({
                    "task_id": t_id,
                    "operator_id": op["operator_id"],
                    "machine_id": op["assigned_machine_id"],
                    "task_type": t_def[0],
                    "location": t_def[1],
                    "priority": t_def[2],
                    "weather": weather_choice,
                    "nominal_duration_min": nominal,
                    "scheduled_time": start_time.isoformat() + "Z",
                    "actual_start": start_time.isoformat() + "Z",
                    "actual_end": end_time.isoformat() + "Z",
                    "actual_duration": actual_duration
                })

    tasks_df = pd.DataFrame(tasks)
    tasks_df.to_csv(os.path.join(DATA_DIR, "task_log.csv"), index=False)
    with open(os.path.join(DATA_DIR, "tasks.json"), "w", encoding="utf-8") as f:
        json.dump(tasks[:25], f, indent=2)

    # 5. TELEMETRY & ENVIRONMENT (500+ correlated rows spanning 10 days)
    telemetry_rows = []
    environment_rows = []
    safety_events = []
    proximity_rows = []

    event_id_counter = 501

    for op in OPERATORS:
        op_id = op["operator_id"]
        m_id = op["assigned_machine_id"]
        mach_meta = next(m for m in MACHINES if m["machine_id"] == m_id)
        is_electric = mach_meta["power_type"] == "Electric"

        cum_hours = mach_meta["operating_hours"]
        cum_fuel = 480.0
        cum_energy_kwh = 1250.0
        battery_soc = 92.0

        for day_offset in range(10):
            current_date = base_date + datetime.timedelta(days=day_offset)
            
            # Weather for this day
            daily_weather = random.choice(["Sunny", "Rain", "Muddy/Wet", "High Wind"])
            daily_rainfall_mm = 0.0 if daily_weather == "Sunny" else (random.uniform(4.5, 18.0) if "Rain" in daily_weather else 8.5)
            daily_temp = random.uniform(14.0, 26.0)
            daily_wind = random.uniform(5.0, 32.0)
            ground_cond = "Firm Dry" if daily_weather == "Sunny" else ("Soft Mud / Slippery" if "Mud" in daily_weather or "Rain" in daily_weather else "Gravel")

            for hour_step in range(7, 18):
                ts = datetime.datetime(current_date.year, current_date.month, current_date.day, hour_step, random.randint(2, 58), 0)
                cum_hours += round(random.uniform(0.82, 0.98), 2)
                
                # Ambient Noise Level in dB (Crucial for Multimodal Alerting)
                # Normal excavation is 68-78 dB, Heavy hammer / rock blasting is 86-94 dB
                ambient_noise = round(random.uniform(62.0, 89.0), 1)
                
                # Operator tendencies
                seatbelt = "Fastened"
                idle_min = random.uniform(10.0, 21.0)
                speed = random.uniform(0.8, 4.5) if mach_meta["machine_type"] != "Haul Truck" else random.uniform(12.0, 28.0)
                load_pct = random.uniform(45.0, 88.0)
                cycles = random.randint(18, 34)

                # Tilt & Slope
                slope_deg = round(random.uniform(2.0, 11.0), 1)
                tilt_deg = round(random.uniform(1.0, slope_deg + random.uniform(0.5, 3.5)), 1)
                
                # Energy/Fuel
                if is_electric:
                    energy_burn = round(random.uniform(22.0, 38.0), 1)
                    cum_energy_kwh += energy_burn
                    battery_soc = max(18.0, battery_soc - (energy_burn / 250.0) * 100.0)
                    charging_status = "Discharging"
                    fuel_used = 0.0
                else:
                    fuel_burn = round(random.uniform(18.0, 32.0), 1)
                    cum_fuel += fuel_burn
                    charging_status = "N/A"
                    energy_burn = 0.0

                # Injected anomalies for specific operators
                # Marcus (Beginner) has occasional seatbelt slips
                if op_id == "OP1003" and random.random() < 0.28:
                    seatbelt = "Unfastened"

                # Tom Chen or Arun on day 3 has high idling test
                if op_id == "OP1001" and day_offset in [3, 6] and hour_step in [11, 13]:
                    idle_min = random.uniform(38.0, 48.0)
                    cycles = random.randint(4, 9)

                telemetry_rows.append({
                    "timestamp": ts.isoformat() + "Z",
                    "machine_id": m_id,
                    "operator_id": op_id,
                    "task_id": f"TSK-{random.randint(101, 130)}",
                    "speed": round(speed, 1),
                    "load": round(load_pct, 1),
                    "cycle_count": cycles,
                    "idle_time": round(idle_min, 1),
                    "fuel_used": round(cum_fuel, 1),
                    "energy_used": round(cum_energy_kwh, 1),
                    "engine_temperature": round(random.uniform(82.0, 91.5), 1),
                    "machine_tilt": tilt_deg,
                    "slope": slope_deg,
                    "acceleration": round(random.uniform(0.2, 1.4), 2),
                    "braking": round(random.uniform(0.1, 1.2), 2),
                    "seatbelt_status": seatbelt,
                    "hydraulic_pressure": round(random.uniform(4200, 4950), 0),
                    "battery_soc": round(battery_soc, 1) if is_electric else 100.0,
                    "battery_temperature": round(random.uniform(32.0, 42.0), 1) if is_electric else 0.0,
                    "charging_status": charging_status
                })

                environment_rows.append({
                    "timestamp": ts.isoformat() + "Z",
                    "location": "North Trench Sector B",
                    "temperature": round(daily_temp, 1),
                    "rainfall": round(daily_rainfall_mm, 1),
                    "visibility": "Moderate (Rain Haze)" if daily_rainfall_mm > 8 else "Optimal Clear",
                    "wind_speed": round(daily_wind, 1),
                    "ground_condition": ground_cond,
                    "terrain_slope": slope_deg,
                    "ambient_noise_level": ambient_noise
                })

                # Proximity Tracking and Safety Events
                # Every few intervals, simulate personnel proximity
                if random.random() < 0.22:
                    dist = round(random.uniform(3.2, 14.5), 1)
                    angle = random.randint(0, 359)
                    in_blind_spot = (angle >= 135 and angle <= 225) # Rear excavator blind spot
                    zone = "CRITICAL" if dist < 5.0 else ("CAUTION" if dist < 9.0 else "SAFE")
                    
                    person_speed = round(random.uniform(1.2, 4.5), 1)

                    proximity_rows.append({
                        "timestamp": ts.isoformat() + "Z",
                        "machine_id": m_id,
                        "person_id": f"P-{random.randint(101, 108)} (Site Worker)",
                        "person_x": round(dist * np.sin(np.radians(angle)), 2),
                        "person_y": round(dist * np.cos(np.radians(angle)), 2),
                        "machine_x": 0.0,
                        "machine_y": 0.0,
                        "machine_heading": random.randint(0, 360),
                        "person_speed": person_speed,
                        "distance": dist,
                        "relative_direction": angle,
                        "zone": zone,
                        "blind_spot_status": in_blind_spot
                    })

                    # If critical or caution, record safety event
                    if zone in ["CRITICAL", "CAUTION"] or seatbelt == "Unfastened":
                        event_type = "PROXIMITY_HAZARD" if zone in ["CRITICAL", "CAUTION"] else "SEATBELT_NONCOMPLIANCE"
                        severity = "Critical" if (zone == "CRITICAL" or seatbelt == "Unfastened") else "Warning"
                        resp_time = round(random.uniform(1.8, 4.2), 1)
                        
                        safety_events.append({
                            "event_id": f"EVT-{event_id_counter}",
                            "timestamp": ts.isoformat() + "Z",
                            "operator_id": op_id,
                            "machine_id": m_id,
                            "event_type": event_type,
                            "severity": severity,
                            "distance_to_person": dist if event_type == "PROXIMITY_HAZARD" else 0.0,
                            "machine_speed": round(speed, 1),
                            "response_time": resp_time,
                            "alert_acknowledged": True,
                            "acknowledgement_time": (ts + datetime.timedelta(seconds=int(resp_time))).isoformat() + "Z",
                            "resolution_time": (ts + datetime.timedelta(seconds=int(resp_time + 4.5))).isoformat() + "Z",
                            "resolved": True
                        })
                        event_id_counter += 1

    # Save Telemetry, Environment, Events
    pd.DataFrame(telemetry_rows).to_csv(os.path.join(DATA_DIR, "telemetry_log.csv"), index=False)
    pd.DataFrame(environment_rows).to_csv(os.path.join(DATA_DIR, "environment.csv"), index=False)
    
    with open(os.path.join(DATA_DIR, "safety_events.json"), "w", encoding="utf-8") as f:
        json.dump(safety_events, f, indent=2)

    with open(os.path.join(DATA_DIR, "proximity_tracking.json"), "w", encoding="utf-8") as f:
        json.dump(proximity_rows, f, indent=2)

    # 6. TRAINING RECORDS (Includes Before & After metric improvements!)
    training_records = [
        {
            "operator_id": "OP1001",
            "module_id": "TRN-PROX-101",
            "module_name": "Blind Spot Awareness & Proximity Defenses",
            "assigned_reason": "Proximity Sensor Caution Trigger on Sep 17",
            "assigned_date": "2026-09-17T09:30:00Z",
            "completion_status": "Completed",
            "assessment_score": 96.0,
            "completion_date": "2026-09-17T17:15:00Z",
            "pre_training_violations": 4,
            "post_training_violations": 1,
            "improvement_pct": 75.0
        },
        {
            "operator_id": "OP1001",
            "module_id": "TRN-IDLE-202",
            "module_name": "Efficient Machine Operation & Idling Elimination",
            "assigned_reason": "Idling Ratio flagged above 28% threshold on Sep 19",
            "assigned_date": "2026-09-19T14:00:00Z",
            "completion_status": "Assigned",
            "assessment_score": None,
            "completion_date": None,
            "pre_training_violations": 3,
            "post_training_violations": 0,
            "improvement_pct": 0.0
        },
        {
            "operator_id": "OP1003",
            "module_id": "TRN-SMTH-404",
            "module_name": "Compound Bucket Motions & Smooth Cycle Mastery",
            "assigned_reason": "Excessive G-force swing braking detected",
            "assigned_date": "2026-09-18T10:00:00Z",
            "completion_status": "Completed",
            "assessment_score": 88.0,
            "completion_date": "2026-09-18T18:00:00Z",
            "pre_training_violations": 6,
            "post_training_violations": 2,
            "improvement_pct": 66.7
        }
    ]
    with open(os.path.join(DATA_DIR, "training_records.json"), "w", encoding="utf-8") as f:
        json.dump(training_records, f, indent=2)

    # 7. MULTI-PILLAR SAFETY SCORES (Over 7+ calendar days)
    safety_score_rows = []
    for op in OPERATORS:
        op_id = op["operator_id"]
        for day_offset in range(8):
            s_date = base_date + datetime.timedelta(days=day_offset)
            
            # Base scores
            base_seatbelt = 100.0 if op_id != "OP1003" else random.choice([80.0, 85.0, 95.0, 100.0])
            base_prox = 94.0 if op_id in ["OP1001", "OP1002", "OP1004"] else 82.0
            base_stab = random.uniform(88.0, 98.0)
            base_smooth = random.uniform(85.0, 96.0)

            overall_safety = round(0.30 * base_seatbelt + 0.30 * base_prox + 0.20 * base_stab + 0.20 * base_smooth, 1)

            safety_score_rows.append({
                "operator_id": op_id,
                "date": s_date.strftime("%Y-%m-%d"),
                "date_display": s_date.strftime("%b %d"),
                "safety_score": overall_safety,
                "seatbelt_score": round(base_seatbelt, 1),
                "proximity_score": round(base_prox, 1),
                "stability_score": round(base_stab, 1),
                "smooth_operation_score": round(base_smooth, 1)
            })

    pd.DataFrame(safety_score_rows).to_csv(os.path.join(DATA_DIR, "safety_score.csv"), index=False)
    print(f"[generate_data.py] Successfully generated complete dataset suite in {DATA_DIR}")

if __name__ == "__main__":
    generate_all_datasets()
