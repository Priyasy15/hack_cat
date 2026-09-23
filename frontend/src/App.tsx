import React, { useState, useEffect } from 'react';
import { CabTopBar } from './components/CabTopBar';
import { OperatorLoginModal } from './components/OperatorLoginModal';
import { ShiftBriefingView } from './components/ShiftBriefingView';
import { AdaptiveTaskDashboard } from './components/AdaptiveTaskDashboard';
import { CurrentTaskView } from './components/CurrentTaskView';
import { SafetyIntelligenceView } from './components/SafetyIntelligenceView';
import { Live2DSafetyMap } from './components/Live2DSafetyMap';
import { AroundMeRadarView } from './components/AroundMeRadarView';
import { SafetyEventReplay } from './components/SafetyEventReplay';
import { IncidentReportModal } from './components/IncidentReportModal';
import { PersonalizedTrainingHub } from './components/PersonalizedTrainingHub';
import { TrainingEffectivenessView } from './components/TrainingEffectivenessView';
import { OperatorSafetyScorecard } from './components/OperatorSafetyScorecard';
import { InCabAiModal } from './components/InCabAiModal';
import { ShiftRecapView } from './components/ShiftRecapView';

import {
  Operator,
  Machine,
  LiveTelemetry,
  AdaptiveTask,
  RadarResponse,
  MapEntities,
  SafetyEvent
} from './types';
import { api } from './api';

