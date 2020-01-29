const express = require('express');
// importing Router from Express package
const router = express.Router();
const mongoose = require('mongoose');
//import multer
const multer = require('multer');
// import middleware Check-Auth for authorization
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');
const Picture = require('../models/picture');

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






router.post('/', upload.single('userPicture'), (req, res, next) => {
    User.findById(req.body.user) // get user in DB
     
     .then(user => {
        if(!user){
            return res.status(404).json({
                message: 'User not found'
            })
        }
    const picture = new Picture({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        name: req.body.name,
        hint: req.body.hint,
        pswd: req.body.pswd,
        userPicture: req.file.path
    });
    //stores in DB with mongoose, returns a promise
    picture
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created Picture successfully',
                createdPicture: {
                    name: result.name,
                    _id: result._id,
                    user: result.user,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/pictures/' + result._id
                    }
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
});

//IMPORTANT
module.exports = router;