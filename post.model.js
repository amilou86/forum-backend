const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true
    },
    discussionId: { // Optional field for associating posts with specific discussions
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion' // (Optional) Reference the Discussion model if applicable
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // You can add additional fields like upvotes, downvotes, etc. (optional)
});

module.exports = mongoose.model('Post', postSchema);
