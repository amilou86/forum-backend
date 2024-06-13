const express = require('express');

const app = express();

// Define a port number for the server
const port = process.env.PORT || 3000;

// Set up a simple route to test the server
app.get('/', (req, res) => {
    res.send('Hello from your Node.js and Express forum back-end!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
