const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'owner'
    },
    records: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
        },
        qty: Number
    }],
    destination: {
        type: String,
        require: true
    },
    shipping_price: {
        type: Number,
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
    note: String,
    firstname: String,
    lastname: String,
    telephone: String
}, {
    timestamps: true
})

exports.Order = mongoose.model('order', OrderSchema);