import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  User,
  Truck,
  CloudRain,
  Volume2,
  VolumeX,
  Power,
  Bell,
  Sparkles,
  Award,
  FileText,
  MapPin,
  Flame,
  BatteryCharging,
  Fuel,
  Vibrate
} from 'lucide-react';
import { Operator, Machine, LiveTelemetry } from '../types';

interface CabTopBarProps {
  operator: Operator;
  machine: Machine;
  telemetry: LiveTelemetry | null;
  activeView: string;
  cachedWeatherInfo: { weather: string; ageMin: number };
  onSelectView: (viewId: string) => void;
  onOpenLogin: () => void;
  onOpenAi: () => void;
  onOpenRecap: () => void;
  onToggleSeatbelt: () => void;
  onSimulateNoiseToggle: () => void;
}

export const CabTopBar: React.FC<CabTopBarProps> = ({
  operator,
  machine,
  telemetry,
  activeView,
  cachedWeatherInfo,
  onSelectView,
  onOpenLogin,
  onOpenAi,
  onOpenRecap,
  onToggleSeatbelt,
  onSimulateNoiseToggle
}) => {
  const [eStopEngaged, setEStopEngaged] = useState(false);

  const seatbeltFastened = telemetry?.seatbelt_status === 'Fastened';
  const isHighNoise = (telemetry?.ambient_noise_db || 70) > 85;
  const isElectric = machine.power_type === 'Electric';

  return (
    <header className="bg-nordic-card border-b border-nordic-border sticky top-0 z-40 shadow-xl">
      {/* Top Heavy Equipment Caution Line */}
      <div className="h-1.5 w-full warning-stripes" />

      <div className="max-w-[1920px] mx-auto px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Operator Setup Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* CAT Logo Pill */}
          <div className="flex items-center gap-2.5 bg-ice-blue px-3.5 py-1.5 rounded-lg shadow-sm text-nordic-base select-none">
            <span className="font-black text-sm tracking-tighter bg-nordic-base text-ice-blue px-1.5 py-0.5 rounded">
              CAT
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-black text-sm tracking-wider uppercase font-industrial">Smart Operator</span>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-90">In-Cab Tablet OS</span>
            </div>
          </div>

          {/* Operator Setup Button */}
          <button
            onClick={onOpenLogin}
            className="touch-btn bg-nordic-base hover:bg-nordic-card border border-nordic-border px-3 py-1.5 text-xs text-nordic-text"
            title="Switch Operator, Machine, or Power Source"
          >
            <User className="w-4 h-4 text-ice-blue shrink-0" />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-nordic-muted uppercase font-mono">Operator</div>
              <div className="font-bold text-white text-xs">{operator.name} ({operator.skill_level})</div>
            </div>
          </button>

          {/* Machine Badge */}
          <div className="hidden md:flex items-center bg-nordic-base border border-nordic-border rounded-lg px-3 py-1.5 text-xs">
            <Truck className="w-4 h-4 text-ice-blue mr-2 shrink-0" />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-nordic-muted uppercase font-mono flex items-center gap-1">
                {machine.machine_type} • {isElectric ? '⚡ Electric' : '⛽ Diesel'}
              </div>
              <div className="font-bold text-white text-xs">{machine.model}</div>
            </div>
          </div>

          {/* Cached Weather Indicator */}
          <div className="flex items-center bg-nordic-base border border-nordic-border rounded-lg px-2.5 py-1.5 text-xs font-mono">
            <CloudRain className="w-4 h-4 text-ice-blue mr-1.5 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-white text-[11px]">{cachedWeatherInfo.weather}</span>
              <span className="text-[9px] text-pastel-ochre">Cached ({cachedWeatherInfo.ageMin}m ago)</span>
            </div>
          </div>
        </div>

        {/* Center / Right: Noise Simulator, Seatbelt Toggle & Navigation Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Ambient Noise Level Simulator Button */}
          <button
            onClick={onSimulateNoiseToggle}
            className={`touch-btn text-xs px-3 py-1.5 border font-mono font-bold ${
              isHighNoise
                ? 'bg-pastel-ochre/20 text-pastel-ochre border-pastel-ochre shadow-warning-glow'
                : 'bg-nordic-base text-nordic-muted border-nordic-border hover:text-white'
            }`}
            title="Toggle between Normal Cab Noise (74 dB) and Heavy Blasting / Hammer Noise (89 dB)"
          >
            {isHighNoise ? <Vibrate className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4" />}
            <span>NOISE: {telemetry?.ambient_noise_db || 74} dB</span>
            {isHighNoise && <span className="text-[10px] bg-pastel-ochre text-nordic-base px-1 rounded ml-1">📳 HAPTIC</span>}
          </button>

          {/* Seatbelt Interlock Button */}
          <button
            onClick={onToggleSeatbelt}
            className={`touch-btn text-xs px-3 py-1.5 border font-bold ${
              seatbeltFastened
                ? 'bg-frost-green/15 text-frost-green border-frost-green/40 shadow-safe-glow'
                : 'bg-coral-red text-white border-coral-red animate-pulse shadow-danger-glow'
            }`}
            title="Toggle Seatbelt Simulation"
          >
            {seatbeltFastened ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            <span>{seatbeltFastened ? 'SEATBELT FASTENED' : 'SEATBELT OFF!'}</span>
          </button>

          {/* AI Co-Pilot Button */}
          <button
            onClick={onOpenAi}
            className="touch-btn bg-ice-blue hover:bg-ice-blue-light text-nordic-base font-bold text-xs px-3.5 py-2 shadow-ice-glow"
            title="In-Cab AI Assistant"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Co-Pilot</span>
          </button>

          {/* Shift Recap Button */}
          <button
            onClick={onOpenRecap}
            className="touch-btn bg-nordic-base hover:bg-nordic-card border border-nordic-border text-xs px-3 py-2 text-nordic-text"
            title="End-of-Shift Sign-Off"
          >
            <FileText className="w-4 h-4 text-ice-blue" />
            <span className="hidden sm:inline">Shift Recap</span>
          </button>

          {/* E-Stop Simulator */}
          <button
            onClick={() => setEStopEngaged(!eStopEngaged)}
            className={`touch-btn text-xs px-3 py-2 border font-black ${
              eStopEngaged
                ? 'bg-coral-red text-white border-coral-red animate-pulse shadow-danger-glow'
                : 'bg-coral-red/20 hover:bg-coral-red/30 text-coral-red border-coral-red/40'
            }`}
            title="Emergency Stop / Hydraulic Lockout"
          >
            <Power className="w-4 h-4" />
            <span>{eStopEngaged ? 'PILOT CUT' : 'E-STOP'}</span>
          </button>
        </div>
      </div>

      {/* Multimodal Banner if High Cab Noise or Active Danger */}
      {telemetry?.modality_label && (
        <div className={`py-1 px-4 text-center text-xs font-mono font-bold flex items-center justify-center gap-2 ${
          isHighNoise ? 'bg-pastel-ochre text-nordic-base shadow-warning-glow' : 'bg-nordic-base text-nordic-muted'
        }`}>
          <span>DISPATCH MODE: {telemetry.modality_label}</span>
        </div>
      )}

      {/* E-Stop Notice */}
      {eStopEngaged && (
        <div className="bg-coral-red text-white font-black text-center py-1.5 px-4 text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-danger-glow animate-pulse">
          <ShieldAlert className="w-4 h-4 text-white" />
          <span>PILOT HYDRAULIC LOCKOUT ENGAGED • ALL JOYSTICK SIGNALS INHIBITED</span>
          <button
            onClick={() => setEStopEngaged(false)}
            className="ml-3 underline text-white hover:text-nordic-base text-xs font-bold"
          >
            DISENGAGE
          </button>
        </div>
      )}

      {/* Primary Navigation Ribbon (13 Integrated Views) */}
      <nav className="bg-nordic-base border-t border-nordic-border px-3 py-1.5 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {[
          { id: 'shift_briefing', label: '1. Shift Briefing' },
          { id: 'task_dashboard', label: '2. Tasks & ML Estimator' },
          { id: 'current_task', label: '3. Current Task HUD' },
          { id: 'safety_intel', label: '4. Safety Intelligence' },
          { id: '2d_map', label: '5. Live 2D Site Map' },
          { id: '360_radar', label: '6. 360° Around Me' },
          { id: 'event_replay', label: '7. Safety Replay' },
          { id: 'incident_report', label: '8. Incident Report' },
          { id: 'training_hub', label: '9. Training Hub' },
          { id: 'training_analytics', label: '10. Learn & Measure' },
          { id: 'safety_scorecard', label: '11. Safety Scorecard' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectView(tab.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === tab.id
                ? 'bg-ice-blue text-nordic-base shadow-sm'
                : 'text-nordic-muted hover:text-white hover:bg-nordic-card'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
