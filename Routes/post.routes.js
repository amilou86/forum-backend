const express = require('express');
const router = express.Router();
const postController = require('../Controllers/post.controller'); // Import the controller

router.get('/:postId', postController.getPostById); // Route for getting a single post
router.post('/:postId', postController.updatePost); // Route for updating posts
router.delete('/:postId', postController.deletePost); // Route for deleting posts
router.put('/:postId/upvote', postController.upvotePost); // Route for upvoting a post
router.put('/:postId/downvote', postController.downvotePost); // Route for downvoting a post

module.exports = router;
