import {
  Operator,
  Machine,
  LiveTelemetry,
  AdaptiveTask,
  RadarResponse,
  MapEntities,
  SafetyEvent,
  EventReplay,
  AnomalyReport,
  PersonalizedTraining,
  TrainingEffectiveness,
  ScorecardData,
  ShiftRecap,
  ChatMessage
} from './types';

import {
  MOCK_OPERATORS,
  MOCK_MACHINES,
  MOCK_TELEMETRY,
  MOCK_RADAR,
  MOCK_MAP_ENTITIES,
  MOCK_TASKS,
  MOCK_SAFETY_EVENTS,
  MOCK_EVENT_REPLAY,
  MOCK_ANOMALY_REPORT,
  MOCK_PERSONALIZED_TRAINING,
  MOCK_TRAINING_EFFECTIVENESS,
  MOCK_SCORECARD,
  MOCK_SHIFT_RECAP
} from './api/mockData';

const BASE_URL = 'http://localhost:8000/api';

// Weather Cache
let cachedWeather: { weather: string; timestamp: number } = {
  weather: 'Muddy/Wet',
  timestamp: Date.now()
};

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
    console.warn(`[OperatorOS API] Network exception on ${endpoint}. Gracefully falling back to mockData.`, err);
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}

export const api = {
  // Operators & Machines
  getOperators: async (): Promise<Operator[]> => {
    return safeFetch<Operator[]>('/operators', undefined, MOCK_OPERATORS);
  },

  getMachines: async (): Promise<Machine[]> => {
    return safeFetch<Machine[]>('/machines', undefined, MOCK_MACHINES);
  },

  // Live Telemetry
  getLiveTelemetry: async (operatorId: string, machineId: string): Promise<LiveTelemetry> => {
    const fallback = {
      ...MOCK_TELEMETRY,
      operator_id: operatorId,
      machine_id: machineId
    };
    return safeFetch<LiveTelemetry>(`/telemetry/live?operator_id=${operatorId}&machine_id=${machineId}`, undefined, fallback);
  },

  simulateTelemetry: async (params: {
    noise_db?: number;
    toggle_seatbelt?: boolean;
    trigger_proximity?: boolean;
    trigger_idling_anomaly?: boolean;
    weather?: string;
  }) => {
    if (params.weather) {
      cachedWeather = { weather: params.weather, timestamp: Date.now() };
    }
    return safeFetch('/telemetry/simulate', {
      method: 'POST',
      body: JSON.stringify(params)
    }, { status: 'UPDATED_OFFLINE' });
  },

  getCachedWeather: () => {
    const ageMin = Math.round((Date.now() - cachedWeather.timestamp) / 60000);
    return {
      weather: cachedWeather.weather,
      ageMin
    };
  },

  // Radar & 2D Site Map
  getSafetyRadar: async (machineId: string): Promise<RadarResponse> => {
    return safeFetch<RadarResponse>(`/safety/radar?machine_id=${machineId}`, undefined, MOCK_RADAR);
  },

  getMapEntities: async (machineId: string): Promise<MapEntities> => {
    return safeFetch<MapEntities>(`/safety/map-entities?machine_id=${machineId}`, undefined, MOCK_MAP_ENTITIES);
  },

  // Safety Events & Replay
  getSafetyEvents: async (): Promise<SafetyEvent[]> => {
    return safeFetch<SafetyEvent[]>('/safety/events', undefined, MOCK_SAFETY_EVENTS);
  },

  acknowledgeEvent: async (eventId: string) => {
    return safeFetch('/safety/event/acknowledge', {
      method: 'POST',
      body: JSON.stringify({ event_id: eventId })
    }, { event_id: eventId, acknowledged: true });
  },

  getEventReplay: async (): Promise<EventReplay> => {
    return safeFetch<EventReplay>('/safety/replay', undefined, MOCK_EVENT_REPLAY);
  },

  reportIncident: async (report: { operator_id: string; machine_id: string; incident_type: string; notes: string }) => {
    return safeFetch('/safety/incident/report', {
      method: 'POST',
      body: JSON.stringify(report)
    }, {
      report_id: `RPT-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      ...report
    });
  },

  // Adaptive Tasks
  getAdaptiveTasks: async (operatorId: string, weather?: string): Promise<{ tasks: AdaptiveTask[]; weather: string }> => {
    const w = weather || cachedWeather.weather;
    return safeFetch<{ tasks: AdaptiveTask[]; weather: string }>(
      `/tasks?operator_id=${operatorId}&weather=${encodeURIComponent(w)}`,
      undefined,
      { tasks: MOCK_TASKS, weather: w }
    );
  },

  acceptTaskReschedule: async (taskId: string) => {
    return safeFetch(`/tasks/${taskId}/accept-reschedule`, { method: 'POST' }, {
      task_id: taskId,
      status: 'RESCHEDULED_FOR_WEATHER_SAFETY'
    });
  },

  updateTaskStatus: async (taskId: string, status: string) => {
    return safeFetch(`/tasks/${taskId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    }, { task_id: taskId, status });
  },

  // Anomaly Engine
  detectAnomalies: async (operatorId: string): Promise<AnomalyReport> => {
    return safeFetch<AnomalyReport>(`/anomalies/detect?operator_id=${operatorId}`, undefined, MOCK_ANOMALY_REPORT);
  },

  // Personalized Training & Effectiveness
  getPersonalizedTraining: async (operatorId: string): Promise<PersonalizedTraining> => {
    return safeFetch<PersonalizedTraining>(`/training/personalized?operator_id=${operatorId}`, undefined, MOCK_PERSONALIZED_TRAINING);
  },

  completeTraining: async (moduleId: string, score: number = 95.0) => {
    return safeFetch('/training/complete', {
      method: 'POST',
      body: JSON.stringify({ module_id: moduleId, score })
    }, { module_id: moduleId, status: 'COMPLETED', score });
  },

  getTrainingEffectiveness: async (): Promise<TrainingEffectiveness> => {
    return safeFetch<TrainingEffectiveness>('/training/effectiveness', undefined, MOCK_TRAINING_EFFECTIVENESS);
  },

  // Scorecard
  getScorecard: async (operatorId: string): Promise<ScorecardData> => {
    return safeFetch<ScorecardData>(`/scorecard?operator_id=${operatorId}`, undefined, {
      ...MOCK_SCORECARD,
      operator_id: operatorId
    });
  },

  // Shift Recap
  getShiftRecap: async (operatorId: string, machineId: string): Promise<ShiftRecap> => {
    return safeFetch<ShiftRecap>(`/shift/recap?operator_id=${operatorId}&machine_id=${machineId}`, undefined, {
      ...MOCK_SHIFT_RECAP,
      operator_id: operatorId,
      machine_id: machineId
    });
  },

  // AI Assistant Chat
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
        reply: `OperatorOS AI Assistant: Operating link active for ${operatorId} on ${machineId}. Live telemetry confirms standard machine parameters.`,
        category: 'CO_PILOT',
        quick_actions: ['Why did I get this alert?', 'Why is my task taking longer?', 'What is my safety score?'],
        timestamp: new Date().toISOString()
      }
    );
  }
};
