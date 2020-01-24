const express = require('express');
// importing Router from Express package
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//will get products after /products (it's set up at App.js), then
// First argument is '/'
// Second argument is a handler
router.get('/', (req, res, next) => {
    //getting from MongoDB
    Product.find() // finds all
        //where get more conditions
        //limit get small number of results
        .exec()
        .then(docs => {
            console.log(docs);
            if(docs.length >= 0){
                res.status(200).json(docs); // positive response
            } else{
                res.status(404).json({
                    message: 'No entries found' // in case there isnt data
                })
            }
        
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ // general errors
                error: err
            });
        });

    //replaced by above code to get from DB
    // res.status(200).json({
    //     message: 'Handling GET requests to /products'
    // });
});

// same as above, but for POST
router.post('/', (req, res, next) => {
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
            res.status(200).json({
                message: 'Handling POST requests to /products',
                createdProduct: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

});

//router using id - GET
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);// positive response
            } else
                res.status(404).json({ // handling if the id doesnt exist
                    message: 'No valid entry found for provided ID'
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err }); // handling general errors
        });

    //replaced by above code to get from MongoDB
    // const id = req.params.productId;
    // if (id === 'special') {
    //     res.status(200).json({
    //         message: 'You discovered the special ID',
    //         id: id
    //     });
    // } else {
    //     res.status(200).json({
    //         message: 'You passed an ID'
    //     });
    // }
});

//router using id - update
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    // parameters to get value from frontend:
    // [
    //     {"propName": "name", "value": "Harry Potter 6"}
    // ]
    for (const ops of req.body){ // finds params to update from request
        updateOps[ops.propName] = ops.value; 
    }
    Product
    .update({_id: id},
        { $set: updateOps}) // sets only the requested params
    .exec()
    .then(result => {
        res.status(200).json(result); // positive response
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    // replaced by above code to update in DB
    // res.status(200).json({
    //     message: 'Updates product',
    // });
});

//router using id - delete
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product
        .remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// replaced by above code to use DB
// res.status(200).json({
//         message: 'deleted product',
//     });
// });

//IMPORTANT
module.exports = router;