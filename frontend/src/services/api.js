const envApiUrl = (import.meta.env.VITE_API_URL || '').trim();

// Determine base API URL
let computedApiBase = '';
let configurationError = null;

if (envApiUrl) {
  const cleanBase = envApiUrl.endsWith('/') ? envApiUrl.slice(0, -1) : envApiUrl;
  // If user included /api at the end, use as is; otherwise append /api
  computedApiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
} else {
  // If in production environment and VITE_API_URL is missing, flag configuration error
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    configurationError = 'VITE_API_URL environment variable is not configured. Please add VITE_API_URL in your Vercel project environment settings.';
    console.warn(`[Meet2Action AI Configuration Warning]: ${configurationError}`);
  }
  // Default fallback to relative /api endpoint
  computedApiBase = '/api';
}

export const API_BASE = computedApiBase;
export const CONFIG_ERROR = configurationError;

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Request failed with status ${response.status}`);
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const extraHint = !envApiUrl
        ? ' (Notice: VITE_API_URL is not set. In production, configure VITE_API_URL in Vercel to your deployed backend URL).'
        : ` (Attempted connection to ${API_BASE}).`;
      throw new Error(`Unable to connect to Meet2Action AI backend API server.${extraHint}`);
    }
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Config & Diagnostics
  getApiBaseUrl: () => API_BASE,
  getConfigurationError: () => CONFIG_ERROR,
  checkHealth: () => request('/health'),

  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  demoLogin: () =>
    request('/auth/demo-login', {
      method: 'POST',
    }),
  getMe: () => request('/auth/me'),

  // Dashboard & Insights
  getDashboardStats: () => request('/dashboard/stats'),
  getAIInsights: () => request('/insights'),
  getAccountability: () => request('/accountability'),

  // Meetings
  getMeetings: () => request('/meetings'),
  getMeeting: (id) => request(`/meetings/${id}`),
  createMeeting: (data) =>
    request('/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMeeting: (id, updates) =>
    request(`/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteMeeting: (id) =>
    request(`/meetings/${id}`, {
      method: 'DELETE',
    }),
  analyzeMeeting: (data) =>
    request('/meetings/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Action Items (Official REST endpoints)
  getActionItems: (params = {}) => {
    const query = new URLSearchParams();
    if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.assignee && params.assignee !== 'All') query.append('assignee', params.assignee);
    if (params.q) query.append('q', params.q);
    const qs = query.toString();
    return request(`/action-items${qs ? `?${qs}` : ''}`);
  },
  createActionItem: (data) =>
    request('/action-items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateActionItem: (id, updates) =>
    request(`/action-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteActionItem: (id) =>
    request(`/action-items/${id}`, {
      method: 'DELETE',
    }),

  // Tasks (Kanban / Tasks Page)
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.assignee && params.assignee !== 'All') query.append('assignee', params.assignee);
    if (params.q) query.append('q', params.q);
    const qs = query.toString();
    return request(`/tasks${qs ? `?${qs}` : ''}`);
  },
  createTask: (data) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTask: (id, updates) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  // Team Members
  getTeam: () => request('/team'),
  createTeamMember: (data) =>
    request('/team', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTeamMember: (id, updates) =>
    request(`/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteTeamMember: (id) =>
    request(`/team/${id}`, {
      method: 'DELETE',
    }),

  // AI Meeting Assistant Endpoints
  aiSummarize: (notes, title = '') =>
    request('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ notes, title }),
    }),
  aiActionItems: (notes, title = '') =>
    request('/ai/action-items', {
      method: 'POST',
      body: JSON.stringify({ notes, title }),
    }),
  aiHighlights: (notes, title = '') =>
    request('/ai/highlights', {
      method: 'POST',
      body: JSON.stringify({ notes, title }),
    }),
  aiFollowUps: (notes, title = '') =>
    request('/ai/follow-ups', {
      method: 'POST',
      body: JSON.stringify({ notes, title }),
    }),

  // Seed / Reset Database
  reseedDatabase: () =>
    request('/seed', {
      method: 'POST',
    }),
};

export default api;
