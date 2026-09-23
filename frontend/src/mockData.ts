import {
  Operator,
  Machine,
  Telemetry,
  Task,
  RadarResponse,
  Incident,
  Scorecard,
  EstimateResult,
  MaintenanceData,
  TrainingModule,
  ShiftSummary,
  LeaderboardItem
} from './types';

export const MOCK_OPERATORS: Operator[] = [
  { id: "OP-401", name: "Dave Miller", skill: "Intermediate", machine_id: "CAT-336-EX01", badge: "Gold Tier", role: "Excavator Lead" },
  { id: "OP-402", name: "Sarah Jenkins", skill: "Expert", machine_id: "CAT-950-LD02", badge: "Master Operator", role: "Wheel Loader Lead" },
  { id: "OP-403", name: "Marcus Vance", skill: "Novice", machine_id: "CAT-336-EX01", badge: "Apprentice", role: "Junior Operator" },
  { id: "OP-404", name: "Elena Rostova", skill: "Expert", machine_id: "CAT-349-EX03", badge: "Site Veteran", role: "Heavy Trench Specialist" },
  { id: "OP-405", name: "Tom Chen", skill: "Intermediate", machine_id: "CAT-980-LD04", badge: "Silver Tier", role: "Quarry Loader" }
];

export const MOCK_MACHINES: Machine[] = [
  { id: "CAT-336-EX01", model: "Cat 336 Next Gen", type: "Excavator", weight_ton: 36.2, power_hp: 314, base_hours: 3432.4, age_yrs: 3.5 },
  { id: "CAT-950-LD02", model: "Cat 950M High Lift", type: "Wheel Loader", weight_ton: 19.5, power_hp: 250, base_hours: 5140.0, age_yrs: 5.0 },
  { id: "CAT-349-EX03", model: "Cat 349 Heavy Duty", type: "Excavator", weight_ton: 49.0, power_hp: 424, base_hours: 1820.0, age_yrs: 1.8 },
  { id: "CAT-980-LD04", model: "Cat 980XE Hybrid", type: "Wheel Loader", weight_ton: 30.5, power_hp: 393, base_hours: 7890.0, age_yrs: 8.2 }
];

export const MOCK_TELEMETRY: Telemetry = {
  operator_id: "OP-401",
  machine_id: "CAT-336-EX01",
  timestamp: new Date().toISOString(),
  engine_hours: 3432.4,
  fuel_used_L: 582.1,
  fuel_rate_lph: 24.5,
  load_cycles: 28,
  idling_time_min: 19.2,
  idling_ratio_pct: 32.0,
  seatbelt_status: "Fastened",
  safety_alert_triggered: false,
  engine_rpm: 1820,
  coolant_temp_c: 86.4,
  hydraulic_pressure_psi: 4850,
  battery_voltage_v: 24.8,
  eco_mode: false
};

export const MOCK_RADAR: RadarResponse = {
  status: "ACTIVE_SCANNING",
  objects: [
    { id: "OB-01", name: "Grade Checker (Mike P.)", type: "Personnel", distance_m: 4.2, angle_deg: 35, alert_level: "CRITICAL", speed_kmh: 2.1 },
    { id: "OB-02", name: "Service F-250 Truck", type: "Light Vehicle", distance_m: 8.6, angle_deg: 140, alert_level: "WARNING", speed_kmh: 6.4 },
    { id: "OB-03", name: "Trench Spoil Slope Edge", type: "Drop-off Hazard", distance_m: 12.4, angle_deg: 220, alert_level: "SAFE", speed_kmh: 0.0 },
    { id: "OB-04", name: "Overhead 33kV Line Stanchion", type: "Overhead Clearance", distance_m: 16.5, angle_deg: 310, alert_level: "SAFE", speed_kmh: 0.0 }
  ],
  closest_hazard: { id: "OB-01", name: "Grade Checker (Mike P.)", type: "Personnel", distance_m: 4.2, angle_deg: 35, alert_level: "CRITICAL", speed_kmh: 2.1 },
  danger_level: "CRITICAL",
  active_warnings: 2,
  timestamp: new Date().toISOString()
};

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-701",
    timestamp: "2026-09-23T08:14:20Z",
    operator_id: "OP-401",
    machine_id: "CAT-336-EX01",
    type: "PROXIMITY_HAZARD",
    severity: "CRITICAL",
    description: "Ground worker entered 3.8m swing radius blindspot near trench bank.",
    resolved: true,
    action_taken: "Cab proximity alarm triggered, swing brake automatically engaged."
  },
  {
    id: "INC-702",
    timestamp: "2026-09-23T10:42:05Z",
    operator_id: "OP-401",
    machine_id: "CAT-336-EX01",
    type: "IDLING_EXCESS",
    severity: "WARNING",
    description: "Continuous high-idle recorded for 42 minutes with hydraulic lockout disengaged.",
    resolved: true,
    action_taken: "AES (Auto-Engine Shutdown) advisory alert sent to cab display."
  }
];

