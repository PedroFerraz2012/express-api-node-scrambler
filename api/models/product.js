const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true // makes sure this field is given
    },
    
    price: {
        type: Number,
        require: true // makes sure this field is given
    }
});

module.exports = mongoose.model('Product', productSchema);