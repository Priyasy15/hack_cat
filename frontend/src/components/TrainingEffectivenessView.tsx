import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrainingEffectiveness } from '../types';
import { api } from '../api';

export const TrainingEffectivenessView: React.FC = () => {
  const [data, setData] = useState<TrainingEffectiveness | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getTrainingEffectiveness();
      setData(res);
    } catch (err) {
      console.error('Failed to load training effectiveness', err);
    }
  };

  if (!data) return null;

  const chartData = data.metrics.map((m) => ({
    name: m.category.split(' ')[0] + ' ' + (m.category.split(' ')[1] || ''),
    'Pre-Training': m.pre_training_value,
    'Post-Training': m.post_training_value,
    reduction: m.reduction_pct
  }));

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Title */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-ice-blue" />
            <h1 className="text-2xl font-bold font-industrial text-white tracking-wide uppercase">
              Measured Training Effectiveness & ROI Analytics
            </h1>
          </div>
          <p className="text-xs text-nordic-muted mt-1">
            Loop verified: <strong className="text-white">MONITOR → DETECT → EXPLAIN → ACT → LEARN → MEASURE IMPROVEMENT</strong>
          </p>
        </div>

        <div className="bg-frost-green/15 text-frost-green border border-frost-green/40 px-4 py-2 rounded-xl flex items-center gap-2 shadow-safe-glow">
          <Award className="w-5 h-5" />
          <span className="font-mono font-black text-sm">+{data.overall_improvement_pct}% SAFETY IMPROVEMENT</span>
        </div>
      </div>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-nordic-muted uppercase tracking-wider block mb-2">
                {metric.category}
              </span>

              <div className="flex items-baseline gap-3 my-3 font-mono">
                <div>
                  <span className="text-xs text-coral-red block uppercase font-bold">BEFORE</span>
                  <span className="text-3xl font-black text-coral-red">{metric.pre_training_value}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-nordic-muted mb-1" />
                <div>
                  <span className="text-xs text-frost-green block uppercase font-bold">AFTER</span>
                  <span className="text-3xl font-black text-frost-green">{metric.post_training_value}</span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-nordic-muted block">
                Unit: {metric.unit}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-nordic-border flex items-center justify-between font-mono text-xs">
              <span className="text-frost-green font-bold">-{metric.reduction_pct}% Reduction</span>
              <span className="text-nordic-muted">{metric.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Comparison Chart */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-nordic-border mb-4">
          <span className="text-xs font-mono font-bold text-ice-blue uppercase tracking-wider">
            Pre-Training Baseline vs Post-Training Telematics Verification
          </span>
          <span className="text-[10px] font-mono text-nordic-muted">
            Aggregated across 5 consecutive task cycles
          </span>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E3440" />
              <XAxis dataKey="name" stroke="#8E8E9B" fontSize={11} tickLine={false} />
              <YAxis stroke="#8E8E9B" fontSize={11} />
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
              <Bar dataKey="Pre-Training" fill="#BF616A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Post-Training" fill="#A3BE8C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
