import React, { useState, useEffect, useCallback } from 'react';
import { CabHeader } from './components/CabHeader';
import { MaintenanceBanner } from './components/MaintenanceBanner';
import { TaskDashboard } from './components/TaskDashboard';
import { SafetyRadarModule } from './components/SafetyRadarModule';
import { AnomalyScorecard } from './components/AnomalyScorecard';
import { TaskEstimator } from './components/TaskEstimator';
import { AiAssistantPanel } from './components/AiAssistantPanel';
import { TrainingHub } from './components/TrainingHub';
import { Leaderboard } from './components/Leaderboard';
import { ShiftRecapModal } from './components/ShiftRecapModal';

import {
  Operator,
  Machine,
  Telemetry,
  RadarResponse,
  Incident,
  Task,
  Scorecard,
  MaintenanceData
} from './types';
import { api } from './api';

export const App: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [currentWeather, setCurrentWeather] = useState<string>('Muddy/Wet');

  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [radar, setRadar] = useState<RadarResponse | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceData | null>(null);

  // Selected task to feed into TaskEstimator
  const [inspectedTask, setInspectedTask] = useState<Task | null>(null);

  // Modals
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isShiftRecapOpen, setIsShiftRecapOpen] = useState(false);

  // 1. Initial Load: Operators & Machines
  useEffect(() => {
    const initApp = async () => {
      try {
        const [ops, machs] = await Promise.all([
          api.getOperators(),
          api.getMachines()
        ]);
        setOperators(ops);
        setMachines(machs);
        if (ops.length > 0) setSelectedOperator(ops[0]);
        if (machs.length > 0) setSelectedMachine(machs[0]);
      } catch (err) {
        console.error('Failed to initialize operators and machines', err);
      }
    };
    initApp();
  }, []);

  // 2. Fetch Tasks when Operator or Weather changes
  useEffect(() => {
    if (!selectedOperator) return;
    const fetchTasks = async () => {
      try {
        const data = await api.getTasks(selectedOperator.id, currentWeather);
        setTasks(data.tasks);
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    };
    fetchTasks();
  }, [selectedOperator, currentWeather]);

  // 3. Fetch Scorecard when Operator changes
  useEffect(() => {
    if (!selectedOperator) return;
    const fetchScorecard = async () => {
      try {
        const sc = await api.getScorecard(selectedOperator.id);
        setScorecard(sc);
      } catch (err) {
        console.error('Failed to load scorecard', err);
      }
    };
    fetchScorecard();
  }, [selectedOperator]);

  // 4. Fetch Maintenance when Machine changes
  useEffect(() => {
    if (!selectedMachine) return;
    const fetchMaintenance = async () => {
      try {
        const m = await api.getMaintenance(selectedMachine.id);
        setMaintenance(m);
      } catch (err) {
        console.error('Failed to load maintenance', err);
      }
    };
    fetchMaintenance();
  }, [selectedMachine]);

  // 5. Polling Real-Time Engine (2.5 seconds HTTP polling interval)
  useEffect(() => {
    if (!selectedOperator || !selectedMachine) return;

    const pollLiveMetrics = async () => {
      try {
        const [tel, rad, incs] = await Promise.all([
          api.getLatestTelemetry(selectedOperator.id, selectedMachine.id),
          api.getRadar(),
          api.getIncidents(selectedOperator.id)
        ]);
        setTelemetry(tel);
        setRadar(rad);
        setIncidents(incs);
      } catch (err) {
        console.error('Telemetry polling error', err);
      }
    };

    pollLiveMetrics();
    const interval = setInterval(pollLiveMetrics, 2500);
    return () => clearInterval(interval);
  }, [selectedOperator, selectedMachine]);

  // Seatbelt Toggle Handler
  const handleToggleSeatbelt = async () => {
    if (!selectedOperator || !selectedMachine) return;
    try {
      await api.toggleSeatbelt(selectedOperator.id, selectedMachine.id);
      // Immediately refresh telemetry, incidents, and scorecard
      const [newTel, newIncs, newSc] = await Promise.all([
        api.getLatestTelemetry(selectedOperator.id, selectedMachine.id),
        api.getIncidents(selectedOperator.id),
        api.getScorecard(selectedOperator.id)
      ]);
      setTelemetry(newTel);
      setIncidents(newIncs);
      setScorecard(newSc);
    } catch (err) {
      console.error('Failed to toggle seatbelt', err);
    }
  };

  // Simulate Proximity Breach Alert
  const handleSimulateHazard = async () => {
    if (!selectedOperator || !selectedMachine) return;
    try {
      await api.createIncident(
        selectedOperator.id,
        selectedMachine.id,
        'PROXIMITY_HAZARD',
        'Simulated Proximity Breach: Hardhat LiDAR sensor detected within 3.2m rear swing blindspot.'
      );
      const incs = await api.getIncidents(selectedOperator.id);
      setIncidents(incs);
    } catch (err) {
      console.error('Failed to simulate hazard', err);
    }
  };

  // Task Status Update Handler
  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      await api.updateTaskStatus(taskId, status);
      setTasks((prev) =>
        prev.map((t) => (t.task_id === taskId ? { ...t, status: status as any } : t))
      );
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  if (!selectedOperator || !selectedMachine) {
    return (
      <div className="min-h-screen bg-cab-black text-cat-yellow flex flex-col items-center justify-center font-mono">
        <div className="w-12 h-12 border-4 border-cat-yellow border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-base font-bold tracking-widest uppercase">INITIALIZING OPERATOROS CAB TELEMETRY...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cab-black text-gray-100 flex flex-col">
      {/* 1. Industrial Cab Header Bar */}
      <CabHeader
        operators={operators}
        machines={machines}
        selectedOperator={selectedOperator}
        selectedMachine={selectedMachine}
        telemetry={telemetry}
        currentWeather={currentWeather}
        onSelectOperator={setSelectedOperator}
        onSelectMachine={setSelectedMachine}
        onChangeWeather={setCurrentWeather}
        onOpenShiftRecap={() => setIsShiftRecapOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenTraining={() => setIsTrainingOpen(true)}
      />

      {/* Main Single-Page Cab Dashboard Container */}
      <main className="max-w-[1920px] w-full mx-auto px-4 py-4 flex-1 space-y-4">
        {/* 2. Predictive Maintenance Nudge Banner */}
        <MaintenanceBanner maintenance={maintenance} />

        {/* Section 1: Daily Task Queue (Left) & Safety Radar Module (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-6 flex flex-col">
            <TaskDashboard
              tasks={tasks}
              currentWeather={currentWeather}
              onUpdateStatus={handleUpdateTaskStatus}
              onSelectTaskForEstimate={(task) => setInspectedTask(task)}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col">
            <SafetyRadarModule
              telemetry={telemetry}
              radar={radar}
              incidents={incidents}
              onToggleSeatbelt={handleToggleSeatbelt}
              onSimulateHazard={handleSimulateHazard}
            />
          </div>
        </div>

        {/* Section 2: Anomaly Detection Scorecard (Left) & AI Task Time Estimator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-6 flex flex-col">
            <AnomalyScorecard scorecard={scorecard} />
          </div>

          <div className="lg:col-span-6 flex flex-col">
            <TaskEstimator
              initialTask={inspectedTask}
              currentWeather={currentWeather}
              operatorSkill={selectedOperator.skill}
              machineAge={selectedMachine.age_yrs}
            />
          </div>
        </div>

        {/* Section 3: AI Co-Pilot Assistant Panel */}
        <div className="grid grid-cols-1 gap-4">
          <AiAssistantPanel
            operatorId={selectedOperator.id}
            machineId={selectedMachine.id}
          />
        </div>
      </main>

      {/* Cab Footer Status Bar */}
      <footer className="bg-cab-black border-t border-cab-border py-3 px-4 text-xs font-mono text-gray-400">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATOROS v1.0 • CATERPILLAR CAB TELEMETRY CLIENT</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Active Unit: <strong className="text-white">{selectedMachine.id}</strong></span>
            <span>Operator: <strong className="text-cat-yellow">{selectedOperator.name}</strong></span>
            <span>Polling Engine: <strong className="text-emerald-400">2.5s HTTP Polling Active</strong></span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TrainingHub
        operatorId={selectedOperator.id}
        isOpen={isTrainingOpen}
        onClose={() => setIsTrainingOpen(false)}
      />

      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        activeOperatorId={selectedOperator.id}
      />

      <ShiftRecapModal
        isOpen={isShiftRecapOpen}
        onClose={() => setIsShiftRecapOpen(false)}
        operatorId={selectedOperator.id}
        machineId={selectedMachine.id}
      />
    </div>
  );
};
