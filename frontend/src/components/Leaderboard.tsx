import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Flame, X, ShieldCheck, Gauge, ArrowUpRight } from 'lucide-react';
import { LeaderboardItem } from '../types';
import { api } from '../api';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  activeOperatorId: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose, activeOperatorId }) => {
  const [board, setBoard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getLeaderboard();
      setBoard(data);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-cat-yellow text-cab-black font-black flex items-center justify-center shadow-cat-glow text-sm">
            1
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-300 text-cab-black font-black flex items-center justify-center text-sm">
            2
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-sm">
            3
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-cab-dark text-gray-400 font-bold flex items-center justify-center text-xs border border-cab-border">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cab-card border border-cab-border rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cab-border flex items-center justify-between bg-cab-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cat-yellow flex items-center justify-center text-cab-black shadow-cat-glow">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
                Site Operator Efficiency & Safety Leaderboard
              </h2>
              <p className="text-xs text-gray-400">
                Gamified rankings: Safety Score (55%) + Eco-Efficiency (45%)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-cab-dark hover:bg-cab-card-hover text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Podium Top 3 Display */}
        {board.length >= 3 && (
          <div className="p-4 sm:p-6 bg-cab-dark border-b border-cab-border grid grid-cols-3 gap-3 text-center">
            {/* 2nd Place */}
            <div className="bg-cab-card p-3 rounded-xl border border-cab-border flex flex-col items-center justify-end pt-4">
              <div className="w-10 h-10 rounded-full bg-slate-300 text-cab-black font-black flex items-center justify-center mb-1">
                2nd
              </div>
              <span className="font-bold text-white text-sm">{board[1].name}</span>
              <span className="text-[10px] text-gray-400 font-mono">{board[1].badge}</span>
              <span className="text-xl font-black font-mono text-cat-yellow mt-1">
                {board[1].composite_score}
              </span>
            </div>

            {/* 1st Place */}
            <div className="bg-cab-card p-4 rounded-xl border-2 border-cat-yellow shadow-cat-glow flex flex-col items-center justify-end -mt-2">
              <div className="w-12 h-12 rounded-full bg-cat-yellow text-cab-black font-black flex items-center justify-center mb-1 text-lg">
                1st
              </div>
              <span className="font-bold text-white text-base">{board[0].name}</span>
              <span className="text-xs text-cat-yellow font-mono font-bold">{board[0].badge}</span>
              <span className="text-2xl font-black font-mono text-cat-yellow mt-1">
                {board[0].composite_score}
              </span>
            </div>

            {/* 3rd Place */}
            <div className="bg-cab-card p-3 rounded-xl border border-cab-border flex flex-col items-center justify-end pt-4">
              <div className="w-10 h-10 rounded-full bg-amber-700 text-white font-black flex items-center justify-center mb-1">
                3rd
              </div>
              <span className="font-bold text-white text-sm">{board[2].name}</span>
              <span className="text-[10px] text-gray-400 font-mono">{board[2].badge}</span>
              <span className="text-xl font-black font-mono text-cat-yellow mt-1">
                {board[2].composite_score}
              </span>
            </div>
          </div>
        )}

        {/* Full Table */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="space-y-2.5">
            {board.map((item) => {
              const isCurrent = item.operator_id === activeOperatorId;
              return (
                <div
                  key={item.operator_id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                    isCurrent
                      ? 'bg-cat-yellow/15 border-cat-yellow shadow-cat-glow'
                      : 'bg-cab-dark hover:bg-cab-dark/80 border-cab-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRankBadge(item.rank)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {item.name}
                        </span>
                        {isCurrent && (
                          <span className="bg-cat-yellow text-cab-black text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                            YOU
                          </span>
                        )}
                        <span className="text-xs text-cat-yellow font-mono hidden sm:inline">
                          [{item.operator_id}]
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">
                        {item.skill} • {item.machine_id}
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs">
                    <div className="hidden md:flex flex-col items-center">
                      <span className="text-gray-400 text-[10px]">IDLING %</span>
                      <span
                        className={`font-bold ${
                          item.idling_pct > 25 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {item.idling_pct}%
                      </span>
                    </div>

                    <div className="hidden sm:flex flex-col items-center">
                      <span className="text-gray-400 text-[10px]">SAFETY</span>
                      <span className="font-bold text-emerald-400">
                        {item.safety_score}
                      </span>
                    </div>

                    <div className="hidden sm:flex flex-col items-center">
                      <span className="text-gray-400 text-[10px]">CYCLES</span>
                      <span className="font-bold text-white">
                        {item.total_cycles}
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-gray-400 text-[10px]">OVERALL SCORE</span>
                      <span className="text-lg font-black text-cat-yellow font-industrial">
                        {item.composite_score}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
