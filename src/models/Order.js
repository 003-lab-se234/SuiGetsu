const mongoose = require("mongoose");


const RecordSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        enum: ['main', 'side', 'drink', 'appetizer', 'dessert']
    },
    image_path: {
        type: String
    },
    quantity: {
        type: Number,
        require: true
    }
})


const OrderSchema = new mongoose.Schema({
    owner_id: {
        type: String,
        require: true
    },
    records: { 
        type: [RecordSchema], 
        require: true 
    },
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
    category: {
        type: String,
        enum: ['pending', 'cooking', 'delivery', 'delivered'],
        default: 'pending'
    }

});

exports.RecordDoc = mongoose.model('record', RecordSchema)
exports.Order = mongoose.model('order', OrderSchema);