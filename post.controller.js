const Post = require('../models/post.model'); // Import the Post model

exports.getPosts = async (req, res) => {
    try {
        // Define query parameters for filtering (optional)
        const { discussionId } = req.query; // Get discussion ID for filtering by discussion

        let query = {};
        if (discussionId) {
            query = { discussionId };
        }

        // Find all posts matching the query criteria (or all posts if no filter)
        const posts = await Post.find(query).populate('author', 'username'); // Populate author details

        // Send success response with the retrieved posts
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving posts' });
    }
};

// You can add additional functions for creating, updating, or deleting posts here
module.exports = exports.getPosts; // Export the getPosts function initially