export const MOCK_TASKS: Task[] = [
  {
    task_id: "TSK-TODAY-01",
    title: "Foundation Trenching - Zone B4",
    task_type: "Trenching",
    target_volume_m3: 180,
    weather: "Muddy/Wet",
    weather_risk: "HIGH",
    risk_explanation: "Saturated soil increases trench cave-in risk. Tracks require extra firm bedding.",
    nominal_time_min: 120,
    predicted_time_min: 165.6,
    priority: "HIGH",
    status: "In Progress",
    factors: [
      { factor: "Weather Condition", value: "Muddy/Wet", delta_min: 36.6, percentage: 28.3, impact: "delay", detail: "Soil adhesion and mud slip" },
      { factor: "Operator Skill Level", value: "Intermediate", delta_min: 0, percentage: 0, impact: "neutral", detail: "Standard speed" },
      { factor: "Equipment Age", value: "3.5 yrs", delta_min: 9.0, percentage: 7.5, impact: "delay", detail: "Minor hydraulic flow drop" }
    ]
  },
  {
    task_id: "TSK-TODAY-02",
    title: "Haul Truck Loading - Pit 2",
    task_type: "Truck Loading",
    target_volume_m3: 450,
    weather: "Muddy/Wet",
    weather_risk: "MEDIUM",
    risk_explanation: "Truck tire slippage at loading platform. Maintain 3-point bucket drop.",
    nominal_time_min: 45,
    predicted_time_min: 56.2,
    priority: "MEDIUM",
    status: "Pending"
  },
  {
    task_id: "TSK-TODAY-03",
    title: "South Retention Pond Slope Grading",
    task_type: "Slope Grading",
    target_volume_m3: 95,
    weather: "Muddy/Wet",
    weather_risk: "CRITICAL",
    risk_explanation: "Slope grading in wet mud causes lateral machine slide. Delay until dewatering passes.",
    nominal_time_min: 90,
    predicted_time_min: 132.0,
    priority: "CRITICAL",
    status: "Pending"
  },
  {
    task_id: "TSK-TODAY-04",
    title: "Crushed Aggregate Stockpile Rehandling",
    task_type: "Stockpile Rehandling",
    target_volume_m3: 320,
    weather: "Sunny",
    weather_risk: "LOW",
    risk_explanation: "Standard stable stockpile face. Eco-mode bucket float recommended.",
    nominal_time_min: 60,
    predicted_time_min: 61.2,
    priority: "LOW",
    status: "Completed"
  }
];

export const MOCK_SCORECARD: Scorecard = {
  operator_id: "OP-401",
  score: 87.5,
  grade: "A",
  status_text: "Site Safety Compliant",
  status_color: "green",
  idling_pct: 26.4,
  idling_benchmark_pct: 22.0,
  seatbelt_status: "Fastened",
  anomaly_flags: [
    {
      code: "IDLE_RATIO_ELEVATED",
      severity: "WARNING",
      message: "Current idling ratio is 26.4% (Threshold: 22.0%). Auto-Engine Shutdown recommended.",
      impact: "Wasting ~2.0 L/hr of diesel fuel during truck waiting queues."
    }
  ],
  trend_history: [
    { date: "Sep 18", score: 94.0, idling_pct: 18.2, seatbelt_violations: 0, safety_alerts: 0, load_cycles: 240 },
    { date: "Sep 19", score: 91.5, idling_pct: 21.0, seatbelt_violations: 0, safety_alerts: 0, load_cycles: 255 },
    { date: "Sep 20", score: 76.0, idling_pct: 38.5, seatbelt_violations: 1, safety_alerts: 1, load_cycles: 195 },
    { date: "Sep 21", score: 84.0, idling_pct: 28.0, seatbelt_violations: 0, safety_alerts: 0, load_cycles: 220 },
    { date: "Sep 22", score: 89.0, idling_pct: 23.5, seatbelt_violations: 0, safety_alerts: 0, load_cycles: 260 },
    { date: "Sep 23", score: 87.5, idling_pct: 26.4, seatbelt_violations: 0, safety_alerts: 0, load_cycles: 210 }
  ]
};

