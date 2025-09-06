// Mock Authentication Routes for Development Mode
// Provides JWT authentication without database dependency

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// In-memory user storage for mock mode
let mockUsers = [];
let mockUserIdCounter = 1;

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
// MOCK AUTHENTICATION ROUTES
// =============================================================================

// Register new user (mock mode)
router.post('/register', validateRegister, async (req, res) => {
    try {
        console.log('🔧 Mock register endpoint called');
        
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
        const existingUser = mockUsers.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = {
            id: mockUserIdCounter++,
            email,
            password_hash: passwordHash,
            first_name: firstName,
            last_name: lastName,
            role,
            email_verified: false,
            created_at: new Date().toISOString(),
            profile: {
                avatar_url: null,
                bio: null,
                location: null,
                phone: null,
                education_level: null,
                interests: [],
                career_goals: null,
                linkedin_url: null,
                github_url: null
            }
        };

        mockUsers.push(newUser);

        // Generate JWT token
        const token = generateToken(newUser.id, newUser.email, newUser.role);

        sendSuccess(res, {
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.first_name,
                lastName: newUser.last_name,
                role: newUser.role,
                createdAt: newUser.created_at
            },
            token
        }, 'User registered successfully (Mock Mode)');

    } catch (error) {
        handleError(res, error, 'Mock user registration');
    }
});

// Login user (mock mode)
router.post('/login', validateLogin, async (req, res) => {
    try {
        console.log('🔧 Mock login endpoint called');
        
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
        const user = mockUsers.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

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
        }, 'Login successful (Mock Mode)');

    } catch (error) {
        handleError(res, error, 'Mock user login');
    }
});

// Get current user info (mock mode)
router.get('/me', async (req, res) => {
    try {
        console.log('🔧 Mock /me endpoint called');
        
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
            
            // Find user in mock storage
            const user = mockUsers.find(user => user.id === decoded.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }
            
            sendSuccess(res, {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                emailVerified: user.email_verified,
                profile: user.profile
            }, 'User info retrieved successfully (Mock Mode)');

        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

    } catch (error) {
        handleError(res, error, 'Mock get user info');
    }
});

// Update user profile (mock mode)
router.put('/profile', async (req, res) => {
    try {
        console.log('🔧 Mock profile update endpoint called');
        
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

            // Find and update user in mock storage
            const userIndex = mockUsers.findIndex(user => user.id === decoded.userId);
            if (userIndex === -1) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Update user data
            if (firstName) mockUsers[userIndex].first_name = firstName;
            if (lastName) mockUsers[userIndex].last_name = lastName;
            
            // Update profile
            const profile = mockUsers[userIndex].profile;
            if (bio !== undefined) profile.bio = bio;
            if (location !== undefined) profile.location = location;
            if (phone !== undefined) profile.phone = phone;
            if (educationLevel !== undefined) profile.education_level = educationLevel;
            if (interests !== undefined) profile.interests = interests;
            if (careerGoals !== undefined) profile.career_goals = careerGoals;
            if (linkedinUrl !== undefined) profile.linkedin_url = linkedinUrl;
            if (githubUrl !== undefined) profile.github_url = githubUrl;

            sendSuccess(res, {}, 'Profile updated successfully (Mock Mode)');

        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

    } catch (error) {
        handleError(res, error, 'Mock update profile');
    }
});

// Logout (mock mode)
router.post('/logout', async (req, res) => {
    try {
        console.log('🔧 Mock logout endpoint called');
        sendSuccess(res, {}, 'Logged out successfully (Mock Mode)');
    } catch (error) {
        handleError(res, error, 'Mock logout');
    }
});

// =============================================================================
// JWT MIDDLEWARE FOR PROTECTING ROUTES (MOCK MODE)
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
            
            // Find user in mock storage
            const user = mockUsers.find(user => user.id === decoded.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }

            req.user = {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            };
            next();

        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

    } catch (error) {
        console.error('Mock authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};

// Middleware to check if user is admin (mock mode)
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
