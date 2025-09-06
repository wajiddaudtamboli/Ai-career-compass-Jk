// Simple Mock Database Functions for Development
// Provides basic compatibility with existing route expectations

import { query as pgQuery, isDBConnected } from './connection-pg.js';

// Mock data storage for development
let mockCareers = [
    {
        id: 1,
        title: 'Software Engineer',
        description: 'Develop software applications',
        category: 'Technology',
        avg_salary: 800000,
        featured: true
    },
    {
        id: 2,
        title: 'Digital Marketing Specialist',
        description: 'Plan digital marketing campaigns',
        category: 'Marketing',
        avg_salary: 500000,
        featured: true
    }
];

let mockColleges = [
    {
        id: 1,
        name: 'University of Jammu',
        location: 'Jammu',
        type: 'University',
        rating: 4.2,
        featured: true
    },
    {
        id: 2,
        name: 'Kashmir University',
        location: 'Srinagar',
        type: 'University',
        rating: 4.0,
        featured: true
    }
];

let mockQuizQuestions = [
    {
        id: 1,
        question: 'What interests you most?',
        options: ['Technology', 'Arts', 'Science', 'Business'],
        type: 'multiple_choice'
    },
    {
        id: 2,
        question: 'What is your preferred work environment?',
        options: ['Office', 'Remote', 'Field Work', 'Laboratory'],
        type: 'multiple_choice'
    }
];

let mockTestimonials = [
    {
        id: 1,
        name: 'Priya Sharma',
        role: 'Software Engineer',
        content: 'Great platform for career guidance!',
        rating: 5
    },
    {
        id: 2,
        name: 'Arjun Singh',
        role: 'Tourism Guide',
        content: 'Helped me find my career path.',
        rating: 5
    }
];

// Career functions
export async function getCareers(filters = {}) {
    if (isDBConnected()) {
        // Use actual database
        try {
            const result = await pgQuery('SELECT * FROM careers WHERE is_active = true ORDER BY featured DESC, title');
            return result.rows;
        } catch (error) {
            console.warn('Database query failed, using mock data:', error.message);
            return mockCareers;
        }
    } else {
        // Use mock data
        console.log('🔧 Using mock careers data');
        return mockCareers;
    }
}

// College functions
export async function getColleges(filters = {}) {
    if (isDBConnected()) {
        // Use actual database
        try {
            const result = await pgQuery('SELECT * FROM colleges WHERE is_active = true ORDER BY featured DESC, name');
            return result.rows;
        } catch (error) {
            console.warn('Database query failed, using mock data:', error.message);
            return mockColleges;
        }
    } else {
        // Use mock data
        console.log('🔧 Using mock colleges data');
        return mockColleges;
    }
}

// Quiz functions
export async function getQuizQuestions() {
    if (isDBConnected()) {
        // Use actual database
        try {
            const result = await pgQuery('SELECT * FROM quiz_questions WHERE is_active = true ORDER BY display_order');
            return result.rows;
        } catch (error) {
            console.warn('Database query failed, using mock data:', error.message);
            return mockQuizQuestions;
        }
    } else {
        // Use mock data
        console.log('🔧 Using mock quiz questions data');
        return mockQuizQuestions;
    }
}

export async function saveQuizResult(userId, answers, recommendations) {
    if (isDBConnected()) {
        // Use actual database
        try {
            const result = await pgQuery(
                'INSERT INTO quiz_results (user_id, answers, recommendations, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
                [userId, JSON.stringify(answers), JSON.stringify(recommendations)]
            );
            return { id: result.rows[0].id, success: true };
        } catch (error) {
            console.warn('Database insert failed:', error.message);
            return { id: Date.now(), success: true, mock: true };
        }
    } else {
        // Mock save
        console.log('🔧 Mock quiz result saved');
        return { id: Date.now(), success: true, mock: true };
    }
}

export async function getUserQuizHistory(userId) {
    if (isDBConnected()) {
        // Use actual database
        try {
            const result = await pgQuery(
                'SELECT * FROM quiz_results WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            );
            return result.rows;
        } catch (error) {
            console.warn('Database query failed:', error.message);
            return [];
        }
    } else {
        // Mock history
        console.log('🔧 Using mock quiz history');
        return [];
    }
}

// Testimonial functions
export async function getTestimonials() {
    if (isDBConnected()) {
        // Use actual database
        try {
            const result = await pgQuery('SELECT * FROM testimonials WHERE is_active = true ORDER BY featured DESC, created_at DESC');
            return result.rows;
        } catch (error) {
            console.warn('Database query failed, using mock data:', error.message);
            return mockTestimonials;
        }
    } else {
        // Use mock data
        console.log('🔧 Using mock testimonials data');
        return mockTestimonials;
    }
}

// Contact functions
export async function addContactMessage(name, email, message, subject = '') {
    if (isDBConnected()) {
        // Use actual database
        try {
            const result = await pgQuery(
                'INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
                [name, email, subject, message]
            );
            return { id: result.rows[0].id, success: true };
        } catch (error) {
            console.warn('Database insert failed:', error.message);
            return { id: Date.now(), success: true, mock: true };
        }
    } else {
        // Mock save
        console.log('🔧 Mock contact message saved:', { name, email, subject });
        return { id: Date.now(), success: true, mock: true };
    }
}

// Analytics functions
export async function logAnalytics(event, data = {}) {
    if (isDBConnected()) {
        // Use actual database
        try {
            const result = await pgQuery(
                'INSERT INTO analytics_events (event_name, event_data, created_at) VALUES ($1, $2, NOW()) RETURNING id',
                [event, JSON.stringify(data)]
            );
            return { id: result.rows[0].id, success: true };
        } catch (error) {
            console.warn('Database insert failed:', error.message);
            return { id: Date.now(), success: true, mock: true };
        }
    } else {
        // Mock log
        console.log('🔧 Mock analytics logged:', event, data);
        return { id: Date.now(), success: true, mock: true };
    }
}

// Health check function
export async function healthCheck() {
    if (isDBConnected()) {
        try {
            const result = await pgQuery('SELECT NOW() as timestamp');
            return {
                status: 'connected',
                timestamp: result.rows[0].timestamp,
                database: 'PostgreSQL'
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    } else {
        return {
            status: 'mock',
            timestamp: new Date().toISOString(),
            database: 'Mock Mode'
        };
    }
}

// Export all functions for compatibility
export {
    mockCareers,
    mockColleges,
    mockQuizQuestions,
    mockTestimonials
};

export default {
    getCareers,
    getColleges,
    getQuizQuestions,
    saveQuizResult,
    getUserQuizHistory,
    getTestimonials,
    addContactMessage,
    logAnalytics,
    healthCheck
};
