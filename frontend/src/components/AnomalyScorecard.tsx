import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Fuel,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Clock,
  Gauge
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
import { Scorecard } from '../types';

interface AnomalyScorecardProps {
  scorecard: Scorecard | null;
}

export const AnomalyScorecard: React.FC<AnomalyScorecardProps> = ({ scorecard }) => {
  if (!scorecard) return null;

  const isGradeGood = scorecard.score >= 80;
  const isGradeWarning = scorecard.score >= 60 && scorecard.score < 80;
  const gradeColor = isGradeGood
    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20'
    : isGradeWarning
    ? 'text-amber-400 border-amber-500/40 bg-amber-950/20'
    : 'text-red-400 border-red-500/40 bg-red-950/20';

  // Format Recharts data
  const chartData = scorecard.trend_history.map((pt) => ({
    date: pt.date,
    Score: pt.score,
    'Idling %': pt.idling_pct,
    'Seatbelt Violations': pt.seatbelt_violations
  }));

  return (
    <div className="bg-cab-card border border-cab-border rounded-xl p-4 sm:p-5 shadow-lg flex flex-col h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-cab-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cat-yellow" />
          <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
            Anomaly Detection & Operator Scorecard
          </h2>
        </div>
        <span className="text-xs font-mono text-gray-400">
          Operator: <strong className="text-cat-yellow">{scorecard.operator_id}</strong>
        </span>
      </div>

      {/* Top Metrics Row: Score Grade & Idling Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {/* Safety Score Card */}
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${gradeColor}`}>
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
            Safety & Compliance Rating
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-black font-industrial tracking-tight">
              {scorecard.grade}
            </span>
            <span className="text-xl font-bold font-mono">
              {scorecard.score.toFixed(1)}/100
            </span>
          </div>
          <span className="text-xs font-medium mt-1">
            {scorecard.status_text}
          </span>
        </div>

        {/* Idling vs Benchmark Ratio Card */}
        <div className="bg-cab-dark p-4 rounded-xl border border-cab-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                Shift Idling Ratio
              </span>
              <Gauge className="w-4 h-4 text-cat-yellow" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-3xl font-black font-mono ${
                scorecard.idling_pct > 30 ? 'text-red-400' : scorecard.idling_pct > 22 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {scorecard.idling_pct}%
              </span>
              <span className="text-xs text-gray-400 font-mono">/ 22.0% site limit</span>
            </div>
          </div>

          <div className="mt-2">
            <div className="w-full bg-cab-black rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full ${
                  scorecard.idling_pct > 30 ? 'bg-red-500' : scorecard.idling_pct > 22 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (scorecard.idling_pct / 50) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 mt-1 block">
              {scorecard.idling_pct > 22
                ? `Exceeds benchmark by ${(scorecard.idling_pct - 22).toFixed(1)}%`
                : 'Within Caterpillar eco-idling targets'}
            </span>
          </div>
        </div>

        {/* Seatbelt Compliance Card */}
        <div className="bg-cab-dark p-4 rounded-xl border border-cab-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
              Interlock Status
            </span>
            {scorecard.seatbelt_status === 'Fastened' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-500" />
            )}
          </div>

          <div className="mt-1">
            <span className={`text-2xl font-black tracking-wide uppercase font-industrial ${
              scorecard.seatbelt_status === 'Fastened' ? 'text-emerald-400' : 'text-red-500'
            }`}>
              {scorecard.seatbelt_status}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              {scorecard.seatbelt_status === 'Fastened'
                ? 'Zero unfastened infractions active.'
                : 'Violation detected: -20 point penalty applied.'}
            </p>
          </div>

          <div className="text-[10px] font-mono text-cat-yellow mt-2">
            OSHA Subpart P Compliant
          </div>
        </div>
      </div>

      {/* Recharts 5-to-7 Day Trend Chart */}
      <div className="bg-cab-dark p-4 rounded-xl border border-cab-border my-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-industrial font-bold uppercase tracking-wider text-gray-200">
            5-Day Trend: Safety Score vs Idling Ratio %
          </span>
          <span className="text-[10px] font-mono text-gray-400">Telemetry History</span>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="idleColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFCD11" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FFCD11" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#282832" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#16161B',
                  borderColor: '#363640',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Area
                type="monotone"
                dataKey="Score"
                stroke="#22C55E"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scoreColor)"
              />
              <Area
                type="monotone"
                dataKey="Idling %"
                stroke="#FFCD11"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#idleColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Surfaced Anomaly Flags */}
      <div className="mt-3">
        <span className="text-xs font-industrial font-bold uppercase tracking-wider text-gray-300 block mb-2">
          Surfaced Operational Anomaly Flags
        </span>

        <div className="space-y-2">
          {scorecard.anomaly_flags.map((flag, idx) => {
            const isCrit = flag.severity === 'CRITICAL';
            const isWarn = flag.severity === 'WARNING';
            const badgeBg = isCrit
              ? 'bg-red-950/30 border-red-800/60 text-red-200'
              : isWarn
              ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
              : 'bg-emerald-950/20 border-emerald-800/50 text-emerald-200';

            return (
              <div key={idx} className={`p-3 rounded-lg border text-xs flex flex-col gap-1 ${badgeBg}`}>
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold flex items-center gap-1.5">
                    {isCrit ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> : <Fuel className="w-3.5 h-3.5 text-cat-yellow" />}
                    {flag.code}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cab-black/40">
                    {flag.severity}
                  </span>
                </div>
                <p className="font-medium text-white">{flag.message}</p>
                <p className="text-[11px] opacity-80 font-mono">Impact: {flag.impact}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
