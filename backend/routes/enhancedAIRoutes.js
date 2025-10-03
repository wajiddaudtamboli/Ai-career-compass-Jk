import express from 'express';
import geminiAIService from '../services/geminiAIService.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for AI endpoints
const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    success: false,
    error: 'Too many AI requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all AI routes
router.use(aiRateLimit);

// AI-Powered Career Counselor (Dynamic Q&A)
router.post('/ask-counselor', async (req, res) => {
  try {
    const { question, userProfile = {} } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    const result = await geminiAIService.getCareerGuidance(question, userProfile);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Ask counselor error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Personalized Course & Stream Recommendations
router.post('/recommend-stream', async (req, res) => {
  try {
    const { quizResults, userPreferences = {} } = req.body;
    
    if (!quizResults) {
      return res.status(400).json({
        success: false,
        error: 'Quiz results are required'
      });
    }

    const result = await geminiAIService.getStreamRecommendations(quizResults, userPreferences);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Stream recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Dynamic Knowledge Hub
router.post('/knowledge-hub', async (req, res) => {
  try {
    const { topic, userContext = {} } = req.body;
    
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }

    const result = await geminiAIService.getKnowledgeContent(topic, userContext);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Knowledge hub error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Natural Language Search
router.post('/natural-search', async (req, res) => {
  try {
    const { query, availableData = {} } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const result = await geminiAIService.processNaturalLanguageQuery(query, availableData);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Natural search error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Interactive Timeline & Notifications
router.post('/generate-reminders', async (req, res) => {
  try {
    const { userProfile, currentDate } = req.body;
    
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        error: 'User profile is required'
      });
    }

    const result = await geminiAIService.generatePersonalizedReminders(
      userProfile, 
      currentDate ? new Date(currentDate) : new Date()
    );
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Generate reminders error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Counselor Expert AI Companion
router.post('/counselor-brief', async (req, res) => {
  try {
    const { studentProfile, sessionType = 'general' } = req.body;
    
    if (!studentProfile) {
      return res.status(400).json({
        success: false,
        error: 'Student profile is required'
      });
    }

    const result = await geminiAIService.generateCounselorBrief(studentProfile, sessionType);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Counselor brief error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Multilingual Support
router.post('/translate', async (req, res) => {
  try {
    const { content, targetLanguage, sourceLanguage = 'english' } = req.body;
    
    if (!content || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Content and target language are required'
      });
    }

    const result = await geminiAIService.translateContent(content, targetLanguage, sourceLanguage);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Scholarship & Financial Aid Advisor
router.post('/scholarship-recommendations', async (req, res) => {
  try {
    const { studentProfile, financialInfo } = req.body;
    
    if (!studentProfile || !financialInfo) {
      return res.status(400).json({
        success: false,
        error: 'Student profile and financial information are required'
      });
    }

    const result = await geminiAIService.getScholarshipRecommendations(studentProfile, financialInfo);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Scholarship recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Career Path Simulator
router.post('/simulate-career', async (req, res) => {
  try {
    const { currentEducation, careerChoice, timeframe = '5 years' } = req.body;
    
    if (!currentEducation || !careerChoice) {
      return res.status(400).json({
        success: false,
        error: 'Current education and career choice are required'
      });
    }

    const result = await geminiAIService.simulateCareerPath(currentEducation, careerChoice, timeframe);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Career simulation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Dynamic Content Generation
router.post('/generate-content', async (req, res) => {
  try {
    const { contentType, parameters = {} } = req.body;
    
    if (!contentType) {
      return res.status(400).json({
        success: false,
        error: 'Content type is required'
      });
    }

    const result = await geminiAIService.generateDynamicContent(contentType, parameters);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const result = await geminiAIService.healthCheck();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('AI health check error:', error);
    res.status(500).json({
      success: false,
      error: 'AI service health check failed'
    });
  }
});

// Batch processing endpoint for multiple AI operations
router.post('/batch-process', async (req, res) => {
  try {
    const { operations } = req.body;
    
    if (!operations || !Array.isArray(operations)) {
      return res.status(400).json({
        success: false,
        error: 'Operations array is required'
      });
    }

    const results = [];
    
    for (const operation of operations) {
      try {
        let result;
        
        switch (operation.type) {
          case 'career_guidance':
            result = await geminiAIService.getCareerGuidance(operation.question, operation.userProfile);
            break;
          case 'stream_recommendation':
            result = await geminiAIService.getStreamRecommendations(operation.quizResults, operation.userPreferences);
            break;
          case 'knowledge_content':
            result = await geminiAIService.getKnowledgeContent(operation.topic, operation.userContext);
            break;
          default:
            result = { success: false, error: 'Unknown operation type' };
        }
        
        results.push({
          operationId: operation.id,
          ...result
        });
      } catch (error) {
        results.push({
          operationId: operation.id,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      results: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Batch process error:', error);
    res.status(500).json({
      success: false,
      error: 'Batch processing failed'
    });
  }
});

// Career Path Simulation
router.post('/simulate-career', async (req, res) => {
  try {
    const { currentEducation, careerChoice, timeframe, additionalInfo = {} } = req.body;
    
    if (!currentEducation || !careerChoice || !timeframe) {
      return res.status(400).json({
        success: false,
        error: 'Current education, career choice, and timeframe are required'
      });
    }

    const result = await geminiAIService.simulateCareerPath(
      currentEducation, 
      careerChoice, 
      timeframe, 
      additionalInfo
    );
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Career simulation error:', error);
    res.status(500).json({
      success: false,
      error: 'Career simulation failed'
    });
  }
});

export default router;