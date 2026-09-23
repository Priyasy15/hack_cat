import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Play,
  CheckCircle2,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  CloudRain,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AdaptiveTask } from '../types';

interface AdaptiveTaskDashboardProps {
  tasks: AdaptiveTask[];
  currentWeather: string;
  onAcceptReschedule: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: string) => void;
}

export const AdaptiveTaskDashboard: React.FC<AdaptiveTaskDashboardProps> = ({
  tasks,
  currentWeather,
  onAcceptReschedule,
  onUpdateStatus
}) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // Weather urgent tasks first
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.weather_reschedule_recommended && !b.weather_reschedule_recommended) return -1;
    if (!a.weather_reschedule_recommended && b.weather_reschedule_recommended) return 1;
    return 0;
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Title Card */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-ice-blue" />
            <h1 className="text-2xl font-bold font-industrial text-white tracking-wide uppercase">
              Adaptive Task Queue & ML Duration Estimator
            </h1>
          </div>
          <p className="text-xs text-nordic-muted mt-1">
            Real-time Scikit-Learn predictions with confidence bounds (`± margin`) and weather-aware risk prioritization.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-nordic-base px-3 py-1.5 rounded-lg border border-nordic-border text-xs font-mono">
          <CloudRain className="w-4 h-4 text-ice-blue" />
          <span className="text-nordic-muted">Weather Context:</span>
          <span className="font-bold text-white">{currentWeather}</span>
        </div>
      </div>

      {/* Adaptive Weather Hold Banner if any task needs rescheduling */}
      {tasks.some((t) => t.weather_reschedule_recommended && t.status !== 'Rescheduled') && (
        <div className="bg-pastel-ochre/15 border-2 border-pastel-ochre rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-warning-glow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-pastel-ochre text-nordic-base flex items-center justify-center shrink-0 font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-industrial font-black text-white text-base uppercase">
                  Adaptive AI Schedule Recommendation
                </span>
                <span className="bg-pastel-ochre text-nordic-base text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Weather Alert
                </span>
              </div>
              <p className="text-xs text-nordic-text mt-0.5 max-w-2xl leading-relaxed">
                Slope Grading & Compaction (TSK-102) is flagged as high lateral slide hazard due to 8.5mm rain and wet clay saturation. 
                ML model predicts +38% delay. Recommend deferring slope grading until track dewatering passes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => onAcceptReschedule('TSK-102')}
              className="touch-btn bg-pastel-ochre hover:bg-pastel-ochre-dark text-nordic-base font-black text-xs px-5 py-2.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>[Accept Reschedule]</span>
            </button>
          </div>
        </div>
      )}

      {/* Task Cards List */}
      <div className="space-y-3">
        {sortedTasks.map((task) => {
          const isRescheduled = task.status === 'Rescheduled';
          const isInProgress = task.status === 'In Progress';
          const isCompleted = task.status === 'Completed';
          const isExpanded = expandedTask === task.task_id;

          return (
            <div
              key={task.task_id}
              className={`rounded-xl border transition-all p-4 ${
                isRescheduled
                  ? 'bg-nordic-card/60 border-pastel-ochre/40'
                  : isInProgress
                  ? 'bg-nordic-card border-ice-blue shadow-ice-glow'
                  : isCompleted
                  ? 'bg-nordic-base/70 border-nordic-border opacity-70'
                  : 'bg-nordic-card border-nordic-border'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Task Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <span className="font-mono text-xs text-ice-blue font-bold">{task.task_id}</span>
                    <h3 className={`text-base font-bold ${isCompleted ? 'line-through text-nordic-muted' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      task.priority === 'Critical' ? 'bg-coral-red/20 text-coral-red border border-coral-red/30' :
                      task.priority === 'High' ? 'bg-pastel-ochre/20 text-pastel-ochre border border-pastel-ochre/30' :
                      'bg-nordic-base text-nordic-muted'
                    }`}>
                      {task.priority} Priority
                    </span>

                    {isRescheduled && (
                      <span className="bg-pastel-ochre text-nordic-base font-black text-[10px] px-2 py-0.5 rounded uppercase">
                        Deferred for Weather Safety
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-nordic-muted flex-wrap mt-1">
                    <span>Location: <strong className="text-white">{task.location}</strong></span>
                    <span>•</span>
                    <span>Window: <strong className="text-white">{task.scheduled_time}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-ice-blue font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      ML Prediction: {task.display_prediction} (Nominal: {task.nominal_duration_min}m)
                    </span>
                  </div>
                </div>

                {/* Actions Area */}
                <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                  <button
                    onClick={() => setExpandedTask(isExpanded ? null : task.task_id)}
                    className="touch-btn bg-nordic-base hover:bg-nordic-card border border-nordic-border text-xs px-3 py-2 text-nordic-muted hover:text-white"
                  >
                    <span>{isExpanded ? 'Hide Factors' : 'Explain ML Factors'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isInProgress ? (
                    <button
                      onClick={() => onUpdateStatus(task.task_id, 'Completed')}
                      className="touch-btn bg-frost-green hover:bg-frost-green-dark text-nordic-base font-bold text-xs px-5 py-2.5 shadow-safe-glow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Task</span>
                    </button>
                  ) : isCompleted ? (
                    <button
                      onClick={() => onUpdateStatus(task.task_id, 'Pending')}
                      className="touch-btn bg-nordic-base border border-nordic-border text-xs px-3 py-2 text-nordic-muted"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reopen</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateStatus(task.task_id, 'In Progress')}
                      disabled={isRescheduled}
                      className="touch-btn bg-ice-blue hover:bg-ice-blue-light disabled:opacity-40 text-nordic-base font-black text-xs px-5 py-2.5 shadow-ice-glow"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Task</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Factor Breakdown */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-nordic-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-ice-blue uppercase">
                      Transparent Machine Learning Factor Contributions
                    </span>
                    <span className="text-[10px] font-mono text-nordic-muted">
                      RandomForest Regression • R²: 0.956
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                    {task.factors?.map((f, idx) => (
                      <div key={idx} className="bg-nordic-base p-3 rounded-xl border border-nordic-border">
                        <div className="flex justify-between items-center text-nordic-muted mb-1">
                          <span>{f.factor}</span>
                          <span className={`font-bold ${f.delta_min > 0 ? 'text-pastel-ochre' : 'text-frost-green'}`}>
                            {f.delta_min > 0 ? `+${f.delta_min}m` : `${f.delta_min}m`} ({f.percentage}%)
                          </span>
                        </div>
                        <p className="text-[11px] text-nordic-text leading-tight mt-1 font-sans">
                          {f.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
