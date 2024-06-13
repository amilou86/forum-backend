const express = require('express');
const userRoutes = require('../fourm-backend/Routes/user.routes');
const postRoutes = require('../fourm-backend/Routes/post.routes');

const app = express();

// ... other app configurations ...

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes); // Mount the post routes

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
