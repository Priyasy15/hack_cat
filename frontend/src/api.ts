import {
  Operator,
  Machine,
  Telemetry,
  Task,
  RadarResponse,
  Incident,
  Scorecard,
  EstimateResult,
  MaintenanceData,
  TrainingModule,
  ShiftSummary,
  LeaderboardItem
} from './types';

import {
  MOCK_OPERATORS,
  MOCK_MACHINES,
  MOCK_TELEMETRY,
  MOCK_RADAR,
  MOCK_INCIDENTS,
  MOCK_TASKS,
  MOCK_SCORECARD,
  MOCK_ESTIMATE_RESULT,
  MOCK_MAINTENANCE,
  MOCK_TRAINING_MODULES,
  MOCK_SHIFT_SUMMARY,
  MOCK_LEADERBOARD
} from './mockData';

const BASE_URL = 'http://localhost:8000/api';

// In-memory offline fallback state mirrors
let localSeatbeltStatus = 'Fastened';
let localIncidents: Incident[] = [...MOCK_INCIDENTS];
let localTasks: Task[] = [...MOCK_TASKS];
let localBadges = ['Pre-Flight Master', 'Trench Safety Pro'];

async function safeFetch<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[OperatorOS API] Network error on ${endpoint}. Using offline fallback.`, err);
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}

export const api = {
  getOperators: async (): Promise<Operator[]> => {
    return safeFetch<Operator[]>('/operators', undefined, MOCK_OPERATORS);
  },

  getMachines: async (): Promise<Machine[]> => {
    return safeFetch<Machine[]>('/machines', undefined, MOCK_MACHINES);
  },

  getLatestTelemetry: async (operatorId: string, machineId: string): Promise<Telemetry> => {
    const fallback = {
      ...MOCK_TELEMETRY,
      operator_id: operatorId,
      machine_id: machineId,
      seatbelt_status: localSeatbeltStatus as 'Fastened' | 'Unfastened',
      safety_alert_triggered: localSeatbeltStatus === 'Unfastened'
    };
    return safeFetch<Telemetry>(`/telemetry/latest?operator_id=${operatorId}&machine_id=${machineId}`, undefined, fallback);
  },

  toggleSeatbelt: async (operatorId: string, machineId: string): Promise<{ seatbelt_status: string }> => {
    localSeatbeltStatus = localSeatbeltStatus === 'Fastened' ? 'Unfastened' : 'Fastened';
    if (localSeatbeltStatus === 'Unfastened') {
      localIncidents.unshift({
        id: `INC-${Math.floor(Math.random() * 900) + 100}`,
        timestamp: new Date().toISOString(),
        operator_id: operatorId,
        machine_id: machineId,
        type: 'SEATBELT_UNFASTENED',
        severity: 'CRITICAL',
        description: 'Seatbelt unfastened while machine hydraulic pilot active.',
        resolved: false,
        action_taken: 'Audible alarm sounded in cab.'
      });
    }
    return safeFetch<{ seatbelt_status: string }>(
      `/safety/seatbelt/toggle?operator_id=${operatorId}&machine_id=${machineId}`,
      { method: 'POST' },
      { seatbelt_status: localSeatbeltStatus }
    );
  },

  getRadar: async (): Promise<RadarResponse> => {
    return safeFetch<RadarResponse>('/safety/radar', undefined, MOCK_RADAR);
  },

  createIncident: async (operatorId: string, machineId: string, type: string, description: string): Promise<Incident> => {
    const fallback: Incident = {
      id: `INC-${Math.floor(Math.random() * 900) + 100}`,
      timestamp: new Date().toISOString(),
      operator_id: operatorId,
      machine_id: machineId,
      type,
      severity: 'CRITICAL',
      description,
      resolved: false,
      action_taken: 'Audible alarm sounded and incident logged.'
    };
    localIncidents.unshift(fallback);
    return safeFetch<Incident>(
      '/safety/incident',
      {
        method: 'POST',
        body: JSON.stringify({ operator_id: operatorId, machine_id: machineId, type, severity: 'CRITICAL', description })
      },
      fallback
    );
  },

  getIncidents: async (operatorId?: string): Promise<Incident[]> => {
    const fallback = operatorId ? localIncidents.filter(i => i.operator_id === operatorId) : localIncidents;
    const q = operatorId ? `?operator_id=${operatorId}` : '';
    return safeFetch<Incident[]>(`/safety/incidents${q}`, undefined, fallback);
  },

  getTasks: async (operatorId: string, weather: string): Promise<{ tasks: Task[]; current_weather: string }> => {
    return safeFetch<{ tasks: Task[]; current_weather: string }>(
      `/tasks?operator_id=${operatorId}&weather=${encodeURIComponent(weather)}`,
      undefined,
      { tasks: localTasks, current_weather: weather }
    );
  },

  updateTaskStatus: async (taskId: string, status: string): Promise<{ task_id: string; status: string }> => {
    localTasks = localTasks.map(t => t.task_id === taskId ? { ...t, status: status as any } : t);
    return safeFetch<{ task_id: string; status: string }>(
      `/tasks/${taskId}/status`,
      {
        method: 'POST',
        body: JSON.stringify({ status })
      },
      { task_id: taskId, status }
    );
  },

  getScorecard: async (operatorId: string): Promise<Scorecard> => {
    const fallback = {
      ...MOCK_SCORECARD,
      operator_id: operatorId,
      seatbelt_status: localSeatbeltStatus as 'Fastened' | 'Unfastened',
      score: localSeatbeltStatus === 'Unfastened' ? 68.0 : 87.5
    };
    return safeFetch<Scorecard>(`/anomalies/scorecard?operator_id=${operatorId}`, undefined, fallback);
  },

  estimateTask: async (taskType: string, weather: string, operatorSkill: string, machineAgeYrs: number): Promise<EstimateResult> => {
    return safeFetch<EstimateResult>(
      '/ml/estimate',
      {
        method: 'POST',
        body: JSON.stringify({
          task_type: taskType,
          weather,
          operator_skill: operatorSkill,
          machine_age_yrs: machineAgeYrs
        })
      },
      MOCK_ESTIMATE_RESULT
    );
  },

  getMaintenance: async (machineId: string): Promise<MaintenanceData> => {
    return safeFetch<MaintenanceData>(`/maintenance?machine_id=${machineId}`, undefined, {
      ...MOCK_MAINTENANCE,
      machine_id: machineId
    });
  },

  getTrainingModules: async (operatorId: string): Promise<{ modules: TrainingModule[]; badges_earned: string[] }> => {
    const modules = MOCK_TRAINING_MODULES.map(m => ({
      ...m,
      completed: localBadges.includes(m.badge_unlocked)
    }));
    return safeFetch<{ modules: TrainingModule[]; badges_earned: string[] }>(
      `/training/modules?operator_id=${operatorId}`,
      undefined,
      { modules, badges_earned: localBadges }
    );
  },

  toggleTrainingBadge: async (operatorId: string, badgeName: string): Promise<{ badges: string[] }> => {
    if (localBadges.includes(badgeName)) {
      localBadges = localBadges.filter(b => b !== badgeName);
    } else {
      localBadges.push(badgeName);
    }
    return safeFetch<{ badges: string[] }>(
      `/training/toggle-badge?operator_id=${operatorId}`,
      {
        method: 'POST',
        body: JSON.stringify({ badge_name: badgeName })
      },
      { badges: [...localBadges] }
    );
  },

  getShiftSummary: async (operatorId: string, machineId: string): Promise<ShiftSummary> => {
    return safeFetch<ShiftSummary>(
      `/shift/summary?operator_id=${operatorId}&machine_id=${machineId}`,
      undefined,
      {
        ...MOCK_SHIFT_SUMMARY,
        operator_id: operatorId,
        machine_id: machineId,
        seatbelt_compliance_pct: localSeatbeltStatus === 'Fastened' ? 100 : 75
      }
    );
  },

  getLeaderboard: async (): Promise<LeaderboardItem[]> => {
    return safeFetch<LeaderboardItem[]>('/leaderboard', undefined, MOCK_LEADERBOARD);
  },

  sendChatMessage: async (message: string, operatorId: string, machineId: string): Promise<{
    query: string;
    reply: string;
    category: string;
    quick_actions: string[];
    timestamp: string;
  }> => {
    return safeFetch(
      '/assistant/chat',
      {
        method: 'POST',
        body: JSON.stringify({ message, operator_id: operatorId, machine_id: machineId })
      },
      {
        query: message,
        reply: `OperatorOS In-Cab Assistant (Offline Mode): Telemetry confirmed for ${operatorId}. Idling ratio is 26.4%, seatbelt is ${localSeatbeltStatus.toUpperCase()}. Next service window is ~67 operating hours.`,
        category: 'SYSTEM',
        quick_actions: ['How much have I idled?', 'What is my safety score?', 'When is next maintenance?'],
        timestamp: new Date().toISOString()
      }
    );
  }
};
