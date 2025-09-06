// Simple Enhanced Data Routes for Testing
import express from 'express';

const router = express.Router();

// Helper function for error handling
const handleError = (res, error, operation) => {
    console.error(`Error in ${operation}:`, error);
    res.status(500).json({ 
        success: false, 
        error: `${operation} failed: ${error.message}` 
    });
};

// Helper function for successful responses
const sendSuccess = (res, data, message = 'Success') => {
    res.json({
        success: true,
        message,
        data
    });
};

// Health check endpoint for API v1
router.get('/health', (req, res) => {
    const { db } = req.app.locals;
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        api_version: 'v1 Enhanced',
        database: db ? 'connected' : 'mock mode',
        features: [
            'Content Blocks Management',
            'Enhanced Careers Database',
            'College Information System',
            'Interactive Quiz Engine',
            'Testimonials Management',
            'Articles & Blog System',
            'Analytics & Reporting',
            'User Feedback System'
        ],
        endpoints: {
            'content_blocks': '/api/v1/content-blocks/:pageRoute',
            'careers': '/api/v1/careers',
            'colleges': '/api/v1/colleges',
            'quiz': '/api/v1/quiz/questions',
            'testimonials': '/api/v1/testimonials',
            'articles': '/api/v1/articles',
            'analytics': '/api/v1/analytics/overview',
            'dashboard': '/api/v1/dashboard/stats'
        }
    });
});

// Content Blocks - Dynamic content management
router.get('/content-blocks/:pageRoute', async (req, res) => {
    try {
        const { pageRoute } = req.params;
        const { db } = req.app.locals;
        
        if (db) {
            // Database implementation would go here
            const result = await db.query(
                `SELECT cb.*, a.username as updated_by_username 
                 FROM content_blocks cb 
                 LEFT JOIN admins a ON cb.updated_by = a.id 
                 WHERE cb.page_route = $1 AND cb.is_active = true 
                 ORDER BY cb.display_order, cb.created_at`,
                [pageRoute]
            );
            sendSuccess(res, result.rows, `Content blocks retrieved for ${pageRoute}`);
        } else {
            // Mock data response
            const mockData = [
                {
                    id: 1,
                    page_route: pageRoute,
                    block_type: 'hero',
                    title: 'Welcome to J&K Career Navigator',
                    content: 'Your gateway to career success in Jammu & Kashmir',
                    display_order: 1,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_by_username: 'system'
                },
                {
                    id: 2,
                    page_route: pageRoute,
                    block_type: 'features',
                    title: 'Our Services',
                    content: 'Career guidance, college information, and skill development programs',
                    display_order: 2,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_by_username: 'system'
                }
            ];
            sendSuccess(res, mockData, `Mock content blocks for ${pageRoute} (Database not connected)`);
        }
    } catch (error) {
        handleError(res, error, 'Get content blocks');
    }
});

