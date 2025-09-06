import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Neon connection
let sql;
let isConnected = false;

try {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'mock_database' || process.env.DATABASE_URL.includes('YOUR_')) {
    console.warn('⚠️ DATABASE_URL not properly configured. Using mock data mode.');
    sql = null;
  } else {
    sql = neon(process.env.DATABASE_URL);
    console.log('✅ Database connection initialized');
    isConnected = true;
  }
} catch (error) {
  console.error('❌ Database connection error:', error);
  sql = null;
  isConnected = false;
}

// Test database connection
export async function testConnection() {
  try {
    if (!sql) {
      throw new Error('Database connection not initialized');
    }
    
    const result = await sql`SELECT NOW() as current_time, version() as version`;
    console.log('✅ Database connected successfully at:', result[0].current_time);
    console.log('📊 Database version:', result[0].version.split(' ')[0], result[0].version.split(' ')[1]);
    isConnected = true;
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    isConnected = false;
    return false;
  }
}

// Health check function
export async function healthCheck() {
  try {
    if (!sql) return { status: 'disconnected', error: 'Database not initialized' };
    
    const start = Date.now();
    await sql`SELECT 1`;
    const responseTime = Date.now() - start;
    
    return {
      status: 'connected',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Database query functions with enhanced error handling and features
export async function getCareers(filters = {}) {
  try {
    if (!sql) {
      return getMockCareers(filters);
    }

    let query = sql`
      SELECT 
        id, title, description, category, education_level,
        skills_required, salary_range_min, salary_range_max,
        location, company_types, growth_prospects, opportunities_in_jk,
        requirements, created_at, updated_at
      FROM careers
      WHERE active = true
    `;

    // Apply filters
    if (filters.category) {
      query = sql`
        SELECT * FROM careers
        WHERE active = true AND category ILIKE ${`%${filters.category}%`}
        ORDER BY created_at DESC
      `;
    }

    if (filters.location) {
      query = sql`
        SELECT * FROM careers
        WHERE active = true AND location ILIKE ${`%${filters.location}%`}
        ORDER BY created_at DESC
      `;
    }

    if (filters.education_level) {
      query = sql`
        SELECT * FROM careers
        WHERE active = true AND education_level ILIKE ${`%${filters.education_level}%`}
        ORDER BY created_at DESC
      `;
    }

    if (filters.search) {
      query = sql`
        SELECT *, 
               ts_rank(to_tsvector('english', title || ' ' || description), 
                      plainto_tsquery('english', ${filters.search})) as rank
        FROM careers
        WHERE active = true 
        AND to_tsvector('english', title || ' ' || description) @@ plainto_tsquery('english', ${filters.search})
        ORDER BY rank DESC, created_at DESC
      `;
    }

    const result = await query;
    return result;
  } catch (error) {
    console.error('❌ Database query error (getCareers):', error);
    return getMockCareers(filters);
  }
}

export async function getColleges(filters = {}) {
  try {
    if (!sql) {
      return getMockColleges(filters);
    }

    let query = sql`
      SELECT 
        id, name, location, college_type, courses, facilities,
        contact_info, website, established_year, ranking,
        fees_range, admission_process, eligibility, placements,
        created_at, updated_at
      FROM colleges
      WHERE active = true
    `;

    if (filters.type) {
      query = sql`
        SELECT * FROM colleges
        WHERE active = true AND college_type ILIKE ${`%${filters.type}%`}
        ORDER BY ranking ASC, name ASC
      `;
    }

    if (filters.location) {
      query = sql`
        SELECT * FROM colleges
        WHERE active = true AND location ILIKE ${`%${filters.location}%`}
        ORDER BY ranking ASC, name ASC
      `;
    }

    if (filters.search) {
      query = sql`
        SELECT *, 
               ts_rank(to_tsvector('english', name || ' ' || location), 
                      plainto_tsquery('english', ${filters.search})) as rank
        FROM colleges
        WHERE active = true 
        AND to_tsvector('english', name || ' ' || location) @@ plainto_tsquery('english', ${filters.search})
        ORDER BY rank DESC, ranking ASC
      `;
    }

    const result = await query;
    return result;
  } catch (error) {
    console.error('❌ Database query error (getColleges):', error);
    return getMockColleges(filters);
  }
}

export async function getQuizQuestions() {
  try {
    if (!sql) {
      return getMockQuizQuestions();
    }

    const result = await sql`
      SELECT id, question, question_type, options, category, order_index
      FROM quiz_questions
      WHERE active = true
      ORDER BY order_index ASC, created_at ASC
    `;
    return result;
  } catch (error) {
    console.error('❌ Database query error (getQuizQuestions):', error);
    return getMockQuizQuestions();
  }
}

export async function saveQuizResult(userId, answers, recommendations) {
  try {
    if (!sql) {
      console.log('Mock: Quiz result saved for user', userId);
      return { id: 'mock-' + Date.now(), success: true };
    }

    const result = await sql`
      INSERT INTO quiz_results (user_id, answers, recommendations)
      VALUES (${userId}, ${JSON.stringify(answers)}, ${JSON.stringify(recommendations)})
      RETURNING id, completed_at
    `;
    
    return { id: result[0].id, completed_at: result[0].completed_at, success: true };
  } catch (error) {
    console.error('❌ Database query error (saveQuizResult):', error);
    throw error;
  }
}

export async function getUserQuizHistory(userId) {
  try {
    if (!sql) {
      return [];
    }

    const result = await sql`
      SELECT id, answers, recommendations, completed_at
      FROM quiz_results
      WHERE user_id = ${userId}
      ORDER BY completed_at DESC
      LIMIT 10
    `;
    
    return result;
  } catch (error) {
    console.error('❌ Database query error (getUserQuizHistory):', error);
    return [];
  }
}

export async function getTestimonials() {
  try {
    if (!sql) {
      return getMockTestimonials();
    }

    const result = await sql`
      SELECT id, name, role, company, testimonial, rating, avatar_url, featured
      FROM testimonials
      WHERE active = true
      ORDER BY featured DESC, created_at DESC
      LIMIT 20
    `;
    return result;
  } catch (error) {
    console.error('❌ Database query error (getTestimonials):', error);
    return getMockTestimonials();
  }
}

export async function addContactMessage(messageData) {
  try {
    if (!sql) {
      console.log('Mock: Contact message saved', messageData);
      return { id: 'mock-' + Date.now(), success: true };
    }

    const result = await sql`
      INSERT INTO contact_messages (name, email, phone, subject, message)
      VALUES (${messageData.name}, ${messageData.email}, ${messageData.phone || null}, 
              ${messageData.subject || 'General Inquiry'}, ${messageData.message})
      RETURNING id, created_at
    `;
    
    return { id: result[0].id, created_at: result[0].created_at, success: true };
  } catch (error) {
    console.error('❌ Database query error (addContactMessage):', error);
    throw error;
  }
}

export async function logAnalytics(eventData) {
  try {
    if (!sql) {
      return;
    }

    await sql`
      INSERT INTO analytics (user_id, event_type, event_data, ip_address, user_agent)
      VALUES (${eventData.userId || null}, ${eventData.eventType}, 
              ${JSON.stringify(eventData.data)}, ${eventData.ipAddress || null}, 
              ${eventData.userAgent || null})
    `;
  } catch (error) {
    console.error('❌ Database query error (logAnalytics):', error);
    // Don't throw error for analytics to avoid breaking main functionality
  }
}

export { sql };

// Mock data functions for fallback when database is not available
function getMockCareers(filters = {}) {
  const mockCareers = [
    {
      id: 'mock-1',
      title: 'Software Engineer',
      description: 'Develop and maintain software applications, websites, and mobile apps. High demand in emerging IT sector of J&K.',
      category: 'Technology',
      education_level: "Bachelor's Degree",
      skills_required: ['Programming', 'Problem Solving', 'Teamwork', 'Communication'],
      salary_range_min: 300000,
      salary_range_max: 1200000,
      location: 'Srinagar, Jammu',
      company_types: ['IT Companies', 'Startups', 'Government', 'E-commerce'],
      growth_prospects: 'Excellent growth with government push for IT sector in J&K. New IT parks coming up.',
      opportunities_in_jk: 'Growing IT sector with government initiatives, startup incubation centers in Srinagar and Jammu.',
      requirements: 'B.Tech/B.E in Computer Science, IT, or related field. Strong programming skills.',
      created_at: new Date().toISOString()
    },
    {
      id: 'mock-2',
      title: 'Medical Doctor',
      description: 'Provide medical care and treatment to patients. Critical need in J&K healthcare system.',
      category: 'Healthcare',
      education_level: 'MBBS + MD/MS',
      skills_required: ['Medical Knowledge', 'Empathy', 'Communication', 'Problem Solving'],
      salary_range_min: 600000,
      salary_range_max: 2500000,
      location: 'Srinagar, Jammu, Leh',
      company_types: ['Government Hospitals', 'Private Hospitals', 'Clinics'],
      growth_prospects: 'Excellent prospects with government healthcare expansion.',
      opportunities_in_jk: 'High demand due to shortage of doctors. New medical colleges being established.',
      requirements: 'MBBS degree, followed by MD/MS specialization. Clear NEET examination.',
      created_at: new Date().toISOString()
    }
  ];

  return mockCareers.filter(career => {
    if (filters.category && !career.category.toLowerCase().includes(filters.category.toLowerCase())) {
      return false;
    }
    if (filters.location && !career.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    return true;
  });
}

function getMockColleges(filters = {}) {
  const mockColleges = [
    {
      id: 'mock-1',
      name: 'National Institute of Technology (NIT) Srinagar',
      location: 'Srinagar, Kashmir',
      college_type: 'Engineering',
      courses: ['Computer Science Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
      facilities: ['Central Library', 'Computer Labs', 'Research Labs', 'Hostel Facilities'],
      contact_info: { phone: '0194-2420475', email: 'registrar@nitsri.ac.in' },
      website: 'https://www.nitsri.ac.in',
      established_year: 1960,
      ranking: 1,
      fees_range: { tuition_fee_per_year: 165000, hostel_fee_per_year: 45000 },
      admission_process: 'JEE Main followed by JoSAA counseling',
      eligibility: { jee_main_rank: 'Required', subjects: 'Physics, Chemistry, Mathematics' },
      placements: { average_package: 800000, highest_package: 2500000, placement_percentage: 85 },
      created_at: new Date().toISOString()
    }
  ];

  return mockColleges.filter(college => {
    if (filters.type && !college.college_type.toLowerCase().includes(filters.type.toLowerCase())) {
      return false;
    }
    if (filters.location && !college.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    return true;
  });
}

function getMockQuizQuestions() {
  return [
    {
      id: 'mock-q1',
      question: 'What subjects do you enjoy the most?',
      question_type: 'multiple_choice',
      options: ['Science & Mathematics', 'Arts & Literature', 'Social Studies', 'Technology & Computers'],
      category: 'interests',
      order_index: 1
    },
    {
      id: 'mock-q2',
      question: 'What type of work environment do you prefer?',
      question_type: 'multiple_choice',
      options: ['Office Environment', 'Outdoor Work', 'Laboratory/Research', 'Remote Work'],
      category: 'work_preference',
      order_index: 2
    }
  ];
}

function getMockTestimonials() {
  return [
    {
      id: 'mock-t1',
      name: 'Priya Sharma',
      role: 'Software Engineer',
      company: 'Tech Solutions Srinagar',
      testimonial: 'J&K Career Navigator helped me find the perfect career path in technology. The guidance was invaluable.',
      rating: 5,
      avatar_url: null,
      featured: true
    },
    {
      id: 'mock-t2',
      name: 'Rahul Kumar',
      role: 'Medical Student',
      company: 'GMC Jammu',
      testimonial: 'The career guidance helped me choose medicine and get into the right college. Highly recommended!',
      rating: 5,
      avatar_url: null,
      featured: true
    }
  ];
}
