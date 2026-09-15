const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs (with search & filter)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, category, type, status } = req.query;
        let query = {};

        // Search by title or skills
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { skills: { $elemMatch: { $regex: search, $options: 'i' } } },
                { company: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        // Filter by type
        if (type) {
            query.type = type;
        }

        // Filter by status (default to open)
        if (status) {
            query.status = status;
        } else {
            query.status = 'open';
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'name avatar')
            .sort({ featured: -1, createdAt: -1 });

        res.json({ success: true, count: jobs.length, data: jobs });
    } catch (err) {
        console.error('Get jobs error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name avatar email');

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.json({ success: true, data: job });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (client only)
router.post('/', protect, authorize('client'), [
    body('title', 'Job title is required').notEmpty().trim(),
    body('company', 'Company name is required').notEmpty().trim(),
    body('budget', 'Budget is required').notEmpty(),
    body('category', 'Category is required').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const jobData = {
            ...req.body,
            postedBy: req.user.id
        };

        const job = await Job.create(jobData);
        const populatedJob = await Job.findById(job._id).populate('postedBy', 'name avatar');

        res.status(201).json({ success: true, data: populatedJob });
    } catch (err) {
        console.error('Create job error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (job owner)
router.put('/:id', protect, async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Verify ownership
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('postedBy', 'name avatar');

        res.json({ success: true, data: job });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (job owner)
router.delete('/:id', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Verify ownership
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();

        res.json({ success: true, message: 'Job removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
