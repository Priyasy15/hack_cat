import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  VolumeX,
  Vibrate,
  Radio,
  PlusCircle,
  Bell,
  Gauge,
  Activity,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import { LiveTelemetry, RadarResponse, SafetyEvent } from '../types';

interface SafetyIntelligenceViewProps {
  telemetry: LiveTelemetry | null;
  radar: RadarResponse | null;
  events: SafetyEvent[];
  onToggleSeatbelt: () => void;
  onSimulateProximity: () => void;
  onToggleHighNoise: () => void;
  onAcknowledgeAlert: (eventId: string) => void;
}

export const SafetyIntelligenceView: React.FC<SafetyIntelligenceViewProps> = ({
  telemetry,
  radar,
  events,
  onToggleSeatbelt,
  onSimulateProximity,
  onToggleHighNoise,
  onAcknowledgeAlert
}) => {
  const noiseDb = telemetry?.ambient_noise_db || 74.0;
  const isHighNoise = noiseDb > 85.0;
  const isCriticalDanger = radar?.danger_level === 'CRITICAL' || telemetry?.seatbelt_status === 'Unfastened';

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Title & Interactive Simulator Bar */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-ice-blue" />
            <h1 className="text-2xl font-bold font-industrial text-white tracking-wide uppercase">
              Multimodal Safety Intelligence & Hazard Dispatch
            </h1>
          </div>
          <p className="text-xs text-nordic-muted mt-1">
            Dynamic noise-aware alerts, rollover stability calculations, and real-time operator interlock enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleHighNoise}
            className={`touch-btn text-xs font-mono font-bold px-4 py-2.5 border ${
              isHighNoise
                ? 'bg-pastel-ochre text-nordic-base border-pastel-ochre shadow-warning-glow'
                : 'bg-nordic-base text-nordic-muted border-nordic-border hover:text-white'
            }`}
          >
            <Vibrate className="w-4 h-4" />
            <span>Simulate High Noise ({noiseDb} dB)</span>
          </button>

          <button
            onClick={onSimulateProximity}
            className="touch-btn bg-coral-red hover:bg-coral-red-dark text-white font-black text-xs px-5 py-2.5 shadow-danger-glow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Trigger Proximity Breach Event</span>
          </button>
        </div>
      </div>

      {/* Multimodal Alert Center Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg ${
        isHighNoise
          ? 'bg-pastel-ochre/20 border-pastel-ochre text-white shadow-warning-glow'
          : isCriticalDanger
          ? 'bg-coral-red/20 border-coral-red text-white shadow-danger-glow animate-pulse'
          : 'bg-nordic-card border-nordic-border text-nordic-text'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold ${
            isHighNoise ? 'bg-pastel-ochre text-nordic-base' : 'bg-nordic-base text-ice-blue'
          }`}>
            {isHighNoise ? <Vibrate className="w-6 h-6 animate-bounce" /> : <Bell className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-xs font-mono uppercase font-bold tracking-wider block">
              Active Alert Modality Engine
            </span>
            <p className="text-sm font-bold mt-0.5">
              {telemetry?.modality_label || '🔉 STANDARD VISUAL + CAB AUDIO (74 dB)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-nordic-muted">Cab Noise:</span>
          <span className={`font-black text-base ${isHighNoise ? 'text-pastel-ochre' : 'text-ice-blue'}`}>
            {noiseDb} dB
          </span>
        </div>
      </div>

      {/* Grid: Seatbelt Interlock & Rollover Stability Meter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Seatbelt Compliance Interlock Card */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between ${
          telemetry?.seatbelt_status === 'Fastened'
            ? 'bg-nordic-card border-frost-green/40 shadow-safe-glow'
            : 'bg-coral-red/15 border-coral-red shadow-danger-glow animate-pulse'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-nordic-muted uppercase">
                Primary Cab Safety Interlock
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                telemetry?.seatbelt_status === 'Fastened' ? 'bg-frost-green text-nordic-base' : 'bg-coral-red text-white'
              }`}>
                {telemetry?.seatbelt_status === 'Fastened' ? 'INTERLOCK SECURE' : 'CRITICAL WARNING'}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              {telemetry?.seatbelt_status === 'Fastened' ? (
                <ShieldCheck className="w-9 h-9 text-frost-green" />
              ) : (
                <AlertOctagon className="w-9 h-9 text-coral-red" />
              )}
              <div>
                <h3 className="text-xl font-black font-industrial uppercase tracking-wide text-white">
                  Seatbelt {telemetry?.seatbelt_status}
                </h3>
                <p className="text-xs text-nordic-muted mt-0.5">
                  {telemetry?.seatbelt_status === 'Fastened'
                    ? 'OSHA Subpart P cab compliance active. Pilot hydraulics certified unlocked.'
                    : 'Cab warning beacon chiming. Hydraulic cut-off standby.'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onToggleSeatbelt}
            className={`mt-5 touch-btn text-xs font-bold uppercase tracking-wider ${
              telemetry?.seatbelt_status === 'Fastened'
                ? 'bg-nordic-base hover:bg-nordic-card border border-nordic-border text-nordic-text'
                : 'bg-coral-red hover:bg-coral-red-dark text-white font-black shadow-md'
            }`}
          >
            <span>{telemetry?.seatbelt_status === 'Fastened' ? 'Simulate Seatbelt Unfastening' : 'Fasten Seatbelt Interlock'}</span>
          </button>
        </div>

        {/* 2. Rollover & Stability Risk Meter */}
        <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-nordic-muted uppercase">
                Dynamic Stability & Rollover Risk Meter
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                telemetry?.stability_risk_level === 'CRITICAL' ? 'bg-coral-red text-white' :
                telemetry?.stability_risk_level === 'WARNING' ? 'bg-pastel-ochre text-nordic-base' :
                'bg-frost-green text-nordic-base'
              }`}>
                {telemetry?.stability_risk_level || 'STABLE'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black font-mono text-pastel-ochre">
                {telemetry?.stability_risk_score || 58.2}
              </span>
              <span className="text-xs font-mono text-nordic-muted">/ 100 risk ceiling</span>
            </div>

            <div className="w-full bg-nordic-base rounded-full h-3 mt-2 overflow-hidden">
              <div
                className={`h-3 rounded-full ${
                  (telemetry?.stability_risk_score || 0) > 75 ? 'bg-coral-red' :
                  (telemetry?.stability_risk_score || 0) > 50 ? 'bg-pastel-ochre' :
                  'bg-frost-green'
                }`}
                style={{ width: `${Math.min(100, telemetry?.stability_risk_score || 58)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-nordic-border text-xs font-mono text-nordic-muted">
            <div>
              <span>Cab Tilt: <strong>{telemetry?.machine_tilt_deg || 8.4}°</strong></span>
              <span className="text-[10px] text-pastel-ochre block">Limit: 15.0°</span>
            </div>
            <div>
              <span>Slope Grade: <strong>{telemetry?.terrain_slope_deg || 7.5}°</strong></span>
              <span className="text-[10px] text-nordic-muted block">Wet clay slope</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Events Log Table */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-nordic-border">
          <span className="text-xs font-mono font-bold text-ice-blue uppercase tracking-wider">
            Safety Events Telematics Log & Escalation Queue
          </span>
          <span className="text-[11px] font-mono text-nordic-muted">
            {events.length} events recorded
          </span>
        </div>

        <div className="space-y-2.5 mt-3 max-h-[320px] overflow-y-auto pr-1">
          {events.map((evt) => {
            const isCrit = evt.severity === 'Critical';
            return (
              <div
                key={evt.event_id}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono ${
                  isCrit ? 'bg-coral-red/15 border-coral-red/50 text-white' : 'bg-nordic-base border-nordic-border text-nordic-text'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                      isCrit ? 'bg-coral-red text-white' : 'bg-pastel-ochre text-nordic-base'
                    }`}>
                      {evt.severity}
                    </span>
                    <span className="font-bold text-white">{evt.event_type}</span>
                    <span className="text-nordic-muted text-[10px]">{evt.event_id}</span>
                  </div>
                  <p className="text-[11px] text-nordic-muted">
                    Distance: {evt.distance_to_person > 0 ? `${evt.distance_to_person}m` : 'N/A'} • Response: {evt.response_time}s • Speed: {evt.machine_speed} km/h
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-frost-green bg-frost-green/15 px-2 py-1 rounded border border-frost-green/30 font-bold">
                    Resolved ({evt.response_time}s)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
