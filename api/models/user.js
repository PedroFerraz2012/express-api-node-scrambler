const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        //unique: true, // optimises the index, ensuring that's only one // depricated, replaced by the next index property
        useCreateIndex: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ // validates the email
    },
    
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);