import {
  Operator,
  Machine,
  LiveTelemetry,
  AdaptiveTask,
  RadarResponse,
  MapEntities,
  SafetyEvent,
  EventReplay,
  AnomalyReport,
  PersonalizedTraining,
  TrainingEffectiveness,
  ScorecardData,
  ShiftRecap
} from '../types';

export const MOCK_OPERATORS: Operator[] = [
  { operator_id: "OP1001", name: "Arun Kumar", role: "Lead Excavator Specialist", skill_level: "Advanced", experience_hours: 4850, assigned_machine_id: "CAT-336-EX01" },
  { operator_id: "OP1002", name: "Sarah Jenkins", role: "Wheel Loader Master", skill_level: "Advanced", experience_hours: 5200, assigned_machine_id: "CAT-950-LD02" },
  { operator_id: "OP1003", name: "Marcus Vance", role: "Apprentice Operator", skill_level: "Beginner", experience_hours: 420, assigned_machine_id: "CAT-336-EX01" },
  { operator_id: "OP1004", name: "Elena Rostova", role: "Heavy Trench & Quarry Lead", skill_level: "Advanced", experience_hours: 6400, assigned_machine_id: "CAT-349-EX03" },
  { operator_id: "OP1005", name: "Tom Chen", role: "Haul Truck & Earthmover Operator", skill_level: "Intermediate", experience_hours: 2150, assigned_machine_id: "CAT-777-HT05" }
];

export const MOCK_MACHINES: Machine[] = [
  { machine_id: "CAT-336-EX01", machine_type: "Excavator", power_type: "Diesel", site_type: "Infrastructure Trenching", model: "Cat 336 Next Gen", operating_hours: 3432.5, machine_condition: "Optimal", swing_radius_m: 7.2, danger_zone_m: 4.5, caution_zone_m: 9.0 },
  { machine_id: "CAT-950-LD02", machine_type: "Wheel Loader", power_type: "Diesel", site_type: "Pit Aggregate Loading", model: "Cat 950M High Lift", operating_hours: 5140.0, machine_condition: "Good", swing_radius_m: 4.0, danger_zone_m: 5.0, caution_zone_m: 10.0 },
  { machine_id: "CAT-349-EX03", machine_type: "Excavator", power_type: "Electric", site_type: "Urban Tunneling", model: "Cat 349E Tethered Electric", operating_hours: 1820.0, machine_condition: "Optimal", swing_radius_m: 8.0, danger_zone_m: 5.0, caution_zone_m: 10.5 },
  { machine_id: "CAT-D8T-DZ04", machine_type: "Dozer", power_type: "Diesel", site_type: "Overburden Stripping", model: "Cat D8T Track-Type Tractor", operating_hours: 4210.0, machine_condition: "Good", swing_radius_m: 3.5, danger_zone_m: 4.0, caution_zone_m: 8.5 },
  { machine_id: "CAT-777-HT05", machine_type: "Haul Truck", power_type: "Electric", site_type: "Quarry Haulage", model: "Cat 777XE Battery-Electric", operating_hours: 1150.0, machine_condition: "Optimal", swing_radius_m: 5.5, danger_zone_m: 6.0, caution_zone_m: 12.0 }
];

export const MOCK_TELEMETRY: LiveTelemetry = {
  timestamp: new Date().toISOString(),
  operator_id: "OP1001",
  machine_id: "CAT-336-EX01",
  machine_type: "Excavator",
  power_type: "Diesel",
  model: "Cat 336 Next Gen",
  speed_kmh: 2.4,
  engine_hours: 3432.5,
  seatbelt_status: "Fastened",
  idle_time_min: 18.5,
  idling_ratio_pct: 30.8,
  ambient_noise_db: 74.0,
  alert_modality: "VISUAL_AUDIO_HIGH",
  modality_label: "🔊 HIGH-CONTRAST VISUAL + ELEVATED AUDIO TONE",
  fuel_level_pct: 74.0,
  battery_soc: null,
  battery_temperature_c: null,
  hydraulic_pressure_psi: 4820,
  engine_temp_c: 87.2,
  machine_tilt_deg: 8.4,
  terrain_slope_deg: 7.5,
  stability_risk_score: 58.2,
  stability_risk_level: "WARNING",
  active_warnings: 0
};

