/**
 * Centralized API service for all backend calls
 * Scalable architecture with error handling and interceptors
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Profile API
 */
export const profileAPI = {
  get: () => apiFetch('/api/profile'),

  update: (data) => apiFetch('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

/**
 * Timeline API
 */
export const timelineAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.highlights_only) params.append('highlights_only', 'true');

    const query = params.toString();
    return apiFetch(`/api/timeline${query ? '?' + query : ''}`);
  },

  create: (event) => apiFetch('/api/timeline', {
    method: 'POST',
    body: JSON.stringify(event),
  }),
};

/**
 * Skills API
 */
export const skillsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.primary_only) params.append('primary_only', 'true');

    const query = params.toString();
    return apiFetch(`/api/skills${query ? '?' + query : ''}`);
  },

  getGrouped: () => apiFetch('/api/skills/grouped'),
};

/**
 * Social Links API
 */
export const socialLinksAPI = {
  getAll: (activeOnly = true) => {
    const params = new URLSearchParams();
    if (activeOnly) params.append('active_only', 'true');

    return apiFetch(`/api/social-links?${params.toString()}`);
  },
};

/**
 * Portfolio Items API (existing)
 */
export const portfolioAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.language) params.append('language', filters.language);
    if (filters.min_confidence) params.append('min_confidence', filters.min_confidence);
    if (filters.limit) params.append('limit', filters.limit);

    const query = params.toString();
    return apiFetch(`/api/portfolio${query ? '?' + query : ''}`);
  },

  getById: (id) => apiFetch(`/api/portfolio/${id}`),

  getStats: () => apiFetch('/api/stats'),
};

/**
 * Events API (existing)
 */
export const eventsAPI = {
  getAll: (limit = 20) => apiFetch(`/api/events?limit=${limit}`),
};

/**
 * Combined API object for easy imports
 */
const api = {
  profile: profileAPI,
  timeline: timelineAPI,
  skills: skillsAPI,
  socialLinks: socialLinksAPI,
  portfolio: portfolioAPI,
  events: eventsAPI,
};

export default api;
