const express = require('express');
// importing Router from Express package
const router = express.Router();
//import mongoose
const mongoose = require('mongoose');

const User = require('../models/user');

router.post('/signup',(req, res, next) =>{
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        email: req.body.email,
        password:req.body.password
    });
});

module.exports = router;