// Determine API base URL dynamically:
// In production: Uses VITE_API_URL environment variable if defined (e.g. https://your-backend.onrender.com/api)
// In development / proxy: Falls back seamlessly to relative '/api'
const envApiUrl = (import.meta.env.VITE_API_URL || '').trim();
let API_BASE = '/api';

if (envApiUrl) {
  const cleanBase = envApiUrl.endsWith('/') ? envApiUrl.slice(0, -1) : envApiUrl;
  API_BASE = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
}

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
      throw new Error('Unable to connect to backend API server. Please ensure the backend service is online.');
    }
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
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
  checkHealth: () => request('/health'),

  // Dashboard & Insights
  getDashboardStats: () => request('/dashboard/stats'),
  getAIInsights: () => request('/insights'),

  // Meetings
  getMeetings: () => request('/meetings'),
  getMeeting: (id) => request(`/meetings/${id}`),
  analyzeMeeting: (data) =>
    request('/meetings/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  createMeeting: (data) =>
    request('/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteMeeting: (id) =>
    request(`/meetings/${id}`, {
      method: 'DELETE',
    }),

  // Tasks
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

  // Accountability
  getAccountability: () => request('/accountability'),

  // Seed / Reset
  reseedDatabase: () =>
    request('/seed', {
      method: 'POST',
    }),
};
