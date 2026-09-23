import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  CloudRain,
  Flame,
  Wind,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { Task } from '../types';

interface TaskDashboardProps {
  tasks: Task[];
  currentWeather: string;
  onUpdateStatus: (taskId: string, status: string) => void;
  onSelectTaskForEstimate?: (task: Task) => void;
}

export const TaskDashboard: React.FC<TaskDashboardProps> = ({
  tasks,
  currentWeather,
  onUpdateStatus,
  onSelectTaskForEstimate
}) => {
  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS' | 'PENDING' | 'COMPLETED'>('ALL');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'IN_PROGRESS') return t.status === 'In Progress';
    if (filter === 'PENDING') return t.status === 'Pending';
    if (filter === 'COMPLETED') return t.status === 'Completed';
    return true;
  });

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[11px] font-bold">CRITICAL PRIORITY</span>;
      case 'HIGH':
        return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded text-[11px] font-bold">HIGH PRIORITY</span>;
      case 'MEDIUM':
        return <span className="bg-cat-yellow/20 text-cat-yellow border border-cat-yellow/30 px-2 py-0.5 rounded text-[11px] font-bold">STANDARD</span>;
      default:
        return <span className="bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded text-[11px] font-medium">ROUTINE</span>;
    }
  };

  const getWeatherRiskBadge = (risk: Task['weather_risk']) => {
    switch (risk) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1 bg-red-600 text-white font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider animate-pulse">
            <AlertTriangle className="w-3 h-3" /> WEATHER HOLD RISK
          </span>
        );
      case 'HIGH':
        return (
          <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            <AlertTriangle className="w-3 h-3" /> ADVERSE WEATHER
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-cab-card border border-cab-border rounded-xl p-4 sm:p-5 shadow-lg flex flex-col h-full">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-cab-border gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
              Daily Task Queue
            </h2>
            <span className="bg-cat-yellow/15 text-cat-yellow border border-cat-yellow/30 text-xs px-2.5 py-0.5 rounded font-mono font-bold">
              {tasks.filter((t) => t.status === 'Completed').length} / {tasks.length} Completed
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Weather-aware task priority sorted for current conditions ({currentWeather})
          </p>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center bg-cab-black p-1 rounded-lg border border-cab-border w-full sm:w-auto">
          {(['ALL', 'IN_PROGRESS', 'PENDING', 'COMPLETED'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-xs font-bold transition-all ${
                filter === mode
                  ? 'bg-cat-yellow text-cab-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3 mt-4 overflow-y-auto max-h-[580px] pr-1">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-mono text-sm">
            No tasks found matching filter: {filter}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';

            return (
              <div
                key={task.task_id}
                className={`p-4 rounded-xl border transition-all ${
                  isInProgress
                    ? 'bg-cab-dark border-cat-yellow shadow-cat-glow'
                    : isCompleted
                    ? 'bg-cab-black/60 border-cab-border opacity-70'
                    : 'bg-cab-dark/80 hover:bg-cab-dark border-cab-border'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  {/* Task Header & Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs text-cat-yellow font-bold">
                        {task.task_id}
                      </span>
                      <h3
                        className={`text-base font-bold ${
                          isCompleted ? 'line-through text-gray-400' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {getPriorityBadge(task.priority)}
                      {getWeatherRiskBadge(task.weather_risk)}
                    </div>

                    {/* Operational Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-300 font-mono flex-wrap mt-1">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-cat-yellow" />
                        Type: <strong className="text-white">{task.task_type}</strong>
                      </span>
                      <span>•</span>
                      <span>Target: <strong className="text-white">{task.target_volume_m3} m³</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        Est: {task.nominal_time_min}m
                        {task.predicted_time_min && (
                          <span className="text-cat-yellow ml-1 font-bold">
                            (ML: {task.predicted_time_min}m)
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Weather Risk Note */}
                    {task.weather_risk !== 'LOW' && (
                      <div className="mt-2 text-xs flex items-start gap-1.5 text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-800/40">
                        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
                        <span>{task.risk_explanation}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {onSelectTaskForEstimate && (
                      <button
                        onClick={() => onSelectTaskForEstimate(task)}
                        className="touch-btn text-xs px-3 py-2 bg-cab-card hover:bg-cab-card-hover border border-cab-border text-gray-200"
                        title="Analyze Duration in ML Estimator"
                      >
                        <Sparkles className="w-4 h-4 text-cat-yellow" />
                        <span className="hidden sm:inline">Inspect ML</span>
                      </button>
                    )}

                    {isInProgress ? (
                      <button
                        onClick={() => onUpdateStatus(task.task_id, 'Completed')}
                        className="touch-btn bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 shadow-safe-glow"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete Task</span>
                      </button>
                    ) : isCompleted ? (
                      <button
                        onClick={() => onUpdateStatus(task.task_id, 'Pending')}
                        className="touch-btn bg-cab-card hover:bg-cab-card-hover border border-cab-border text-gray-300 text-xs px-3 py-2"
                        title="Reopen task"
                      >
                        <RotateCcw className="w-4 h-4 text-gray-400" />
                        <span>Reopen</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(task.task_id, 'In Progress')}
                        className="touch-btn bg-cat-yellow hover:bg-cat-yellow-hover text-cab-black font-black text-xs px-4 py-2.5 shadow-cat-glow"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Start Work</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
