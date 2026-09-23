export interface Operator {
  operator_id: string;
  name: string;
  role: string;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
  experience_hours: number;
  assigned_machine_id: string;
}

export interface Machine {
  machine_id: string;
  machine_type: 'Excavator' | 'Wheel Loader' | 'Haul Truck' | 'Dozer';
  power_type: 'Diesel' | 'Electric';
  site_type: string;
  model: string;
  operating_hours: number;
  machine_condition: string;
  swing_radius_m: number;
  danger_zone_m: number;
  caution_zone_m: number;
}

export interface LiveTelemetry {
  timestamp: string;
  operator_id: string;
  machine_id: string;
  machine_type: string;
  power_type: 'Diesel' | 'Electric';
  model: string;
  speed_kmh: number;
  engine_hours: number;
  seatbelt_status: 'Fastened' | 'Unfastened';
  idle_time_min: number;
  idling_ratio_pct: number;
  ambient_noise_db: number;
  alert_modality: 'VISUAL_AUDIO_STANDARD' | 'VISUAL_AUDIO_HIGH' | 'VISUAL_HAPTIC';
  modality_label: string;
  fuel_level_pct?: number | null;
  battery_soc?: number | null;
  battery_temperature_c?: number | null;
  hydraulic_pressure_psi: number;
  engine_temp_c: number;
  machine_tilt_deg: number;
  terrain_slope_deg: number;
  stability_risk_score: number;
  stability_risk_level: 'STABLE' | 'WARNING' | 'CRITICAL';
  active_warnings: number;
}

export interface TaskFactor {
  factor: string;
  delta_min: number;
  percentage: number;
  impact: 'delay' | 'accelerated' | 'neutral';
  detail: string;
}

export interface AdaptiveTask {
  task_id: string;
  title: string;
  task_type: string;
  location: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  scheduled_time: string;
  weather: string;
  status: 'In Progress' | 'Pending' | 'Completed' | 'Rescheduled';
  nominal_duration_min: number;
  predicted_duration_min: number;
  confidence_margin_min: number;
  display_prediction: string;
  factors: TaskFactor[];
  weather_reschedule_recommended: boolean;
  recommended_action: string;
}

export interface RadarObject {
  id: string;
  name: string;
  type: 'Personnel' | 'Heavy Vehicle' | 'Drop-off Hazard';
  distance_m: number;
  angle_deg: number;
  speed_kmh: number;
  heading_deg: number;
  seconds_to_impact: number;
  in_blind_spot: boolean;
  zone: 'SAFE' | 'CAUTION' | 'CRITICAL';
  alert_level: 'Informational' | 'Caution' | 'Critical';
  recommended_action: string;
}

export interface RadarResponse {
  timestamp: string;
  machine_model: string;
  swing_radius_m: number;
  danger_zone_radius_m: number;
  caution_zone_radius_m: number;
  danger_level: 'SAFE' | 'CAUTION' | 'CRITICAL';
  closest_hazard: RadarObject;
  person_in_blind_spot: boolean;
  objects: RadarObject[];
}

export interface MapPerson {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  distance_m: number;
  zone: 'SAFE' | 'CAUTION' | 'CRITICAL';
  in_blind_spot: boolean;
}

export interface MapEntities {
  machine: {
    id: string;
    model: string;
    x: number;
    y: number;
    heading_deg: number;
    swing_radius_m: number;
    danger_zone_m: number;
    caution_zone_m: number;
    blind_spot_angles: { start: number; end: number };
  };
  personnel: MapPerson[];
  site_boundary: { width_m: number; height_m: number };
}

export interface SafetyEvent {
  event_id: string;
  timestamp: string;
  operator_id: string;
  machine_id: string;
  event_type: string;
  severity: 'Informational' | 'Caution' | 'Warning' | 'Critical';
  distance_to_person: number;
  machine_speed: number;
  response_time: number;
  alert_acknowledged: boolean;
  resolved: boolean;
}

export interface ReplayStep {
  time_offset_sec: number;
  timestamp_label: string;
  stage: string;
  description: string;
  distance_m: number;
  zone: string;
  operator_action: string;
  alert_state: string;
}

export interface EventReplay {
  event_id: string;
  title: string;
  total_duration_sec: number;
  operator_response_time_sec: number;
  timeline_steps: ReplayStep[];
}

export interface AnomalyItem {
  type: string;
  severity: 'Warning' | 'Critical';
  title: string;
  explanation: string;
  fuel_wasted_L?: number;
  action: string;
}

export interface AnomalyReport {
  is_anomaly: boolean;
  overall_severity: 'Safe' | 'Warning' | 'Critical';
  anomaly_count: number;
  anomalies: AnomalyItem[];
  recommended_training?: {
    module_id: string;
    module_name: string;
    reason: string;
  } | null;
  benchmark_idle_min: number;
  current_idle_min: number;
}

export interface TrainingModule {
  module_id: string;
  module_name: string;
  applicable_role: string;
  applicable_machine: string;
  skill_level: string;
  duration: string;
  skill_area: string;
  description: string;
  completed?: boolean;
}

export interface TrainingRecommendation {
  trigger_reason: string;
  module_id: string;
  module_name: string;
  duration: string;
  urgency: 'Low' | 'Medium' | 'High';
}

export interface TrainingRecord {
  operator_id: string;
  module_id: string;
  module_name: string;
  assigned_reason: string;
  assigned_date: string;
  completion_status: string;
  assessment_score: number | null;
  completion_date: string | null;
  pre_training_violations: number;
  post_training_violations: number;
  improvement_pct: number;
}

export interface PersonalizedTraining {
  operator_id: string;
  recommendations: TrainingRecommendation[];
  all_modules: TrainingModule[];
  records: TrainingRecord[];
}

export interface EffectivenessMetric {
  category: string;
  pre_training_value: number;
  post_training_value: number;
  unit: string;
  reduction_pct: number;
  status: string;
}

export interface TrainingEffectiveness {
  title: string;
  overall_improvement_pct: number;
  metrics: EffectivenessMetric[];
}

export interface TrendPoint {
  date: string;
  score: number;
  seatbelt: number;
  proximity: number;
  stability: number;
  smoothness: number;
}

export interface ScorecardData {
  operator_id: string;
  composite_safety_score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  sub_scores: {
    seatbelt_compliance: number;
    proximity_awareness: number;
    machine_stability: number;
    smooth_operation: number;
  };
  trend: TrendPoint[];
  recommended_focus: string;
}

export interface ShiftRecap {
  shift_date: string;
  operator_id: string;
  operator_name: string;
  role: string;
  machine_id: string;
  machine_model: string;
  power_type: 'Diesel' | 'Electric';
  total_shift_hours: number;
  active_work_hours: number;
  idling_hours: number;
  idling_pct: number;
  tasks_completed: number;
  tasks_scheduled: number;
  tasks_weather_rescheduled: number;
  safety_score: number;
  seatbelt_compliance_pct: number;
  fuel_or_energy_used: string;
  eco_savings: string;
  incidents_prevented: number;
  verified_hash: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
  quick_actions?: string[];
}
