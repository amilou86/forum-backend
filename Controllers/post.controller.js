const Post = require('../Modals/post.model'); // Import the Post model
const User = require('../Modals/user.model'); // Import the User model
const jwt = require('jsonwebtoken');

exports.getPosts = async (req, res) => {
    try {
        const { discussionId } = req.query; // Get discussion ID for filtering (optional)

        let query = {};
        if (discussionId) {
            query = { discussionId };
        }

        // Aggregation pipeline to get posts with reply count
        const pipeline = [
            { $match: query }, // Match posts based on discussion ID (optional)
            {
                $lookup: {
                    from: 'posts', // Reference the Post collection itself
                    localField: '_id', // Local field for matching (post's ID)
                    foreignField: 'parentId', // Foreign field (reply's parentId)
                    as: 'replies' // Name for the resulting array of replies
                }
            },
            {
                $project: {
                    _id: 1, // Include post ID
                    content: 1, // Include post content
                    author: 1, // Include populated author details
                    discussionId: 1, // Include discussion ID (optional)
                    replyCount: { $size: '$replies' }, // Calculate reply count using $size
                }
            }
        ];

        const posts = await Post.aggregate(pipeline);

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving posts' });
    }
};



// add additional functions for creating, updating, or deleting posts here

exports.createPost = async (req, res) => {
    try {
        // Extract post content and other data from the request body
        const { content, discussionId } = req.body;

        // Validate user input (optional)

        // Get the currently logged-in user ID from the request object (assuming JWT verification middleware is used)
        const userId = req.userId;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'Invalid user' });
        }

        // Create a new post object
        const newPost = new Post({ content, author: userId, discussionId }); // Associate with logged-in user

        // Save the post to the database
        await newPost.save();

        // Send success response with the newly created post information
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating post' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { postId, content } = req.body;

        // Validate user input (optional)
        // Ensure content is provided for update

        // Get the currently logged-in user ID from the request object (assuming JWT verification middleware is used)
        const userId = req.userId;

        // Find the post by ID
        const post = await Post.findById(postId);

        // Check if the post exists and the user is authorized to update it (e.g., the post author)
        if (!post || post.author.toString() !== userId) {
            return res.status(401).json({ message: 'Unauthorized or post not found' });
        }

        // Update post content
        post.content = content;
        post.updatedAt = Date.now(); // Update timestamp

        // Save the updated post to the database
        await post.save();

        // Send success response with the updated post information
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating post' });
    }
};

const jwt = require('jsonwebtoken');

exports.verifyJWT = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from authorization header
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret
        req.userId = decoded.userId; // Attach user ID to the request object
        next(); // Allow request to proceed if valid
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

exports.upvotePost = async (req, res) => {
    try {
        const { postId } = req.params;

        // Use middleware.verifyJWT here (optional) to check authorization

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user has already upvoted this post (optional)

        post.votes.upvotes++; // Increment upvote count
        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error upvoting post' });
    }
};

exports.downvotePost = async (req, res) => {
    try {
        const { postId } = req.params;

        // Use middleware.verifyJWT here (optional) to check authorization

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user has already downvoted this post (optional)

        post.votes.downvotes++; // Increment downvote count
        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error downvoting post' });
    }
};

exports.upvotePost = async (req, res) => {
    try {
        const { postId } = req.params;

        // Use middleware.verifyJWT here (optional) to check authorization

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user has already upvoted this post (optional)

        post.votes.upvotes++; // Increment upvote count
        await post.save();

        res.json(post);
    } catch (err) {
        // Improved error handling
        if (err.name === 'CastError') { // Handle potential mongoose casting errors (e.g., invalid postId)
            return res.status(400).json({ message: 'Invalid post ID' });
        } else {
            console.error(err);
            return res.status(500).json({ message: 'Error upvoting post' }); // Generic error for internal server errors
        }
    }
};

exports.downvotePost = async (req, res) => {
    try {
        const { postId } = req.params;

        // Use middleware.verifyJWT here (optional) to check authorization

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user has already downvoted this post (optional)

        post.votes.downvotes++; // Increment downvote count
        await post.save();

        res.json(post);
    } catch (err) {
        // Improved error handling (same structure as upvotePost)
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid post ID' });
        } else {
            console.error(err);
            return res.status(500).json({ message: 'Error downvoting post' });
        }
    }
};


module.exports = exports.getPosts, //export all functions
    exports.createPost,
    exports.updatePost,
    exports.verifyJWT,
    exports.upvotePost,
    exports.downvotePost;