export const MOCK_RADAR: RadarResponse = {
  timestamp: new Date().toISOString(),
  machine_model: "Cat 336 Next Gen",
  swing_radius_m: 7.2,
  danger_zone_radius_m: 4.5,
  caution_zone_radius_m: 9.0,
  danger_level: "CAUTION",
  closest_hazard: {
    id: "P-101",
    name: "Mike P. (Grade Checker)",
    type: "Personnel",
    distance_m: 5.8,
    angle_deg: 165,
    speed_kmh: 2.2,
    heading_deg: 345,
    seconds_to_impact: 7.5,
    in_blind_spot: true,
    zone: "CAUTION",
    alert_level: "Caution",
    recommended_action: "Auto-swing brake engagement standby. Sound horn."
  },
  person_in_blind_spot: true,
  objects: [
    {
      id: "P-101",
      name: "Mike P. (Grade Checker)",
      type: "Personnel",
      distance_m: 5.8,
      angle_deg: 165,
      speed_kmh: 2.2,
      heading_deg: 345,
      seconds_to_impact: 7.5,
      in_blind_spot: true,
      zone: "CAUTION",
      alert_level: "Caution",
      recommended_action: "Auto-swing brake engagement standby. Sound horn."
    },
    {
      id: "V-202",
      name: "Haul Truck #4 (Approaching Ramp)",
      type: "Heavy Vehicle",
      distance_m: 8.8,
      angle_deg: 45,
      speed_kmh: 12.0,
      heading_deg: 225,
      seconds_to_impact: 11.2,
      in_blind_spot: false,
      zone: "CAUTION",
      alert_level: "Caution",
      recommended_action: "Maintain bucket elevation above truck bed rim."
    }
  ]
};

export const MOCK_MAP_ENTITIES: MapEntities = {
  machine: {
    id: "CAT-336-EX01",
    model: "Cat 336 Next Gen",
    x: 0.0,
    y: 0.0,
    heading_deg: 65,
    swing_radius_m: 7.2,
    danger_zone_m: 4.5,
    caution_zone_m: 9.0,
    blind_spot_angles: { start: 195, end: 295 }
  },
  personnel: [
    { id: "P-101", name: "Mike P. (Grade Checker)", x: -2.8, y: -4.2, vx: 0.4, vy: 0.6, distance_m: 5.8, zone: "CAUTION", in_blind_spot: true },
    { id: "P-102", name: "Sarah T. (Surveyor)", x: 8.5, y: 6.2, vx: -0.2, vy: 0.1, distance_m: 10.5, zone: "SAFE", in_blind_spot: false }
  ],
  site_boundary: { width_m: 40.0, height_m: 40.0 }
};

export const MOCK_TASKS: AdaptiveTask[] = [
  {
    task_id: "TSK-101",
    title: "Foundation Trenching - Zone B4",
    task_type: "Foundation Trenching",
    location: "Zone B - West Sector",
    priority: "High",
    scheduled_time: "08:00 - 09:15",
    weather: "Muddy/Wet",
    status: "In Progress",
    nominal_duration_min: 70.0,
    predicted_duration_min: 88.0,
    confidence_margin_min: 10,
    display_prediction: "88 ± 10 min",
    factors: [
      { factor: "Weather (Muddy/Wet)", delta_min: 26.6, percentage: 38.0, impact: "delay", detail: "Wet ground slippage and bucket mud adhesion" },
      { factor: "Operator Skill (Advanced)", delta_min: -7.0, percentage: -10.0, impact: "accelerated", detail: "Advanced compound joystick mastery" },
      { factor: "Equipment Age (3.5 yrs)", delta_min: 1.2, percentage: 1.7, impact: "delay", detail: "Hydraulic seal flow rate" }
    ],
    weather_reschedule_recommended: false,
    recommended_action: "Proceed with standard cycle speed"
  },
  {
    task_id: "TSK-102",
    title: "South Retention Pond Slope Grading",
    task_type: "Slope Grading & Compaction",
    location: "South Retention Pond",
    priority: "Critical",
    scheduled_time: "09:30 - 11:00",
    weather: "Muddy/Wet",
    status: "Pending",
    nominal_duration_min: 85.0,
    predicted_duration_min: 114.0,
    confidence_margin_min: 12,
    display_prediction: "114 ± 12 min",
    factors: [
      { factor: "Weather (Muddy/Wet)", delta_min: 32.3, percentage: 38.0, impact: "delay", detail: "High lateral slide hazard on wet mud slopes" }
    ],
    weather_reschedule_recommended: true,
    recommended_action: "Hold until track dewatering passes"
  }
];

