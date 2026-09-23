export interface Operator {
  id: string;
  name: string;
  skill: 'Novice' | 'Intermediate' | 'Expert';
  machine_id: string;
  badge: string;
  role: string;
}

export interface Machine {
  id: string;
  model: string;
  type: string;
  weight_ton: number;
  power_hp: number;
  base_hours: number;
  age_yrs: number;
}

export interface Telemetry {
  operator_id: string;
  machine_id: string;
  timestamp: string;
  engine_hours: number;
  fuel_used_L: number;
  fuel_rate_lph: number;
  load_cycles: number;
  idling_time_min: number;
  idling_ratio_pct: number;
  seatbelt_status: 'Fastened' | 'Unfastened';
  safety_alert_triggered: boolean;
  engine_rpm: number;
  coolant_temp_c: number;
  hydraulic_pressure_psi: number;
  battery_voltage_v: number;
  eco_mode: boolean;
}

export interface TaskFactor {
  factor: string;
  value: string;
  delta_min: number;
  percentage: number;
  impact: 'delay' | 'accelerated' | 'neutral';
  detail: string;
}

export interface Task {
  task_id: string;
  title: string;
  task_type: string;
  target_volume_m3: number;
  weather: string;
  weather_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_explanation: string;
  nominal_time_min: number;
  predicted_time_min?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'Pending' | 'In Progress' | 'Completed';
  factors?: TaskFactor[];
}

export interface RadarObject {
  id: string;
  name: string;
  type: 'Personnel' | 'Light Vehicle' | 'Drop-off Hazard' | 'Overhead Clearance';
  distance_m: number;
  angle_deg: number;
  alert_level: 'SAFE' | 'WARNING' | 'CRITICAL';
  speed_kmh: number;
}

export interface RadarResponse {
  status: string;
  objects: RadarObject[];
  closest_hazard: RadarObject | null;
  danger_level: 'SAFE' | 'WARNING' | 'CRITICAL';
  active_warnings: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  timestamp: string;
  operator_id: string;
  machine_id: string;
  type: string;
  severity: 'SAFE' | 'WARNING' | 'CRITICAL';
  description: string;
  resolved: boolean;
  action_taken: string;
}

export interface AnomalyFlag {
  code: string;
  severity: 'SAFE' | 'WARNING' | 'CRITICAL';
  message: string;
  impact: string;
}

export interface TrendPoint {
  date: string;
  score: number;
  idling_pct: number;
  seatbelt_violations: number;
  safety_alerts: number;
  load_cycles: number;
}

export interface Scorecard {
  operator_id: string;
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  status_text: string;
  status_color: 'green' | 'amber' | 'red';
  idling_pct: number;
  idling_benchmark_pct: number;
  seatbelt_status: 'Fastened' | 'Unfastened';
  anomaly_flags: AnomalyFlag[];
  trend_history: TrendPoint[];
}

export interface EstimateResult {
  task_type: string;
  nominal_time_min: number;
  predicted_time_min: number;
  total_variance_min: number;
  factors: TaskFactor[];
  model_metadata: {
    algorithm: string;
    r2_score: number;
    mae_min: number;
    training_samples: number;
  };
}

export interface MaintenanceData {
  machine_id: string;
  current_engine_hours: number;
  next_service_hours: number;
  hours_to_next_service: number;
  service_type: string;
  urgency: 'HEALTHY' | 'APPROACHING' | 'URGENT';
  badge: string;
  telemetry_health: {
    oil_life_pct: number;
    hydraulic_filter_delta_bar: number;
    hydraulic_filter_status: string;
    air_filter_restriction_kpa: number;
    track_shoe_wear_pct: number;
  };
  nudge_message: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  category: string;
  duration_min: number;
  thumbnail: string;
  video_url: string;
  summary: string;
  key_takeaways: string[];
  badge_unlocked: string;
  required_for: string[];
  completed?: boolean;
}

export interface ShiftSummary {
  shift_date: string;
  operator_id: string;
  operator_name: string;
  machine_id: string;
  shift_hours: number;
  active_work_hours: number;
  idling_hours: number;
  idling_pct: number;
  total_load_cycles: number;
  fuel_burned_L: number;
  eco_fuel_saved_L: number;
  carbon_saved_kg: number;
  tasks_completed: number;
  tasks_total: number;
  safety_score: number;
  seatbelt_compliance_pct: number;
  time_estimate_accuracy_pct: number;
  signature_hash: string;
}

export interface LeaderboardItem {
  rank: number;
  operator_id: string;
  name: string;
  skill: string;
  machine_id: string;
  badge: string;
  safety_score: number;
  efficiency_score: number;
  composite_score: number;
  idling_pct: number;
  total_cycles: number;
  seatbelt_violations: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
  quick_actions?: string[];
}
