const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    role: {
        type: String,
        required: [true, 'Please provide a role']
    },
    avatar: {
        type: String,
        default: ''
    },
    quote: {
        type: String,
        required: [true, 'Please provide a review quote'],
        maxlength: [500, 'Review cannot exceed 500 characters']
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 5
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
