const User = require('../Modals/user.model'); // Import the User model

exports.register = async (req, res) => {
    try {
        // Extract user data from the request body
        const { username, email, password } = req.body;

        // Validate user input (optional)
        // Can use validation libraries like Joi for this

        // Check for existing user with the same username or email (optional)
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Create a new user object
        const newUser = new User({ username, email, password });

        // Save the user to the database
        await newUser.save();

        // Send success response
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
    }
};

const User = require('../models/user.model'); // Import the User model
const jwt = require('jsonwebtoken'); // Library for JWT generation

exports.login = async (req, res) => {
    try {
        // Extract username and password from the request body
        const { username, password } = req.body;

        // Find the user with the provided username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare hashed passwords using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token on successful login
        const payload = { userId: user._id }; // Payload for the token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Sign the token with a secret

        // Send success response with the JWT token
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in' });
    }
};

const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Attach decoded user ID to the request object
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

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

module.exports = verifyJWT, register, login, createPost; // Export all functions

module.exports = verifyJWT;

