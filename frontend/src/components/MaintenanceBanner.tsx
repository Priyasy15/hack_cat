import React, { useState } from 'react';
import { Wrench, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Droplets, Activity, Gauge, Disc } from 'lucide-react';
import { MaintenanceData } from '../types';

interface MaintenanceBannerProps {
  maintenance: MaintenanceData | null;
}

export const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({ maintenance }) => {
  const [expanded, setExpanded] = useState(false);

  if (!maintenance) return null;

  const isUrgent = maintenance.urgency === 'URGENT';
  const isApproaching = maintenance.urgency === 'APPROACHING';

  const badgeColor = isUrgent
    ? 'bg-red-500 text-white'
    : isApproaching
    ? 'bg-cat-yellow text-cab-black font-bold'
    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';

  return (
    <div className="bg-cab-card border border-cab-border rounded-xl overflow-hidden shadow-lg transition-all duration-200">
      {/* Primary Banner Header */}
      <div className="p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
              isUrgent ? 'bg-red-600/20 text-red-400' : 'bg-cat-yellow/20 text-cat-yellow'
            }`}
          >
            <Wrench className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-industrial font-bold text-lg text-white tracking-wide">
                PREDICTIVE MAINTENANCE NUDGE
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${badgeColor}`}>
                {maintenance.badge}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-0.5">
              Next Service Window:{' '}
              <strong className="text-white font-mono text-base">
                ~{maintenance.hours_to_next_service.toFixed(1)} operating hours
              </strong>{' '}
              ({maintenance.service_type})
            </p>
          </div>
        </div>

        {/* Quick Wear Status Bar & Expand Button */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[10px]">OIL LIFE</span>
              <span
                className={`font-bold ${
                  maintenance.telemetry_health.oil_life_pct < 20 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {maintenance.telemetry_health.oil_life_pct}%
              </span>
            </div>
            <div className="h-6 w-px bg-cab-border" />
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[10px]">HYD. FILTER</span>
              <span
                className={`font-bold ${
                  maintenance.telemetry_health.hydraulic_filter_delta_bar > 1.8
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {maintenance.telemetry_health.hydraulic_filter_delta_bar} bar
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="touch-btn bg-cab-dark hover:bg-cab-card-hover border border-cab-border text-xs px-3.5 py-2 text-gray-200"
          >
            <span>{expanded ? 'Hide Telemetry' : 'View Health Diagnostics'}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Health Diagnostics View */}
      {expanded && (
        <div className="bg-cab-dark/95 border-t border-cab-border p-4 transition-all">
          <p className="text-xs text-cat-yellow font-mono mb-3 bg-cat-yellow/10 p-2.5 rounded border border-cat-yellow/20">
            {maintenance.nudge_message}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {/* Engine Oil Life */}
            <div className="bg-cab-card p-3 rounded-lg border border-cab-border flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Droplets className="w-4 h-4 text-cat-yellow" />
                  Engine Oil Life
                </span>
                <span className="font-mono">{maintenance.telemetry_health.oil_life_pct}%</span>
              </div>
              <div className="w-full bg-cab-black rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                    maintenance.telemetry_health.oil_life_pct < 20 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, maintenance.telemetry_health.oil_life_pct)}%` }}
                />
              </div>
            </div>

            {/* Hydraulic Filter Delta */}
            <div className="bg-cab-card p-3 rounded-lg border border-cab-border flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Gauge className="w-4 h-4 text-cat-yellow" />
                  Hydraulic Filter
                </span>
                <span className="font-mono text-white">
                  {maintenance.telemetry_health.hydraulic_filter_delta_bar} bar
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 mt-2">
                {maintenance.telemetry_health.hydraulic_filter_status}
              </span>
            </div>

            {/* Air Filter Restriction */}
            <div className="bg-cab-card p-3 rounded-lg border border-cab-border flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Activity className="w-4 h-4 text-cat-yellow" />
                  Air Restriction
                </span>
                <span className="font-mono text-white">
                  {maintenance.telemetry_health.air_filter_restriction_kpa} kPa
                </span>
              </div>
              <span className="text-[11px] text-gray-400 mt-2">Within Normal Specs</span>
            </div>

            {/* Undercarriage Wear */}
            <div className="bg-cab-card p-3 rounded-lg border border-cab-border flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Disc className="w-4 h-4 text-cat-yellow" />
                  Track Shoe Wear
                </span>
                <span className="font-mono text-white">
                  {maintenance.telemetry_health.track_shoe_wear_pct}%
                </span>
              </div>
              <span className="text-[11px] text-amber-400 mt-2">Inspect Sprockets at 500h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
