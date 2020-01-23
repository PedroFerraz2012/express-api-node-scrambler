const express = require('express');
const app = express();

app.use((req, res, next) => {
    // sets 200 as success response and json to handle parameters
    res.status(200).json({ 
        message: 'Server works!'
    });
});

module.exports = app;