const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a job title'],
        trim: true,
        maxlength: [120, 'Title cannot exceed 120 characters']
    },
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        trim: true
    },
    logo: {
        type: String,
        default: ''
    },
    budget: {
        type: String,
        required: [true, 'Please provide a budget range']
    },
    type: {
        type: String,
        enum: ['Contract', 'Fixed Price', 'Milestone', 'Monthly Retainer'],
        default: 'Contract'
    },
    location: {
        type: String,
        default: 'Remote'
    },
    category: {
        type: String,
        required: [true, 'Please provide a category']
    },
    skills: [{
        type: String,
        trim: true
    }],
    description: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proposals: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'closed'],
        default: 'open'
    }
}, {
    timestamps: true
});

// Virtual for time-ago display
jobSchema.virtual('posted').get(function () {
    const now = new Date();
    const diff = now - this.createdAt;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
});

jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
