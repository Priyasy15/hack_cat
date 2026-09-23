import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Award,
  Clock,
  Sparkles,
  AlertTriangle,
  BookOpen,
  X
} from 'lucide-react';
import { PersonalizedTraining, TrainingModule } from '../types';
import { api } from '../api';

interface PersonalizedTrainingHubProps {
  operatorId: string;
  onTrainingCompleted?: () => void;
}

export const PersonalizedTrainingHub: React.FC<PersonalizedTrainingHubProps> = ({
  operatorId,
  onTrainingCompleted
}) => {
  const [data, setData] = useState<PersonalizedTraining | null>(null);
  const [activeModuleModal, setActiveModuleModal] = useState<TrainingModule | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [operatorId]);

  const loadData = async () => {
    try {
      const res = await api.getPersonalizedTraining(operatorId);
      setData(res);
    } catch (err) {
      console.error('Failed to load personalized training', err);
    }
  };

  const handleComplete = async (moduleId: string) => {
    try {
      await api.completeTraining(moduleId, 96.0);
      setQuizScore(96.0);
      loadData();
      if (onTrainingCompleted) onTrainingCompleted();
    } catch (err) {
      console.error('Failed to complete training', err);
    }
  };

  if (!data) return null;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Title */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-ice-blue" />
            <h1 className="text-2xl font-bold font-industrial text-white tracking-wide uppercase">
              Behavioral-Triggered Operator Training Hub
            </h1>
          </div>
          <p className="text-xs text-nordic-muted mt-1">
            Proactive training modules automatically assigned based on telematics sensor triggers and machine idling anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-nordic-base px-3 py-1.5 rounded-lg border border-nordic-border text-xs font-mono">
          <Award className="w-4 h-4 text-frost-green" />
          <span className="text-nordic-muted">Completed Modules:</span>
          <span className="font-bold text-white">
            {data.all_modules.filter((m) => m.completed).length} / {data.all_modules.length}
          </span>
        </div>
      </div>

      {/* Behavioral Trigger Recommendations (Priority Action Cards) */}
      {data.recommendations.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-ice-blue uppercase tracking-wider block">
            Behavioral Telematics Intervention Triggers:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="bg-nordic-card border-2 border-ice-blue rounded-xl p-4 shadow-ice-glow flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-pastel-ochre text-nordic-base text-[10px] font-black px-2 py-0.5 rounded uppercase font-mono">
                      TELEMETRY TRIGGER
                    </span>
                    <span className="text-xs text-nordic-muted font-mono">{rec.duration}</span>
                  </div>
                  <h3 className="font-bold text-white text-base font-industrial">{rec.module_name}</h3>
                  <p className="text-xs text-nordic-muted mt-1">{rec.trigger_reason}</p>
                </div>

                <button
                  onClick={() => {
                    const m = data.all_modules.find((mod) => mod.module_id === rec.module_id);
                    if (m) setActiveModuleModal(m);
                  }}
                  className="touch-btn bg-ice-blue hover:bg-ice-blue-light text-nordic-base font-black text-xs px-4 py-2 shrink-0 shadow-sm"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Module</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Available Caterpillar Certification Modules */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg space-y-3">
        <span className="text-xs font-mono font-bold text-ice-blue uppercase tracking-wider block mb-2">
          Curated Heavy Machinery Certification Curriculum
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.all_modules.map((m) => (
            <div
              key={m.module_id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                m.completed
                  ? 'bg-nordic-base/60 border-frost-green/40'
                  : 'bg-nordic-base border-nordic-border'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-ice-blue bg-ice-blue/15 px-2 py-0.5 rounded font-bold">
                    {m.skill_area}
                  </span>
                  <span className="text-xs font-mono text-nordic-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {m.duration}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm mb-1">{m.module_name}</h3>
                <p className="text-xs text-nordic-muted leading-relaxed line-clamp-2">{m.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-nordic-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-nordic-muted">
                  Skill: {m.skill_level}
                </span>

                {m.completed ? (
                  <span className="flex items-center gap-1.5 text-xs text-frost-green font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Certified & Completed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveModuleModal(m)}
                    className="touch-btn bg-nordic-card hover:bg-nordic-card-hover border border-nordic-border text-xs px-4 py-1.5 text-white font-bold"
                  >
                    <span>Launch Lesson</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Lesson & Quiz Sub-Modal */}
      {activeModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-nordic-card border border-nordic-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-nordic-border">
              <div>
                <span className="text-[10px] font-mono text-ice-blue uppercase font-bold">
                  {activeModuleModal.skill_area} • {activeModuleModal.duration}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activeModuleModal.module_name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveModuleModal(null);
                  setQuizScore(null);
                }}
                className="p-1.5 rounded-lg bg-nordic-base text-nordic-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs font-mono">
              <div className="bg-nordic-base p-4 rounded-xl border border-nordic-border">
                <span className="text-ice-blue font-bold uppercase block mb-1">
                  Core In-Cab Standard Operating Procedure:
                </span>
                <p className="text-sm font-sans text-nordic-text leading-relaxed">
                  {activeModuleModal.description}
                </p>
              </div>

              {quizScore ? (
                <div className="p-4 bg-frost-green/15 border border-frost-green/40 rounded-xl text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-frost-green text-nordic-base flex items-center justify-center mx-auto font-black text-xl shadow-safe-glow">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-white">Assessment Passed: {quizScore}%</h4>
                  <p className="text-xs text-nordic-muted font-mono">
                    Certification verified. Telematics baseline updated. Open "Learn & Measure" to verify measured safety improvement.
                  </p>
                </div>
              ) : (
                <div className="bg-nordic-base p-4 rounded-xl border border-nordic-border space-y-2">
                  <span className="text-ice-blue font-bold uppercase block mb-1">
                    Knowledge Verification Checkpoint:
                  </span>
                  <p className="text-xs text-nordic-text font-sans">
                    Q: When operating in blind-spot areas during trench excavation, what is the mandatory immediate action upon LiDAR alert?
                  </p>
                  <div className="p-2.5 rounded bg-nordic-card border border-frost-green/50 text-frost-green font-bold cursor-pointer">
                    A: Engage swing brake immediately and sound cab horn warning to verify perimeter.
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-nordic-border flex justify-end gap-3">
              {!quizScore ? (
                <button
                  onClick={() => handleComplete(activeModuleModal.module_id)}
                  className="touch-btn bg-ice-blue hover:bg-ice-blue-light text-nordic-base font-black text-xs px-6 py-2.5 shadow-ice-glow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Quiz & Verify Competency</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveModuleModal(null);
                    setQuizScore(null);
                  }}
                  className="touch-btn bg-nordic-base hover:bg-nordic-card border border-nordic-border text-xs px-5 py-2.5 text-white font-bold"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
