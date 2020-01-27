const express = require('express');
// importing Router from Express package
const router = express.Router();
const mongoose = require('mongoose');
//import multer
const multer = require('multer');
// import middleware Check-Auth for authorization
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() +file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

if (file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png'){
// acept a file
cb(null, true);
} else {
    cb(null, false);// reject a file
} 

};

const upload = multer({ // call this method at post method
    storage: storage, // sets a destination folder for incoming uploads
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}); // by default needs to be set as static folder at app.js

const Product = require('../models/product');

//will get products after /products (it's set up at App.js), then
// First argument is '/'
// Second argument is a handler
router.get('/', (req, res, next) => {
    //getting from MongoDB
    Product.find() // finds all
        //where get more conditions
        //limit get small number of results
        .select('name price _id productImage') // constrolls which data we want to fetch
        .exec()
        .then(docs => {
            //console.log(docs);
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            if (docs.length >= 0) {
                res.status(200).json(response); // positive response
            } else {
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
//Authorization sent as Header
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
     console.log(req.file);
    //remove this after installing db, replacing with next statement (const)
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    //stores in DB with mongoose, returns a promise
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created products successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: [{
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    },
                    {
                        type: 'UPDATE',
                        url: 'http://localhost:3000/products/' + result._id,
                        body:[{
                            propName: 'name',
                            value: 'String'
                        },
                        {
                            propName: 'price',
                            value: 'Number'
                        }]
                    }]
                }
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
        .select('name price _id productImage') // constrolls which data we want to fetch
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({// positive response
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: 'http://localhost:3000/products'
                    }
                });
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
router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    // parameters to get value from frontend:
    // [
    //     {"propName": "name", "value": "Harry Potter 6"}
    // ]
    for (const ops of req.body) { // finds params to update from request
        updateOps[ops.propName] = ops.value;
    }
    Product
        .update({ _id: id },
            { $set: updateOps }) // sets only the requested params
        .exec()
        .then(result => {
            res.status(200).json({// positive response
                message: 'Product update',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
            }
        }); 
        })
        .catch(err => {
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
router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product
        .remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'Post',
                    url: 'htttp://localhost:3000/products',
                    body:{
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
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