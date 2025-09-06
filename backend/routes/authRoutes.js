// JWT Authentication Routes for J&K Career Navigator
// Replaces Clerk with custom JWT + bcrypt authentication

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { query } from '../db/connection-pg.js';

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

// Generate JWT token
const generateToken = (userId, email, role) => {
    return jwt.sign(
        { 
            userId, 
            email, 
            role,
            iat: Math.floor(Date.now() / 1000)
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Validation middleware
const validateRegister = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required')
];

const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
];

// =============================================================================
// AUTHENTICATION ROUTES
// =============================================================================

// Register new user
router.post('/register', validateRegister, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password, firstName, lastName, role = 'user' } = req.body;

        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const userResult = await query(
            `INSERT INTO users (email, password_hash, first_name, last_name, role) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, email, first_name, last_name, role, created_at`,
            [email, passwordHash, firstName, lastName, role]
        );

        const user = userResult.rows[0];

        // Create user profile
        await query(
            `INSERT INTO user_profiles (user_id) VALUES ($1)`,
            [user.id]
        );

        // Generate JWT token
        const token = generateToken(user.id, user.email, user.role);

        sendSuccess(res, {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                createdAt: user.created_at
            },
            token
        }, 'User registered successfully');

    } catch (error) {
        handleError(res, error, 'User registration');
    }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user
        const userResult = await query(
            'SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        const user = userResult.rows[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(user.id, user.email, user.role);

        sendSuccess(res, {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            },
            token
        }, 'Login successful');

    } catch (error) {
        handleError(res, error, 'User login');
    }
});

// Get current user info
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user details with profile
            const userResult = await query(
                `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.email_verified,
                        p.avatar_url, p.bio, p.location, p.phone, p.education_level, 
                        p.interests, p.career_goals, p.linkedin_url, p.github_url
                 FROM users u 
                 LEFT JOIN user_profiles p ON u.id = p.user_id 
                 WHERE u.id = $1`,
                [decoded.userId]
            );

            if (userResult.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const user = userResult.rows[0];
            
            sendSuccess(res, {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                emailVerified: user.email_verified,
                profile: {
                    avatarUrl: user.avatar_url,
                    bio: user.bio,
                    location: user.location,
                    phone: user.phone,
                    educationLevel: user.education_level,
                    interests: user.interests,
                    careerGoals: user.career_goals,
                    linkedinUrl: user.linkedin_url,
                    githubUrl: user.github_url
                }
            }, 'User info retrieved successfully');

        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

    } catch (error) {
        handleError(res, error, 'Get user info');
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const { 
                firstName, lastName, bio, location, phone, 
                educationLevel, interests, careerGoals, 
                linkedinUrl, githubUrl 
            } = req.body;

            // Update user basic info
            if (firstName || lastName) {
                await query(
                    `UPDATE users 
                     SET first_name = COALESCE($1, first_name), 
                         last_name = COALESCE($2, last_name),
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = $3`,
                    [firstName, lastName, decoded.userId]
                );
            }

            // Update user profile
            await query(
                `UPDATE user_profiles 
                 SET bio = COALESCE($1, bio),
                     location = COALESCE($2, location),
                     phone = COALESCE($3, phone),
                     education_level = COALESCE($4, education_level),
                     interests = COALESCE($5, interests),
                     career_goals = COALESCE($6, career_goals),
                     linkedin_url = COALESCE($7, linkedin_url),
                     github_url = COALESCE($8, github_url),
                     updated_at = CURRENT_TIMESTAMP
                 WHERE user_id = $9`,
                [bio, location, phone, educationLevel, interests, careerGoals, linkedinUrl, githubUrl, decoded.userId]
            );

            sendSuccess(res, {}, 'Profile updated successfully');

        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

    } catch (error) {
        handleError(res, error, 'Update profile');
    }
});

// Logout (client-side token removal, but we can track this)
router.post('/logout', async (req, res) => {
    try {
        // In a production app, you might want to blacklist the token
        // For now, we'll just send a success response
        sendSuccess(res, {}, 'Logged out successfully');
    } catch (error) {
        handleError(res, error, 'Logout');
    }
});

// =============================================================================
// JWT MIDDLEWARE FOR PROTECTING ROUTES
// =============================================================================

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user info and attach to request
            const userResult = await query(
                'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
                [decoded.userId]
            );

            if (userResult.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }

            req.user = userResult.rows[0];
            next();

        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
    }
};

export default router;
