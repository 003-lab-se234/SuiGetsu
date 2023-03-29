const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    records: [{
        item: {
            type: mongoose.Schema.Types.ObjectId ,
            ref: 'food'
        },
        qty: Number
    }],
        desitination: {
        type: String,
        require: true 
    },
    shipping_price: {
        type: Number ,
        default: 15 
    },
    product_price: {
        type: Number,
        require: true
    },
    total_price: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['pending', 'cooking', 'delivery', 'delivered'],
        default: 'pending'
    },
    note: String

})

exports.Order = mongoose.model('order', OrderSchema);