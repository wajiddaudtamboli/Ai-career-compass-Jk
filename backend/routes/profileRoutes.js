// User Profile Management Routes
// Dynamic profile system with database integration

import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/connection-pg.js';

const router = express.Router();

// Middleware to authenticate user (assumes JWT middleware is already applied)
const authenticateUser = (req, res, next) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }
    next();
};

// Helper function for error handling
const handleError = (res, error, operation) => {
    console.error(`Error in ${operation}:`, error);
    res.status(500).json({
        success: false,
        error: `${operation} failed: ${error.message}`
    });
};

// =============================================================================
// PROFILE ROUTES
// =============================================================================

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get user basic info
        const userResult = await query(
            'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const user = userResult.rows[0];

        // Get detailed profile
        const profileResult = await query(
            'SELECT * FROM user_profiles WHERE user_id = $1',
            [userId]
        );

        let profile = null;
        if (profileResult.rows.length > 0) {
            profile = profileResult.rows[0];
        }

        // Get user preferences
        const preferencesResult = await query(
            'SELECT * FROM user_preferences WHERE user_id = $1',
            [userId]
        );

        let preferences = null;
        if (preferencesResult.rows.length > 0) {
            preferences = preferencesResult.rows[0];
        }

        // Get recent activities
        const activitiesResult = await query(
            'SELECT * FROM user_activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
            [userId]
        );

        // Get bookmarks
        const bookmarksResult = await query(
            'SELECT * FROM user_bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        // Get quiz attempts
        const quizResult = await query(
            'SELECT * FROM quiz_attempts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [userId]
        );

        res.json({
            success: true,
            data: {
                user,
                profile,
                preferences,
                activities: activitiesResult.rows,
                bookmarks: bookmarksResult.rows,
                latestQuiz: quizResult.rows[0] || null
            }
        });

    } catch (error) {
        handleError(res, error, 'Get profile');
    }
});

// Create or update user profile
router.put('/profile', [
    authenticateUser,
    body('full_name').optional().trim().isLength({ min: 1 }),
    body('phone').optional().matches(/^[\d\s\-\+\(\)]+$/),
    body('current_class').optional().trim(),
    body('stream').optional().trim(),
    body('school').optional().trim(),
    body('district').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const userId = req.user.userId;
        const {
            full_name,
            phone,
            date_of_birth,
            current_class,
            stream,
            school,
            district,
            interests,
            career_goals,
            preferred_locations,
            skills,
            achievements,
            extracurricular_activities,
            father_name,
            mother_name,
            father_occupation,
            mother_occupation,
            family_income_range,
            languages_known,
            special_needs
        } = req.body;

        // Check if profile exists
        const existingProfile = await query(
            'SELECT id FROM user_profiles WHERE user_id = $1',
            [userId]
        );

        let result;
        if (existingProfile.rows.length > 0) {
            // Update existing profile
            result = await query(`
                UPDATE user_profiles SET
                    full_name = COALESCE($2, full_name),
                    phone = COALESCE($3, phone),
                    date_of_birth = COALESCE($4, date_of_birth),
                    current_class = COALESCE($5, current_class),
                    stream = COALESCE($6, stream),
                    school = COALESCE($7, school),
                    district = COALESCE($8, district),
                    interests = COALESCE($9, interests),
                    career_goals = COALESCE($10, career_goals),
                    preferred_locations = COALESCE($11, preferred_locations),
                    skills = COALESCE($12, skills),
                    achievements = COALESCE($13, achievements),
                    extracurricular_activities = COALESCE($14, extracurricular_activities),
                    father_name = COALESCE($15, father_name),
                    mother_name = COALESCE($16, mother_name),
                    father_occupation = COALESCE($17, father_occupation),
                    mother_occupation = COALESCE($18, mother_occupation),
                    family_income_range = COALESCE($19, family_income_range),
                    languages_known = COALESCE($20, languages_known),
                    special_needs = COALESCE($21, special_needs),
                    last_profile_update = NOW()
                WHERE user_id = $1
                RETURNING *
            `, [
                userId, full_name, phone, date_of_birth, current_class, stream,
                school, district, interests ? JSON.stringify(interests) : null,
                career_goals, preferred_locations ? JSON.stringify(preferred_locations) : null,
                skills ? JSON.stringify(skills) : null, achievements,
                extracurricular_activities ? JSON.stringify(extracurricular_activities) : null,
                father_name, mother_name, father_occupation, mother_occupation,
                family_income_range, languages_known ? JSON.stringify(languages_known) : null,
                special_needs
            ]);
        } else {
            // Create new profile
            result = await query(`
                INSERT INTO user_profiles (
                    user_id, full_name, phone, date_of_birth, current_class, stream,
                    school, district, interests, career_goals, preferred_locations,
                    skills, achievements, extracurricular_activities, father_name,
                    mother_name, father_occupation, mother_occupation, family_income_range,
                    languages_known, special_needs
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                    $16, $17, $18, $19, $20, $21
                ) RETURNING *
            `, [
                userId, full_name, phone, date_of_birth, current_class, stream,
                school, district, interests ? JSON.stringify(interests) : '[]',
                career_goals, preferred_locations ? JSON.stringify(preferred_locations) : '[]',
                skills ? JSON.stringify(skills) : '[]', achievements,
                extracurricular_activities ? JSON.stringify(extracurricular_activities) : '[]',
                father_name, mother_name, father_occupation, mother_occupation,
                family_income_range, languages_known ? JSON.stringify(languages_known) : '["English", "Hindi"]',
                special_needs
            ]);
        }

        // Log activity
        await query(
            'INSERT INTO user_activities (user_id, activity_type, activity_data) VALUES ($1, $2, $3)',
            [userId, 'profile_update', JSON.stringify({ fields_updated: Object.keys(req.body) })]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        handleError(res, error, 'Update profile');
    }
});

