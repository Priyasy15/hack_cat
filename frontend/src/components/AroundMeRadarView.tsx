import React from 'react';
import { Radio, ShieldAlert, Crosshair, AlertTriangle, Clock, Volume2 } from 'lucide-react';
import { RadarResponse } from '../types';

interface AroundMeRadarViewProps {
  radar: RadarResponse | null;
}

export const AroundMeRadarView: React.FC<AroundMeRadarViewProps> = ({ radar }) => {
  if (!radar) return null;

  const CX = 180;
  const CY = 180;
  const MAX_RADIUS = 150;
  const MAX_METERS = 20;

  const getCoords = (distM: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    const r = (Math.min(distM, MAX_METERS) / MAX_METERS) * MAX_RADIUS;
    return {
      x: CX + r * Math.cos(rad),
      y: CY + r * Math.sin(rad)
    };
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-ice-blue" />
            <h1 className="text-2xl font-bold font-industrial text-white tracking-wide uppercase">
              360° Around-Me Spatial Radar
            </h1>
          </div>
          <p className="text-xs text-nordic-muted mt-1">
            LiDAR sweeping radar calculating trajectory seconds-to-impact and blind spot penetration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-lg text-xs font-mono font-black uppercase ${
            radar.danger_level === 'CRITICAL' ? 'bg-coral-red text-white animate-pulse' :
            radar.danger_level === 'CAUTION' ? 'bg-pastel-ochre text-nordic-base' :
            'bg-frost-green text-nordic-base'
          }`}>
            Threat Level: {radar.danger_level}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Animated 360° Radar Instrument (6 cols) */}
        <div className="lg:col-span-6 bg-nordic-card border border-nordic-border rounded-xl p-6 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-[360px] h-[360px] max-w-full">
            <svg className="w-full h-full" viewBox="0 0 360 360">
              <defs>
                <radialGradient id="radarDarkGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1E222A" stopOpacity="1" />
                  <stop offset="85%" stopColor="#121418" stopOpacity="1" />
                </radialGradient>
                <linearGradient id="sweepIce" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#88C0D0" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#88C0D0" stopOpacity="0" />
                </linearGradient>
              </defs>

              <circle cx={CX} cy={CY} r={MAX_RADIUS} fill="url(#radarDarkGlow)" stroke="#2E3440" strokeWidth="1.5" />
              <circle cx={CX} cy={CY} r={MAX_RADIUS * 0.75} fill="none" stroke="#242933" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx={CX} cy={CY} r={MAX_RADIUS * 0.50} fill="none" stroke="#2E3440" strokeWidth="1.2" />
              <circle cx={CX} cy={CY} r={MAX_RADIUS * 0.25} fill="rgba(191, 97, 106, 0.1)" stroke="#BF616A" strokeWidth="1.5" strokeDasharray="2,2" />

              {/* Crosshairs */}
              <line x1={CX} y1={CY - MAX_RADIUS} x2={CX} y2={CY + MAX_RADIUS} stroke="#2E3440" strokeWidth="1" />
              <line x1={CX - MAX_RADIUS} y1={CY} x2={CX + MAX_RADIUS} y2={CY} stroke="#2E3440" strokeWidth="1" />

              {/* Distance text */}
              <text x={CX + 3} y={CY - MAX_RADIUS * 0.25 - 2} fill="#BF616A" fontSize="8" fontFamily="monospace">5m (CRITICAL)</text>
              <text x={CX + 3} y={CY - MAX_RADIUS * 0.50 - 2} fill="#EBCB8B" fontSize="8" fontFamily="monospace">10m</text>
              <text x={CX + 3} y={CY - MAX_RADIUS * 0.75 - 2} fill="#4C566A" fontSize="8" fontFamily="monospace">15m</text>
              <text x={CX + 3} y={CY - MAX_RADIUS + 10} fill="#4C566A" fontSize="8" fontFamily="monospace">20m</text>

              {/* Center Excavator */}
              <rect x={CX - 8} y={CY - 14} width="16" height="28" rx="2" fill="#88C0D0" stroke="#121418" strokeWidth="1.5" />
              <line x1={CX} y1={CY - 14} x2={CX} y2={CY - 28} stroke="#88C0D0" strokeWidth="3" strokeLinecap="round" />

              {/* Sweeping Beam */}
              <g className="origin-[180px_180px] animate-radar-sweep">
                <path
                  d={`M ${CX} ${CY} L ${CX} ${CY - MAX_RADIUS} A ${MAX_RADIUS} ${MAX_RADIUS} 0 0 1 ${CX + MAX_RADIUS * 0.707} ${CY - MAX_RADIUS * 0.707} Z`}
                  fill="url(#sweepIce)"
                />
                <line x1={CX} y1={CY} x2={CX} y2={CY - MAX_RADIUS} stroke="#88C0D0" strokeWidth="1.8" />
              </g>

              {/* Blip Objects */}
              {radar.objects.map((obj) => {
                const { x, y } = getCoords(obj.distance_m, obj.angle_deg);
                const isCrit = obj.zone === 'CRITICAL';
                const isWarn = obj.zone === 'CAUTION';
                const color = isCrit ? '#BF616A' : isWarn ? '#EBCB8B' : '#A3BE8C';

                return (
                  <g key={obj.id} className="cursor-pointer">
                    {isCrit && (
                      <circle cx={x} cy={y} r="14" fill="none" stroke="#BF616A" strokeWidth="1.5" className="animate-ping origin-center" />
                    )}
                    <circle cx={x} cy={y} r={isCrit ? '7' : '5'} fill={color} stroke="#121418" strokeWidth="1.5" />
                    <text x={x + 8} y={y + 3} fill="#ECEFF4" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                      {obj.name.split(' ')[0]} ({obj.distance_m}m)
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[10px] text-ice-blue">
              <Crosshair className="w-3 h-3 animate-spin" />
              <span>RADAR 360° SWEEP</span>
            </div>
            <div className="absolute bottom-2 right-2 font-mono text-[9px] text-nordic-muted">
              ULTRASONIC + LIDAR
            </div>
          </div>
        </div>

        {/* Proximity Objects Trajectory Table (6 cols) */}
        <div className="lg:col-span-6 bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-ice-blue uppercase tracking-wider block mb-3">
              Perimeter Objects & Trajectory Seconds-To-Impact
            </span>

            <div className="space-y-3">
              {radar.objects.map((obj) => {
                const isCrit = obj.zone === 'CRITICAL';
                const isWarn = obj.zone === 'CAUTION';

                return (
                  <div
                    key={obj.id}
                    className={`p-4 rounded-xl border text-xs font-mono flex flex-col gap-2 ${
                      isCrit ? 'bg-coral-red/15 border-coral-red/60 text-white' :
                      isWarn ? 'bg-pastel-ochre/15 border-pastel-ochre/40 text-nordic-text' :
                      'bg-nordic-base border-nordic-border text-nordic-text'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                          isCrit ? 'bg-coral-red text-white' : isWarn ? 'bg-pastel-ochre text-nordic-base' : 'bg-frost-green text-nordic-base'
                        }`}>
                          {obj.zone}
                        </span>
                        <span className="font-bold text-sm text-white">{obj.name}</span>
                      </div>
                      <span className="text-xs font-bold text-ice-blue">{obj.distance_m} meters</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-nordic-muted">
                      <div>Bearing: <strong className="text-white">{obj.angle_deg}°</strong></div>
                      <div>Speed: <strong className="text-white">{obj.speed_kmh} km/h</strong></div>
                      <div>Blind Spot: <strong className={obj.in_blind_spot ? 'text-coral-red' : 'text-frost-green'}>
                        {obj.in_blind_spot ? 'YES (Rear Arc)' : 'NO (Cab Clear)'}
                      </strong></div>
                      <div>Impact Window: <strong className={obj.seconds_to_impact < 5 ? 'text-coral-red font-bold' : 'text-white'}>
                        {obj.seconds_to_impact < 100 ? `${obj.seconds_to_impact} sec` : 'Safe'}
                      </strong></div>
                    </div>

                    <div className="p-2 rounded bg-nordic-card/80 border border-nordic-border text-[11px] text-nordic-text">
                      Action: {obj.recommended_action}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-nordic-border text-xs font-mono text-nordic-muted flex items-center justify-between">
            <span>Blind Spot Detection: <strong>ACTIVE</strong></span>
            <span>Audible Chime: <strong className="text-frost-green">ARMED</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
