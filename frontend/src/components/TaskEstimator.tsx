import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  BarChart2,
  CloudRain,
  User,
  Wrench
} from 'lucide-react';
import { EstimateResult, Task } from '../types';
import { api } from '../api';

interface TaskEstimatorProps {
  initialTask?: Task | null;
  currentWeather: string;
  operatorSkill: string;
  machineAge: number;
}

const TASK_OPTIONS = [
  "Trenching",
  "Mass Excavation",
  "Slope Grading",
  "Truck Loading",
  "Pipe Laying",
  "Stockpile Rehandling"
];

const WEATHER_OPTIONS = [
  "Sunny",
  "Rain",
  "Muddy/Wet",
  "High Wind",
  "Fog/Low Visibility",
  "Extreme Heat"
];

const SKILL_OPTIONS = ["Novice", "Intermediate", "Expert"];

export const TaskEstimator: React.FC<TaskEstimatorProps> = ({
  initialTask,
  currentWeather,
  operatorSkill,
  machineAge
}) => {
  const [taskType, setTaskType] = useState<string>(initialTask?.task_type || 'Trenching');
  const [weather, setWeather] = useState<string>(currentWeather || 'Muddy/Wet');
  const [skill, setSkill] = useState<string>(operatorSkill || 'Intermediate');
  const [age, setAge] = useState<number>(machineAge || 3.5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTaskType(initialTask.task_type);
    }
  }, [initialTask]);

  useEffect(() => {
    handleRunEstimate();
  }, [taskType, weather, skill, age]);

  const handleRunEstimate = async () => {
    setLoading(true);
    try {
      const res = await api.estimateTask(taskType, weather, skill, age);
      setResult(res);
    } catch (err) {
      console.error('Failed to run ML estimation', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cab-card border border-cab-border rounded-xl p-4 sm:p-5 shadow-lg flex flex-col h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-cab-border">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cat-yellow" />
          <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
            AI Task Time Estimator & Explainer
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Scikit-Learn Model Active</span>
        </div>
      </div>

      {/* Simulator Inputs Form */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {/* Task Type */}
        <div className="bg-cab-dark p-3 rounded-lg border border-cab-border">
          <label className="text-[10px] text-gray-400 font-mono uppercase block mb-1">
            Task Type
          </label>
          <select
            className="w-full bg-cab-black text-white text-xs font-bold p-2 rounded border border-cab-border focus:border-cat-yellow focus:outline-none cursor-pointer"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
          >
            {TASK_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Weather Condition */}
        <div className="bg-cab-dark p-3 rounded-lg border border-cab-border">
          <label className="text-[10px] text-gray-400 font-mono uppercase block mb-1">
            Weather Condition
          </label>
          <select
            className="w-full bg-cab-black text-white text-xs font-bold p-2 rounded border border-cab-border focus:border-cat-yellow focus:outline-none cursor-pointer"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          >
            {WEATHER_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* Operator Skill */}
        <div className="bg-cab-dark p-3 rounded-lg border border-cab-border">
          <label className="text-[10px] text-gray-400 font-mono uppercase block mb-1">
            Operator Skill
          </label>
          <select
            className="w-full bg-cab-black text-white text-xs font-bold p-2 rounded border border-cab-border focus:border-cat-yellow focus:outline-none cursor-pointer"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          >
            {SKILL_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Machine Age */}
        <div className="bg-cab-dark p-3 rounded-lg border border-cab-border">
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] text-gray-400 font-mono uppercase">
              Equipment Age
            </label>
            <span className="text-xs font-mono font-bold text-cat-yellow">{age} yrs</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="12.0"
            step="0.5"
            value={age}
            onChange={(e) => setAge(parseFloat(e.target.value))}
            className="w-full accent-cat-yellow cursor-pointer h-2 bg-cab-black rounded"
          />
        </div>
      </div>

      {/* Main Results Display */}
      {result && (
        <div className="space-y-4">
          {/* Predicted Duration Comparison Banner */}
          <div className="bg-cab-dark p-4 rounded-xl border border-cab-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                Machine Learning Prediction
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-black font-mono text-cat-yellow">
                  {result.predicted_time_min} min
                </span>
                <span className="text-sm text-gray-400 font-mono">
                  vs {result.nominal_time_min}m standard target
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Expected Variance</span>
                <span
                  className={`text-lg font-black font-mono ${
                    result.total_variance_min > 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {result.total_variance_min > 0 ? `+${result.total_variance_min} min` : `${result.total_variance_min} min`}
                </span>
              </div>
              <div
                className={`p-2.5 rounded-lg ${
                  result.total_variance_min > 0
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Transparent Factors Influence Breakdown */}
          <div>
            <span className="text-xs font-industrial font-bold uppercase tracking-wider text-gray-300 block mb-2">
              Factors That Influenced This Prediction (Feature Attributions)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.factors.map((factor, idx) => {
                const isDelay = factor.impact === 'delay';
                const isAccel = factor.impact === 'accelerated';

                return (
                  <div
                    key={idx}
                    className="bg-cab-dark p-3.5 rounded-xl border border-cab-border flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-gray-400">{factor.factor}</span>
                        <span
                          className={`font-bold ${
                            isDelay ? 'text-amber-400' : isAccel ? 'text-emerald-400' : 'text-gray-400'
                          }`}
                        >
                          {factor.delta_min > 0 ? `+${factor.delta_min}m` : `${factor.delta_min}m`} ({factor.percentage > 0 ? `+${factor.percentage}%` : `${factor.percentage}%`})
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white mt-1">
                        {factor.value}
                      </div>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                        {factor.detail}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-cab-border flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span>Impact:</span>
                      <span
                        className={`font-bold uppercase ${
                          isDelay ? 'text-amber-400' : isAccel ? 'text-emerald-400' : 'text-gray-300'
                        }`}
                      >
                        {factor.impact}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ML Model Health & Specs Footer */}
          <div className="bg-cab-black/60 p-3 rounded-lg border border-cab-border text-[11px] font-mono text-gray-400 flex flex-wrap items-center justify-between gap-2">
            <span>Model: {result.model_metadata.algorithm}</span>
            <div className="flex items-center gap-4">
              <span>R² Score: <strong className="text-white">{result.model_metadata.r2_score}</strong></span>
              <span>MAE: <strong className="text-white">{result.model_metadata.mae_min} min</strong></span>
              <span>Trained on: <strong className="text-white">{result.model_metadata.training_samples} real tasks</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
