// Frontend AI service for comprehensive Gemini API integration
import api from './api.js';

class AIServiceClient {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // =====================================================
  // ADAPTIVE QUIZ SYSTEM
  // =====================================================

  async generateAdaptiveQuiz(studentLevel = 'class10', previousAnswers = [], userId = null) {
    try {
      const response = await api.post('/api/ai/quiz/generate', {
        studentLevel,
        previousAnswers,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error generating adaptive quiz:', error);
      throw new Error('Failed to generate adaptive quiz');
    }
  }

  async evaluateQuizResults(answers, studentProfile = {}, userId = null) {
    try {
      const response = await api.post('/api/ai/quiz/evaluate', {
        answers,
        studentProfile,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error evaluating quiz results:', error);
      throw new Error('Failed to evaluate quiz results');
    }
  }

  // =====================================================
  // CAREER ROADMAP GENERATION
  // =====================================================

  async generateCareerRoadmap(studentInterests, academicLevel, targetCareer = null, userId = null) {
    try {
      const response = await api.post('/api/ai/roadmap/generate', {
        studentInterests,
        academicLevel,
        targetCareer,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error generating career roadmap:', error);
      throw new Error('Failed to generate career roadmap');
    }
  }

  // =====================================================
  // PERSONALIZED DASHBOARD
  // =====================================================

  async getPersonalizedRecommendations(userProfile, interactionHistory = [], userId = null) {
    const cacheKey = `recommendations_${userId}_${Date.now().toString(36)}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await api.post('/api/ai/dashboard/recommendations', {
        userProfile,
        interactionHistory,
        userId
      });
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  async trackInteraction(userId, interactionType, interactionData) {
    try {
      const response = await api.post('/api/ai/dashboard/track-interaction', {
        userId,
        interactionType,
        interactionData
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking interaction:', error);
      // Don't throw error for tracking - it's not critical
      return { success: false };
    }
  }

  // =====================================================
  // MULTI-LANGUAGE TRANSLATION
  // =====================================================

  async translateContent(content, targetLanguage = 'hi', context = 'career guidance') {
    const cacheKey = `translate_${targetLanguage}_${this.hashContent(content)}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await api.post('/api/ai/translate', {
        content,
        targetLanguage,
        context
      });
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error translating content:', error);
      throw new Error('Failed to translate content');
    }
  }

  async getSupportedLanguages() {
    try {
      const response = await api.get('/api/ai/languages');
      return response.data;
    } catch (error) {
      console.error('Error getting supported languages:', error);
      // Return fallback languages
      return {
        success: true,
        languages: [
          { code: 'en', name: 'English', native: 'English' },
          { code: 'hi', name: 'Hindi', native: 'हिंदी' }
        ]
      };
    }
  }

  // =====================================================
  // AI CHATBOT COUNSELOR
  // =====================================================

  async getCounselingResponse(message, userContext = {}, conversationHistory = [], userId = null, language = 'en') {
    try {
      const response = await api.post('/api/ai/chat/counsel', {
        message,
        userContext,
        conversationHistory,
        userId,
        language
      });
      return response.data;
    } catch (error) {
      console.error('Error getting counseling response:', error);
      throw new Error('Failed to get counseling response');
    }
  }

  // =====================================================
  // SMART NOTIFICATIONS
  // =====================================================

  async getSmartNotifications(userProfile, upcomingEvents = [], userId = null) {
    try {
      const response = await api.post('/api/ai/notifications/generate', {
        userProfile,
        upcomingEvents,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error getting smart notifications:', error);
      throw new Error('Failed to get notifications');
    }
  }

  async markNotificationAsRead(notificationId, userId) {
    try {
      const response = await api.post(`/api/ai/notifications/${notificationId}/read`, {
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false };
    }
  }

  // =====================================================
  // ANALYTICS & INSIGHTS
  // =====================================================

  async getUserAnalytics(userId) {
    try {
      const response = await api.get(`/api/ai/analytics/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw new Error('Failed to get analytics');
    }
  }

  // =====================================================
  // HEALTH CHECK
  // =====================================================

  async checkAIServiceHealth() {
    try {
      const response = await api.get('/api/ai/health');
      return response.data;
    } catch (error) {
      console.error('Error checking AI service health:', error);
      return { status: 'error', ai_service: 'unavailable' };
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  hashContent(content) {
    // Simple hash for caching
    return btoa(JSON.stringify(content)).substring(0, 16);
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }

  // =====================================================
  // LOCAL STORAGE HELPERS
  // =====================================================

  saveUserProfile(profile) {
    try {
      localStorage.setItem('jk_career_user_profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  getUserProfile() {
    try {
      const profile = localStorage.getItem('jk_career_user_profile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  saveInteractionHistory(history) {
    try {
      const maxHistoryLength = 50; // Keep last 50 interactions
      const limitedHistory = history.slice(-maxHistoryLength);
      localStorage.setItem('jk_career_interaction_history', JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error saving interaction history:', error);
    }
  }

  getInteractionHistory() {
    try {
      const history = localStorage.getItem('jk_career_interaction_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting interaction history:', error);
      return [];
    }
  }

  addInteraction(interaction) {
    try {
      const history = this.getInteractionHistory();
      history.push({
        ...interaction,
        timestamp: new Date().toISOString()
      });
      this.saveInteractionHistory(history);
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  }

  // =====================================================
  // ERROR HANDLING HELPERS
  // =====================================================

  formatErrorMessage(error) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  isNetworkError(error) {
    return error.code === 'ERR_NETWORK' || error.message === 'Network Error';
  }

  isAIServiceError(error) {
    return error.response?.status >= 500 || error.message.includes('AI service');
  }
}

// Create singleton instance
const aiServiceClient = new AIServiceClient();

export default aiServiceClient;
