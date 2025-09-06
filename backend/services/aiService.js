// Enhanced AI service with comprehensive Gemini API integration
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.cache = new Map(); // Simple in-memory cache
    this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
  }

  // =====================================================
  // 1. STUDENT APTITUDE & INTEREST ASSESSMENT
  // =====================================================
  
  async generateAdaptiveQuiz(studentLevel = 'class10', previousAnswers = []) {
    const cacheKey = `quiz_${studentLevel}_${previousAnswers.length}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const prompt = `
    Generate 5 adaptive career aptitude questions for ${studentLevel} students in Jammu & Kashmir context.
    
    Previous answers analysis: ${JSON.stringify(previousAnswers)}
    
    Requirements:
    1. Mix of scenario-based and direct questions
    2. Include J&K specific context (local industries, opportunities)
    3. Adaptive difficulty based on previous responses
    4. Cover: Technical aptitude, Creative thinking, Leadership, Problem-solving, Communication
    5. Include real-world scenarios relevant to J&K (tourism, agriculture, technology, governance)
    
    Return as JSON with structure:
    {
      "questions": [
        {
          "id": "unique_id",
          "type": "multiple_choice|scenario|ranking",
          "difficulty": "easy|medium|hard",
          "category": "technical|creative|leadership|analytical|communication",
          "question": "Question text",
          "context": "J&K specific context if applicable",
          "options": ["option1", "option2", "option3", "option4"],
          "correct_indicators": ["traits indicated by each option"],
          "j_k_relevance": "How this relates to J&K opportunities"
        }
      ],
      "adaptive_reasoning": "Why these questions were selected based on previous answers"
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const cleanedResponse = this.extractJSON(response);
      const quiz = JSON.parse(cleanedResponse);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: quiz,
        timestamp: Date.now()
      });
      
      return quiz;
    } catch (error) {
      console.error('Error generating adaptive quiz:', error);
      return this.getFallbackQuiz(studentLevel);
    }
  }

  async evaluateQuizResults(answers, studentProfile = {}) {
    const prompt = `
    Analyze student quiz responses and provide comprehensive career guidance for Jammu & Kashmir context.
    
    Student Profile: ${JSON.stringify(studentProfile)}
    Quiz Answers: ${JSON.stringify(answers)}
    
    Provide analysis with:
    1. Aptitude scoring (Technical, Creative, Leadership, Analytical, Communication) out of 10
    2. Recommended streams (Science/Commerce/Arts/Vocational) with percentages
    3. Top 5 career recommendations specific to J&K opportunities
    4. Personalized development plan
    5. J&K specific college/institution suggestions
    6. Industry growth trends in J&K relevant to student
    
    Return as JSON:
    {
      "aptitude_scores": {
        "technical": score,
        "creative": score,
        "leadership": score,
        "analytical": score,
        "communication": score
      },
      "recommended_streams": [
        {
          "stream": "Science/Commerce/Arts/Vocational",
          "match_percentage": percentage,
          "reasoning": "why this stream fits",
          "j_k_opportunities": "specific opportunities in J&K"
        }
      ],
      "career_recommendations": [
        {
          "title": "Career Title",
          "match_score": percentage,
          "description": "Career description",
          "j_k_demand": "demand level in J&K",
          "growth_prospects": "future growth in region",
          "required_skills": ["skill1", "skill2"],
          "education_path": "recommended education",
          "salary_range": "expected salary in J&K"
        }
      ],
      "development_plan": {
        "immediate_actions": ["action1", "action2"],
        "skill_development": ["skill1", "skill2"],
        "j_k_resources": ["local resources available"],
        "timeline": "suggested timeline"
      },
      "college_suggestions": [
        {
          "name": "College Name",
          "location": "J&K location",
          "programs": ["relevant programs"],
          "why_recommended": "reasoning"
        }
      ]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const analysis = JSON.parse(this.extractJSON(response));
      return analysis;
    } catch (error) {
      console.error('Error evaluating quiz results:', error);
      return this.getFallbackEvaluation();
    }
  }

  // =====================================================
  // 2. COURSE-TO-CAREER PATH MAPPING
  // =====================================================

  async generateCareerRoadmap(studentInterests, academicLevel, targetCareer = null) {
    const prompt = `
    Generate an interactive career roadmap for a student in Jammu & Kashmir.
    
    Student Interests: ${JSON.stringify(studentInterests)}
    Academic Level: ${academicLevel}
    Target Career: ${targetCareer || 'to be determined'}
    
    Create a comprehensive roadmap including:
    1. Multiple career pathways (at least 3 alternatives)
    2. Education milestones with J&K institutions
    3. Skill development checkpoints
    4. Industry connections in J&K
    5. Government schemes and opportunities
    6. Timeline with realistic deadlines
    7. Alternative routes if plans change
    
    Return as JSON suitable for visualization:
    {
      "pathways": [
        {
          "id": "pathway_id",
          "title": "Pathway Title",
          "description": "Brief description",
          "suitability_score": percentage,
          "timeline_years": number,
          "milestones": [
            {
              "year": number,
              "title": "Milestone title",
              "description": "What to achieve",
              "type": "education|skill|experience|certification",
              "j_k_institutions": ["relevant local institutions"],
              "requirements": ["prerequisites"],
              "outcomes": ["expected outcomes"]
            }
          ],
          "j_k_advantages": "Why this path is good in J&K context",
          "growth_potential": "Career growth prospects in J&K",
          "salary_progression": "Expected salary growth",
          "success_stories": "Local success stories or examples"
        }
      ],
      "skills_matrix": {
        "technical_skills": ["skill1", "skill2"],
        "soft_skills": ["skill1", "skill2"],
        "j_k_specific_skills": ["region-specific advantages"]
      },
      "government_support": [
        {
          "scheme_name": "Scheme name",
          "description": "How it helps",
          "eligibility": "Who can apply",
          "application_process": "How to apply"
        }
      ]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(this.extractJSON(response));
    } catch (error) {
      console.error('Error generating career roadmap:', error);
      return this.getFallbackRoadmap();
    }
  }

  // =====================================================
  // 3. PERSONALIZED DASHBOARD RECOMMENDATIONS
  // =====================================================

  async generatePersonalizedRecommendations(userProfile, interactionHistory = []) {
    const prompt = `
    Generate personalized dashboard recommendations for AI Career Compass J&K user.
    
    User Profile: ${JSON.stringify(userProfile)}
    Recent Interactions: ${JSON.stringify(interactionHistory)}
    
    Provide real-time recommendations for:
    1. Best-fit courses based on aptitude and interests
    2. Top colleges in J&K and nearby regions
    3. Relevant entrance exams with deadlines
    4. Study resources (books, online courses, prep material)
    5. Scholarship opportunities
    6. Industry trends affecting their chosen field
    7. Networking opportunities in J&K
    8. Government schemes and initiatives
    
    Return as JSON:
    {
      "priority_recommendations": [
        {
          "type": "course|college|exam|resource|scholarship|opportunity",
          "title": "Recommendation title",
          "description": "Why this is recommended",
          "relevance_score": percentage,
          "action_required": "What user should do",
          "deadline": "if applicable",
          "j_k_specific": "regional relevance",
          "next_steps": ["step1", "step2"]
        }
      ],
      "trending_opportunities": [
        {
          "title": "Opportunity title",
          "description": "Description",
          "why_trending": "Why it's gaining importance",
          "j_k_relevance": "Local relevance",
          "how_to_prepare": "Preparation steps"
        }
      ],
      "study_plan": {
        "weekly_goals": ["goal1", "goal2"],
        "monthly_targets": ["target1", "target2"],
        "resource_recommendations": [
          {
            "type": "book|online_course|video|practice_test",
            "title": "Resource name",
            "description": "What it covers",
            "j_k_availability": "Where to find in J&K",
            "cost": "Free/Paid/Cost estimate"
          }
        ]
      },
      "alerts": [
        {
          "type": "deadline|opportunity|update",
          "title": "Alert title",
          "message": "Alert description",
          "urgency": "high|medium|low",
          "action_deadline": "when to act"
        }
      ]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(this.extractJSON(response));
    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      return this.getFallbackRecommendations();
    }
  }

  // =====================================================
  // 4. MULTI-LANGUAGE SUPPORT
  // =====================================================

  async translateContent(content, targetLanguage = 'hi', context = 'career guidance') {
    const cacheKey = `translate_${targetLanguage}_${this.hashContent(content)}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const languageNames = {
      'hi': 'Hindi (हिंदी)',
      'ks': 'Kashmiri (कॉशुर)',
      'mr': 'Marathi (मराठी)',
      'ur': 'Urdu (اردو)',
      'pa': 'Punjabi (ਪੰਜਾਬੀ)'
    };

    const prompt = `
    Translate the following career guidance content to ${languageNames[targetLanguage]}.
    
    Context: ${context}
    Content to translate: ${JSON.stringify(content)}
    
    Requirements:
    1. Maintain technical terms accuracy
    2. Keep J&K specific terms recognizable
    3. Preserve formatting if JSON structure
    4. Use culturally appropriate expressions
    5. Maintain professional tone suitable for career guidance
    
    If input is JSON, return translated JSON with same structure.
    If input is plain text, return translated text.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      let translatedContent;
      try {
        // Try to parse as JSON first
        translatedContent = JSON.parse(this.extractJSON(response));
      } catch {
        // If not JSON, treat as plain text
        translatedContent = response.trim();
      }
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: translatedContent,
        timestamp: Date.now()
      });
      
      return translatedContent;
    } catch (error) {
      console.error('Error translating content:', error);
      return content; // Return original content if translation fails
    }
  }

  // =====================================================
  // 5. CHATBOT COUNSELOR
  // =====================================================

  async provideCounselingResponse(message, userContext = {}, conversationHistory = []) {
    const prompt = `
    You are an expert career counselor for students in Jammu & Kashmir, India.
    
    User Context: ${JSON.stringify(userContext)}
    Conversation History: ${JSON.stringify(conversationHistory.slice(-5))} // Last 5 messages
    Current Message: ${message}
    
    Provide contextual career guidance considering:
    1. J&K specific opportunities and challenges
    2. Local industries and growth sectors
    3. Educational institutions in the region
    4. Government schemes and initiatives
    5. Cultural and economic factors
    6. Current market trends
    
    Response should be:
    - Personalized to user's profile
    - Actionable and practical
    - Encouraging and supportive
    - Include specific next steps
    - Reference local resources when applicable
    
    Return as JSON:
    {
      "response": "Main response text",
      "suggestions": [
        {
          "title": "Suggestion title",
          "description": "What to do",
          "priority": "high|medium|low",
          "timeline": "when to do it"
        }
      ],
      "resources": [
        {
          "type": "website|book|course|institution|contact",
          "title": "Resource name",
          "description": "How it helps",
          "access_info": "How to access/contact"
        }
      ],
      "follow_up_questions": ["question1", "question2"],
      "sentiment": "supportive|encouraging|informative|urgent"
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(this.extractJSON(response));
    } catch (error) {
      console.error('Error providing counseling response:', error);
      return this.getFallbackCounselingResponse(message);
    }
  }

  // =====================================================
  // 6. NOTIFICATIONS & TIMELINE TRACKER
  // =====================================================

  async generateSmartNotifications(userProfile, upcomingEvents = []) {
    const prompt = `
    Generate intelligent notifications and reminders for AI Career Compass J&K user.
    
    User Profile: ${JSON.stringify(userProfile)}
    Upcoming Events: ${JSON.stringify(upcomingEvents)}
    Current Date: ${new Date().toISOString()}
    
    Generate notifications for:
    1. Admission deadlines (J&K colleges and outside)
    2. Scholarship applications
    3. Entrance exam registrations and dates
    4. Career fair and counseling sessions
    5. Document preparation deadlines
    6. Fee payment deadlines
    7. Course selection periods
    8. Internship application windows
    
    Return as JSON:
    {
      "urgent_notifications": [
        {
          "id": "notification_id",
          "type": "deadline|opportunity|reminder|update",
          "title": "Notification title",
          "message": "Detailed message",
          "deadline": "ISO date string",
          "days_remaining": number,
          "priority": "critical|high|medium|low",
          "action_required": "What user needs to do",
          "resources": ["helpful links or contacts"],
          "j_k_specific": "regional relevance"
        }
      ],
      "upcoming_opportunities": [
        {
          "title": "Opportunity title",
          "description": "Description",
          "application_period": "when to apply",
          "eligibility": "who can apply",
          "how_to_apply": "application process",
          "j_k_advantage": "special provisions for J&K students"
        }
      ],
      "weekly_reminders": [
        {
          "day": "Monday|Tuesday|...",
          "tasks": ["task1", "task2"],
          "preparation_activities": ["activity1", "activity2"]
        }
      ]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(this.extractJSON(response));
    } catch (error) {
      console.error('Error generating smart notifications:', error);
      return this.getFallbackNotifications();
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  extractJSON(text) {
    // Extract JSON from AI response that might have extra text
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      return text.substring(jsonStart, jsonEnd);
    }
    
    return text;
  }

  hashContent(content) {
    // Simple hash for caching
    return btoa(JSON.stringify(content)).substring(0, 16);
  }

  // =====================================================
  // FALLBACK METHODS (for when AI is unavailable)
  // =====================================================

  getFallbackQuiz(studentLevel) {
    return {
      questions: [
        {
          id: "q1_fallback",
          type: "multiple_choice",
          difficulty: "medium",
          category: "technical",
          question: "What interests you most about technology in Jammu & Kashmir?",
          context: "J&K is developing its IT infrastructure with new tech parks",
          options: [
            "Building software for local businesses",
            "Working on e-governance projects",
            "Developing tourism apps",
            "Creating agricultural technology solutions"
          ],
          correct_indicators: ["technical", "analytical", "creative", "innovative"],
          j_k_relevance: "IT sector is growing rapidly in J&K with government support"
        }
      ],
      adaptive_reasoning: "Fallback quiz focusing on local relevance"
    };
  }

  getFallbackEvaluation() {
    return {
      aptitude_scores: {
        technical: 7,
        creative: 6,
        leadership: 5,
        analytical: 7,
        communication: 6
      },
      recommended_streams: [
        {
          stream: "Science",
          match_percentage: 75,
          reasoning: "Strong technical and analytical scores",
          j_k_opportunities: "Growing IT and healthcare sectors in J&K"
        }
      ],
      career_recommendations: [
        {
          title: "Software Developer",
          match_score: 80,
          description: "Develop applications and software solutions",
          j_k_demand: "High demand with new IT parks",
          growth_prospects: "Excellent with government digitization initiatives",
          required_skills: ["Programming", "Problem Solving"],
          education_path: "B.Tech in Computer Science",
          salary_range: "3-8 LPA in J&K"
        }
      ],
      development_plan: {
        immediate_actions: ["Strengthen programming skills", "Explore local IT companies"],
        skill_development: ["Python", "Web Development", "Problem Solving"],
        j_k_resources: ["NIT Srinagar", "IIIT Srinagar", "Local coding bootcamps"],
        timeline: "2-4 years for establishing career"
      },
      college_suggestions: [
        {
          name: "NIT Srinagar",
          location: "Srinagar, J&K",
          programs: ["B.Tech Computer Science", "B.Tech Electronics"],
          why_recommended: "Premier technical institution in J&K"
        }
      ]
    };
  }

  getFallbackRoadmap() {
    return {
      pathways: [
        {
          id: "tech_pathway",
          title: "Technology Career Path",
          description: "Career in software development and IT",
          suitability_score: 80,
          timeline_years: 4,
          milestones: [
            {
              year: 1,
              title: "Foundation Building",
              description: "Complete 12th grade with strong math and science",
              type: "education",
              j_k_institutions: ["Local schools with good science programs"],
              requirements: ["Good grades in math and science"],
              outcomes: ["Strong foundation for engineering entrance"]
            }
          ],
          j_k_advantages: "Growing IT sector with government support",
          growth_potential: "High growth potential in emerging IT ecosystem",
          salary_progression: "3 LPA to 15+ LPA over 5-7 years",
          success_stories: "Many J&K students now working in top tech companies"
        }
      ],
      skills_matrix: {
        technical_skills: ["Programming", "Data Analysis", "System Design"],
        soft_skills: ["Communication", "Teamwork", "Problem Solving"],
        j_k_specific_skills: ["Understanding local business needs", "Multi-lingual communication"]
      },
      government_support: [
        {
          scheme_name: "Digital India Initiative",
          description: "Support for IT skill development",
          eligibility: "All students",
          application_process: "Apply through official website"
        }
      ]
    };
  }

  getFallbackRecommendations() {
    return {
      priority_recommendations: [
        {
          type: "exam",
          title: "JEE Main Registration",
          description: "Register for engineering entrance exam",
          relevance_score: 90,
          action_required: "Complete registration and prepare",
          deadline: "January 2024",
          j_k_specific: "Special provisions for J&K students",
          next_steps: ["Register online", "Start preparation", "Gather documents"]
        }
      ],
      trending_opportunities: [
        {
          title: "AI and Machine Learning",
          description: "Growing field with applications in governance and business",
          why_trending: "Government focus on digitization",
          j_k_relevance: "Opportunities in e-governance and smart cities",
          how_to_prepare: "Learn Python, statistics, and ML algorithms"
        }
      ],
      study_plan: {
        weekly_goals: ["Complete 3 practice tests", "Study 2 hours daily"],
        monthly_targets: ["Finish one subject syllabus", "Take mock exam"],
        resource_recommendations: [
          {
            type: "book",
            title: "NCERT Mathematics",
            description: "Foundation for engineering entrance",
            j_k_availability: "Available in local bookstores",
            cost: "₹500-800"
          }
        ]
      },
      alerts: [
        {
          type: "deadline",
          title: "Application Deadline Approaching",
          message: "JEE Main registration closes in 2 weeks",
          urgency: "high",
          action_deadline: "2024-01-15"
        }
      ]
    };
  }

  getFallbackCounselingResponse(message) {
    return {
      response: "I understand you're seeking career guidance. Based on the opportunities in Jammu & Kashmir, I recommend focusing on emerging sectors like Technology, Healthcare, and Tourism. The region is experiencing growth in IT with new tech parks and government digitization initiatives. Would you like specific guidance about any particular field?",
      suggestions: [
        {
          title: "Explore IT Opportunities",
          description: "Visit local IT companies and learn about career paths",
          priority: "high",
          timeline: "This month"
        },
        {
          title: "Connect with Alumni",
          description: "Reach out to graduates working in your field of interest",
          priority: "medium",
          timeline: "Next 2 weeks"
        }
      ],
      resources: [
        {
          type: "institution",
          title: "NIT Srinagar Career Counseling",
          description: "Professional career guidance services",
          access_info: "Contact admission office for counseling sessions"
        }
      ],
      follow_up_questions: [
        "What subjects do you enjoy most in school?",
        "Are you interested in technical or non-technical careers?"
      ],
      sentiment: "supportive"
    };
  }

  getFallbackNotifications() {
    return {
      urgent_notifications: [
        {
          id: "deadline_1",
          type: "deadline",
          title: "College Application Deadline",
          message: "Several college applications are due soon",
          deadline: "2024-03-15",
          days_remaining: 30,
          priority: "high",
          action_required: "Submit applications with required documents",
          resources: ["College websites", "Admission helplines"],
          j_k_specific: "Special quotas available for J&K students"
        }
      ],
      upcoming_opportunities: [
        {
          title: "Scholarship Applications Open",
          description: "Various scholarships for J&K students",
          application_period: "February - March 2024",
          eligibility: "Students with good academic record",
          how_to_apply: "Online application through portal",
          j_k_advantage: "Higher allocation for regional students"
        }
      ],
      weekly_reminders: [
        {
          day: "Monday",
          tasks: ["Review study plan", "Check application deadlines"],
          preparation_activities: ["Practice test", "Document verification"]
        }
      ]
    };
  }
}

export default AIService;
