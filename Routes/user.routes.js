const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user.controller'); // Import the user controller

router.post('/login', userController.login);

module.exports = router;