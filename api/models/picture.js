const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // it cant be null, so it makes sure this field is given
    },

    name: {
        type: String,
        required: true // makes sure this field is given
    },
    
    hint: {
        type: String,
        required: true // makes sure this field is given
    },

    pswd: {
        type: String,
        required: true
    },

    userPicture: {
        type: String,
        required: true
    },

    blurPicture: {
        type: String,
        
    }
});

module.exports = mongoose.model('Picture', pictureSchema);