const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/freelancers
// @desc    Get all freelancers (with search & filter)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, skill, location } = req.query;
        let query = { role: 'freelancer' };

        // Search by name, title, or skills
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } },
                { skills: { $elemMatch: { $regex: search, $options: 'i' } } }
            ];
        }

        // Filter by specific skill
        if (skill) {
            query.skills = { $elemMatch: { $regex: skill, $options: 'i' } };
        }

        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const freelancers = await User.find(query)
            .select('-password')
            .sort({ rating: -1, jobsDone: -1 });

        res.json({ success: true, count: freelancers.length, data: freelancers });
    } catch (err) {
        console.error('Get freelancers error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/freelancers/:id
// @desc    Get single freelancer profile
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const freelancer = await User.findById(req.params.id).select('-password');

        if (!freelancer || freelancer.role !== 'freelancer') {
            return res.status(404).json({ success: false, message: 'Freelancer not found' });
        }

        res.json({ success: true, data: freelancer });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Freelancer not found' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
