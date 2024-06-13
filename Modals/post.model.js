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
    discussionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion', // Optional reference to a discussion model (if applicable)
    },
    parentId: { // New field for parent post reference
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' // Reference the Post model itself (for nested replies)
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);
