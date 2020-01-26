const express = require('express');
// importing Router from Express package
const router = express.Router();
//import mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            //comparing the hash has the same algorithm
            bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
                if(err) { return res.status(401).json({
                    message: 'Auth failed'
                });

                }
                if (result){ 
                    return res.status(200).json({
                        message: 'Auth successful'
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

router.delete('/:userId', (req, res, next) => {
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