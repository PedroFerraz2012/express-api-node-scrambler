const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true // it cant be null, so it makes sure this field is given
    },
    
    quantity: {
        type: Number,
        default: 1 // qty will be 1 if not provided
    }
});

module.exports = mongoose.model('Order', orderSchema);