// Update user preferences
router.put('/preferences', [
    authenticateUser,
    body('dashboard_theme').optional().isIn(['light', 'dark']),
    body('language_preference').optional().isIn(['en', 'hi', 'ks'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const userId = req.user.userId;
        const {
            dashboard_theme,
            language_preference,
            email_notifications,
            sms_notifications,
            push_notifications,
            show_profile_to_peers,
            show_quiz_results,
            allow_mentor_contact
        } = req.body;

        // Check if preferences exist
        const existingPrefs = await query(
            'SELECT id FROM user_preferences WHERE user_id = $1',
            [userId]
        );

        let result;
        if (existingPrefs.rows.length > 0) {
            // Update existing preferences
            result = await query(`
                UPDATE user_preferences SET
                    dashboard_theme = COALESCE($2, dashboard_theme),
                    language_preference = COALESCE($3, language_preference),
                    email_notifications = COALESCE($4, email_notifications),
                    sms_notifications = COALESCE($5, sms_notifications),
                    push_notifications = COALESCE($6, push_notifications),
                    show_profile_to_peers = COALESCE($7, show_profile_to_peers),
                    show_quiz_results = COALESCE($8, show_quiz_results),
                    allow_mentor_contact = COALESCE($9, allow_mentor_contact),
                    updated_at = NOW()
                WHERE user_id = $1
                RETURNING *
            `, [
                userId, dashboard_theme, language_preference, email_notifications,
                sms_notifications, push_notifications, show_profile_to_peers,
                show_quiz_results, allow_mentor_contact
            ]);
        } else {
            // Create new preferences
            result = await query(`
                INSERT INTO user_preferences (
                    user_id, dashboard_theme, language_preference, email_notifications,
                    sms_notifications, push_notifications, show_profile_to_peers,
                    show_quiz_results, allow_mentor_contact
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `, [
                userId, dashboard_theme || 'light', language_preference || 'en',
                email_notifications !== undefined ? email_notifications : true,
                sms_notifications !== undefined ? sms_notifications : false,
                push_notifications !== undefined ? push_notifications : true,
                show_profile_to_peers !== undefined ? show_profile_to_peers : false,
                show_quiz_results !== undefined ? show_quiz_results : false,
                allow_mentor_contact !== undefined ? allow_mentor_contact : true
            ]);
        }

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        handleError(res, error, 'Update preferences');
    }
});

// Add bookmark
router.post('/bookmarks', [
    authenticateUser,
    body('bookmark_type').isIn(['career', 'college', 'article']),
    body('bookmark_id').isUUID(),
    body('notes').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const userId = req.user.userId;
        const { bookmark_type, bookmark_id, notes } = req.body;

        // Check if bookmark already exists
        const existingBookmark = await query(
            'SELECT id FROM user_bookmarks WHERE user_id = $1 AND bookmark_type = $2 AND bookmark_id = $3',
            [userId, bookmark_type, bookmark_id]
        );

        if (existingBookmark.rows.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Item already bookmarked'
            });
        }

        const result = await query(
            'INSERT INTO user_bookmarks (user_id, bookmark_type, bookmark_id, notes) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, bookmark_type, bookmark_id, notes]
        );

        // Log activity
        await query(
            'INSERT INTO user_activities (user_id, activity_type, activity_data) VALUES ($1, $2, $3)',
            [userId, `${bookmark_type}_bookmarked`, JSON.stringify({ bookmark_id, notes })]
        );

        res.json({
            success: true,
            message: 'Bookmark added successfully',
            data: result.rows[0]
        });

    } catch (error) {
        handleError(res, error, 'Add bookmark');
    }
});

// Remove bookmark
router.delete('/bookmarks/:id', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId;
        const bookmarkId = req.params.id;

        const result = await query(
            'DELETE FROM user_bookmarks WHERE user_id = $1 AND id = $2 RETURNING *',
            [userId, bookmarkId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Bookmark not found'
            });
        }

        res.json({
            success: true,
            message: 'Bookmark removed successfully'
        });

    } catch (error) {
        handleError(res, error, 'Remove bookmark');
    }
});

// Get user activities
router.get('/activities', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const result = await query(
            'SELECT * FROM user_activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [userId, limit, offset]
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        handleError(res, error, 'Get activities');
    }
});

export default router;
