// Enhanced Data Routes for J&K Career Navigator
// Comprehensive API endpoints for dynamic content management

import express from 'express';

const router = express.Router();

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

// =============================================================================
// CONTENT BLOCKS - Dynamic content management for flexible pages
// =============================================================================

// Get all content blocks for a specific page route
router.get('/content-blocks/:pageRoute', async (req, res) => {
    try {
        const { pageRoute } = req.params;
        const { db } = req.app.locals;
        
        if (db) {
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
            // Mock data response when database is not available
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

// Get all content blocks (admin view)
router.get('/content-blocks', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { type, page, active } = req.query;
        
        let query = `
            SELECT cb.*, a.username as updated_by_username 
            FROM content_blocks cb 
            LEFT JOIN admins a ON cb.updated_by = a.id 
            WHERE 1=1
        `;
        const queryParams = [];
        
        if (type) {
            queryParams.push(type);
            query += ` AND cb.block_type = $${queryParams.length}`;
        }
        
        if (page) {
            queryParams.push(page);
            query += ` AND cb.page_route = $${queryParams.length}`;
        }
        
        if (active !== undefined) {
            queryParams.push(active === 'true');
            query += ` AND cb.is_active = $${queryParams.length}`;
        }
        
        query += ` ORDER BY cb.page_route, cb.display_order, cb.created_at`;
        
        const result = await db.query(query, queryParams);
        sendSuccess(res, result.rows, 'All content blocks retrieved');
    } catch (error) {
        handleError(res, error, 'Get all content blocks');
    }
});

// Create new content block
router.post('/content-blocks', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const {
            block_type, block_name, title, subtitle, content,
            metadata, display_order, page_route, is_active = true,
            updated_by
        } = req.body;
        
        const result = await db.query(`
            INSERT INTO content_blocks 
            (block_type, block_name, title, subtitle, content, metadata, 
             display_order, page_route, is_active, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [block_type, block_name, title, subtitle, content, 
            JSON.stringify(metadata), display_order, page_route, is_active, updated_by]);
        
        sendSuccess(res, result.rows[0], 'Content block created successfully');
    } catch (error) {
        handleError(res, error, 'Create content block');
    }
});

// Update content block
router.put('/content-blocks/:id', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { id } = req.params;
        const {
            block_type, block_name, title, subtitle, content,
            metadata, display_order, page_route, is_active, updated_by
        } = req.body;
        
        const result = await db.query(`
            UPDATE content_blocks 
            SET block_type = $1, block_name = $2, title = $3, subtitle = $4, 
                content = $5, metadata = $6, display_order = $7, page_route = $8, 
                is_active = $9, updated_by = $10, updated_at = CURRENT_TIMESTAMP
            WHERE id = $11
            RETURNING *
        `, [block_type, block_name, title, subtitle, content, 
            JSON.stringify(metadata), display_order, page_route, is_active, 
            updated_by, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Content block not found' });
        }
        
        sendSuccess(res, result.rows[0], 'Content block updated successfully');
    } catch (error) {
        handleError(res, error, 'Update content block');
    }
});

// Delete content block
router.delete('/content-blocks/:id', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { id } = req.params;
        
        const result = await db.query('DELETE FROM content_blocks WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Content block not found' });
        }
        
        sendSuccess(res, result.rows[0], 'Content block deleted successfully');
    } catch (error) {
        handleError(res, error, 'Delete content block');
    }
});

// =============================================================================
// CAREERS - Enhanced career data with search and filtering
// =============================================================================

// Get all careers with filtering and search
router.get('/careers', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { 
            category, subcategory, location, education_level, 
            search, featured, limit = 50, offset = 0,
            sort_by = 'demand_score', sort_order = 'DESC'
        } = req.query;
        
        if (db) {
            let query = `
                SELECT c.*, 
                       COALESCE(avg(cr.rating), 0) as avg_rating,
                       COUNT(cr.id) as review_count
                FROM careers c
                LEFT JOIN career_reviews cr ON c.id = cr.career_id
                WHERE 1=1
            `;
            const queryParams = [];
            
            // Add filters
            if (category) {
                queryParams.push(category);
                query += ` AND c.category = $${queryParams.length}`;
            }
            
            if (subcategory) {
                queryParams.push(subcategory);
                query += ` AND c.subcategory = $${queryParams.length}`;
            }
            
            if (location) {
                queryParams.push(`%${location}%`);
                query += ` AND c.location::text ILIKE $${queryParams.length}`;
            }
            
            if (education_level) {
                queryParams.push(education_level);
                query += ` AND c.education_level = $${queryParams.length}`;
            }
            
            if (featured === 'true') {
                query += ` AND c.featured = true`;
            }
            
            // Add search functionality
            if (search) {
                queryParams.push(`%${search}%`);
                query += ` AND (
                    c.title ILIKE $${queryParams.length} OR 
                    c.description ILIKE $${queryParams.length} OR 
                    c.skills_required::text ILIKE $${queryParams.length}
                )`;
            }
            
            query += ` GROUP BY c.id`;
            
            // Add sorting
            const allowedSortFields = ['title', 'avg_salary', 'demand_score', 'created_at', 'avg_rating'];
            const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'demand_score';
            const sortDirection = ['ASC', 'DESC'].includes(sort_order) ? sort_order : 'DESC';
            query += ` ORDER BY ${sortField} ${sortDirection}`;
            
            // Add pagination
            queryParams.push(parseInt(limit), parseInt(offset));
            query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;
            
            const result = await db.query(query, queryParams);
            const countResult = await db.query('SELECT COUNT(*) FROM careers WHERE 1=1');
            
            sendSuccess(res, {
                careers: result.rows,
                pagination: {
                    total: parseInt(countResult.rows[0].count),
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    has_more: (parseInt(offset) + parseInt(limit)) < parseInt(countResult.rows[0].count)
                }
            }, 'Careers retrieved successfully');
        } else {
            // Mock data when database is not available
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
                    description: 'Analyze complex datasets to derive business insights and recommendations',
                    category: 'Technology',
                    subcategory: 'Data Science',
                    avg_salary: 600000,
                    demand_score: 90,
                    education_level: 'Bachelor',
                    skills_required: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics'],
                    location: ['Jammu', 'Srinagar', 'Remote'],
                    featured: true,
                    avg_rating: 4.3,
                    review_count: 6,
                    created_at: new Date().toISOString()
                }
            ];
            
            // Apply filters to mock data
            let filteredCareers = mockCareers;
            
            if (category) {
                filteredCareers = filteredCareers.filter(career => 
                    career.category.toLowerCase() === category.toLowerCase()
                );
            }
            
            if (search) {
                filteredCareers = filteredCareers.filter(career => 
                    career.title.toLowerCase().includes(search.toLowerCase()) ||
                    career.description.toLowerCase().includes(search.toLowerCase()) ||
                    career.skills_required.some(skill => 
                        skill.toLowerCase().includes(search.toLowerCase())
                    )
                );
            }
            
            if (featured === 'true') {
                filteredCareers = filteredCareers.filter(career => career.featured);
            }
            
            sendSuccess(res, {
                careers: filteredCareers,
                pagination: {
                    total: filteredCareers.length,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    has_more: false
                },
                mode: 'mock'
            }, 'Mock careers data (Database not connected)');
        }
    } catch (error) {
        handleError(res, error, 'Get careers');
    }
});
        
        if (search) {
            queryParams.push(`%${search}%`);
            query += ` AND (
                c.title ILIKE $${queryParams.length} OR 
                c.description ILIKE $${queryParams.length} OR 
                c.tags::text ILIKE $${queryParams.length}
            )`;
        }
        
        query += ` GROUP BY c.id`;
        
        // Add sorting
        const validSortFields = ['title', 'demand_score', 'salary_range_min', 'salary_range_max', 'created_at'];
        const sortField = validSortFields.includes(sort_by) ? sort_by : 'demand_score';
        const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        query += ` ORDER BY c.${sortField} ${sortDirection}`;
        
        // Add pagination
        queryParams.push(parseInt(limit), parseInt(offset));
        query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;
        
        const result = await db.query(query, queryParams);
        
        // Get total count for pagination
        const countResult = await db.query('SELECT COUNT(*) FROM careers WHERE 1=1');
        const totalCount = parseInt(countResult.rows[0].count);
        
        sendSuccess(res, {
            careers: result.rows,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
            }
        }, 'Careers retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get careers');
    }
});

// Get single career by slug
router.get('/careers/:slug', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { slug } = req.params;
        
        const result = await db.query(`
            SELECT c.*, 
                   COALESCE(avg(cr.rating), 0) as avg_rating,
                   COUNT(cr.id) as review_count
            FROM careers c
            LEFT JOIN career_reviews cr ON c.id = cr.career_id
            WHERE c.slug = $1
            GROUP BY c.id
        `, [slug]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Career not found' });
        }
        
        // Get related careers
        const relatedResult = await db.query(`
            SELECT id, title, slug, description, category, demand_score, featured
            FROM careers 
            WHERE category = $1 AND slug != $2 
            ORDER BY demand_score DESC 
            LIMIT 5
        `, [result.rows[0].category, slug]);
        
        sendSuccess(res, {
            career: result.rows[0],
            related_careers: relatedResult.rows
        }, 'Career details retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get career details');
    }
});

// Get career categories and statistics
router.get('/careers/stats/categories', async (req, res) => {
    try {
        const { db } = req.app.locals;
        
        const result = await db.query(`
            SELECT 
                category,
                COUNT(*) as career_count,
                AVG(demand_score) as avg_demand_score,
                MIN(salary_range_min) as min_salary,
                MAX(salary_range_max) as max_salary
            FROM careers 
            GROUP BY category 
            ORDER BY career_count DESC
        `);
        
        sendSuccess(res, result.rows, 'Career categories retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get career categories');
    }
});

// =============================================================================
// COLLEGES - Enhanced college data with search and filtering
// =============================================================================

// Get all colleges with filtering
router.get('/colleges', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { 
            location, college_type, course, search, featured,
            limit = 20, offset = 0, sort_by = 'ranking'
        } = req.query;
        
        let query = `
            SELECT c.*, 
                   COALESCE(avg(cr.rating), 0) as avg_rating,
                   COUNT(cr.id) as review_count
            FROM colleges c
            LEFT JOIN college_reviews cr ON c.id = cr.college_id
            WHERE 1=1
        `;
        const queryParams = [];
        
        if (location) {
            queryParams.push(`%${location}%`);
            query += ` AND c.location ILIKE $${queryParams.length}`;
        }
        
        if (college_type) {
            queryParams.push(college_type);
            query += ` AND c.college_type = $${queryParams.length}`;
        }
        
        if (course) {
            queryParams.push(`%${course}%`);
            query += ` AND c.courses::text ILIKE $${queryParams.length}`;
        }
        
        if (featured === 'true') {
            query += ` AND c.featured = true`;
        }
        
        if (search) {
            queryParams.push(`%${search}%`);
            query += ` AND (c.name ILIKE $${queryParams.length} OR c.location ILIKE $${queryParams.length})`;
        }
        
        query += ` GROUP BY c.id ORDER BY c.${sort_by === 'ranking' ? 'ranking ASC' : 'name ASC'}`;
        
        queryParams.push(parseInt(limit), parseInt(offset));
        query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;
        
        const result = await db.query(query, queryParams);
        sendSuccess(res, result.rows, 'Colleges retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get colleges');
    }
});

// Get single college by slug
router.get('/colleges/:slug', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { slug } = req.params;
        
        const result = await db.query(`
            SELECT c.*, 
                   COALESCE(avg(cr.rating), 0) as avg_rating,
                   COUNT(cr.id) as review_count
            FROM colleges c
            LEFT JOIN college_reviews cr ON c.id = cr.college_id
            WHERE c.slug = $1
            GROUP BY c.id
        `, [slug]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'College not found' });
        }
        
        sendSuccess(res, result.rows[0], 'College details retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get college details');
    }
});

// =============================================================================
// QUIZ SYSTEM - Enhanced quiz management
// =============================================================================

// Get quiz questions
router.get('/quiz/questions', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { category, difficulty, limit = 10 } = req.query;
        
        let query = `
            SELECT id, question, question_type, options, category, 
                   subcategory, difficulty_level, explanation
            FROM quiz_questions 
            WHERE 1=1
        `;
        const queryParams = [];
        
        if (category) {
            queryParams.push(category);
            query += ` AND category = $${queryParams.length}`;
        }
        
        if (difficulty) {
            queryParams.push(difficulty);
            query += ` AND difficulty_level = $${queryParams.length}`;
        }
        
        query += ` ORDER BY order_index, RANDOM()`;
        
        if (limit) {
            queryParams.push(parseInt(limit));
            query += ` LIMIT $${queryParams.length}`;
        }
        
        const result = await db.query(query, queryParams);
        sendSuccess(res, result.rows, 'Quiz questions retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get quiz questions');
    }
});

// Submit quiz responses and get recommendations
router.post('/quiz/submit', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { user_id, responses, session_data } = req.body;
        
        // Save quiz response
        const quizResult = await db.query(`
            INSERT INTO quiz_responses 
            (user_id, responses, score, session_data)
            VALUES ($1, $2, $3, $4)
            RETURNING id, score
        `, [user_id || null, JSON.stringify(responses), 0, JSON.stringify(session_data)]);
        
        // Simple recommendation logic (can be enhanced with AI)
        const recommendations = await db.query(`
            SELECT id, title, slug, description, category, demand_score, featured
            FROM careers 
            WHERE featured = true 
            ORDER BY demand_score DESC 
            LIMIT 5
        `);
        
        sendSuccess(res, {
            quiz_id: quizResult.rows[0].id,
            score: quizResult.rows[0].score,
            recommendations: recommendations.rows
        }, 'Quiz submitted successfully');
    } catch (error) {
        handleError(res, error, 'Submit quiz');
    }
});

// =============================================================================
// TESTIMONIALS - Dynamic testimonials management
// =============================================================================

// Get testimonials with filtering
router.get('/testimonials', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { category, featured, verified, limit = 10 } = req.query;
        
        let query = `
            SELECT id, name, role, company, college, testimonial, 
                   rating, category, location, verification_status, featured
            FROM testimonials 
            WHERE 1=1
        `;
        const queryParams = [];
        
        if (category) {
            queryParams.push(category);
            query += ` AND category = $${queryParams.length}`;
        }
        
        if (featured === 'true') {
            query += ` AND featured = true`;
        }
        
        if (verified === 'true') {
            query += ` AND verification_status = 'verified'`;
        }
        
        query += ` ORDER BY featured DESC, rating DESC, created_at DESC`;
        
        if (limit) {
            queryParams.push(parseInt(limit));
            query += ` LIMIT $${queryParams.length}`;
        }
        
        const result = await db.query(query, queryParams);
        sendSuccess(res, result.rows, 'Testimonials retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get testimonials');
    }
});

// =============================================================================
// ARTICLES/BLOG - Dynamic content articles
// =============================================================================

// Get articles with filtering
router.get('/articles', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { category, featured, status = 'published', limit = 10, offset = 0 } = req.query;
        
        let query = `
            SELECT a.*, ad.username as author_name
            FROM articles a
            LEFT JOIN admins ad ON a.author_id = ad.id
            WHERE a.status = $1
        `;
        const queryParams = [status];
        
        if (category) {
            queryParams.push(category);
            query += ` AND a.category = $${queryParams.length}`;
        }
        
        if (featured === 'true') {
            query += ` AND a.featured = true`;
        }
        
        query += ` ORDER BY a.featured DESC, a.created_at DESC`;
        
        queryParams.push(parseInt(limit), parseInt(offset));
        query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;
        
        const result = await db.query(query, queryParams);
        sendSuccess(res, result.rows, 'Articles retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get articles');
    }
});

// Get single article by slug
router.get('/articles/:slug', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { slug } = req.params;
        
        const result = await db.query(`
            SELECT a.*, ad.username as author_name
            FROM articles a
            LEFT JOIN admins ad ON a.author_id = ad.id
            WHERE a.slug = $1 AND a.status = 'published'
        `, [slug]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Article not found' });
        }
        
        // Update view count
        await db.query('UPDATE articles SET views = views + 1 WHERE id = $1', [result.rows[0].id]);
        
        sendSuccess(res, result.rows[0], 'Article retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get article');
    }
});

// =============================================================================
// ANALYTICS - Track user interactions
// =============================================================================

// Log analytics event
router.post('/analytics', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const {
            event_type, event_category, event_action, event_data,
            page_url, user_id, device_type, browser
        } = req.body;
        
        await db.query(`
            INSERT INTO analytics 
            (event_type, event_category, event_action, event_data, 
             page_url, user_id, device_type, browser)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [event_type, event_category, event_action, JSON.stringify(event_data),
            page_url, user_id, device_type, browser]);
        
        sendSuccess(res, null, 'Analytics event logged successfully');
    } catch (error) {
        handleError(res, error, 'Log analytics');
    }
});

