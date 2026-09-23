import React from 'react';
import {
  Activity,
  Clock,
  CheckCircle2,
  Gauge,
  Layers,
  AlertTriangle,
  RotateCcw,
  Zap,
  Fuel,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { AdaptiveTask, LiveTelemetry, Machine } from '../types';

interface CurrentTaskViewProps {
  currentTask: AdaptiveTask;
  telemetry: LiveTelemetry | null;
  machine: Machine;
  onCompleteTask: () => void;
}

export const CurrentTaskView: React.FC<CurrentTaskViewProps> = ({
  currentTask,
  telemetry,
  machine,
  onCompleteTask
}) => {
  const isElectric = machine.power_type === 'Electric';
  const elapsedMin = 42;
  const targetMin = currentTask.predicted_duration_min || 70;
  const progressPct = Math.min(100, Math.round((elapsedMin / targetMin) * 100));

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Active Task Head-Up Display Banner */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-frost-green animate-pulse" />
            <span className="text-xs font-mono text-frost-green uppercase font-bold tracking-wider">
              TASK IN PROGRESS • CAB TELEMATICS ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-black font-industrial text-white tracking-wide uppercase">
            {currentTask.title}
          </h1>
          <p className="text-xs text-nordic-muted mt-0.5">
            Location: <strong className="text-white">{currentTask.location}</strong> • Type: <strong className="text-ice-blue">{currentTask.task_type}</strong>
          </p>
        </div>

        <button
          onClick={onCompleteTask}
          className="touch-btn bg-frost-green hover:bg-frost-green-dark text-nordic-base font-black text-sm px-6 py-3 shadow-safe-glow"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Mark Task Completed</span>
        </button>
      </div>

      {/* Progress Ring & High-Contrast Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Progress Circular Meter (4 cols) */}
        <div className="md:col-span-4 bg-nordic-card border border-nordic-border rounded-xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
          <span className="text-xs font-mono text-nordic-muted uppercase tracking-wider mb-3">
            Task Duration Progress
          </span>

          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#2E3440" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#88C0D0"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPct) / 100}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black font-mono text-white">{elapsedMin}m</span>
              <span className="text-[11px] font-mono text-nordic-muted">/ {targetMin}m target</span>
              <span className="text-[10px] font-bold text-ice-blue mt-0.5">{progressPct}% Complete</span>
            </div>
          </div>

          <p className="text-xs font-mono text-nordic-muted mt-2">
            Remaining time: <strong className="text-ice-blue">{Math.max(0, targetMin - elapsedMin)} min</strong>
          </p>
        </div>

        {/* Real-Time Machine Telematics HUD (8 cols) */}
        <div className="md:col-span-8 bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-nordic-border">
            <span className="text-xs font-mono font-bold text-ice-blue uppercase tracking-wider">
              Real-Time Machine Operating Telemetry
            </span>
            <span className="text-[11px] font-mono text-nordic-muted">
              Unit: <strong className="text-white">{machine.model}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3">
            {/* Hydraulic Pilot Pressure */}
            <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
              <span className="text-[10px] font-mono text-nordic-muted uppercase block">
                Hydraulic Pressure
              </span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {telemetry?.hydraulic_pressure_psi || 4820} <span className="text-xs font-normal">psi</span>
              </div>
              <span className="text-[10px] text-frost-green font-mono">Nominal flow</span>
            </div>

            {/* Ground Speed */}
            <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
              <span className="text-[10px] font-mono text-nordic-muted uppercase block">
                Ground Travel Speed
              </span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {telemetry?.speed_kmh || 2.4} <span className="text-xs font-normal">km/h</span>
              </div>
              <span className="text-[10px] text-nordic-muted font-mono">Track gear 1</span>
            </div>

            {/* Load Passes / Cycle Count */}
            <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
              <span className="text-[10px] font-mono text-nordic-muted uppercase block">
                Trench Cycle Count
              </span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                28 <span className="text-xs font-normal">passes</span>
              </div>
              <span className="text-[10px] text-ice-blue font-mono">~26 passes/hr</span>
            </div>

            {/* Machine Tilt */}
            <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
              <span className="text-[10px] font-mono text-nordic-muted uppercase block">
                Machine In-Cab Tilt
              </span>
              <div className="text-2xl font-black font-mono text-pastel-ochre mt-1">
                {telemetry?.machine_tilt_deg || 8.4}°
              </div>
              <span className="text-[10px] text-pastel-ochre font-mono">Wet clay compensation</span>
            </div>

            {/* Power Status */}
            <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
              <span className="text-[10px] font-mono text-nordic-muted uppercase block">
                {isElectric ? 'Battery SOC' : 'Diesel Level'}
              </span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {isElectric ? `${telemetry?.battery_soc || 84.5}%` : `${telemetry?.fuel_level_pct || 74}%`}
              </div>
              <span className="text-[10px] text-frost-green font-mono">Good operational range</span>
            </div>

            {/* Seatbelt Sensor */}
            <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
              <span className="text-[10px] font-mono text-nordic-muted uppercase block">
                Safety Interlock
              </span>
              <div className={`text-xl font-black font-mono uppercase mt-1 ${
                telemetry?.seatbelt_status === 'Fastened' ? 'text-frost-green' : 'text-coral-red'
              }`}>
                {telemetry?.seatbelt_status || 'Fastened'}
              </div>
              <span className="text-[10px] text-nordic-muted font-mono">OSHA cab requirement</span>
            </div>
          </div>

          <div className="bg-nordic-base p-3 rounded-lg border border-nordic-border text-xs font-mono text-nordic-muted flex items-center justify-between">
            <span>Throttle Position: <strong>82% Dynamic Governor</strong></span>
            <span className="text-frost-green">Auto-Engine Shutdown: <strong>ARMED (3 min idle limit)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
