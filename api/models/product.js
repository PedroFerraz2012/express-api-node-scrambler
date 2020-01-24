const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true // makes sure this field is given
    },
    
    price: {
        type: Number,
        required: true // makes sure this field is given
    }
});

module.exports = mongoose.model('Product', productSchema);