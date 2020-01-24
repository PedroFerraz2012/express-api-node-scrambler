const express = require('express');
// importing Router from Express package
const router = express.Router();
//import mongoose
const mongoose = require('mongoose');
//import order model
const Order = require('../models/order');
// import products
const Product = require('../models/product');
 
router.get('/', (req, res, next) => {
    Order
    .find() // find all
    .select('product quantity _id')
    .populate('product', 'name') //populates order with product details // second property selects only fiels you want
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            }),
        });
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    });
    // res.status(200).json({
    //     message: 'Orders were fetched'
    // });
});

router.post('/', (req, res, next) => {
Product.findById(req.body.productId) // to ensure the product exists in DB
.then(product => {
    if(!product){
        return res.status(404).json({
            message: 'Product not found'
        })
    }
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
});
return order.save();})
.then(result => { 
    console.log(result);
    res.status(201).json({
        message: 'Order stored',
        createdOrder:{
            _id: result._id,
            product: result.product,
            quantity: result.quantity
        },
        request: {
            type: 'GET',
            url: 'htt://locahost:3000/orders/' +result._id
        }
    });
})
.catch(err => {
    res.status(500).json({
        message: err.message,
        error: err
    });
});

    // replaced by method above with mongoDB
    // const order = {
    //     productId: req.body.productId,
    //     quantity: req.body.quantity
    // };
    // res.status(201).json({
    //     message: 'Order was created',
    //     order: order
    // });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product', 'name price') //populates order with product details // second property selects only fiels you want
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.status(200).json({
            order: order,
            request:{
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });


    // replaced by code above with DB
    // res.status(200).json({
    //     message: 'Order details',
    //     orderId: req.params.orderId
    // });
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({
        _id: req.params.orderId
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {
                    productId: 'ID',
                    quantitu: 'Number'
                }
            }
        })
    })
    .catch()

    // replaced by code above with DB
    // res.status(200).json({
    //     message: 'Order deleted',
    //     orderId: req.params.orderId
    // });
});

//IMPORTANT
module.exports = router;