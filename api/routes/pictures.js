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

const Jimp = require('jimp');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        // acept a file
        cb(null, true);
    } else {
        cb(null, false);// reject a file
    }

};

const upload = multer({ // call this method at post method
    storage: storage, // sets a destination folder for incoming uploads
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
}); // by default needs to be set as static folder at app.js






router.post('/', checkAuth, upload.single('userPicture'), (req, res, next) => {
    

    User.findById(req.body.user) // get user in DB
        .then(user => {
            if (!user) {
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
                userPicture: req.file.path,
            });
            //stores in DB with mongoose, returns a promise
            picture
                .save()
                .then(result => {
                    console.log(result);
                    
                    
                

                // this works************
                Jimp.read(result.userPicture, function(err, image){
                    if(err){
                        console.log(err);
                    }
                    else{
                        image.resize(256,256)
                        .quality(80)
                        .write('uploads/'+req.file.filename+'_new.jpg')
                    }
                });
                //************* */

                

                
                    

                    res.status(201).json({
                        message: 'Created Picture successfully',
                        createdPicture: {
                            name: result.name,
                            _id: result._id,
                            user: result.user,
                            hint: result.hint,
                            pswd: result.pswd,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/pictures/' + result._id
                            }
                        }
                    });
                })
                .catch(err => {
                    //console.log(err);
                    res.status(500).json({
                        error: err
                    })
                });
                //console.log(err);
            
        });
    });

//router using id - GET
router.get('/:user', (req, res, next) => {
    //user = req.params.user // getting this valeu to search in the list of pictures


    // validation
    let userId = mongoose.Types.ObjectId(req.params.user);


    Picture.find({ user: userId })
        .select('name _id hint pswd userPicture user') // constrolls which data we want to fetch
        .exec()
        .then(docs => {
            console.log(docs);
            const response = {
                count: docs.length,
                pictures: docs.map(doc => {
                    return {
                        user: doc.user,
                        name: doc.name,
                        hint: doc.hint,
                        userPicture: doc.userPicture,
                        _id: doc._id,
                        pswd: doc.pswd,
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
        })
});



router.get('/', (req, res, next) => {
    //getting from MongoDB
    Picture.find() // finds all
        //where get more conditions
        //limit get small number of results
        .select('name _id userPicture hint pswd user') // constrolls which data we want to fetch
        .exec()
        .then(docs => {
            //console.log(docs);
            const response = {
                count: docs.length,
                pictures: docs.map(doc => {
                    return {
                        user: doc.user,
                        name: doc.name,
                        hint: doc.hint,
                        userPicture: doc.userPicture,
                        _id: doc._id,
                        pswd: doc.pswd,
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

// checkAuth, // removed temporarly
//router using id - delete
router.delete('/:pictureId', (req, res, next) => {
    const id = req.params.pictureId;
    

    //also trying to delete the file
    // Picture.find({ _id: pictureId })
    //     .select('userPicture') // constrolls which data we want to fetch
    //     .exec()
    //     .then(docs => {
    //         console.log(docs);

    //         // const response = {
    //         //     count: docs.length,
    //         //     pictures: docs.map(doc => {
    //         //         return {
                        
    //         //             userPicture: doc.userPicture,
    //         //         }
    //         //     })
    //         // }
    //     }
            
    //         //fs.unlink(userPicture)=>{

            
    //         )

    Picture
        .remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Picture deleted',
                request: {
                    type: 'Post',
                    url: 'htttp://localhost:3000/pictures',
                    body:{
                        name: 'String',
                        type: 'formdata'
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

//IMPORTANT
module.exports = router;