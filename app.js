const express = require('express');
const app = express();
//importing products route
const productRoutes = require('./api/routes/products');

// this was the test to see if server is working
// app.use((req, res, next) => {
//     // sets 200 as success response and json to handle parameters
//     res.status(200).json({ 
//         message: 'Server works!'
//     });
// });

//filter for produts Routes
app.use('/products', productRoutes);

module.exports = app;