export const App: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [activeOperator, setActiveOperator] = useState<Operator | null>(null);
  const [activeMachine, setActiveMachine] = useState<Machine | null>(null);

  const [activeView, setActiveView] = useState<string>('shift_briefing');
  const [telemetry, setTelemetry] = useState<LiveTelemetry | null>(null);
  const [radar, setRadar] = useState<RadarResponse | null>(null);
  const [mapEntities, setMapEntities] = useState<MapEntities | null>(null);
  const [tasks, setTasks] = useState<AdaptiveTask[]>([]);
  const [events, setEvents] = useState<SafetyEvent[]>([]);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [isRecapOpen, setIsRecapOpen] = useState<boolean>(false);
  const [isIncidentReportOpen, setIsIncidentReportOpen] = useState<boolean>(false);

  // 1. Initial Load: Operators and Machines
  useEffect(() => {
    const init = async () => {
      try {
        const [ops, machs] = await Promise.all([
          api.getOperators(),
          api.getMachines()
        ]);
        setOperators(ops);
        setMachines(machs);
        if (ops.length > 0) setActiveOperator(ops[0]); // Default OP1001 - Arun Kumar
        if (machs.length > 0) setActiveMachine(machs[0]); // Default CAT-336-EX01
      } catch (err) {
        console.error('Failed to initialize app', err);
      }
    };
    init();
  }, []);

  // 2. Fetch Tasks when Operator changes
  useEffect(() => {
    if (!activeOperator) return;
    const fetchTasks = async () => {
      try {
        const res = await api.getAdaptiveTasks(activeOperator.operator_id);
        setTasks(res.tasks);
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    };
    fetchTasks();
  }, [activeOperator]);

  // 3. HTTP Polling Real-Time Engine (2.5 sec interval)
  useEffect(() => {
    if (!activeOperator || !activeMachine) return;

    const poll = async () => {
      try {
        const [tel, rad, mapData, evts] = await Promise.all([
          api.getLiveTelemetry(activeOperator.operator_id, activeMachine.machine_id),
          api.getSafetyRadar(activeMachine.machine_id),
          api.getMapEntities(activeMachine.machine_id),
          api.getSafetyEvents()
        ]);
        setTelemetry(tel);
        setRadar(rad);
        setMapEntities(mapData);
        setEvents(evts);
      } catch (err) {
        console.error('Polling error', err);
      }
    };

    poll();
    const interval = setInterval(poll, 2500);
    return () => clearInterval(interval);
  }, [activeOperator, activeMachine]);

  // Actions
  const handleToggleSeatbelt = async () => {
    await api.simulateTelemetry({ toggle_seatbelt: true });
    if (activeOperator && activeMachine) {
      const tel = await api.getLiveTelemetry(activeOperator.operator_id, activeMachine.machine_id);
      setTelemetry(tel);
    }
  };

  const handleSimulateNoiseToggle = async () => {
    const currentNoise = telemetry?.ambient_noise_db || 74.0;
    const nextNoise = currentNoise > 85.0 ? 74.0 : 89.0;
    await api.simulateTelemetry({ noise_db: nextNoise });
    if (activeOperator && activeMachine) {
      const tel = await api.getLiveTelemetry(activeOperator.operator_id, activeMachine.machine_id);
      setTelemetry(tel);
    }
  };

  const handleSimulateProximity = async () => {
    await api.simulateTelemetry({ trigger_proximity: true });
    if (activeOperator && activeMachine) {
      const [tel, rad, mapData, evts] = await Promise.all([
        api.getLiveTelemetry(activeOperator.operator_id, activeMachine.machine_id),
        api.getSafetyRadar(activeMachine.machine_id),
        api.getMapEntities(activeMachine.machine_id),
        api.getSafetyEvents()
      ]);
      setTelemetry(tel);
      setRadar(rad);
      setMapEntities(mapData);
      setEvents(evts);
    }
  };

  const handleAcceptReschedule = async (taskId: string) => {
    await api.acceptTaskReschedule(taskId);
    setTasks((prev) =>
      prev.map((t) => (t.task_id === taskId ? { ...t, status: 'Rescheduled' } : t))
    );
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    await api.updateTaskStatus(taskId, status);
    setTasks((prev) =>
      prev.map((t) => (t.task_id === taskId ? { ...t, status: status as any } : t))
    );
  };

  if (!activeOperator || !activeMachine) {
    return (
      <div className="min-h-screen bg-nordic-base text-ice-blue flex flex-col items-center justify-center font-mono">
        <div className="w-12 h-12 border-4 border-ice-blue border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm font-bold tracking-widest uppercase">INITIALIZING CAT SMART OPERATOR TABLET...</span>
      </div>
    );
  }

  const cachedWeather = api.getCachedWeather();
  const currentActiveTask = tasks.find((t) => t.status === 'In Progress') || tasks[0];

  return (
    <div className="min-h-screen bg-nordic-base text-nordic-text flex flex-col select-none">
      {/* 1. Cab Top Header */}
      <CabTopBar
        operator={activeOperator}
        machine={activeMachine}
        telemetry={telemetry}
        activeView={activeView}
        cachedWeatherInfo={cachedWeather}
        onSelectView={(v) => {
          if (v === 'incident_report') {
            setIsIncidentReportOpen(true);
          } else {
            setActiveView(v);
          }
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenRecap={() => setIsRecapOpen(true)}
        onToggleSeatbelt={handleToggleSeatbelt}
        onSimulateNoiseToggle={handleSimulateNoiseToggle}
      />

      {/* Main Tablet Content Area */}
      <main className="max-w-[1920px] w-full mx-auto px-3 sm:px-5 py-4 flex-1">
        {activeView === 'shift_briefing' && (
          <ShiftBriefingView
            operator={activeOperator}
            machine={activeMachine}
            telemetry={telemetry}
            tasks={tasks}
            onStartShift={() => setActiveView('current_task')}
            onNavigateToTasks={() => setActiveView('task_dashboard')}
          />
        )}

        {activeView === 'task_dashboard' && (
          <AdaptiveTaskDashboard
            tasks={tasks}
            currentWeather={cachedWeather.weather}
            onAcceptReschedule={handleAcceptReschedule}
            onUpdateStatus={handleUpdateTaskStatus}
          />
        )}

        {activeView === 'current_task' && (
          <CurrentTaskView
            currentTask={currentActiveTask}
            telemetry={telemetry}
            machine={activeMachine}
            onCompleteTask={() => handleUpdateTaskStatus(currentActiveTask.task_id, 'Completed')}
          />
        )}

        {activeView === 'safety_intel' && (
          <SafetyIntelligenceView
            telemetry={telemetry}
            radar={radar}
            events={events}
            onToggleSeatbelt={handleToggleSeatbelt}
            onSimulateProximity={handleSimulateProximity}
            onToggleHighNoise={handleSimulateNoiseToggle}
            onAcknowledgeAlert={(id) => api.acknowledgeEvent(id)}
          />
        )}

        {activeView === '2d_map' && mapEntities && (
          <Live2DSafetyMap mapData={mapEntities} />
        )}

        {activeView === '360_radar' && (
          <AroundMeRadarView radar={radar} />
        )}

        {activeView === 'event_replay' && (
          <SafetyEventReplay />
        )}

        {activeView === 'training_hub' && (
          <PersonalizedTrainingHub
            operatorId={activeOperator.operator_id}
            onTrainingCompleted={() => setActiveView('training_analytics')}
          />
        )}

        {activeView === 'training_analytics' && (
          <TrainingEffectivenessView />
        )}

        {activeView === 'safety_scorecard' && (
          <OperatorSafetyScorecard operatorId={activeOperator.operator_id} />
        )}
      </main>

      {/* Tablet Bottom Telematics Status Bar */}
      <footer className="bg-nordic-card border-t border-nordic-border py-2 px-4 text-xs font-mono text-nordic-muted">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-frost-green animate-pulse" />
            <span>CAT SMART OPERATOR ASSISTANT (OPERATOROS) • INDUSTRIAL CAB TABLET SYSTEM</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Operator: <strong className="text-white">{activeOperator.name}</strong></span>
            <span>Machine: <strong className="text-ice-blue">{activeMachine.model}</strong></span>
            <span>Link: <strong className="text-frost-green">2.5s Polling Active</strong></span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <OperatorLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        operators={operators}
        machines={machines}
        activeOperator={activeOperator}
        activeMachine={activeMachine}
        onConfirm={(op, mach) => {
          setActiveOperator(op);
          setActiveMachine(mach);
        }}
      />

      <InCabAiModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        operatorId={activeOperator.operator_id}
        machineId={activeMachine.machine_id}
      />

      <ShiftRecapView
        isOpen={isRecapOpen}
        onClose={() => setIsRecapOpen(false)}
        operatorId={activeOperator.operator_id}
        machineId={activeMachine.machine_id}
      />

      <IncidentReportModal
        isOpen={isIncidentReportOpen}
        onClose={() => setIsIncidentReportOpen(false)}
        operator={activeOperator}
        machine={activeMachine}
        telemetry={telemetry}
      />
    </div>
  );
};
