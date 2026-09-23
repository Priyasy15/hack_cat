import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CloudRain,
  Sun,
  Wind,
  AlertTriangle,
  User,
  Truck,
  Clock,
  Radio,
  FileText,
  HelpCircle,
  Trophy,
  SlidersHorizontal,
  Flame,
  Power
} from 'lucide-react';
import { Operator, Machine, Telemetry } from '../types';

interface CabHeaderProps {
  operators: Operator[];
  machines: Machine[];
  selectedOperator: Operator;
  selectedMachine: Machine;
  telemetry: Telemetry | null;
  currentWeather: string;
  onSelectOperator: (op: Operator) => void;
  onSelectMachine: (m: Machine) => void;
  onChangeWeather: (weather: string) => void;
  onOpenShiftRecap: () => void;
  onOpenLeaderboard: () => void;
  onOpenTraining: () => void;
}

const WEATHER_OPTIONS = [
  "Sunny",
  "Rain",
  "Muddy/Wet",
  "High Wind",
  "Fog/Low Visibility",
  "Extreme Heat"
];

export const CabHeader: React.FC<CabHeaderProps> = ({
  operators,
  machines,
  selectedOperator,
  selectedMachine,
  telemetry,
  currentWeather,
  onSelectOperator,
  onSelectMachine,
  onChangeWeather,
  onOpenShiftRecap,
  onOpenLeaderboard,
  onOpenTraining
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [eStopTriggered, setEStopTriggered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'Rain':
      case 'Muddy/Wet':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'High Wind':
        return <Wind className="w-5 h-5 text-teal-300" />;
      case 'Extreme Heat':
        return <Flame className="w-5 h-5 text-orange-400" />;
      default:
        return <Sun className="w-5 h-5 text-cat-yellow" />;
    }
  };

  return (
    <header className="bg-cab-black border-b border-cab-border sticky top-0 z-40 shadow-xl">
      {/* Heavy Machinery Top Hazard Stripe */}
      <div className="h-1.5 w-full warning-stripes"></div>

      <div className="max-w-[1920px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Section: CAT Brand & Operator / Machine Selector */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* CAT Logo Emblem */}
          <div className="flex items-center gap-2.5 bg-cat-yellow px-3.5 py-1.5 rounded-md shadow-md text-cab-black select-none">
            <div className="w-6 h-6 bg-cab-black flex items-center justify-center rounded text-cat-yellow font-black text-xs tracking-tighter">
              CAT
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-base tracking-wider uppercase font-industrial">OperatorOS</span>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-85">In-Cab Command</span>
            </div>
          </div>

          {/* Machine Selector */}
          <div className="flex items-center bg-cab-card border border-cab-border rounded-lg px-2.5 py-1 text-sm">
            <Truck className="w-4 h-4 text-cat-yellow mr-2 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-mono leading-none">Equipment</span>
              <select
                className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer pr-2"
                value={selectedMachine.id}
                onChange={(e) => {
                  const m = machines.find((item) => item.id === e.target.value);
                  if (m) onSelectMachine(m);
                }}
              >
                {machines.map((m) => (
                  <option key={m.id} value={m.id} className="bg-cab-dark text-white font-medium">
                    {m.model} ({m.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Operator Selector */}
          <div className="flex items-center bg-cab-card border border-cab-border rounded-lg px-2.5 py-1 text-sm">
            <User className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-mono leading-none">Active Operator</span>
              <select
                className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer pr-2"
                value={selectedOperator.id}
                onChange={(e) => {
                  const op = operators.find((item) => item.id === e.target.value);
                  if (op) onSelectOperator(op);
                }}
              >
                {operators.map((op) => (
                  <option key={op.id} value={op.id} className="bg-cab-dark text-white font-medium">
                    {op.name} • {op.skill} [{op.id}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Weather Selector */}
          <div className="flex items-center bg-cab-card border border-cab-border rounded-lg px-2.5 py-1 text-sm">
            <div className="mr-2 shrink-0">{getWeatherIcon(currentWeather)}</div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-mono leading-none">Site Weather</span>
              <select
                className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer pr-2"
                value={currentWeather}
                onChange={(e) => onChangeWeather(e.target.value)}
              >
                {WEATHER_OPTIONS.map((w) => (
                  <option key={w} value={w} className="bg-cab-dark text-white font-medium">
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Center / Right Section: Quick Metrics & Cab Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Cab Telemetry Health Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-cab-card px-3 py-1.5 rounded-lg border border-cab-border">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-gray-400 font-mono">TELEMATICS:</span>{' '}
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
          </div>

          {/* Engine Hours Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-cab-card px-3 py-1.5 rounded-lg border border-cab-border font-mono text-xs">
            <Clock className="w-4 h-4 text-cat-yellow" />
            <span className="text-gray-400">HRS:</span>
            <span className="text-white font-bold">{telemetry?.engine_hours.toFixed(1) || '3,432.4'}h</span>
          </div>

          {/* Shift Time Clock */}
          <div className="flex items-center gap-1.5 bg-cab-card px-3 py-1.5 rounded-lg border border-cab-border font-mono text-xs">
            <span className="text-gray-400">SHIFT:</span>
            <span className="text-white font-bold tracking-wider">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTraining}
              className="touch-btn bg-cab-card hover:bg-cab-card-hover border border-cab-border text-xs px-3 py-2 text-gray-200"
              title="Open Training & Skill Badges"
            >
              <HelpCircle className="w-4 h-4 text-cat-yellow" />
              <span className="hidden md:inline">Training Hub</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="touch-btn bg-cab-card hover:bg-cab-card-hover border border-cab-border text-xs px-3 py-2 text-gray-200"
              title="Site Leaderboard"
            >
              <Trophy className="w-4 h-4 text-cat-yellow" />
              <span className="hidden md:inline">Leaderboard</span>
            </button>

            <button
              onClick={onOpenShiftRecap}
              className="touch-btn bg-cat-yellow hover:bg-cat-yellow-hover text-cab-black text-xs px-3.5 py-2 font-black shadow-cat-glow"
              title="Review and Submit Shift Summary"
            >
              <FileText className="w-4 h-4" />
              <span>Shift Recap</span>
            </button>

            {/* E-Stop Simulated Trigger */}
            <button
              onClick={() => setEStopTriggered(!eStopTriggered)}
              className={`touch-btn text-xs px-3 py-2 border font-bold ${
                eStopTriggered
                  ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-danger-glow'
                  : 'bg-red-950/60 hover:bg-red-900/80 text-red-300 border-red-800'
              }`}
              title="Simulate Cab Interlock / Emergency Stop"
            >
              <Power className="w-4 h-4" />
              <span className="hidden sm:inline">{eStopTriggered ? 'PILOT CUT' : 'E-STOP'}</span>
            </button>
          </div>
        </div>
      </div>

      {eStopTriggered && (
        <div className="bg-red-600 text-white font-black text-center py-1.5 px-4 text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-danger-glow animate-pulse">
          <AlertTriangle className="w-4 h-4 text-yellow-300" />
          <span>CAB HYDRAULIC PILOT LOCKOUT ENGAGED • ALL BOOM AND SWING FUNCTIONS INHIBITED</span>
          <button
            onClick={() => setEStopTriggered(false)}
            className="ml-4 underline text-yellow-300 hover:text-white text-xs font-bold"
          >
            DISENGAGE LOCKOUT
          </button>
        </div>
      )}
    </header>
  );
};