export const MOCK_SAFETY_EVENTS: SafetyEvent[] = [
  {
    event_id: "EVT-704",
    timestamp: "2026-09-23T10:42:06Z",
    operator_id: "OP1001",
    machine_id: "CAT-336-EX01",
    event_type: "PROXIMITY_HAZARD",
    severity: "Critical",
    distance_to_person: 4.2,
    machine_speed: 2.4,
    response_time: 3.2,
    alert_acknowledged: true,
    resolved: true
  }
];

export const MOCK_EVENT_REPLAY: EventReplay = {
  event_id: "EVT-REPLAY-704",
  title: "Ground Personnel Blind Spot Proximity Incident",
  total_duration_sec: 12.0,
  operator_response_time_sec: 3.2,
  timeline_steps: [
    {
      time_offset_sec: 0.0,
      timestamp_label: "10:42:01",
      stage: "DETECT",
      description: "LiDAR detects moving worker entering 9.0m caution perimeter.",
      distance_m: 8.8,
      zone: "CAUTION",
      operator_action: "Normal swing rotation (8.2 RPM)",
      alert_state: "🟡 Caution Chime Sounded"
    },
    {
      time_offset_sec: 5.0,
      timestamp_label: "10:42:06",
      stage: "CRITICAL_ALERT",
      description: "Worker walks into rear excavator blind spot at 4.2m. Distance closes rapidly.",
      distance_m: 4.2,
      zone: "CRITICAL",
      operator_action: "Audible cab beacon triggers, haptic vibration pulse sent.",
      alert_state: "🔴 Critical Proximity Alarm"
    },
    {
      time_offset_sec: 8.2,
      timestamp_label: "10:42:09.2",
      stage: "CORRECTIVE_ACTION",
      description: "Operator Arun acknowledges alert and applies emergency swing lock brake.",
      distance_m: 3.4,
      zone: "STOPPED",
      operator_action: "Swing brake locked. Machine brought to complete stop in 3.2 sec.",
      alert_state: "🟢 Hazard Neutralized • E-Stop Engaged"
    },
    {
      time_offset_sec: 12.0,
      timestamp_label: "10:42:13",
      stage: "LOG_&_LEARN",
      description: "Worker clears perimeter. Telemetry incident logged and sent to site dashboard.",
      distance_m: 9.5,
      zone: "CLEAR",
      operator_action: "Safe clearance confirmed via rear camera.",
      alert_state: "✅ Perimeter Verified Safe"
    }
  ]
};

export const MOCK_ANOMALY_REPORT: AnomalyReport = {
  is_anomaly: false,
  overall_severity: "Safe",
  anomaly_count: 0,
  anomalies: [],
  recommended_training: null,
  benchmark_idle_min: 18.0,
  current_idle_min: 18.5
};