// Careers endpoint with mock data
router.get('/careers', async (req, res) => {
    try {
        const { category, search, featured, limit = 10 } = req.query;
        
        // Mock careers data
        const mockCareers = [
            {
                id: 1,
                title: 'Software Engineer',
                slug: 'software-engineer',
                description: 'Develop and maintain software applications using modern technologies',
                category: 'Technology',
                subcategory: 'Software Development',
                avg_salary: 800000,
                demand_score: 95,
                education_level: 'Bachelor',
                skills_required: ['JavaScript', 'React', 'Node.js', 'Python'],
                location: ['Jammu', 'Srinagar', 'Remote'],
                featured: true,
                avg_rating: 4.5,
                review_count: 12,
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Digital Marketing Specialist',
                slug: 'digital-marketing-specialist',
                description: 'Plan and execute digital marketing campaigns across various platforms',
                category: 'Marketing',
                subcategory: 'Digital Marketing',
                avg_salary: 500000,
                demand_score: 85,
                education_level: 'Bachelor',
                skills_required: ['SEO', 'Social Media', 'Google Analytics', 'Content Marketing'],
                location: ['Jammu', 'Srinagar'],
                featured: true,
                avg_rating: 4.2,
                review_count: 8,
                created_at: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Tourism Guide',
                slug: 'tourism-guide',
                description: 'Guide tourists and showcase the beauty of Jammu & Kashmir',
                category: 'Tourism',
                subcategory: 'Guide Services',
                avg_salary: 300000,
                demand_score: 75,
                education_level: 'High School',
                skills_required: ['Local Knowledge', 'Communication', 'Languages', 'Customer Service'],
                location: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Leh'],
                featured: false,
                avg_rating: 4.0,
                review_count: 15,
                created_at: new Date().toISOString()
            },
            {
                id: 4,
                title: 'Data Analyst',
                slug: 'data-analyst',
                description: 'Analyze complex datasets to derive business insights',
                category: 'Technology',
                subcategory: 'Data Science',
                avg_salary: 600000,
                demand_score: 90,
                education_level: 'Bachelor',
                skills_required: ['Python', 'SQL', 'Excel', 'Tableau'],
                location: ['Jammu', 'Srinagar', 'Remote'],
                featured: true,
                avg_rating: 4.3,
                review_count: 6,
                created_at: new Date().toISOString()
            }
        ];
        
        // Apply filters
        let filteredCareers = mockCareers;
        
        if (category) {
            filteredCareers = filteredCareers.filter(career => 
                career.category.toLowerCase() === category.toLowerCase()
            );
        }
        
        if (search) {
            filteredCareers = filteredCareers.filter(career => 
                career.title.toLowerCase().includes(search.toLowerCase()) ||
                career.description.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        if (featured === 'true') {
            filteredCareers = filteredCareers.filter(career => career.featured);
        }
        
        // Apply limit
        filteredCareers = filteredCareers.slice(0, parseInt(limit));
        
        sendSuccess(res, {
            careers: filteredCareers,
            total: filteredCareers.length,
            mode: 'mock_data'
        }, 'Mock careers data retrieved successfully');
        
    } catch (error) {
        handleError(res, error, 'Get careers');
    }
});

// Colleges endpoint with mock data
router.get('/colleges', async (req, res) => {
    try {
        const { location, type, search, limit = 10 } = req.query;
        
        // Mock colleges data
        const mockColleges = [
            {
                id: 1,
                name: 'University of Jammu',
                slug: 'university-of-jammu',
                location: 'Jammu',
                type: 'University',
                affiliation: 'State University',
                established: 1969,
                rating: 4.2,
                courses: ['Engineering', 'Arts', 'Commerce', 'Science'],
                fees_range: '50000-200000',
                website: 'https://jammuuniversity.ac.in',
                featured: true
            },
            {
                id: 2,
                name: 'Kashmir University',
                slug: 'kashmir-university',
                location: 'Srinagar',
                type: 'University',
                affiliation: 'State University',
                established: 1948,
                rating: 4.0,
                courses: ['Medicine', 'Engineering', 'Arts', 'Science'],
                fees_range: '60000-250000',
                website: 'https://kashmiruniversity.net',
                featured: true
            },
            {
                id: 3,
                name: 'NIT Srinagar',
                slug: 'nit-srinagar',
                location: 'Srinagar',
                type: 'Institute',
                affiliation: 'NIT',
                established: 1960,
                rating: 4.5,
                courses: ['Engineering', 'Technology'],
                fees_range: '200000-300000',
                website: 'https://nitsri.ac.in',
                featured: true
            }
        ];
        
        // Apply filters
        let filteredColleges = mockColleges;
        
        if (location) {
            filteredColleges = filteredColleges.filter(college => 
                college.location.toLowerCase().includes(location.toLowerCase())
            );
        }
        
        if (type) {
            filteredColleges = filteredColleges.filter(college => 
                college.type.toLowerCase() === type.toLowerCase()
            );
        }
        
        if (search) {
            filteredColleges = filteredColleges.filter(college => 
                college.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        // Apply limit
        filteredColleges = filteredColleges.slice(0, parseInt(limit));
        
        sendSuccess(res, {
            colleges: filteredColleges,
            total: filteredColleges.length,
            mode: 'mock_data'
        }, 'Mock colleges data retrieved successfully');
        
    } catch (error) {
        handleError(res, error, 'Get colleges');
    }
});

// Testimonials endpoint
router.get('/testimonials', async (req, res) => {
    try {
        const mockTestimonials = [
            {
                id: 1,
                name: 'Priya Sharma',
                role: 'Software Engineer',
                company: 'Tech Solutions Jammu',
                content: 'J&K Career Navigator helped me transition from commerce to technology. The career guidance was exceptional!',
                rating: 5,
                image: '/images/testimonials/priya.jpg',
                featured: true,
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Arjun Singh',
                role: 'Tourism Entrepreneur',
                company: 'Kashmir Adventures',
                content: 'Started my tourism business with the guidance from this platform. Highly recommended for local entrepreneurs.',
                rating: 5,
                image: '/images/testimonials/arjun.jpg',
                featured: true,
                created_at: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Fatima Khan',
                role: 'Digital Marketing Manager',
                company: 'Srinagar Digital Hub',
                content: 'The career assessment and skill development resources are top-notch. Found my dream job through their platform.',
                rating: 4,
                image: '/images/testimonials/fatima.jpg',
                featured: false,
                created_at: new Date().toISOString()
            }
        ];
        
        sendSuccess(res, {
            testimonials: mockTestimonials,
            total: mockTestimonials.length,
            mode: 'mock_data'
        }, 'Mock testimonials retrieved successfully');
        
    } catch (error) {
        handleError(res, error, 'Get testimonials');
    }
});

// Dashboard stats endpoint
router.get('/dashboard/stats', async (req, res) => {
    try {
        const mockStats = {
            total_careers: 150,
            total_colleges: 45,
            total_users: 2500,
            total_testimonials: 89,
            featured_careers: 25,
            featured_colleges: 12,
            recent_registrations: 15,
            popular_categories: [
                { name: 'Technology', count: 45 },
                { name: 'Healthcare', count: 32 },
                { name: 'Tourism', count: 28 },
                { name: 'Education', count: 25 },
                { name: 'Agriculture', count: 20 }
            ]
        };
        
        sendSuccess(res, mockStats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get dashboard stats');
    }
});

export default router;
