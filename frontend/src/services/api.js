// API service for making HTTP requests to backend
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available (Clerk will handle this)
    const token = localStorage.getItem('clerk-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors vs CORS vs other errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network Error: Backend server might be down or unreachable');
      error.userMessage = 'Backend server is unreachable. Please check if the server is running on http://localhost:5001';
    } else if (error.response?.status === 0) {
      console.error('CORS Error: Cross-origin request blocked');
      error.userMessage = 'CORS Error: Request blocked due to cross-origin restrictions';
    } else if (error.response?.status === 404) {
      console.error('API Endpoint not found:', error.config?.url);
      error.userMessage = 'API endpoint not found';
    } else {
      console.error('API Error:', error.response?.data || error.message);
      error.userMessage = error.response?.data?.message || error.message;
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  // Gemini AI chat
  chat: (message, context = 'career guidance') => 
    api.post('/api/chat', { message, context }),

  // Careers
  getCareers: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/api/careers?${params}`);
  },

  // Colleges
  getColleges: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/api/colleges?${params}`);
  },

  // Quiz
  getQuizQuestions: () => api.get('/api/quiz/questions'),
  submitQuiz: (answers, userId) => 
    api.post('/api/quiz/submit', { answers, user_id: userId }),

  // User profile (protected routes)
  getProfile: () => api.get('/api/profile'),
  updateProfile: (profileData) => api.put('/api/profile', profileData),

  // Contact form
  submitContactForm: (formData) => api.post('/api/contact/submit', formData),

  // Analytics
  trackEvent: (eventType, eventData) => 
    api.post('/api/analytics/track', { event_type: eventType, event_data: eventData }),
};

export default api;
