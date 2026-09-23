import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  UserX,
  Truck,
  AlertOctagon,
  Volume2,
  VolumeX,
  PlusCircle,
  Clock,
  Eye,
  Crosshair
} from 'lucide-react';
import { RadarResponse, Incident, Telemetry } from '../types';

interface SafetyRadarModuleProps {
  telemetry: Telemetry | null;
  radar: RadarResponse | null;
  incidents: Incident[];
  onToggleSeatbelt: () => void;
  onSimulateHazard: () => void;
}

export const SafetyRadarModule: React.FC<SafetyRadarModuleProps> = ({
  telemetry,
  radar,
  incidents,
  onToggleSeatbelt,
  onSimulateHazard
}) => {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const seatbeltFastened = telemetry?.seatbelt_status === 'Fastened';
  const hasCriticalHazard = radar?.danger_level === 'CRITICAL' || !seatbeltFastened;

  // Radar geometry helpers
  // Radar center is at (140, 140) with radius 120 (representing 20 meters, so scale = 120 / 20 = 6 px/m)
  const CX = 140;
  const CY = 140;
  const MAX_RADIUS = 120;
  const MAX_METERS = 20;

  const getCoordinates = (distanceMeters: number, angleDeg: number) => {
    // 0 deg is North (top), 90 is East, etc.
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    const r = (Math.min(distanceMeters, MAX_METERS) / MAX_METERS) * MAX_RADIUS;
    return {
      x: CX + r * Math.cos(rad),
      y: CY + r * Math.sin(rad)
    };
  };

  return (
    <div className="bg-cab-card border border-cab-border rounded-xl p-4 sm:p-5 shadow-lg flex flex-col h-full">
      {/* Module Title & Audio Simulation Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-cab-border">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cat-yellow" />
          <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
            Cab Safety & Proximity Radar
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-cab-dark border border-cab-border text-gray-300 hover:text-white text-xs flex items-center gap-1.5"
            title="Toggle Simulated Audible Alarm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            <span className="hidden sm:inline font-mono">{soundEnabled ? 'ALARM ON' : 'ALARM MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Primary Safety Status Cards: Seatbelt & Radar Proximity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Seatbelt Interlock Card */}
        <div
          className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
            seatbeltFastened
              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-safe-glow'
              : 'bg-red-950/40 border-red-500 animate-pulse shadow-danger-glow'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                Primary Operator Interlock
              </span>
              <div className="flex items-center gap-2 mt-1">
                {seatbeltFastened ? (
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                ) : (
                  <AlertOctagon className="w-7 h-7 text-red-500 animate-bounce" />
                )}
                <div>
                  <h3 className="text-lg font-black tracking-wide uppercase font-industrial text-white">
                    {seatbeltFastened ? 'SEATBELT FASTENED' : 'SEATBELT UNFASTENED!'}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {seatbeltFastened
                      ? 'Cab pilot hydraulics unlocked & certified safe.'
                      : 'WARNING: Pilot hydraulics must be locked out per OSHA standard.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onToggleSeatbelt}
            className={`mt-4 touch-btn text-xs font-bold uppercase tracking-wider ${
              seatbeltFastened
                ? 'bg-cab-dark hover:bg-cab-black border border-cab-border text-gray-200'
                : 'bg-red-600 hover:bg-red-700 text-white font-black'
            }`}
          >
            <span>{seatbeltFastened ? 'Simulate Unbuckling' : 'Click to Fasten Seatbelt'}</span>
          </button>
        </div>

        {/* Hazard Alert Banner Card */}
        <div
          className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
            radar?.danger_level === 'CRITICAL'
              ? 'bg-red-950/40 border-red-500 shadow-danger-glow'
              : radar?.danger_level === 'WARNING'
              ? 'bg-amber-950/30 border-amber-500/40'
              : 'bg-cab-dark border-cab-border'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                360° Proximity Zone
              </span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                  radar?.danger_level === 'CRITICAL'
                    ? 'bg-red-500 text-white animate-pulse'
                    : radar?.danger_level === 'WARNING'
                    ? 'bg-amber-500 text-cab-black'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {radar?.danger_level || 'SCANNING'}
              </span>
            </div>

            <div className="mt-2">
              <h3 className="text-base font-bold text-white">
                {radar?.closest_hazard
                  ? `Hazard: ${radar.closest_hazard.name} (${radar.closest_hazard.distance_m}m)`
                  : 'Clear Perimeter: No immediate hazards detected'}
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                {radar?.closest_hazard?.distance_m && radar.closest_hazard.distance_m < 5.0
                  ? 'CRITICAL: Ground personnel inside 5.0m swing perimeter!'
                  : 'Radar scanning 360° perimeter with ultrasonic LiDAR sensors.'}
              </p>
            </div>
          </div>

          <button
            onClick={onSimulateHazard}
            className="mt-4 touch-btn bg-cat-yellow/15 hover:bg-cat-yellow/25 border border-cat-yellow/40 text-cat-yellow text-xs font-bold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simulate Proximity Breach Alert</span>
          </button>
        </div>
      </div>

      {/* Visual Radar & Incident Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Animated 360° SVG Radar Screen (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 bg-cab-dark rounded-xl border border-cab-border relative overflow-hidden">
          <div className="relative w-[280px] h-[280px]">
            {/* SVG Radar Instrument */}
            <svg className="w-full h-full" viewBox="0 0 280 280">
              <defs>
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.08" />
                  <stop offset="70%" stopColor="#22C55E" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#0F0F11" stopOpacity="0.9" />
                </radialGradient>
                <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFCD11" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#FFCD11" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Background circular radar grid */}
              <circle cx={CX} cy={CY} r={MAX_RADIUS} fill="url(#radarGlow)" stroke="#363640" strokeWidth="1.5" />
              {/* Range rings (5m, 10m, 15m) */}
              <circle cx={CX} cy={CY} r={MAX_RADIUS * 0.75} fill="none" stroke="#282832" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx={CX} cy={CY} r={MAX_RADIUS * 0.50} fill="none" stroke="#3A3A48" strokeWidth="1.2" />
              {/* 5m Danger zone circle */}
              <circle cx={CX} cy={CY} r={MAX_RADIUS * 0.25} fill="rgba(239, 68, 68, 0.08)" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2,2" />

              {/* Axis crosshairs */}
              <line x1={CX} y1={CY - MAX_RADIUS} x2={CX} y2={CY + MAX_RADIUS} stroke="#363640" strokeWidth="1" />
              <line x1={CX - MAX_RADIUS} y1={CY} x2={CX + MAX_RADIUS} y2={CY} stroke="#363640" strokeWidth="1" />

              {/* Distance Labels */}
              <text x={CX + 3} y={CY - MAX_RADIUS * 0.25 - 2} fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold">5m (CRITICAL)</text>
              <text x={CX + 3} y={CY - MAX_RADIUS * 0.50 - 2} fill="#F59E0B" fontSize="8" fontFamily="monospace">10m</text>
              <text x={CX + 3} y={CY - MAX_RADIUS * 0.75 - 2} fill="#6B7280" fontSize="8" fontFamily="monospace">15m</text>
              <text x={CX + 3} y={CY - MAX_RADIUS + 10} fill="#6B7280" fontSize="8" fontFamily="monospace">20m</text>

              {/* Center Machine Representation (Excavator / Loader) */}
              <rect x={CX - 8} y={CY - 12} width="16" height="24" rx="2" fill="#FFCD11" stroke="#0F0F11" strokeWidth="1.5" />
              <line x1={CX} y1={CY - 12} x2={CX} y2={CY - 22} stroke="#FFCD11" strokeWidth="3" strokeLinecap="round" />

              {/* Rotating Sweep Beam */}
              <g className="origin-[140px_140px] animate-radar-sweep">
                <path
                  d={`M ${CX} ${CY} L ${CX} ${CY - MAX_RADIUS} A ${MAX_RADIUS} ${MAX_RADIUS} 0 0 1 ${CX + MAX_RADIUS * 0.707} ${CY - MAX_RADIUS * 0.707} Z`}
                  fill="url(#sweepGradient)"
                />
                <line x1={CX} y1={CY} x2={CX} y2={CY - MAX_RADIUS} stroke="#FFCD11" strokeWidth="1.8" />
              </g>

              {/* Object Blips */}
              {radar?.objects.map((obj) => {
                const { x, y } = getCoordinates(obj.distance_m, obj.angle_deg);
                const isCritical = obj.alert_level === 'CRITICAL';
                const isWarning = obj.alert_level === 'WARNING';
                const color = isCritical ? '#EF4444' : isWarning ? '#F59E0B' : '#22C55E';

                return (
                  <g key={obj.id} className="cursor-pointer">
                    {/* Pulsing ring for critical blips */}
                    {isCritical && (
                      <circle cx={x} cy={y} r="12" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-ping origin-center" />
                    )}
                    <circle cx={x} cy={y} r={isCritical ? '6' : '4.5'} fill={color} stroke="#0F0F11" strokeWidth="1.5" />
                    <text x={x + 7} y={y + 3} fill="#FFFFFF" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                      {obj.name.split(' ')[0]} ({obj.distance_m}m)
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Radar Coordinates Overlay */}
            <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[10px] text-cat-yellow">
              <Crosshair className="w-3 h-3 animate-spin" />
              <span>RADAR 360° ACTIVE</span>
            </div>
            <div className="absolute bottom-2 right-2 font-mono text-[9px] text-gray-400">
              RANGE: 20 METERS
            </div>
          </div>
        </div>

        {/* Live Safety Incidents Log (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-full bg-cab-dark rounded-xl border border-cab-border p-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-cab-border">
            <span className="font-industrial font-bold text-sm text-white uppercase tracking-wider">
              Safety Incident & Telematics Audit Log
            </span>
            <span className="text-[11px] font-mono text-gray-400">
              {incidents.length} events logged today
            </span>
          </div>

          <div className="space-y-2 mt-3 overflow-y-auto max-h-[220px] pr-1">
            {incidents.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs font-mono">
                Zero safety incidents logged today. Optimal safety streak!
              </div>
            ) : (
              incidents.map((inc) => {
                const isCritical = inc.severity === 'CRITICAL';
                return (
                  <div
                    key={inc.id}
                    className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1 transition-all ${
                      isCritical
                        ? 'bg-red-950/30 border-red-800/60 text-red-200'
                        : 'bg-cab-card border-cab-border text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                            isCritical ? 'bg-red-600 text-white' : 'bg-cat-yellow text-cab-black'
                          }`}
                        >
                          {inc.type}
                        </span>
                        <span className="text-gray-400 text-[11px]">{inc.id}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    <p className="font-semibold text-white mt-0.5">{inc.description}</p>
                    <p className="text-[11px] text-gray-400 font-mono italic">
                      Action: {inc.action_taken}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
