const express = require('express');
// importing Router from Express package
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//will get products after /products (it's set up at App.js), then
// First argument is '/'
// Second argument is a handler
router.get('/', (req, res, next) =>{
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

// same as above, but for POST
router.post('/', (req, res, next) =>{
    //remove this after installing db, replacing with next statement (const)
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    //stores in DB with mongoose, returns a promise
    product
    .save()
    .then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
    res.status(200).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    });
});

//router using id - GET
router.get('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});

//router using id - update
router.patch('/:productId', (req, res, next) =>{
    res.status(200).json({
            message: 'Updates product',
        });
    });

//router using id - delete
router.delete('/:productId', (req, res, next) =>{
    res.status(200).json({
            message: 'deleted product',
        });
    });

//IMPORTANT
module.exports = router;