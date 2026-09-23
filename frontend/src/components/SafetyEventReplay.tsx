import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { EventReplay, ReplayStep } from '../types';
import { api } from '../api';

export const SafetyEventReplay: React.FC = () => {
  const [replay, setReplay] = useState<EventReplay | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    loadReplay();
  }, []);

  const loadReplay = async () => {
    try {
      const data = await api.getEventReplay();
      setReplay(data);
    } catch (err) {
      console.error('Failed to load replay', err);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && replay) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= replay.timeline_steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, replay]);

  if (!replay) return null;

  const currentStep = replay.timeline_steps[currentStepIdx];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-ice-blue" />
            <h1 className="text-2xl font-bold font-industrial text-white tracking-wide uppercase">
              Safety Incident Telematics Replay & Response Time Tracker
            </h1>
          </div>
          <p className="text-xs text-nordic-muted mt-1">
            Millisecond-precise telematics audit reproducing LiDAR proximity detections and operator brake actuation.
          </p>
        </div>

        {/* Highlighted Operator Response Time Card */}
        <div className="bg-nordic-base px-4 py-2.5 rounded-xl border border-frost-green/40 shadow-safe-glow text-right font-mono">
          <span className="text-[10px] text-nordic-muted block uppercase">Operator Response Time</span>
          <span className="text-2xl font-black text-frost-green">
            {replay.operator_response_time_sec} sec
          </span>
          <span className="text-[10px] text-frost-green block">Optimal E-Stop Reaction</span>
        </div>
      </div>

      {/* Main Interactive Replay Theater */}
      <div className="bg-nordic-card border border-nordic-border rounded-xl p-6 shadow-lg space-y-6">
        {/* Playback Controls & Progress Scrubber */}
        <div className="bg-nordic-base p-4 rounded-xl border border-nordic-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 rounded-lg bg-ice-blue hover:bg-ice-blue-light text-nordic-base font-black flex items-center justify-center shadow-ice-glow"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  setCurrentStepIdx(0);
                  setIsPlaying(false);
                }}
                className="p-2.5 rounded-lg bg-nordic-card hover:bg-nordic-card-hover text-nordic-muted hover:text-white border border-nordic-border"
                title="Reset to Beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div>
                <span className="text-xs font-mono font-bold text-white block">
                  {isPlaying ? 'PLAYING INCIDENT SEQUENCE' : 'SCRUBBER PAUSED'}
                </span>
                <span className="text-[10px] font-mono text-nordic-muted">
                  Frame {currentStepIdx + 1} of {replay.timeline_steps.length} • {currentStep.timestamp_label}
                </span>
              </div>
            </div>

            <span className="text-xs font-mono text-ice-blue font-bold">
              Time Elapsed: {currentStep.time_offset_sec.toFixed(1)}s / {replay.total_duration_sec}s
            </span>
          </div>

          {/* Interactive Range Slider */}
          <input
            type="range"
            min="0"
            max={replay.timeline_steps.length - 1}
            value={currentStepIdx}
            onChange={(e) => setCurrentStepIdx(parseInt(e.target.value))}
            className="w-full accent-ice-blue cursor-pointer h-2 bg-nordic-card rounded-lg"
          />
        </div>

        {/* Current Replay Stage Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-nordic-base p-5 rounded-xl border border-nordic-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-ice-blue font-bold uppercase tracking-wider">
                  Stage: {currentStep.stage}
                </span>
                <span className="text-xs font-mono text-white bg-nordic-card px-2.5 py-0.5 rounded border border-nordic-border">
                  {currentStep.timestamp_label}
                </span>
              </div>
              <h2 className="text-lg font-black text-white font-industrial mb-1">
                {currentStep.alert_state}
              </h2>
              <p className="text-sm text-nordic-text leading-relaxed">
                {currentStep.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-nordic-border text-xs font-mono text-nordic-muted">
              Machine Telematics: <strong>{currentStep.operator_action}</strong>
            </div>
          </div>

          <div className="bg-nordic-base p-5 rounded-xl border border-nordic-border flex flex-col justify-between">
            <span className="text-xs font-mono text-nordic-muted uppercase tracking-wider">
              Sensor Spatial State at {currentStep.time_offset_sec}s
            </span>

            <div className="my-4 flex items-center justify-around text-center font-mono">
              <div>
                <span className="text-[10px] text-nordic-muted uppercase block">Worker Distance</span>
                <span className="text-3xl font-black text-white">{currentStep.distance_m}m</span>
              </div>
              <div className="h-10 w-px bg-nordic-border" />
              <div>
                <span className="text-[10px] text-nordic-muted uppercase block">Proximity Zone</span>
                <span className={`text-2xl font-black uppercase ${
                  currentStep.zone === 'CRITICAL' ? 'text-coral-red' :
                  currentStep.zone === 'CAUTION' ? 'text-pastel-ochre' : 'text-frost-green'
                }`}>
                  {currentStep.zone}
                </span>
              </div>
            </div>

            <div className="text-xs font-mono text-center text-frost-green bg-frost-green/10 p-2.5 rounded border border-frost-green/20 font-bold">
              Operator Response Window: {replay.operator_response_time_sec}s (Passing Benchmark: &lt;4.0s)
            </div>
          </div>
        </div>

        {/* 4 Step Timeline Progression Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {replay.timeline_steps.map((step, idx) => {
            const isCurrent = idx === currentStepIdx;
            return (
              <div
                key={idx}
                onClick={() => setCurrentStepIdx(idx)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs font-mono ${
                  isCurrent
                    ? 'bg-ice-blue/15 border-ice-blue shadow-ice-glow'
                    : 'bg-nordic-base hover:bg-nordic-base/80 border-nordic-border text-nordic-muted'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">{step.timestamp_label}</span>
                  <span className="text-[10px] text-ice-blue font-bold">Step {idx + 1}</span>
                </div>
                <div className="font-bold text-white mb-1 font-sans">{step.stage}</div>
                <p className="text-[11px] text-nordic-muted line-clamp-2 leading-tight">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
