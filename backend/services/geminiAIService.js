import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

class GeminiAIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Rate limiting tracking
    this.requestCount = new Map();
    this.maxRequestsPerMinute = 20;
  }

  // Rate limiting helper
  checkRateLimit(userId = 'anonymous') {
    const now = Date.now();
    const userRequests = this.requestCount.get(userId) || [];
    
    // Remove requests older than 1 minute
    const recentRequests = userRequests.filter(time => now - time < 60000);
    
    if (recentRequests.length >= this.maxRequestsPerMinute) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    recentRequests.push(now);
    this.requestCount.set(userId, recentRequests);
  }

  // AI-Powered Career Counselor (Dynamic Q&A)
  async getCareerGuidance(question, userProfile = {}) {
    try {
      this.checkRateLimit(userProfile.userId);
      
      const context = `You are an expert career counselor for students in Jammu & Kashmir, India. 
      Provide personalized, practical, and encouraging career guidance. 
      Consider local opportunities, government schemes, and cultural context.
      
      Student Profile: ${JSON.stringify(userProfile)}
      Question: ${question}`;

      const result = await this.model.generateContent(context);
      const response = await result.response;
      
      return {
        success: true,
        response: response.text(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Career guidance error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get career guidance'
      };
    }
  }

  // Personalized Course & Stream Recommendations
  async getStreamRecommendations(quizResults, userPreferences = {}) {
    try {
      this.checkRateLimit(userPreferences.userId);
      
      const prompt = `Based on the following aptitude and interest quiz results, provide personalized stream recommendations for a student in India:

      Quiz Results: ${JSON.stringify(quizResults)}
      User Preferences: ${JSON.stringify(userPreferences)}
      
      Please provide:
      1. Top 3 recommended streams (Science, Commerce, Arts, Vocational)
      2. Reasoning for each recommendation
      3. Specific career paths within each stream
      4. Skills to develop for success
      5. Entrance exams to prepare for
      
      Format the response as a structured JSON object.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        recommendations: response.text(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Stream recommendation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get stream recommendations'
      };
    }
  }

  // Dynamic Knowledge Hub
  async getKnowledgeContent(topic, userContext = {}) {
    try {
      this.checkRateLimit(userContext.userId);
      
      const prompt = `Provide comprehensive, up-to-date information about: "${topic}"
      
      Context: This is for students in Jammu & Kashmir, India.
      User Context: ${JSON.stringify(userContext)}
      
      Please include:
      1. Overview and current relevance
      2. Key opportunities and requirements
      3. Application processes and deadlines
      4. Tips for success
      5. Recent updates or changes
      
      Keep the content informative, practical, and encouraging.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        content: response.text(),
        topic: topic,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Knowledge content error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get knowledge content'
      };
    }
  }

  // Natural Language Search
  async processNaturalLanguageQuery(query, availableData = {}) {
    try {
      this.checkRateLimit();
      
      const prompt = `Process this natural language query and extract structured search parameters:
      
      Query: "${query}"
      Available Data Categories: ${JSON.stringify(Object.keys(availableData))}
      
      Extract and return:
      1. Search intent (college_search, career_info, exam_details, etc.)
      2. Location preferences
      3. Course/stream preferences
      4. Other relevant filters
      5. Suggested search parameters
      
      Format as JSON object for easy parsing.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        searchParams: response.text(),
        originalQuery: query,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Natural language query error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process natural language query'
      };
    }
  }

  // Interactive Timeline & Notifications
  async generatePersonalizedReminders(userProfile, currentDate = new Date()) {
    try {
      this.checkRateLimit(userProfile.userId);
      
      const prompt = `Generate personalized academic and career reminders for a student:
      
      Student Profile: ${JSON.stringify(userProfile)}
      Current Date: ${currentDate.toISOString()}
      
      Generate reminders for:
      1. Upcoming admission deadlines
      2. Scholarship application dates
      3. Entrance exam registration dates
      4. Career guidance session suggestions
      5. Skill development recommendations
      
      Prioritize based on the student's stream, academic year, and career interests.
      Format as an array of reminder objects with date, type, message, and priority.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        reminders: response.text(),
        generatedDate: currentDate.toISOString()
      };
    } catch (error) {
      console.error('Reminders generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate reminders'
      };
    }
  }

  // Counselor Expert AI Companion
  async generateCounselorBrief(studentProfile, sessionType = 'general') {
    try {
      this.checkRateLimit();
      
      const prompt = `Generate a comprehensive brief for a career counselor about to meet with a student:
      
      Student Profile: ${JSON.stringify(studentProfile)}
      Session Type: ${sessionType}
      
      Provide:
      1. Student background summary
      2. Key concerns and interests
      3. Suggested talking points
      4. Potential challenges to address
      5. Recommended resources or next steps
      6. Questions to ask the student
      
      Make this actionable for an effective counseling session.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        brief: response.text(),
        sessionType: sessionType,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Counselor brief error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate counselor brief'
      };
    }
  }

  // Multilingual Support
  async translateContent(content, targetLanguage, sourceLanguage = 'english') {
    try {
      this.checkRateLimit();
      
      const prompt = `Translate the following career guidance content from ${sourceLanguage} to ${targetLanguage}:
      
      Content: ${content}
      
      Maintain the professional tone and ensure cultural appropriateness for Indian context.
      If technical terms don't have direct translations, provide explanations in parentheses.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        translatedContent: response.text(),
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Translation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to translate content'
      };
    }
  }

  // Scholarship & Financial Aid Advisor
  async getScholarshipRecommendations(studentProfile, financialInfo) {
    try {
      this.checkRateLimit(studentProfile.userId);
      
      const prompt = `Provide personalized scholarship and financial aid recommendations:
      
      Student Profile: ${JSON.stringify(studentProfile)}
      Financial Information: ${JSON.stringify(financialInfo)}
      
      Include:
      1. Eligible government scholarships (Central & J&K State)
      2. Merit-based scholarships
      3. Need-based financial aid
      4. Application procedures and deadlines
      5. Required documents
      6. Tips for successful applications
      
      Focus on opportunities specifically available for J&K students.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        scholarships: response.text(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Scholarship recommendation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get scholarship recommendations'
      };
    }
  }

  // Career Path Simulator
  async simulateCareerPath(currentEducation, careerChoice, timeframe = '5 years') {
    try {
      this.checkRateLimit();
      
      const prompt = `Simulate a detailed career path projection:
      
      Current Education: ${currentEducation}
      Career Choice: ${careerChoice}
      Timeframe: ${timeframe}
      
      Provide:
      1. Year-by-year progression milestones
      2. Skill development requirements
      3. Potential challenges and solutions
      4. Alternative paths and opportunities
      5. Expected salary progression
      6. Success indicators and metrics
      
      Make this realistic and actionable for Indian job market context.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        careerPath: response.text(),
        timeframe: timeframe,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Career path simulation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to simulate career path'
      };
    }
  }

  // Dynamic Content Generation
  async generateDynamicContent(contentType, parameters = {}) {
    try {
      this.checkRateLimit();
      
      let prompt = '';
      
      switch (contentType) {
        case 'faq':
          prompt = `Generate comprehensive FAQ section for a career guidance platform for J&K students. Include common questions about streams, exams, colleges, careers, and scholarships.`;
          break;
        case 'admission_guide':
          prompt = `Create a detailed admission guide blog post for ${parameters.topic || 'general college admissions'} in India, specifically useful for J&K students.`;
          break;
        case 'success_story':
          prompt = `Generate an inspiring student success story template for ${parameters.stream || 'any stream'} students, focusing on challenges overcome and achievements.`;
          break;
        default:
          prompt = `Generate engaging educational content about ${contentType} for career guidance platform.`;
      }
      
      prompt += ` Make it informative, encouraging, and culturally appropriate for Indian students.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        content: response.text(),
        contentType: contentType,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Dynamic content generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate dynamic content'
      };
    }
  }

  // AI Career Path Simulation
  async simulateCareerPath(currentEducation, careerChoice, timeframe, additionalInfo = {}) {
    try {
      this.checkRateLimit(additionalInfo.userId || 'anonymous');
      
      const educationLevels = {
        'class10': 'Class 10th (Secondary Education)',
        'class12_science': 'Class 12th Science (PCM/PCB)',
        'class12_commerce': 'Class 12th Commerce',
        'class12_arts': 'Class 12th Arts/Humanities',
        'graduation': 'Bachelor\'s Degree',
        'postgraduation': 'Master\'s Degree'
      };

      const careerOptions = {
        'software_engineer': 'Software Engineer',
        'doctor': 'Medical Doctor',
        'civil_engineer': 'Civil Engineer',
        'teacher': 'Teacher/Professor',
        'ias_officer': 'IAS Officer',
        'entrepreneur': 'Entrepreneur',
        'chartered_accountant': 'Chartered Accountant',
        'lawyer': 'Lawyer',
        'journalist': 'Journalist',
        'data_scientist': 'Data Scientist',
        'psychologist': 'Psychologist',
        'digital_marketer': 'Digital Marketer'
      };

      const currentLevel = educationLevels[currentEducation] || currentEducation;
      const targetCareer = careerOptions[careerChoice] || careerChoice;
      const location = additionalInfo.location || 'Jammu & Kashmir';
      const interests = additionalInfo.interests || [];

      const prompt = `You are an expert career counselor specializing in Indian education and career pathways, with deep knowledge of opportunities in ${location}.

Create a detailed, realistic career path simulation for:

**Current Situation:**
- Education Level: ${currentLevel}
- Target Career: ${targetCareer}
- Timeframe: ${timeframe}
- Location: ${location}
- Interests: ${interests.join(', ') || 'Not specified'}

**Please provide a comprehensive simulation that includes:**

1. **Immediate Steps (Next 6-12 months):**
   - Specific courses, exams, or certifications needed
   - Skill development priorities
   - Application deadlines and processes

2. **Short-term Milestones (1-2 years):**
   - Educational progression
   - Internship or work experience opportunities
   - Key competencies to develop

3. **Medium-term Goals (2-5 years):**
   - Career entry strategies
   - Professional development pathways
   - Networking and industry connections

4. **Long-term Vision (5+ years):**
   - Career advancement opportunities
   - Leadership and specialization paths
   - Potential salary ranges and growth prospects

5. **Jammu & Kashmir Specific Opportunities:**
   - Local institutions and programs
   - Government schemes and support
   - Regional industry insights
   - Cultural and geographical advantages

6. **Challenges & Solutions:**
   - Potential obstacles and how to overcome them
   - Alternative pathways if plans change
   - Market trends and future outlook

7. **Action Plan:**
   - Specific next steps to take this month
   - Resources and contacts to utilize
   - Timeline with key milestones

**Make this simulation:**
- Realistic and achievable
- Specific to Indian context and ${location}
- Include actual institutions, exams, and programs where relevant
- Consider current market trends and future projections
- Provide encouragement and motivation
- Include backup plans and alternatives

Format the response in a clear, structured manner with actionable insights.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        careerPath: response.text(),
        timeframe: timeframe,
        timestamp: new Date().toISOString(),
        simulationId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error) {
      console.error('Career path simulation error:', error);
      return {
        success: false,
        error: error.message === 'Rate limit exceeded. Please try again later.' 
          ? 'Too many simulation requests. Please wait a moment and try again.'
          : 'Unable to generate career path simulation at this time. Please try again later.'
      };
    }
  }

  // Health check for the service
  async healthCheck() {
    try {
      const testPrompt = 'Respond with "AI service is working correctly" if you can process this message.';
      const result = await this.model.generateContent(testPrompt);
      const response = await result.response;
      
      return {
        success: true,
        status: 'healthy',
        message: response.text(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

export default new GeminiAIService();