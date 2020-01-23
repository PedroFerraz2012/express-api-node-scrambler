const express = require('express');
const app = express();
//importinh morgan
const morgan = require('morgan');
const bodyParser = require('body-parser');

//importing products route
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// this was the test to see if server is working
// app.use((req, res, next) => {
//     // sets 200 as success response and json to handle parameters
//     res.status(200).json({ 
//         message: 'Server works!'
//     });
// });

//using morgan
app.use(morgan('dev'));
//using body parser, specifying with sort of body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//filter for produts Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// starting handling error and request
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
// handling error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;