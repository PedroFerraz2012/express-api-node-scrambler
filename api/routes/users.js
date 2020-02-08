const express = require('express');
// importing Router from Express package
const router = express.Router();
//import mongoose
const mongoose = require('mongoose');
//importing encryption
const bcrypt = require('bcrypt');
//importing sjonwebtoken
const jwt = require('jsonwebtoken');
// import middleware Check-Auth for authorization
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists already'
                });
            } else {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    message: err.message,
                                    error: err
                                });
                            });
                    }

                });
            }
        })

});

router.post('/login', (req, res, next) => {
    //finding the provided user in the DB
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            //comparing the hash has the same algorithm
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,//insert JWT key in nodemon env
                        { // inserting options
                            expiresIn: "1h" //timeout
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token,
                        id: user[0]._id
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: err.message
            });
        });
});

router.get('/', (req, res, next) => {
    //getting from MongoDB
    User.find() // finds all
        //where get more conditions
        //limit get small number of results
        .select( 'name _id email' ) // constrolls which data we want to fetch
        .exec()
        .then(docs => {
            //console.log(docs);
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        name: doc.name,
                        _id: doc._id,
                        email: doc.email,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/user/' + doc._id
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

});

router.delete('/:userId', checkAuth, (req, res, next) => {
    User.deleteOne({
        _id: req.params.userId
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: err.message
            });
        });
});

module.exports = router;