// Get analytics summary (admin only)
router.get('/analytics/summary', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { date_from, date_to } = req.query;
        
        let dateFilter = '';
        const queryParams = [];
        
        if (date_from && date_to) {
            queryParams.push(date_from, date_to);
            dateFilter = ` WHERE created_at BETWEEN $1 AND $2`;
        }
        
        const result = await db.query(`
            SELECT 
                event_type,
                event_category,
                COUNT(*) as event_count,
                COUNT(DISTINCT user_id) as unique_users
            FROM analytics ${dateFilter}
            GROUP BY event_type, event_category
            ORDER BY event_count DESC
        `, queryParams);
        
        sendSuccess(res, result.rows, 'Analytics summary retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get analytics summary');
    }
});

// =============================================================================
// DASHBOARD ROUTES
// =============================================================================

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
    try {
        const { db } = req.app.locals;
        
        const careerCount = await db.query('SELECT COUNT(*) as count FROM careers');
        const collegeCount = await db.query('SELECT COUNT(*) as count FROM colleges');
        const testimonialCount = await db.query('SELECT COUNT(*) as count FROM testimonials');
        const quizResponseCount = await db.query('SELECT COUNT(*) as count FROM quiz_responses');
        const articleCount = await db.query('SELECT COUNT(*) as count FROM articles WHERE status = \'published\'');
        const contentBlockCount = await db.query('SELECT COUNT(*) as count FROM content_blocks WHERE is_active = true');
        
        sendSuccess(res, {
            careers: parseInt(careerCount.rows[0].count),
            colleges: parseInt(collegeCount.rows[0].count),
            testimonials: parseInt(testimonialCount.rows[0].count),
            quiz_responses: parseInt(quizResponseCount.rows[0].count),
            articles: parseInt(articleCount.rows[0].count),
            content_blocks: parseInt(contentBlockCount.rows[0].count)
        }, 'Dashboard statistics retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get dashboard statistics');
    }
});

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const healthResult = await db.query('SELECT NOW() as timestamp');
        
        res.json({
            status: 'success',
            database: 'connected',
            timestamp: healthResult.rows[0].timestamp,
            service: 'J&K Career Navigator Enhanced API'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Health check failed',
            error: error.message
        });
    }
});

export default router;
