const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/proposals
// @desc    Submit a proposal for a job
// @access  Private (freelancer only)
router.post('/', protect, authorize('freelancer'), [
    body('job', 'Job ID is required').notEmpty(),
    body('coverLetter', 'Cover letter is required').notEmpty().trim(),
    body('bidAmount', 'Bid amount is required').isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { job: jobId, coverLetter, bidAmount } = req.body;

        // Verify job exists and is open
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        if (job.status !== 'open') {
            return res.status(400).json({ success: false, message: 'This job is no longer accepting proposals' });
        }

        // Check for duplicate proposal
        const existing = await Proposal.findOne({ job: jobId, freelancer: req.user.id });
        if (existing) {
            return res.status(400).json({ success: false, message: 'You have already submitted a proposal for this job' });
        }

        const proposal = await Proposal.create({
            job: jobId,
            freelancer: req.user.id,
            coverLetter,
            bidAmount
        });

        // Increment job proposal count
        await Job.findByIdAndUpdate(jobId, { $inc: { proposals: 1 } });

        const populated = await Proposal.findById(proposal._id)
            .populate('freelancer', 'name avatar title rating skills hourlyRate')
            .populate('job', 'title company budget');

        res.status(201).json({ success: true, data: populated });
    } catch (err) {
        console.error('Create proposal error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/proposals/job/:jobId
// @desc    Get all proposals for a specific job
// @access  Private (job owner)
router.get('/job/:jobId', protect, async (req, res) => {
    try {
        // Verify the user owns this job
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to view proposals for this job' });
        }

        const proposals = await Proposal.find({ job: req.params.jobId })
            .populate('freelancer', 'name avatar title rating skills hourlyRate location jobsDone badge verified')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: proposals.length, data: proposals });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/proposals/my
// @desc    Get freelancer's own proposals
// @access  Private (freelancer)
router.get('/my', protect, authorize('freelancer'), async (req, res) => {
    try {
        const proposals = await Proposal.find({ freelancer: req.user.id })
            .populate('job', 'title company budget status category')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: proposals.length, data: proposals });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/proposals/:id/status
// @desc    Accept or reject a proposal
// @access  Private (job owner)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be accepted or rejected' });
        }

        const proposal = await Proposal.findById(req.params.id).populate('job');
        if (!proposal) {
            return res.status(404).json({ success: false, message: 'Proposal not found' });
        }

        // Verify job ownership
        if (proposal.job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        proposal.status = status;
        await proposal.save();

        // If accepted, set job to in-progress
        if (status === 'accepted') {
            await Job.findByIdAndUpdate(proposal.job._id, { status: 'in-progress' });
        }

        res.json({ success: true, data: proposal });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