export const MOCK_ESTIMATE_RESULT: EstimateResult = {
  task_type: "Trenching",
  nominal_time_min: 120.0,
  predicted_time_min: 165.6,
  total_variance_min: 45.6,
  factors: [
    {
      factor: "Weather Condition",
      value: "Muddy/Wet",
      delta_min: 36.6,
      percentage: 28.3,
      impact: "delay",
      detail: "Severe undercarriage slippage, heavy bucket soil adhesion, trench cave-in hazard."
    },
    {
      factor: "Operator Skill Level",
      value: "Intermediate",
      delta_min: 0.0,
      percentage: 0.0,
      impact: "neutral",
      detail: "Standard operating velocity with regular grade verification checks."
    },
    {
      factor: "Equipment Age & Wear",
      value: "3.5 yrs",
      delta_min: 9.0,
      percentage: 7.5,
      impact: "delay",
      detail: "Hydraulic flow drop, linkage play, requiring slower fine-grade feathering."
    }
  ],
  model_metadata: {
    algorithm: "RandomForestRegressor + Counterfactual Ridge Explainer",
    r2_score: 0.956,
    mae_min: 8.66,
    training_samples: 400
  }
};

export const MOCK_MAINTENANCE: MaintenanceData = {
  machine_id: "CAT-336-EX01",
  current_engine_hours: 3432.4,
  next_service_hours: 3500.0,
  hours_to_next_service: 67.6,
  service_type: "500-Hour Hydraulic Fluid & Valve Lash Inspection",
  urgency: "APPROACHING",
  badge: "Service Due in <80 hrs",
  telemetry_health: {
    oil_life_pct: 74.0,
    hydraulic_filter_delta_bar: 0.82,
    hydraulic_filter_status: "NORMAL",
    air_filter_restriction_kpa: 2.8,
    track_shoe_wear_pct: 58.2
  },
  nudge_message: "Predictive Nudge: Based on current fuel burn and cycle duty, next 500-hr service window arrives in ~67.6 operating hours. Cat Certified tech scheduled."
};

