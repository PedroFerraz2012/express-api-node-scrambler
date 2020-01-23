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

//adding headers handling
// preventing cors errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // * allows any http, which could be only a few of them for security proposal
    res.header(
        'Access-Contro-Allow-Headers',
        'Origin, X-Requested-With', 'Content-Type', 'Accept', 'Authorization');
if (req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
}
//to avoid blocking requests, use next
next();
});

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