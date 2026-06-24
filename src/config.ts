/**
 * Global application parameters, network paths, and cost tracking configuration arrays.
 */


export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
export const WS_BASE = (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;

const defaultWs = (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
const configuredWs = import.meta.env.VITE_WS_BASE_URL;

export const PRICING = {
  INPUT_COST_PER_M: 0.075,
  OUTPUT_COST_PER_M: 0.30,
};

export const DEPARTMENTS = ['Technical', 'Finance', 'HR', 'Marketing', 'Sales', 'Operations'] as const;

export const TRACE_NOISE_FILTER = [
  'connect',
  'urllib3',
  'sqlite',
  'qdrant.upsert',
  'socket',
  'ping',
  'health',
  'get',
  'http',
  'options'
];
