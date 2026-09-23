import React, { useState } from 'react';
import { MapPin, AlertTriangle, Eye, ShieldAlert, Navigation, User, Crosshair } from 'lucide-react';
import { MapEntities, MapPerson } from '../types';

interface Live2DSafetyMapProps {
  mapData: MapEntities;
}

export const Live2DSafetyMap: React.FC<Live2DSafetyMapProps> = ({ mapData }) => {
  const [selectedPerson, setSelectedPerson] = useState<MapPerson | null>(null);

  // SVG coordinate transformation:
  // Center is (250, 250), range is ±20 meters, so 1 meter = 10 px
  const CX = 250;
  const CY = 250;
  const SCALE = 10; // 10px per meter

  const toSvgX = (xMeters: number) => CX + xMeters * SCALE;
  const toSvgY = (yMeters: number) => CY - yMeters * SCALE;

  const machine = mapData.machine;
  const swingPx = machine.swing_radius_m * SCALE;
  const dangerPx = machine.danger_zone_m * SCALE;
  const cautionPx = machine.caution_zone_m * SCALE;

  const personInBlindSpot = mapData.personnel.some((p) => p.in_blind_spot && p.zone !== 'SAFE');

  // Calculate blind spot wedge SVG path
  // Arc from start angle to end angle
  const startRad = ((machine.blind_spot_angles.start - 90) * Math.PI) / 180;
  const endRad = ((machine.blind_spot_angles.end - 90) * Math.PI) / 180;
  const x1 = CX + cautionPx * Math.cos(startRad);
  const y1 = CY + cautionPx * Math.sin(startRad);
  const x2 = CX + cautionPx * Math.cos(endRad);
  const y2 = CY + cautionPx * Math.sin(endRad);

  const blindSpotPath = `M ${CX} ${CY} L ${x1} ${y1} A ${cautionPx} ${cautionPx} 0 0 1 ${x2} ${y2} Z`;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Map Header */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-ice-blue" />
            <h1 className="text-2xl font-bold font-industrial text-white tracking-wide uppercase">
              Live 2D Cab Safety Map & Dynamic Blind Spots
            </h1>
          </div>
          <p className="text-xs text-nordic-muted mt-1">
            Real-time top-down spatial positioning with LiDAR/GPS person vectors and machine swing radius.
          </p>
        </div>

        {personInBlindSpot && (
          <div className="bg-coral-red text-white text-xs font-mono font-black px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse shadow-danger-glow">
            <AlertTriangle className="w-4 h-4" />
            <span>⚠️ PERSON IN BLIND SPOT DETECTED</span>
          </div>
        )}
      </div>

      {/* Main Interactive Map & Details Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* SVG Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-nordic-card border border-nordic-border rounded-xl p-4 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-[500px] h-[500px] max-w-full max-h-[500px]">
            <svg className="w-full h-full" viewBox="0 0 500 500">
              <defs>
                <radialGradient id="siteGrid" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1E222A" stopOpacity="1" />
                  <stop offset="90%" stopColor="#121418" stopOpacity="1" />
                </radialGradient>
              </defs>

              {/* Background site ground */}
              <rect width="500" height="500" fill="url(#siteGrid)" rx="16" />

              {/* Grid lines (5m intervals = 50px) */}
              {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((pos) => (
                <g key={pos}>
                  <line x1={pos} y1="0" x2={pos} y2="500" stroke="#242933" strokeWidth="0.8" />
                  <line x1="0" y1={pos} x2="500" y2={pos} stroke="#242933" strokeWidth="0.8" />
                </g>
              ))}

              {/* Range Circles */}
              {/* Caution Zone Circle (9.0m = 90px) */}
              <circle cx={CX} cy={CY} r={cautionPx} fill="rgba(235, 203, 139, 0.05)" stroke="#EBCB8B" strokeWidth="1.2" strokeDasharray="4,4" />
              {/* Danger Zone Circle (4.5m = 45px) */}
              <circle cx={CX} cy={CY} r={dangerPx} fill="rgba(191, 97, 106, 0.08)" stroke="#BF616A" strokeWidth="1.5" />
              {/* Swing Radius Circle (7.2m = 72px) */}
              <circle cx={CX} cy={CY} r={swingPx} fill="none" stroke="#88C0D0" strokeWidth="1.2" strokeDasharray="3,3" />

              {/* Excavator Blind Spot Shaded Wedge */}
              <path d={blindSpotPath} fill="rgba(191, 97, 106, 0.22)" stroke="#BF616A" strokeWidth="1.5" />
              <text x={CX - 80} y={CY + 75} fill="#BF616A" fontSize="9" fontWeight="bold" fontFamily="monospace">
                REAR BLIND SPOT
              </text>

              {/* Distance Markings */}
              <text x={CX + 3} y={CY - dangerPx - 2} fill="#BF616A" fontSize="8" fontFamily="monospace">4.5m Danger</text>
              <text x={CX + 3} y={CY - swingPx - 2} fill="#88C0D0" fontSize="8" fontFamily="monospace">7.2m Swing</text>
              <text x={CX + 3} y={CY - cautionPx - 2} fill="#EBCB8B" fontSize="8" fontFamily="monospace">9.0m Caution</text>

              {/* Center Heavy Machine Body */}
              <g transform={`rotate(${machine.heading_deg} ${CX} ${CY})`}>
                {/* Tracks */}
                <rect x={CX - 14} y={CY - 22} width="8" height="44" rx="2" fill="#2E3440" stroke="#88C0D0" strokeWidth="1" />
                <rect x={CX + 6} y={CY - 22} width="8" height="44" rx="2" fill="#2E3440" stroke="#88C0D0" strokeWidth="1" />
                {/* Main Cab House */}
                <rect x={CX - 10} y={CY - 16} width="20" height="32" rx="3" fill="#1E222A" stroke="#ECEFF4" strokeWidth="1.5" />
                {/* Excavator Boom Line pointing Forward */}
                <line x1={CX} y1={CY - 16} x2={CX} y2={CY - swingPx} stroke="#88C0D0" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx={CX} cy={CY - swingPx} r="4" fill="#88C0D0" />
              </g>

              {/* Personnel Positions with Movement Vectors */}
              {mapData.personnel.map((p) => {
                const px = toSvgX(p.x);
                const py = toSvgY(p.y);
                const isCrit = p.zone === 'CRITICAL';
                const isWarn = p.zone === 'CAUTION';
                const color = isCrit ? '#BF616A' : isWarn ? '#EBCB8B' : '#A3BE8C';

                return (
                  <g
                    key={p.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setSelectedPerson(p)}
                  >
                    {/* Pulsing ring if in blind spot or critical */}
                    {(p.in_blind_spot || isCrit) && (
                      <circle cx={px} cy={py} r="14" fill="none" stroke={color} strokeWidth="1.5" className="animate-ping origin-center" />
                    )}
                    {/* Velocity Vector */}
                    <line x1={px} y1={py} x2={px + p.vx * 25} y2={py - p.vy * 25} stroke={color} strokeWidth="2" strokeLinecap="round" />
                    {/* Person icon dot */}
                    <circle cx={px} cy={py} r="6.5" fill={color} stroke="#121418" strokeWidth="1.5" />
                    <text x={px + 8} y={py + 3} fill="#ECEFF4" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      {p.name.split(' ')[0]} ({p.distance_m}m)
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[10px] text-ice-blue bg-nordic-base/80 px-2 py-1 rounded">
              <Crosshair className="w-3 h-3 animate-spin" />
              <span>2D SITE GPS / LIDAR MAP</span>
            </div>
            <div className="absolute bottom-2 right-2 font-mono text-[9px] text-nordic-muted bg-nordic-base/80 px-2 py-1 rounded">
              GRID: 5m SQUARES
            </div>
          </div>
        </div>

        {/* Person / Object Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-ice-blue uppercase tracking-wider block mb-3">
              Ground Personnel Telemetry Inspector
            </span>

            {selectedPerson ? (
              <div className="space-y-3 bg-nordic-base p-4 rounded-xl border border-nordic-border">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">{selectedPerson.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                    selectedPerson.zone === 'CRITICAL' ? 'bg-coral-red text-white' :
                    selectedPerson.zone === 'CAUTION' ? 'bg-pastel-ochre text-nordic-base' :
                    'bg-frost-green text-nordic-base'
                  }`}>
                    {selectedPerson.zone}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono text-nordic-muted">
                  <div className="flex justify-between">
                    <span>Distance to Cab:</span>
                    <strong className="text-white">{selectedPerson.distance_m} meters</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Blind Spot Status:</span>
                    <strong className={selectedPerson.in_blind_spot ? 'text-coral-red' : 'text-frost-green'}>
                      {selectedPerson.in_blind_spot ? '⚠️ INSIDE BLIND SPOT' : 'VISIBLE TO CAB'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Relative Coords:</span>
                    <strong className="text-white">({selectedPerson.x}m, {selectedPerson.y}m)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Velocity Vector:</span>
                    <strong className="text-white">{Math.hypot(selectedPerson.vx, selectedPerson.vy).toFixed(1)} m/s</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-nordic-card border border-nordic-border text-xs text-nordic-text mt-3">
                  Recommendation: {selectedPerson.in_blind_spot ? 'Audible horn blast sent to hardhat beacon.' : 'Perimeter within safe clearance.'}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-nordic-muted font-mono text-xs bg-nordic-base p-6 rounded-xl border border-nordic-border">
                Click any worker dot on the 2D map to inspect coordinates and blind spot risk vectors.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-nordic-border text-xs font-mono text-nordic-muted flex items-center justify-between">
            <span>Blind Spot Arc: <strong>130° - 230°</strong></span>
            <span>LiDAR Status: <strong className="text-frost-green">LOCKED</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