export const MOCK_PERSONALIZED_TRAINING: PersonalizedTraining = {
  operator_id: "OP1001",
  recommendations: [
    {
      trigger_reason: "Blind Spot Proximity Incident History",
      module_id: "TRN-PROX-101",
      module_name: "Blind Spot Awareness & Proximity Defenses",
      duration: "8 min",
      urgency: "Medium"
    }
  ],
  all_modules: [
    {
      module_id: "TRN-PROX-101",
      module_name: "Blind Spot Awareness & Proximity Defenses",
      applicable_role: "All Operators",
      applicable_machine: "All Heavy Equipment",
      skill_level: "All Levels",
      duration: "8 min",
      skill_area: "Proximity Safety",
      description: "Strategies to actively mitigate ground-personnel blind spots, utilize dual-mirror scanning, and execute audible swing warnings.",
      completed: true
    },
    {
      module_id: "TRN-IDLE-202",
      module_name: "Efficient Machine Operation & Idling Elimination",
      applicable_role: "Excavator & Loader Leads",
      applicable_machine: "Excavator, Wheel Loader",
      skill_level: "Intermediate",
      duration: "10 min",
      skill_area: "Fuel & Eco-Efficiency",
      description: "Understanding Cat Auto-Engine Shutdown (AES), feathering hydraulics to prevent cavitation, and saving 4.5L/hr diesel.",
      completed: false
    }
  ],
  records: [
    {
      operator_id: "OP1001",
      module_id: "TRN-PROX-101",
      module_name: "Blind Spot Awareness & Proximity Defenses",
      assigned_reason: "Proximity Sensor Caution Trigger on Sep 17",
      assigned_date: "2026-09-17T09:30:00Z",
      completion_status: "Completed",
      assessment_score: 96.0,
      completion_date: "2026-09-17T17:15:00Z",
      pre_training_violations: 4,
      post_training_violations: 1,
      improvement_pct: 75.0
    }
  ]
};

export const MOCK_TRAINING_EFFECTIVENESS: TrainingEffectiveness = {
  title: "Measured Behavioral Safety & Efficiency Improvement",
  overall_improvement_pct: 75.0,
  metrics: [
    {
      category: "Blind Spot Proximity Violations",
      pre_training_value: 4.0,
      post_training_value: 1.0,
      unit: "events / 5 tasks",
      reduction_pct: 75.0,
      status: "Significant Safety Gain"
    },
    {
      category: "Shift Idling Ratio",
      pre_training_value: 34.2,
      post_training_value: 19.5,
      unit: "% of operating time",
      reduction_pct: 43.0,
      status: "Diesel Saved (~4.8 L/shift)"
    },
    {
      category: "Operator Response Time to Alerts",
      pre_training_value: 5.4,
      post_training_value: 3.2,
      unit: "seconds to brake engagement",
      reduction_pct: 40.7,
      status: "Faster Emergency Reaction"
    }
  ]
};

export const MOCK_SCORECARD: ScorecardData = {
  operator_id: "OP1001",
  composite_safety_score: 92.5,
  grade: "A",
  sub_scores: {
    seatbelt_compliance: 100.0,
    proximity_awareness: 92.0,
    machine_stability: 94.0,
    smooth_operation: 90.0
  },
  trend: [
    { date: "Sep 18", score: 94.0, seatbelt: 100, proximity: 95, stability: 92, smoothness: 89 },
    { date: "Sep 19", score: 92.0, seatbelt: 100, proximity: 90, stability: 94, smoothness: 91 },
    { date: "Sep 20", score: 86.0, seatbelt: 90, proximity: 84, stability: 90, smoothness: 85 },
    { date: "Sep 21", score: 91.0, seatbelt: 100, proximity: 92, stability: 93, smoothness: 88 },
    { date: "Sep 22", score: 95.0, seatbelt: 100, proximity: 96, stability: 95, smoothness: 92 },
    { date: "Today", score: 92.5, seatbelt: 100, proximity: 92, stability: 94, smoothness: 90 }
  ],
  recommended_focus: "Maintain 360° blind spot scan before swing"
};

export const MOCK_SHIFT_RECAP: ShiftRecap = {
  shift_date: "Wednesday, September 23, 2026",
  operator_id: "OP1001",
  operator_name: "Arun Kumar",
  role: "Lead Excavator Specialist",
  machine_id: "CAT-336-EX01",
  machine_model: "Cat 336 Next Gen",
  power_type: "Diesel",
  total_shift_hours: 8.0,
  active_work_hours: 6.2,
  idling_hours: 1.8,
  idling_pct: 22.5,
  tasks_completed: 3,
  tasks_scheduled: 4,
  tasks_weather_rescheduled: 1,
  safety_score: 92.5,
  seatbelt_compliance_pct: 100.0,
  fuel_or_energy_used: "164.2 L Diesel",
  eco_savings: "18.4 L Saved via Eco-Mode",
  incidents_prevented: 3,
  verified_hash: "CAT-BLOCK-782914"
};
