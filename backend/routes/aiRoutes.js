// Enhanced API routes with comprehensive AI integration
import express from 'express';
import AIService from '../services/aiService.js';

const router = express.Router();
const aiService = new AIService();

// =====================================================
// STUDENT APTITUDE & INTEREST ASSESSMENT ROUTES
// =====================================================

// Generate adaptive quiz questions
router.post('/quiz/generate', async (req, res) => {
  try {
    const { studentLevel = 'class10', previousAnswers = [], userId } = req.body;
    
    console.log(`Generating adaptive quiz for ${studentLevel} level`);
    
    const quiz = await aiService.generateAdaptiveQuiz(studentLevel, previousAnswers);
    
    // Track quiz generation for analytics
    if (userId) {
      // In production, save to database
      console.log(`Quiz generated for user ${userId}`);
    }
    
    res.json({
      success: true,
      quiz,
      generated_at: new Date().toISOString(),
      adaptive: previousAnswers.length > 0
    });
    
  } catch (error) {
    console.error('Error generating adaptive quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate quiz',
      message: error.message
    });
  }
});

// Evaluate quiz results and provide career recommendations
router.post('/quiz/evaluate', async (req, res) => {
  try {
    const { answers, studentProfile = {}, userId } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Valid answers array is required'
      });
    }
    
    console.log(`Evaluating quiz for user ${userId || 'anonymous'}`);
    
    const evaluation = await aiService.evaluateQuizResults(answers, studentProfile);
    
    // In production, save results to database
    const quizResult = {
      user_id: userId,
      answers,
      evaluation,
      completed_at: new Date().toISOString()
    };
    
    res.json({
      success: true,
      evaluation,
      quiz_id: `quiz_${Date.now()}_${userId || 'anon'}`,
      recommendations_count: evaluation.career_recommendations?.length || 0
    });
    
  } catch (error) {
    console.error('Error evaluating quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate quiz',
      message: error.message
    });
  }
});

// =====================================================
// CAREER ROADMAP GENERATION ROUTES
// =====================================================

// Generate personalized career roadmap
router.post('/roadmap/generate', async (req, res) => {
  try {
    const { studentInterests, academicLevel, targetCareer, userId } = req.body;
    
    if (!studentInterests || !academicLevel) {
      return res.status(400).json({
        success: false,
        error: 'Student interests and academic level are required'
      });
    }
    
    console.log(`Generating career roadmap for ${academicLevel} student`);
    
    const roadmap = await aiService.generateCareerRoadmap(
      studentInterests, 
      academicLevel, 
      targetCareer
    );
    
    res.json({
      success: true,
      roadmap,
      generated_at: new Date().toISOString(),
      pathways_count: roadmap.pathways?.length || 0
    });
    
  } catch (error) {
    console.error('Error generating career roadmap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate career roadmap',
      message: error.message
    });
  }
});

// =====================================================
// PERSONALIZED DASHBOARD ROUTES
// =====================================================

// Get personalized recommendations for dashboard
router.post('/dashboard/recommendations', async (req, res) => {
  try {
    const { userProfile, interactionHistory = [], userId } = req.body;
    
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        error: 'User profile is required'
      });
    }
    
    console.log(`Generating recommendations for user ${userId}`);
    
    const recommendations = await aiService.generatePersonalizedRecommendations(
      userProfile, 
      interactionHistory
    );
    
    res.json({
      success: true,
      recommendations,
      generated_at: new Date().toISOString(),
      user_id: userId
    });
    
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
});

// Update user interaction history
router.post('/dashboard/track-interaction', async (req, res) => {
  try {
    const { userId, interactionType, interactionData } = req.body;
    
    if (!userId || !interactionType) {
      return res.status(400).json({
        success: false,
        error: 'User ID and interaction type are required'
      });
    }
    
    // In production, save to database
    const interaction = {
      user_id: userId,
      type: interactionType,
      data: interactionData,
      timestamp: new Date().toISOString()
    };
    
    console.log(`Tracked interaction: ${interactionType} for user ${userId}`);
    
    res.json({
      success: true,
      message: 'Interaction tracked successfully',
      interaction_id: `int_${Date.now()}_${userId}`
    });
    
  } catch (error) {
    console.error('Error tracking interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track interaction',
      message: error.message
    });
  }
});

// =====================================================
// MULTI-LANGUAGE TRANSLATION ROUTES
// =====================================================

