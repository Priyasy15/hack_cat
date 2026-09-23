import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  AlertTriangle,
  Compass,
  Gauge,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { ScorecardData } from '../types';
import { api } from '../api';

interface OperatorSafetyScorecardProps {
  operatorId: string;
}

export const OperatorSafetyScorecard: React.FC<OperatorSafetyScorecardProps> = ({ operatorId }) => {
  const [scorecard, setScorecard] = useState<ScorecardData | null>(null);

  useEffect(() => {
    loadData();
  }, [operatorId]);

  const loadData = async () => {
    try {
      const data = await api.getScorecard(operatorId);
      setScorecard(data);
    } catch (err) {
      console.error('Failed to load scorecard', err);
    }
  };

  if (!scorecard) return null;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Title */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-ice-blue" />
            <h1 className="text-2xl font-bold font-industrial text-white tracking-wide uppercase">
              Operator Multi-Pillar Safety Scorecard
            </h1>
          </div>
          <p className="text-xs text-nordic-muted mt-1">
            Holistic assessment: Seatbelt (30%), Proximity (30%), Stability (20%), Smoothness (20%).
          </p>
        </div>

        <div className="flex items-baseline gap-3 bg-nordic-base px-4 py-2 rounded-xl border border-frost-green/40 shadow-safe-glow font-mono">
          <span className="text-3xl font-black text-frost-green font-industrial">{scorecard.grade}</span>
          <span className="text-xl font-bold text-white">{scorecard.composite_safety_score.toFixed(1)}/100</span>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Seatbelt */}
        <div className="bg-nordic-card p-4 rounded-xl border border-nordic-border">
          <div className="flex justify-between items-center text-xs font-mono text-nordic-muted mb-1">
            <span>Seatbelt Interlock</span>
            <span className="font-bold text-frost-green">{scorecard.sub_scores.seatbelt_compliance}%</span>
          </div>
          <div className="w-full bg-nordic-base rounded-full h-2 mt-2">
            <div className="bg-frost-green h-2 rounded-full" style={{ width: `${scorecard.sub_scores.seatbelt_compliance}%` }} />
          </div>
          <span className="text-[10px] font-mono text-nordic-muted mt-2 block">Zero unfastened alerts</span>
        </div>

        {/* Proximity */}
        <div className="bg-nordic-card p-4 rounded-xl border border-nordic-border">
          <div className="flex justify-between items-center text-xs font-mono text-nordic-muted mb-1">
            <span>Proximity Awareness</span>
            <span className="font-bold text-ice-blue">{scorecard.sub_scores.proximity_awareness}%</span>
          </div>
          <div className="w-full bg-nordic-base rounded-full h-2 mt-2">
            <div className="bg-ice-blue h-2 rounded-full" style={{ width: `${scorecard.sub_scores.proximity_awareness}%` }} />
          </div>
          <span className="text-[10px] font-mono text-nordic-muted mt-2 block">Blind spot cleared</span>
        </div>

        {/* Stability */}
        <div className="bg-nordic-card p-4 rounded-xl border border-nordic-border">
          <div className="flex justify-between items-center text-xs font-mono text-nordic-muted mb-1">
            <span>Machine Stability</span>
            <span className="font-bold text-pastel-ochre">{scorecard.sub_scores.machine_stability}%</span>
          </div>
          <div className="w-full bg-nordic-base rounded-full h-2 mt-2">
            <div className="bg-pastel-ochre h-2 rounded-full" style={{ width: `${scorecard.sub_scores.machine_stability}%` }} />
          </div>
          <span className="text-[10px] font-mono text-nordic-muted mt-2 block">Tilt within limits</span>
        </div>

        {/* Smoothness */}
        <div className="bg-nordic-card p-4 rounded-xl border border-nordic-border">
          <div className="flex justify-between items-center text-xs font-mono text-nordic-muted mb-1">
            <span>Smooth Operation</span>
            <span className="font-bold text-frost-green">{scorecard.sub_scores.smooth_operation}%</span>
          </div>
          <div className="w-full bg-nordic-base rounded-full h-2 mt-2">
            <div className="bg-frost-green h-2 rounded-full" style={{ width: `${scorecard.sub_scores.smooth_operation}%` }} />
          </div>
          <span className="text-[10px] font-mono text-nordic-muted mt-2 block">Cylinder end-stops cushioned</span>
        </div>
      </div>

      {/* Trend Area Chart */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-nordic-border mb-3">
          <span className="text-xs font-mono font-bold text-ice-blue uppercase tracking-wider">
            7-Day Operator Safety Score Evolution Trend
          </span>
          <span className="text-[10px] font-mono text-nordic-muted">
            Focus: <strong className="text-pastel-ochre">{scorecard.recommended_focus}</strong>
          </span>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={scorecard.trend} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="scoreNordic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#88C0D0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#88C0D0" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E3440" />
              <XAxis dataKey="date" stroke="#8E8E9B" fontSize={11} tickLine={false} />
              <YAxis stroke="#8E8E9B" fontSize={11} domain={[60, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E222A',
                  borderColor: '#2E3440',
                  borderRadius: '8px',
                  color: '#ECEFF4',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="score" stroke="#88C0D0" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreNordic)" name="Composite Score" />
              <Area type="monotone" dataKey="proximity" stroke="#A3BE8C" strokeWidth={1.5} fillOpacity={0} name="Proximity" />
              <Area type="monotone" dataKey="stability" stroke="#EBCB8B" strokeWidth={1.5} fillOpacity={0} name="Stability" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
