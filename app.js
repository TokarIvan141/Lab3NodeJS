const express = require('express');
const rateLimiter = require('./middlewares/rateLimiter');
const requestTracker = require('./middlewares/tracker');
const bookRoutes = require('./routes/book.routes');

const app = express();
app.use(express.json());

app.use(rateLimiter);
app.use(requestTracker);

app.use('/api/books', bookRoutes);

module.exports = app;

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Library API!',
        endpoints: 'Try GET /api/books'
    });
});