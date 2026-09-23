import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Award,
  Clock,
  X,
  BookOpen,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { TrainingModule } from '../types';
import { api } from '../api';

interface TrainingHubProps {
  operatorId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingHub: React.FC<TrainingHubProps> = ({ operatorId, isOpen, onClose }) => {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, operatorId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getTrainingModules(operatorId);
      setModules(res.modules);
      setBadges(res.badges_earned);
    } catch (err) {
      console.error('Failed to load training modules', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBadge = async (badgeName: string) => {
    try {
      const res = await api.toggleTrainingBadge(operatorId, badgeName);
      setBadges(res.badges);
      setModules((prev) =>
        prev.map((m) =>
          m.badge_unlocked === badgeName ? { ...m, completed: res.badges.includes(badgeName) } : m
        )
      );
    } catch (err) {
      console.error('Failed to toggle badge', err);
    }
  };

  if (!isOpen) return null;

  const completedCount = badges.length;
  const totalCount = modules.length;
  const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cab-card border border-cab-border rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-cab-border flex items-center justify-between bg-cab-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cat-yellow flex items-center justify-center text-cab-black">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
                Caterpillar Operator Training & Skill Badges
              </h2>
              <p className="text-xs text-gray-400">
                Continuous Heavy Equipment Certification for <strong className="text-cat-yellow">{operatorId}</strong>
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

        {/* Progress & Badge Summary Bar */}
        <div className="p-4 bg-cab-dark border-b border-cab-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-gray-400">CERTIFICATION MASTERY</span>
              <span className="font-bold text-cat-yellow">{progressPct}% Complete ({completedCount}/{totalCount} Badges)</span>
            </div>
            <div className="w-full bg-cab-black rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-cat-yellow h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {badges.map((b, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 bg-cat-yellow/20 text-cat-yellow border border-cat-yellow/40 text-xs px-2.5 py-1 rounded-full font-bold"
              >
                <Award className="w-3.5 h-3.5" />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Modules List Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {modules.map((module) => {
            const isEarned = badges.includes(module.badge_unlocked);

            return (
              <div
                key={module.id}
                className={`p-4 rounded-xl border transition-all ${
                  isEarned
                    ? 'bg-cab-dark/60 border-emerald-500/30'
                    : 'bg-cab-dark hover:bg-cab-dark/80 border-cab-border'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-cab-black border border-cab-border">
                      <img
                        src={module.thumbnail}
                        alt={module.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <button
                        onClick={() => setSelectedModule(module)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 text-cat-yellow transition-all"
                      >
                        <Play className="w-7 h-7 fill-current" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-mono text-cat-yellow px-1.5 py-0.5 rounded bg-cat-yellow/15">
                          {module.category}
                        </span>
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {module.duration_min} min
                        </span>
                        {isEarned && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3 h-3" /> BADGE UNLOCKED
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">
                        {module.title}
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
                        {module.summary}
                      </p>
                    </div>
                  </div>

                  {/* Right: Badge Unlock Checkbox Action */}
                  <div className="flex flex-row md:flex-col items-end justify-between w-full md:w-auto gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleBadge(module.badge_unlocked)}
                      className={`touch-btn text-xs font-bold px-4 py-2.5 rounded-lg border ${
                        isEarned
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400 shadow-safe-glow'
                          : 'bg-cab-black hover:bg-cab-card border-cab-border text-gray-300'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isEarned ? 'Badge Earned' : 'Mark as Completed'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedModule(module)}
                      className="text-xs text-cat-yellow hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>Study Key Takeaways</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video / Curriculum Detail Sub-Modal */}
        {selectedModule && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 animate-fadeIn">
            <div className="bg-cab-card border border-cab-border rounded-xl max-w-2xl w-full p-5 shadow-2xl">
              <div className="flex justify-between items-start pb-3 border-b border-cab-border">
                <div>
                  <span className="text-[10px] font-mono text-cat-yellow uppercase">
                    {selectedModule.category} • {selectedModule.duration_min} min lesson
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedModule.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="p-1.5 rounded-lg bg-cab-dark text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Simulation */}
              <div className="my-4 aspect-video bg-cab-black rounded-lg border border-cab-border relative overflow-hidden flex flex-col items-center justify-center">
                <img
                  src={selectedModule.thumbnail}
                  alt={selectedModule.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative z-10 text-center p-4">
                  <div className="w-14 h-14 rounded-full bg-cat-yellow text-cab-black flex items-center justify-center mx-auto mb-2 shadow-cat-glow">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                  <span className="font-industrial font-bold text-white text-base uppercase block">
                    Caterpillar Certified Training Stream
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    High Definition In-Cab Safe Playback
                  </span>
                </div>
              </div>

              {/* Key Takeaways Checklist */}
              <div className="space-y-2 mt-3">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block">
                  Critical Cab Checkpoints & Takeaways:
                </span>
                {selectedModule.key_takeaways.map((point, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex items-start gap-2 text-xs text-gray-200 bg-cab-dark p-2.5 rounded border border-cab-border"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-cab-border flex justify-end gap-2">
                <button
                  onClick={() => {
                    handleToggleBadge(selectedModule.badge_unlocked);
                    setSelectedModule(null);
                  }}
                  className="touch-btn bg-cat-yellow hover:bg-cat-yellow-hover text-cab-black font-black text-xs px-5 py-2.5 shadow-cat-glow"
                >
                  <Award className="w-4 h-4" />
                  <span>Verify Knowledge & Claim Badge</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
