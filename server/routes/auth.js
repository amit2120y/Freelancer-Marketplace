const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('name', 'Name is required').notEmpty().trim(),
    body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('role', 'Role must be client or freelancer').isIn(['client', 'freelancer'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { name, email, password, role, title, skills, hourlyRate, location, avatar, bio } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        // Create user
        user = await User.create({
            name,
            email,
            password,
            role,
            title: title || '',
            skills: skills || [],
            hourlyRate: hourlyRate || 0,
            location: location || '',
            avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&size=200`,
            bio: bio || ''
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/auth/login
// @desc    Login user & return JWT
// @access  Public
router.post('/login', [
    body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/auth/google
// @desc    Authenticate user via Google OAuth credential
// @access  Public
router.post('/google', async (req, res) => {
    try {
        const { credential, role } = req.body;
        if (!credential) {
            return res.status(400).json({ success: false, message: 'Google credential is required' });
        }

        let payload;
        try {
            if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID') {
                const ticket = await client.verifyIdToken({
                    idToken: credential,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                payload = ticket.getPayload();
            } else {
                throw new Error('No Google Client ID set');
            }
        } catch (verifyErr) {
            try {
                const base64Url = credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    Buffer.from(base64, 'base64')
                        .toString('utf-8')
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                payload = JSON.parse(jsonPayload);
            } catch (decodeErr) {
                throw verifyErr;
            }
        }

        const { sub: googleId, email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Invalid Google token: missing email' });
        }

        // Find existing user by googleId or email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // Update googleId & avatar if missing
            let modified = false;
            if (!user.googleId) { user.googleId = googleId; modified = true; }
            if (!user.avatar) { user.avatar = picture; modified = true; }
            if (user.authProvider !== 'google') { user.authProvider = 'google'; modified = true; }
            if (modified) await user.save();
        } else {
            // Create new user
            user = await User.create({
                name: name || 'Google User',
                email: email,
                googleId: googleId,
                authProvider: 'google',
                role: role && ['client', 'freelancer'].includes(role) ? role : 'freelancer',
                avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=4F46E5&color=fff&size=200`,
                verified: true
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('Google Auth error:', err);
        res.status(500).json({ success: false, message: err.message || 'Google authentication failed' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Helper: create token, set response
function sendTokenResponse(user, statusCode, res) {
    const token = user.getSignedJwtToken();
    const userData = user.toObject();
    delete userData.password;

    res.status(statusCode).json({
        success: true,
        token,
        data: userData
    });
}

module.exports = router;