export const MOCK_TRAINING_MODULES: TrainingModule[] = [
  {
    id: "CAT-TRN-101",
    title: "Excavator Pre-Shift Walkaround & Cab Ergonomics",
    category: "Pre-Operation Safety",
    duration_min: 12,
    thumbnail: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80",
    video_url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    summary: "Master the 360-degree daily walkaround inspection: hydraulic fluid levels, track tension, cab seatbelt sensors, and Grade Control display zeroing.",
    key_takeaways: [
      "Check track sag (standard 25-40mm for standard steel shoes)",
      "Verify hydraulic oil sight glass when stick cylinder is fully extended",
      "Ensure cab emergency egress hammer and primary seatbelt latch click engagement"
    ],
    badge_unlocked: "Pre-Flight Master",
    required_for: ["Excavator", "Wheel Loader"],
    completed: true
  },
  {
    id: "CAT-TRN-102",
    title: "Trenching Safety, Bench Heights & Cave-in Prevention",
    category: "Excavation Dynamics",
    duration_min: 18,
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    video_url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    summary: "OSHA Subpart P trenching standards. Proper boom placement relative to trench edge, surcharge load clearance, and spoil pile setbacks.",
    key_takeaways: [
      "Spoil pile must remain minimum 2.0 feet (0.61m) back from trench edge",
      "Never swing bucket over personnel or unprotected trench boxes",
      "Position tracks perpendicular to trench edge for maximum stability"
    ],
    badge_unlocked: "Trench Safety Pro",
    required_for: ["Excavator"],
    completed: true
  },
  {
    id: "CAT-TRN-103",
    title: "Cat Grade 3D Automation & Bucket Float Optimization",
    category: "Efficiency & Technology",
    duration_min: 15,
    thumbnail: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80",
    video_url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    summary: "Utilizing Cat Grade with 3D semi-autonomous digging to prevent over-excavation, save fuel, and achieve grade in a single pass.",
    key_takeaways: [
      "Set elevation targets on the in-cab display to lock boom depth",
      "Single-pass grade reduces cycle passes by up to 35%",
      "Engage bucket float on slope grading backfill to avoid gouging"
    ],
    badge_unlocked: "Precision Grader",
    required_for: ["Excavator"],
    completed: false
  },
  {
    id: "CAT-TRN-104",
    title: "Eco-Mode Idling Reduction & Fuel Conservation",
    category: "Sustainability & Cost",
    duration_min: 10,
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=600&q=80",
    video_url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    summary: "How excessive idling (>20 min/hr) degrades DPF regeneration and wastes 4.5L/hr. Leveraging Auto-Engine Idle Shutdown (AES).",
    key_takeaways: [
      "Engage Cat Auto-Idle (drops engine from 1800 to 1000 RPM after 5s inactive)",
      "Set Auto-Engine Shutdown timer to 3 minutes during extended haul waits",
      "Idling burns $8,200 in wasted diesel per machine annually"
    ],
    badge_unlocked: "Eco-Titan",
    required_for: ["Excavator", "Wheel Loader"],
    completed: false
  }
];

export const MOCK_SHIFT_SUMMARY: ShiftSummary = {
  shift_date: "Wednesday, September 23, 2026",
  operator_id: "OP-401",
  operator_name: "Dave Miller",
  machine_id: "CAT-336-EX01",
  shift_hours: 8.5,
  active_work_hours: 6.2,
  idling_hours: 2.3,
  idling_pct: 26.4,
  total_load_cycles: 248,
  fuel_burned_L: 190.4,
  eco_fuel_saved_L: 32.3,
  carbon_saved_kg: 86.5,
  tasks_completed: 1,
  tasks_total: 4,
  safety_score: 87.5,
  seatbelt_compliance_pct: 100.0,
  time_estimate_accuracy_pct: 94.2,
  signature_hash: "CAT-SIG-482910"
};

export const MOCK_LEADERBOARD: LeaderboardItem[] = [
  { rank: 1, operator_id: "OP-404", name: "Elena Rostova", skill: "Expert", machine_id: "CAT-349-EX03", badge: "Site Veteran", safety_score: 98.0, efficiency_score: 94.5, composite_score: 96.4, idling_pct: 14.2, total_cycles: 380, seatbelt_violations: 0 },
  { rank: 2, operator_id: "OP-402", name: "Sarah Jenkins", skill: "Expert", machine_id: "CAT-950-LD02", badge: "Master Operator", safety_score: 95.0, efficiency_score: 91.0, composite_score: 93.2, idling_pct: 17.5, total_cycles: 360, seatbelt_violations: 0 },
  { rank: 3, operator_id: "OP-401", name: "Dave Miller", skill: "Intermediate", machine_id: "CAT-336-EX01", badge: "Gold Tier", safety_score: 87.5, efficiency_score: 82.0, composite_score: 85.0, idling_pct: 26.4, total_cycles: 248, seatbelt_violations: 0 },
  { rank: 4, operator_id: "OP-405", name: "Tom Chen", skill: "Intermediate", machine_id: "CAT-980-LD04", badge: "Silver Tier", safety_score: 82.0, efficiency_score: 79.5, composite_score: 80.9, idling_pct: 28.5, total_cycles: 290, seatbelt_violations: 0 },
  { rank: 5, operator_id: "OP-403", name: "Marcus Vance", skill: "Novice", machine_id: "CAT-336-EX01", badge: "Apprentice", safety_score: 64.0, efficiency_score: 72.0, composite_score: 67.6, idling_pct: 34.0, total_cycles: 190, seatbelt_violations: 2 }
];