// Translate content to different languages
router.post('/translate', async (req, res) => {
  try {
    const { content, targetLanguage = 'hi', context = 'career guidance' } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content to translate is required'
      });
    }
    
    const supportedLanguages = ['hi', 'ks', 'mr', 'ur', 'pa'];
    if (!supportedLanguages.includes(targetLanguage)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language. Supported: ${supportedLanguages.join(', ')}`
      });
    }
    
    console.log(`Translating content to ${targetLanguage}`);
    
    const translatedContent = await aiService.translateContent(
      content, 
      targetLanguage, 
      context
    );
    
    res.json({
      success: true,
      original_content: content,
      translated_content: translatedContent,
      target_language: targetLanguage,
      context,
      translated_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error translating content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to translate content',
      message: error.message
    });
  }
});

// Get available languages
router.get('/languages', (req, res) => {
  const supportedLanguages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ks', name: 'Kashmiri', native: 'कॉशुर' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
  ];
  
  res.json({
    success: true,
    languages: supportedLanguages,
    default_language: 'en'
  });
});

// =====================================================
// CHATBOT COUNSELOR ROUTES
// =====================================================

// AI-powered career counseling chat
router.post('/chat/counsel', async (req, res) => {
  try {
    const { 
      message, 
      userContext = {}, 
      conversationHistory = [], 
      userId,
      language = 'en' 
    } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    console.log(`Processing counseling chat for user ${userId || 'anonymous'}`);
    
    let counselingResponse = await aiService.provideCounselingResponse(
      message, 
      userContext, 
      conversationHistory
    );
    
    // Translate response if requested language is not English
    if (language !== 'en') {
      counselingResponse = await aiService.translateContent(
        counselingResponse, 
        language, 
        'career counseling'
      );
    }
    
    // In production, save conversation to database
    const chatEntry = {
      user_id: userId,
      message,
      response: counselingResponse,
      language,
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      response: counselingResponse,
      conversation_id: `conv_${Date.now()}_${userId || 'anon'}`,
      language
    });
    
  } catch (error) {
    console.error('Error in counseling chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process counseling request',
      message: error.message
    });
  }
});

// =====================================================
// NOTIFICATIONS & TIMELINE ROUTES
// =====================================================

// Generate smart notifications
router.post('/notifications/generate', async (req, res) => {
  try {
    const { userProfile, upcomingEvents = [], userId } = req.body;
    
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        error: 'User profile is required'
      });
    }
    
    console.log(`Generating notifications for user ${userId}`);
    
    const notifications = await aiService.generateSmartNotifications(
      userProfile, 
      upcomingEvents
    );
    
    res.json({
      success: true,
      notifications,
      generated_at: new Date().toISOString(),
      user_id: userId,
      urgent_count: notifications.urgent_notifications?.length || 0
    });
    
  } catch (error) {
    console.error('Error generating notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate notifications',
      message: error.message
    });
  }
});

// Mark notification as read
router.post('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;
    
    // In production, update database
    console.log(`Marked notification ${notificationId} as read for user ${userId}`);
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      notification_id: notificationId,
      marked_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      message: error.message
    });
  }
});

// =====================================================
// ANALYTICS & INSIGHTS ROUTES
// =====================================================

// Get user analytics and insights
router.get('/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In production, fetch from database
    const analytics = {
      user_id: userId,
      quiz_attempts: 3,
      career_paths_explored: 5,
      recommendations_viewed: 12,
      notifications_received: 8,
      notifications_acted_upon: 6,
      study_time_weekly: 15, // hours
      progress_score: 75, // percentage
      strengths: ['Technical Skills', 'Problem Solving'],
      improvement_areas: ['Communication', 'Leadership'],
      j_k_opportunities_matched: 7,
      last_activity: new Date().toISOString()
    };
    
    res.json({
      success: true,
      analytics,
      generated_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// =====================================================
// SYSTEM HEALTH & STATUS ROUTES
// =====================================================

// AI service health check
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      ai_service: 'operational',
      cache_size: aiService.cache.size,
      timestamp: new Date().toISOString(),
      features: [
        'Adaptive Quiz Generation',
        'Career Roadmap Mapping',
        'Personalized Recommendations',
        'Multi-language Translation',
        'AI Counseling Chat',
        'Smart Notifications'
      ]
    };
    
    res.json(health);
    
  } catch (error) {
    console.error('Error checking AI service health:', error);
    res.status(500).json({
      status: 'error',
      ai_service: 'degraded',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
