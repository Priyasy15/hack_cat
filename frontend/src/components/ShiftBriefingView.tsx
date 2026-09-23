import React from 'react';
import {
  Calendar,
  CloudRain,
  ShieldAlert,
  AlertTriangle,
  Play,
  Battery,
  Fuel,
  Gauge,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Operator, Machine, LiveTelemetry, AdaptiveTask } from '../types';

interface ShiftBriefingViewProps {
  operator: Operator;
  machine: Machine;
  telemetry: LiveTelemetry | null;
  tasks: AdaptiveTask[];
  onStartShift: () => void;
  onNavigateToTasks: () => void;
}

export const ShiftBriefingView: React.FC<ShiftBriefingViewProps> = ({
  operator,
  machine,
  telemetry,
  tasks,
  onStartShift,
  onNavigateToTasks
}) => {
  const isElectric = machine.power_type === 'Electric';

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Shift Briefing Header Card */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-nordic-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-ice-blue uppercase font-bold bg-ice-blue/15 px-2.5 py-0.5 rounded">
                Pre-Shift Intelligence
              </span>
              <span className="text-xs font-mono text-nordic-muted">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl font-black font-industrial text-white tracking-wide uppercase">
              Welcome, {operator.name}
            </h1>
            <p className="text-xs text-nordic-muted mt-0.5">
              Role: <strong className="text-white">{operator.role}</strong> • Assigned Machine: <strong className="text-ice-blue">{machine.model} ({machine.machine_id})</strong>
            </p>
          </div>

          <button
            onClick={onStartShift}
            className="touch-btn bg-ice-blue hover:bg-ice-blue-light text-nordic-base font-black text-sm px-6 py-3 shadow-ice-glow"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Acknowledge Briefing & Start Shift</span>
          </button>
        </div>

        {/* AI Co-Pilot Shift Advisory Box */}
        <div className="my-4 bg-nordic-base p-4 rounded-xl border border-nordic-border flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-ice-blue/20 text-ice-blue flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-ice-blue uppercase tracking-wider block mb-1">
              AI In-Cab Shift Briefing & Hazard Advisory
            </span>
            <p className="text-sm text-nordic-text leading-relaxed">
              Ground telemetry confirms <strong className="text-pastel-ochre">Muddy/Wet</strong> conditions at North Trench Sector B. 
              Saturated soils elevate trench bank cave-in risks by 38%. Surcharge loads must remain at least 0.6m from edge. 
              Rear swing blind spot warning: Ground checkers are active on Footprint Zone B4. 
              Ensure full seatbelt interlock engagement and maintain Auto-Engine Shutdown (AES) during haul truck delays.
            </p>
          </div>
        </div>

        {/* Machine Vital Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          {/* Fuel / Battery SOC */}
          <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
            <div className="flex items-center justify-between text-nordic-muted mb-1">
              <span className="text-[10px] uppercase font-bold">
                {isElectric ? 'Battery SOC' : 'Fuel Reserve'}
              </span>
              {isElectric ? <Battery className="w-4 h-4 text-frost-green" /> : <Fuel className="w-4 h-4 text-ice-blue" />}
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {isElectric ? `${telemetry?.battery_soc || 84.5}%` : `${telemetry?.fuel_level_pct || 74}%`}
            </div>
            <span className="text-[10px] text-frost-green mt-1 block">
              {isElectric ? 'Discharge normal (36.2°C)' : 'Estimated range: 6.8 hrs'}
            </span>
          </div>

          {/* Machine Health & Hours */}
          <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
            <div className="flex items-center justify-between text-nordic-muted mb-1">
              <span className="text-[10px] uppercase font-bold">Equipment Hours</span>
              <Clock className="w-4 h-4 text-ice-blue" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {machine.operating_hours.toFixed(1)}h
            </div>
            <span className="text-[10px] text-nordic-muted mt-1 block">
              Condition: <strong className="text-frost-green">{machine.machine_condition}</strong>
            </span>
          </div>

          {/* Hydraulic Pressure */}
          <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
            <div className="flex items-center justify-between text-nordic-muted mb-1">
              <span className="text-[10px] uppercase font-bold">Hydraulic Pilot</span>
              <Gauge className="w-4 h-4 text-ice-blue" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {telemetry?.hydraulic_pressure_psi || 4820} psi
            </div>
            <span className="text-[10px] text-frost-green mt-1 block">
              Relief valve nominal
            </span>
          </div>

          {/* Stability Status */}
          <div className="bg-nordic-base p-3.5 rounded-xl border border-nordic-border">
            <div className="flex items-center justify-between text-nordic-muted mb-1">
              <span className="text-[10px] uppercase font-bold">Stability Risk</span>
              <AlertTriangle className="w-4 h-4 text-pastel-ochre" />
            </div>
            <div className="text-2xl font-black text-pastel-ochre mt-1">
              {telemetry?.stability_risk_level || 'STABLE'}
            </div>
            <span className="text-[10px] text-nordic-muted mt-1 block">
              Tilt: {telemetry?.machine_tilt_deg || 8.4}° • Slope: {telemetry?.terrain_slope_deg || 7.5}°
            </span>
          </div>
        </div>
      </div>

      {/* Today's Tasks Quick Preview */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-nordic-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-ice-blue" />
            <h2 className="text-lg font-bold font-industrial text-white tracking-wide uppercase">
              Today's Scheduled Tasks Preview ({tasks.length})
            </h2>
          </div>
          <button
            onClick={onNavigateToTasks}
            className="text-xs text-ice-blue hover:underline flex items-center gap-1 font-mono font-bold"
          >
            <span>Open Adaptive Task Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task.task_id}
              className="bg-nordic-base p-4 rounded-xl border border-nordic-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-ice-blue font-bold">{task.task_id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    task.priority === 'Critical' ? 'bg-coral-red/20 text-coral-red border border-coral-red/30' :
                    task.priority === 'High' ? 'bg-pastel-ochre/20 text-pastel-ochre border border-pastel-ochre/30' :
                    'bg-nordic-card text-nordic-muted'
                  }`}>
                    {task.priority} Priority
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{task.title}</h3>
                <p className="text-xs text-nordic-muted">{task.location} • {task.scheduled_time}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-nordic-border flex items-center justify-between text-xs font-mono">
                <span className="text-nordic-muted">Est: {task.display_prediction}</span>
                <span className={`font-bold ${task.status === 'In Progress' ? 'text-ice-blue' : 'text-nordic-muted'}`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
