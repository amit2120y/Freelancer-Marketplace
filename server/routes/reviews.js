const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// @route   GET /api/reviews
// @desc    Get all reviews/testimonials
// @access  Public
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
        console.error('Get reviews error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/reviews
// @desc    Submit a review
// @access  Private
router.post('/', protect, [
    body('quote', 'Review text is required').notEmpty().trim(),
    body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const review = await Review.create({
            name: req.user.name,
            role: req.body.role || req.user.title || 'FreelanceHub User',
            avatar: req.user.avatar,
            quote: req.body.quote,
            rating: req.body.rating,
            user: req.user.id
        });

        res.status(201).json({ success: true, data: review });
    } catch (err) {
        console.error('Create review error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
